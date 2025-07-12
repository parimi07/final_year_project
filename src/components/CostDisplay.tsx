import React from 'react';
import { Calculator, Clock, Volume2, Target, Zap } from 'lucide-react';

interface CostMetrics {
  supportVolume: number;
  printTime: number;
  surfaceQuality: number;
  totalCost: number;
}

interface CostDisplayProps {
  quaternion: { w: number; x: number; y: number; z: number };
  metrics: CostMetrics;
  isCalculating: boolean;
}

const CostDisplay: React.FC<CostDisplayProps> = ({ quaternion, metrics, isCalculating }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Cost Function</h3>
      </div>
      
      <div className="space-y-4">
        {/* Quaternion display */}
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Current Quaternion</div>
          <div className="font-mono text-cyan-400">
            q = {quaternion.w.toFixed(3)} + {quaternion.x.toFixed(3)}i + {quaternion.y.toFixed(3)}j + {quaternion.z.toFixed(3)}k
          </div>
        </div>

        {/* Cost function result */}
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Cost Function Result</div>
          <div className="font-mono text-lg text-white">
            {isCalculating ? (
              <span className="text-yellow-400">Calculating...</span>
            ) : (
              <>f(q) = <span className="text-red-400">{metrics.totalCost.toFixed(4)}</span></>
            )}
          </div>
        </div>

        {/* Individual metrics */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Support Volume</span>
            </div>
            <span className="text-white font-mono">
              {isCalculating ? '---' : `${metrics.supportVolume.toFixed(2)} mm³`}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Print Time</span>
            </div>
            <span className="text-white font-mono">
              {isCalculating ? '---' : `${metrics.printTime.toFixed(1)} min`}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">Surface Quality</span>
            </div>
            <span className="text-white font-mono">
              {isCalculating ? '---' : `${metrics.surfaceQuality.toFixed(3)}`}
            </span>
          </div>
        </div>

        {/* Orientation vectors */}
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-400 mb-3">Orientation Vectors</div>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex items-center gap-2">
              <span className="text-red-400">f(i):</span>
              <span className="text-white">[1, 0, 0] → rotated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">f(j):</span>
              <span className="text-white">[0, 1, 0] → rotated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">f(k):</span>
              <span className="text-white">[0, 0, 1] → rotated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostDisplay;