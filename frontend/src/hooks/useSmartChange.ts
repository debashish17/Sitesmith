import { useState } from 'react';
import { projectService, SmartChangeResponse } from '../services/projectService';

export interface UseSmartChangeProps {
  projectId: string;
}

export interface SmartChangeState {
  isAnalyzing: boolean;
  isProcessing: boolean;
  lastAnalysis: SmartChangeResponse['analysis'] | null;
  error: string | null;
}

export const useSmartChange = ({ projectId }: UseSmartChangeProps) => {
  const [state, setState] = useState<SmartChangeState>({
    isAnalyzing: false,
    isProcessing: false,
    lastAnalysis: null,
    error: null
  });

  /**
   * Process a smart change request with NLP analysis
   */
  const processSmartChange = async (
    userRequest: string, 
    includeIndexing: boolean = false
  ): Promise<SmartChangeResponse['analysis'] | null> => {
    setState(prev => ({ 
      ...prev, 
      isAnalyzing: true, 
      error: null 
    }));

    try {
      console.log('🤖 Processing smart change request:', userRequest);
      
      const response = await projectService.processSmartChange(projectId, {
        userRequest,
        includeIndexing
      });

      if (!response.success) {
        throw new Error('Smart change analysis failed');
      }

      const analysis = response.analysis;
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        lastAnalysis: analysis,
        error: null
      }));

      console.log('✅ Smart change analysis completed:', {
        intent: analysis.changeRequest.intent,
        confidence: analysis.changeRequest.confidence,
        affectedFiles: analysis.affectedFiles.length,
        complexity: analysis.estimatedComplexity
      });

      return analysis;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Smart change analysis failed:', errorMessage);
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));

      return null;
    }
  };

  /**
   * Get optimized prompt for AI based on smart analysis
   */
  const getOptimizedPrompt = (): string | null => {
    if (!state.lastAnalysis) {
      return null;
    }

    return state.lastAnalysis.optimizedPrompt;
  };

  /**
   * Check if a request needs clarification based on analysis
   */
  const needsClarification = (): boolean => {
    if (!state.lastAnalysis) return false;
    
    return (
      state.lastAnalysis.changeRequest.confidence < 0.6 ||
      state.lastAnalysis.suggestions !== undefined
    );
  };

  /**
   * Get suggestions for improving the request
   */
  const getSuggestions = (): string[] => {
    return state.lastAnalysis?.suggestions || [];
  };

  /**
   * Get analysis summary for display
   */
  const getAnalysisSummary = () => {
    if (!state.lastAnalysis) return null;

    const { changeRequest, affectedFiles, estimatedComplexity } = state.lastAnalysis;

    return {
      intent: changeRequest.intent,
      confidence: Math.round(changeRequest.confidence * 100),
      targets: changeRequest.targets,
      affectedFilesCount: affectedFiles.length,
      complexity: estimatedComplexity,
      confidenceLevel: changeRequest.confidence >= 0.8 ? 'high' : 
                     changeRequest.confidence >= 0.6 ? 'medium' : 'low'
    };
  };

  /**
   * Clear previous analysis
   */
  const clearAnalysis = () => {
    setState(prev => ({
      ...prev,
      lastAnalysis: null,
      error: null
    }));
  };

  return {
    // State
    isAnalyzing: state.isAnalyzing,
    isProcessing: state.isProcessing,
    lastAnalysis: state.lastAnalysis,
    error: state.error,

    // Actions
    processSmartChange,
    getOptimizedPrompt,
    clearAnalysis,

    // Utilities
    needsClarification,
    getSuggestions,
    getAnalysisSummary,
    
    // Analysis indicators
    hasAnalysis: !!state.lastAnalysis,
    isHighConfidence: (state.lastAnalysis?.changeRequest.confidence ?? 0) >= 0.8,
    isMediumConfidence: (state.lastAnalysis?.changeRequest.confidence ?? 0) >= 0.6,
    isLowConfidence: (state.lastAnalysis?.changeRequest.confidence ?? 1) < 0.6
  };
};

export default useSmartChange;