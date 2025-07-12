import React from 'react';
import { Sliders } from 'lucide-react';

interface QuaternionControlsProps {
  quaternion: { w: number; x: number; y: number; z: number };
  onChange: (q: { w: number; x: number; y: number; z: number }) => void;
}

const QuaternionControls: React.FC<QuaternionControlsProps> = ({ quaternion, onChange }) => {
  const handleSliderChange = (component: keyof typeof quaternion, value: number) => {
    const newQuaternion = { ...quaternion, [component]: value };
    
    // Normalize quaternion
    const magnitude = Math.sqrt(
      newQuaternion.w * newQuaternion.w +
      newQuaternion.x * newQuaternion.x +
      newQuaternion.y * newQuaternion.y +
      newQuaternion.z * newQuaternion.z
    );
    
    if (magnitude > 0) {
      newQuaternion.w /= magnitude;
      newQuaternion.x /= magnitude;
      newQuaternion.y /= magnitude;
      newQuaternion.z /= magnitude;
    }
    
    onChange(newQuaternion);
  };

  const handleInputChange = (component: keyof typeof quaternion, value: string) => {
    const numValue = parseFloat(value) || 0;
    handleSliderChange(component, numValue);
  };

  const resetQuaternion = () => {
    onChange({ w: 1, x: 0, y: 0, z: 0 });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Quaternion Controls</h3>
      </div>
      
      <div className="space-y-4">
        <div className="text-sm text-gray-300 mb-4">
          q = w + xi + yj + zk
        </div>
        
        {/* W component */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            w (real part)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={quaternion.w}
              onChange={(e) => handleSliderChange('w', parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-cyan"
            />
            <input
              type="number"
              value={quaternion.w.toFixed(3)}
              onChange={(e) => handleInputChange('w', e.target.value)}
              className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              step="0.001"
            />
          </div>
        </div>

        {/* X component */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            x (i coefficient)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={quaternion.x}
              onChange={(e) => handleSliderChange('x', parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-cyan"
            />
            <input
              type="number"
              value={quaternion.x.toFixed(3)}
              onChange={(e) => handleInputChange('x', e.target.value)}
              className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              step="0.001"
            />
          </div>
        </div>

        {/* Y component */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            y (j coefficient)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={quaternion.y}
              onChange={(e) => handleSliderChange('y', parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-cyan"
            />
            <input
              type="number"
              value={quaternion.y.toFixed(3)}
              onChange={(e) => handleInputChange('y', e.target.value)}
              className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              step="0.001"
            />
          </div>
        </div>

        {/* Z component */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            z (k coefficient)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={quaternion.z}
              onChange={(e) => handleSliderChange('z', parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-cyan"
            />
            <input
              type="number"
              value={quaternion.z.toFixed(3)}
              onChange={(e) => handleInputChange('z', e.target.value)}
              className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              step="0.001"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-600">
          <button
            onClick={resetQuaternion}
            className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Reset to Identity
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuaternionControls;