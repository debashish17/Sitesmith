import NLPProcessor from './NLPProcessor.js';
import type { ChangeRequest, CodeSegment } from './NLPProcessor.js';

export interface SmartChangeResponse {
  success: boolean;
  changeRequest: ChangeRequest;
  optimizedPrompt: string;
  affectedFiles: string[];
  estimatedComplexity: 'low' | 'medium' | 'high';
  suggestions?: string[] | undefined;
}

export class SmartChangeHandler {
  private nlpProcessor: NLPProcessor;
  private isInitialized = false;

  constructor() {
    this.nlpProcessor = new NLPProcessor();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    await this.nlpProcessor.initialize();
    this.isInitialized = true;
    console.log('🤖 Smart Change Handler initialized');
  }

  /**
   * Process project files for semantic understanding
   */
  async indexProjectFiles(files: { path: string; content: string }[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    console.log('📂 Indexing project files for semantic search...');
    await this.nlpProcessor.processCodebase(files);
  }

  /**
   * Process user change request intelligently
   */
  async processChangeRequest(
    userRequest: string,
    currentFiles: { path: string; content: string }[]
  ): Promise<SmartChangeResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    console.log('🔍 Processing smart change request:', userRequest);

    try {
      // 1. Analyze the change request with NLP
      const changeRequest = await this.nlpProcessor.processChangeRequest(userRequest);
      
      // 2. Generate optimized prompt for AI
      const optimizedPrompt = this.generateOptimizedPrompt(changeRequest, currentFiles);
      
      // 3. Determine affected files
      const affectedFiles = this.determineAffectedFiles(changeRequest, currentFiles);
      
      // 4. Estimate complexity
      const estimatedComplexity = this.estimateComplexity(changeRequest);
      
      // 5. Generate suggestions if confidence is low
      const suggestions = changeRequest.confidence < 0.6 
        ? this.generateSuggestions(changeRequest, userRequest)
        : undefined;

      const response: SmartChangeResponse = {
        success: true,
        changeRequest,
        optimizedPrompt,
        affectedFiles,
        estimatedComplexity,
        ...(suggestions && { suggestions })
      };

      console.log('✅ Smart change request processed:', {
        intent: changeRequest.intent,
        confidence: changeRequest.confidence.toFixed(2),
        affectedFiles: affectedFiles.length,
        complexity: estimatedComplexity
      });

      return response;

    } catch (error) {
      console.error('❌ Error processing change request:', error);
      
      return {
        success: false,
        changeRequest: {
          text: userRequest,
          intent: 'modify',
          targets: [],
          confidence: 0,
          context: []
        },
        optimizedPrompt: userRequest,
        affectedFiles: [],
        estimatedComplexity: 'high',
        suggestions: ['Please try rephrasing your request with more specific details.']
      };
    }
  }

