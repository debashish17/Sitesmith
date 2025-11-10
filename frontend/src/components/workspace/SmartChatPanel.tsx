import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  Files, 
  Gauge, 
  CheckCircle, 
  AlertCircle, 
  Send,
  Loader2
} from 'lucide-react';
import { useSmartChange } from '../../hooks/useSmartChange';
import type { SmartChangeResponse } from '../../services/projectService';

interface SmartChatPanelProps {
  projectId: string;
  onOptimizedPromptReady: (prompt: string, analysis: SmartChangeResponse['analysis'] | null) => void;
  isFirstSmartRequest?: boolean;
}

const SmartChatPanel: React.FC<SmartChatPanelProps> = ({ 
  projectId, 
  onOptimizedPromptReady,
  isFirstSmartRequest = false
}) => {
  const [userInput, setUserInput] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const {
    isAnalyzing,
    lastAnalysis,
    error,
    processSmartChange,
    needsClarification,
    getSuggestions,
    getAnalysisSummary,
    clearAnalysis,
    hasAnalysis,
    isHighConfidence,
    isMediumConfidence,
    isLowConfidence
  } = useSmartChange({ projectId });

  const analysis = getAnalysisSummary();

  const handleAnalyze = async () => {
    if (!userInput.trim()) return;

    setShowAnalysis(true);
    const result = await processSmartChange(userInput, isFirstSmartRequest);
    
    if (result && !needsClarification()) {
      // Automatically proceed with optimized prompt if confidence is high
      onOptimizedPromptReady(result.optimizedPrompt, result);
    }
  };

  const handleProceedWithOptimized = () => {
    if (lastAnalysis) {
      onOptimizedPromptReady(lastAnalysis.optimizedPrompt, lastAnalysis);
      setShowAnalysis(false);
      setUserInput('');
      clearAnalysis();
    }
  };

  const handleProceedWithOriginal = () => {
    onOptimizedPromptReady(userInput, null);
    setShowAnalysis(false);
    setUserInput('');
    clearAnalysis();
  };

  const getIntentBadgeColor = (intent: string) => {
    switch (intent) {
      case 'style': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'functionality': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'add': return 'bg-green-100 text-green-800 border-green-200';
      case 'remove': return 'bg-red-100 text-red-800 border-red-200';
      case 'modify': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Brain className="w-4 h-4" />
          <span>AI-Powered Change Request Analysis</span>
          {isFirstSmartRequest && (
            <Badge variant="secondary" className="text-xs">
              First request - Building semantic index
            </Badge>
          )}
        </div>
        
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe what you want to change in your website... (e.g., 'Make the header blue' or 'Add a contact form to the homepage')"
          className="min-h-[100px] resize-none"
          disabled={isAnalyzing}
        />
        
        <div className="flex gap-2">
          <Button 
            onClick={handleAnalyze}
            disabled={!userInput.trim() || isAnalyzing}
            className="flex-1"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Request...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analyze & Optimize
              </>
            )}
          </Button>
          
          {hasAnalysis && (
            <Button 
              variant="outline" 
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              {showAnalysis ? 'Hide' : 'Show'} Analysis
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Analysis Results */}
      {showAnalysis && analysis && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Brain className="w-5 h-5" />
              Smart Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Intent & Confidence */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Intent
                </div>
                <Badge className={getIntentBadgeColor(analysis.intent)}>
                  {analysis.intent.toUpperCase()}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Confidence
                </div>
                <Badge className={getConfidenceBadgeColor(analysis.confidence)}>
                  {analysis.confidence}%
                </Badge>
              </div>
            </div>

            {/* Targets */}
            {analysis.targets.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Target Elements
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.targets.map((target, index) => (
                    <Badge key={index} variant="outline">
                      {target}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* File Impact & Complexity */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Files className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  {analysis.affectedFilesCount} file(s) affected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  Complexity: 
                  <span className={`ml-1 font-medium ${getComplexityColor(analysis.complexity)}`}>
                    {analysis.complexity}
                  </span>
                </span>
              </div>
            </div>

            {/* Suggestions for low confidence */}
            {needsClarification() && getSuggestions().length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <Lightbulb className="w-4 h-4" />
                <AlertDescription className="text-yellow-800">
                  <div className="font-medium mb-2">Suggestions for better results:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {getSuggestions().map((suggestion, index) => (
                      <li key={index} className="text-sm">{suggestion}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-blue-200">
              <Button 
                onClick={handleProceedWithOptimized}
                className="flex-1"
                disabled={!lastAnalysis}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Use Optimized Request
              </Button>
              <Button 
                variant="outline" 
                onClick={handleProceedWithOriginal}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Use Original
              </Button>
            </div>

            {/* Confidence Indicator */}
            <div className="text-xs text-gray-600 text-center">
              {isHighConfidence && '✅ High confidence - ready to proceed'}
              {isMediumConfidence && '⚠️ Medium confidence - review suggested changes'}
              {isLowConfidence && '❌ Low confidence - consider refining your request'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartChatPanel;