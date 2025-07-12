import React, { useState } from 'react';
import { Zap, Play, Square } from 'lucide-react';

interface OptimizationPanelProps {
  onOptimize: () => void;
  isOptimizing: boolean;
  onStop: () => void;
}

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({ 
  onOptimize, 
  isOptimizing, 
  onStop 
}) => {
  const [optimizationMethod, setOptimizationMethod] = useState<'grid' | 'gradient'>('grid');
  const [samples, setSamples] = useState(100);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Optimization</h3>
      </div>
      
      <div className="space-y-4">
        {/* Optimization method */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Optimization Method
          </label>
          <select
            value={optimizationMethod}
            onChange={(e) => setOptimizationMethod(e.target.value as 'grid' | 'gradient')}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            disabled={isOptimizing}
          >
            <option value="grid">Grid Search</option>
            <option value="gradient">Gradient Descent</option>
          </select>
        </div>

        {/* Sample count for grid search */}
        {optimizationMethod === 'grid' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Sample Count
            </label>
            <input
              type="number"
              value={samples}
              onChange={(e) => setSamples(parseInt(e.target.value) || 100)}
              min="10"
              max="1000"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              disabled={isOptimizing}
            />
          </div>
        )}

        {/* Optimization controls */}
        <div className="flex gap-2">
          {!isOptimizing ? (
            <button
              onClick={onOptimize}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              Find Best Orientation
            </button>
          ) : (
            <button
              onClick={onStop}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Square className="w-4 h-4" />
              Stop Optimization
            </button>
          )}
        </div>

        {/* Optimization status */}
        {isOptimizing && (
          <div className="p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-yellow-400">Optimizing orientation...</span>
            </div>
          </div>
        )}

        {/* Algorithm info */}
        <div className="p-3 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Algorithm Info</div>
          <div className="text-sm text-gray-300">
            {optimizationMethod === 'grid' ? (
              <>Grid search will test {samples} random quaternion orientations and select the one with the lowest cost.</>
            ) : (
              <>Gradient descent will iteratively improve the quaternion orientation using cost function gradients.</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationPanel;