import { pipeline } from '@xenova/transformers';
import natural from 'natural';
import compromise from 'compromise';
import * as faiss from 'faiss-node';

// Type for FAISS index (faiss-node has limited TypeScript support)
type FaissIndex = any;

export interface CodeSegment {
  id: string;
  filePath: string;
  content: string;
  type: 'component' | 'style' | 'function' | 'config';
  startLine: number;
  endLine: number;
  dependencies: string[];
  semanticTags: string[];
}

export interface ChangeRequest {
  text: string;
  intent: 'modify' | 'add' | 'remove' | 'style' | 'functionality';
  targets: string[];
  confidence: number;
  context: CodeSegment[];
}

export class NLPProcessor {
  private embedder: any;
  private faissIndex: FaissIndex | null = null;
  private codeSegments: CodeSegment[] = [];
  private tokenizer: any;
  private stemmer: any;

  constructor() {
    // Initialize tokenizer using the correct import pattern
    const { WordTokenizer, PorterStemmer } = natural;
    this.tokenizer = new WordTokenizer();
    this.stemmer = PorterStemmer;
  }

  async initialize() {
    console.log('🧠 Initializing NLP Processor...');
    
    // Load the embedding model
    this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    console.log('✅ NLP Processor initialized');
  }

  /**
   * Process and extract semantic meaning from code
   */
  async processCodebase(files: { path: string; content: string }[]): Promise<void> {
    console.log('📝 Processing codebase for semantic analysis...');
    
    this.codeSegments = [];
    const embeddings: number[][] = [];

    for (const file of files) {
      const segments = this.extractCodeSegments(file);
      
      for (const segment of segments) {
        this.codeSegments.push(segment);
        
        // Create semantic representation
        const semanticText = this.createSemanticText(segment);
        const embedding = await this.getEmbedding(semanticText);
        embeddings.push(embedding);
      }
    }

    // Create FAISS index
    if (embeddings.length > 0 && embeddings[0]) {
      const dimension = embeddings[0].length;
      this.faissIndex = new (faiss as any).FaissIndex(dimension);
      
      // Add vectors to index
      embeddings.forEach((embedding, index) => {
        this.faissIndex!.add(embedding, index);
      });
      
      console.log(`✅ Indexed ${embeddings.length} code segments`);
    }
  }

  /**
   * Process user change request using NLP
   */
  async processChangeRequest(requestText: string): Promise<ChangeRequest> {
    console.log('🔍 Processing change request:', requestText);

    // 1. Intent Recognition
    const intent = this.detectIntent(requestText);
    
    // 2. Entity Extraction
    const entities = this.extractEntities(requestText);
    
    // 3. Semantic Search
    const relevantSegments = await this.findRelevantCode(requestText);
    
    // 4. Confidence Scoring
    const confidence = this.calculateConfidence(requestText, relevantSegments);

    const changeRequest: ChangeRequest = {
      text: requestText,
      intent,
      targets: entities,
      confidence,
      context: relevantSegments
    };

    console.log('📊 Change request processed:', {
      intent,
      targets: entities,
      confidence: confidence.toFixed(2),
      foundSegments: relevantSegments.length
    });

    return changeRequest;
  }

  /**
   * Extract meaningful code segments from files
   */
  private extractCodeSegments(file: { path: string; content: string }): CodeSegment[] {
    const segments: CodeSegment[] = [];
    const lines = file.content.split('\n');
    
    // Simple regex patterns for different code types
    const patterns = {
      component: /(?:function|const|class)\s+([A-Z][a-zA-Z0-9]*)/g,
      style: /\.([a-zA-Z0-9-_]+)\s*\{|className="([^"]+)"/g,
      function: /(?:function|const)\s+([a-z][a-zA-Z0-9]*)/g,
      config: /(?:export|const)\s+([A-Z_][A-Z0-9_]*)/g
    };

    let currentSegment = '';
    let startLine = 0;
    let segmentType: CodeSegment['type'] = 'function';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line) {
        currentSegment += line + '\n';

        // Detect segment boundaries (simplified)
        if (line.includes('}') || line.includes(';') || i === lines.length - 1) {
          if (currentSegment.trim().length > 20) { // Minimum segment size
          // Determine segment type and extract semantic info
          const semanticTags = this.extractSemanticTags(currentSegment);
          const dependencies = this.extractDependencies(currentSegment);
          
          segments.push({
            id: `${file.path}:${startLine}-${i}`,
            filePath: file.path,
            content: currentSegment.trim(),
            type: this.determineSegmentType(currentSegment),
            startLine,
            endLine: i,
            dependencies,
            semanticTags
          });
        }
        
        currentSegment = '';
        startLine = i + 1;
        }
      }
    }

    return segments;
  }

  /**
   * Create semantic text representation of code segment
   */
  private createSemanticText(segment: CodeSegment): string {
    return [
      segment.filePath,
      segment.type,
      ...segment.semanticTags,
      ...segment.dependencies,
      segment.content.replace(/[{}();]/g, ' ').substring(0, 200)
    ].join(' ').toLowerCase();
  }

  /**
   * Detect user intent from change request
   */
  private detectIntent(text: string): ChangeRequest['intent'] {
    const lowerText = text.toLowerCase();
    
    const intentPatterns = {
      modify: ['change', 'update', 'modify', 'edit', 'alter', 'fix'],
      add: ['add', 'create', 'insert', 'include', 'new'],
      remove: ['remove', 'delete', 'hide', 'take away', 'eliminate'],
      style: ['color', 'size', 'font', 'background', 'border', 'css', 'style', 'appearance'],
      functionality: ['function', 'feature', 'behavior', 'logic', 'action', 'event']
    };

    let maxScore = 0;
    let detectedIntent: ChangeRequest['intent'] = 'modify';

    for (const [intent, keywords] of Object.entries(intentPatterns)) {
      const score = keywords.reduce((acc, keyword) => 
        acc + (lowerText.includes(keyword) ? 1 : 0), 0
      );
      
      if (score > maxScore) {
        maxScore = score;
        detectedIntent = intent as ChangeRequest['intent'];
      }
    }

    return detectedIntent;
  }

  /**
   * Extract entities (components, elements) mentioned in request
   */
  private extractEntities(text: string): string[] {
    const doc = compromise(text);
    
    // Extract nouns that might be UI elements
    const nouns = doc.nouns().out('array');
    
    // Extract capitalized words (likely component names)
    const capitalizedWords = text.match(/[A-Z][a-zA-Z0-9]*/g) || [];
    
    // Common UI element keywords
    const uiElements = text.match(/\b(?:button|header|footer|nav|sidebar|card|modal|form|input|table|list|menu|dropdown)\b/gi) || [];
    
    return [...new Set([...nouns, ...capitalizedWords, ...uiElements])]
      .filter(entity => entity.length > 2);
  }

  /**
   * Find relevant code using semantic search
   */
  private async findRelevantCode(queryText: string): Promise<CodeSegment[]> {
    if (!this.faissIndex || this.codeSegments.length === 0) {
      return [];
    }

    try {
      // Get query embedding
      const queryEmbedding = await this.getEmbedding(queryText);
      
      // Search for similar code segments
      const k = Math.min(5, this.codeSegments.length); // Top 5 results
      const results = this.faissIndex.search(queryEmbedding, k);
      
      return results.map((result: any) => this.codeSegments[result.index])
        .filter((segment: CodeSegment | undefined) => segment !== undefined) as CodeSegment[];
        
    } catch (error) {
      console.error('Error in semantic search:', error);
      return [];
    }
  }

  /**
   * Calculate confidence score for the change request
   */
  private calculateConfidence(text: string, relevantSegments: CodeSegment[]): number {
    // Base confidence from segment matching
    let confidence = Math.min(relevantSegments.length * 0.2, 0.8);
    
    // Boost confidence based on specific keywords
    const specificKeywords = ['change', 'modify', 'update', 'color', 'size', 'button', 'header'];
    const foundKeywords = specificKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    confidence += foundKeywords.length * 0.05;
    
    // Penalize if request is too vague
    if (text.split(' ').length < 5) {
      confidence *= 0.7;
    }
    
    return Math.min(confidence, 1.0);
  }

  private async getEmbedding(text: string): Promise<number[]> {
    try {
      const result = await this.embedder(text);
      // Handle different output formats
      if (Array.isArray(result) && result.length > 0) {
        return Array.isArray(result[0]) ? result[0] : result;
      }
      return result.data || result;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  private extractSemanticTags(code: string): string[] {
    const tags: string[] = [];
    
    // CSS/Style related
    if (code.includes('className') || code.includes('style') || code.includes('css')) {
      tags.push('styling', 'appearance');
    }
    
    // Event handlers
    if (code.includes('onClick') || code.includes('onChange') || code.includes('onSubmit')) {
      tags.push('interactive', 'event-handler');
    }
    
    // State management
    if (code.includes('useState') || code.includes('setState') || code.includes('state')) {
      tags.push('stateful', 'data');
    }
    
    // UI components
    if (code.includes('button') || code.includes('Button')) {
      tags.push('button', 'clickable');
    }
    if (code.includes('input') || code.includes('Input')) {
      tags.push('input', 'form');
    }
    if (code.includes('header') || code.includes('Header')) {
      tags.push('header', 'navigation');
    }
    
    return tags;
  }

  private extractDependencies(code: string): string[] {
    const dependencies: string[] = [];
    
    // Import statements
    const importMatches = code.match(/import.*from ['"]([^'"]+)['"]/g);
    if (importMatches) {
      importMatches.forEach(match => {
        const dep = match.match(/from ['"]([^'"]+)['"]/)?.[1];
        if (dep) dependencies.push(dep);
      });
    }
    
    // Component usage
    const componentMatches = code.match(/<([A-Z][a-zA-Z0-9]*)/g);
    if (componentMatches) {
      componentMatches.forEach(match => {
        const component = match.substring(1);
        dependencies.push(component);
      });
    }
    
    return dependencies;
  }

  private determineSegmentType(code: string): CodeSegment['type'] {
    if (code.includes('className') || code.includes('style') || code.includes('.css')) {
      return 'style';
    }
    if (code.includes('function') && /^[A-Z]/.test(code.trim())) {
      return 'component';
    }
    if (code.includes('export') && code.includes('const') && /^[A-Z_]/.test(code.trim())) {
      return 'config';
    }
    return 'function';
  }
}

export default NLPProcessor;