  /**
   * Generate optimized prompt for AI based on NLP analysis
   */
  private generateOptimizedPrompt(
    changeRequest: ChangeRequest,
    currentFiles: { path: string; content: string }[]
  ): string {
    const { intent, targets, context, text } = changeRequest;

    let prompt = `Based on the following change request analysis:

Original Request: "${text}"
Intent: ${intent}
Target Elements: ${targets.join(', ')}
Confidence: ${(changeRequest.confidence * 100).toFixed(1)}%

`;

    // Add context from relevant code segments
    if (context.length > 0) {
      prompt += `\nRelevant Code Context:\n`;
      context.slice(0, 3).forEach((segment, index) => {
        prompt += `${index + 1}. File: ${segment.filePath} (${segment.type})\n`;
        prompt += `   Code: ${segment.content.substring(0, 200)}...\n`;
        prompt += `   Tags: ${segment.semanticTags.join(', ')}\n\n`;
      });
    }

    // Add specific instructions based on intent
    switch (intent) {
      case 'style':
        prompt += `Please make the following styling changes:
- Focus on visual elements like colors, fonts, spacing, or layout
- Maintain existing functionality
- Use modern CSS practices
- Ensure responsive design is preserved\n`;
        break;
      
      case 'functionality':
        prompt += `Please implement the following functional changes:
- Add or modify the specified functionality
- Maintain existing styling and layout
- Ensure proper error handling
- Follow React best practices\n`;
        break;
      
      case 'add':
        prompt += `Please add the following new elements:
- Create new components or features as needed
- Integrate seamlessly with existing code
- Follow the current design patterns
- Maintain consistent styling\n`;
        break;
      
      case 'remove':
        prompt += `Please remove the specified elements:
- Remove only the requested components/features
- Clean up any unused dependencies
- Maintain overall functionality
- Update related components as needed\n`;
        break;
      
      default:
        prompt += `Please modify the code to implement the requested changes:
- Make targeted changes to the relevant sections
- Preserve existing functionality where possible
- Maintain code quality and best practices\n`;
    }

    prompt += `\nSpecific Request: ${text}

Please provide the complete updated code for the affected files, focusing on the identified areas while preserving the overall structure and functionality.`;

    return prompt;
  }

  /**
   * Determine which files will be affected by the change
   */
  private determineAffectedFiles(
    changeRequest: ChangeRequest,
    currentFiles: { path: string; content: string }[]
  ): string[] {
    const affectedFiles = new Set<string>();

    // Add files from relevant code segments
    changeRequest.context.forEach(segment => {
      affectedFiles.add(segment.filePath);
    });

    // Add files that might contain target elements
    changeRequest.targets.forEach(target => {
      currentFiles.forEach(file => {
        if (file.content.toLowerCase().includes(target.toLowerCase())) {
          affectedFiles.add(file.path);
        }
      });
    });

    // If no specific files identified, assume main component files
    if (affectedFiles.size === 0) {
      currentFiles.forEach(file => {
        if (file.path.includes('App.') || file.path.includes('index.') || file.path.includes('main.')) {
          affectedFiles.add(file.path);
        }
      });
    }

    return Array.from(affectedFiles).slice(0, 5); // Limit to 5 files max
  }

  /**
   * Estimate the complexity of the change request
   */
  private estimateComplexity(changeRequest: ChangeRequest): 'low' | 'medium' | 'high' {
    const { intent, targets, context, confidence } = changeRequest;

    // Base complexity by intent
    const intentComplexity = {
      style: 1,
      modify: 2,
      add: 3,
      functionality: 3,
      remove: 2
    };

    let complexityScore = intentComplexity[intent] || 2;

    // Adjust based on number of targets and context
    complexityScore += Math.min(targets.length * 0.5, 2);
    complexityScore += Math.min(context.length * 0.3, 1.5);

    // Adjust based on confidence (low confidence = higher complexity)
    if (confidence < 0.4) complexityScore += 1.5;
    else if (confidence < 0.6) complexityScore += 0.5;

    if (complexityScore <= 2.5) return 'low';
    if (complexityScore <= 4) return 'medium';
    return 'high';
  }

  /**
   * Generate helpful suggestions for unclear requests
   */
  private generateSuggestions(
    changeRequest: ChangeRequest,
    originalText: string
  ): string[] {
    const suggestions: string[] = [];

    if (changeRequest.targets.length === 0) {
      suggestions.push("Try being more specific about which element you want to change (e.g., 'header', 'button', 'navigation')");
    }

    if (changeRequest.confidence < 0.4) {
      suggestions.push("Consider providing more details about what you want to achieve");
    }

    if (!originalText.includes('color') && !originalText.includes('style') && !originalText.includes('function')) {
      suggestions.push("Specify whether you want to change the appearance (colors, fonts) or functionality (behavior, features)");
    }

    if (originalText.length < 20) {
      suggestions.push("Provide more context about the desired change for better results");
    }

    return suggestions;
  }
}

export default SmartChangeHandler;