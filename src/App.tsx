import React, { useState, useEffect } from 'react';
import STLViewer from './components/STLViewer';
import QuaternionControls from './components/QuaternionControls';
import FileUpload from './components/FileUpload';
import CostDisplay from './components/CostDisplay';
import OptimizationPanel from './components/OptimizationPanel';
import { costApi, CostMetrics } from './services/costApi';

function App() {
  const [stlFile, setStlFile] = useState<File | null>(null);
  const [quaternion, setQuaternion] = useState({ w: 1, x: 0, y: 0, z: 0 });
  const [costMetrics, setCostMetrics] = useState<CostMetrics>({
    supportVolume: 0,
    printTime: 0,
    surfaceQuality: 0,
    totalCost: 0
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Calculate cost when quaternion changes
  useEffect(() => {
    if (!stlFile) return;

    const calculateCost = async () => {
      setIsCalculating(true);
      try {
        const metrics = await costApi.calculateCost({
          quaternion,
          stlData: await stlFile.arrayBuffer()
        });
        setCostMetrics(metrics);
      } catch (error) {
        console.error('Error calculating cost:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateCost();
  }, [quaternion, stlFile]);

  const handleOptimize = async () => {
    if (!stlFile) return;

    setIsOptimizing(true);
    try {
      const stlData = await stlFile.arrayBuffer();
      const samples = await costApi.generateQuaternionSamples(100);
      
      let bestQuaternion = quaternion;
      let bestCost = costMetrics.totalCost;
      
      // Test each sample and find the best one
      for (const sample of samples) {
        const metrics = await costApi.calculateCost({
          quaternion: sample,
          stlData
        });
        
        if (metrics.totalCost < bestCost) {
          bestCost = metrics.totalCost;
          bestQuaternion = sample;
        }
      }
      
      // Apply the best quaternion
      setQuaternion(bestQuaternion);
    } catch (error) {
      console.error('Error during optimization:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleStopOptimization = () => {
    setIsOptimizing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">
            STL Orientation Optimizer
          </h1>
          <p className="text-gray-400">
            Interactive 3D quaternion-based orientation optimization for 3D printing
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <FileUpload
              onFileSelect={setStlFile}
              selectedFile={stlFile}
            />
            
            <QuaternionControls
              quaternion={quaternion}
              onChange={setQuaternion}
            />
            
            <OptimizationPanel
              onOptimize={handleOptimize}
              isOptimizing={isOptimizing}
              onStop={handleStopOptimization}
            />
          </div>

          {/* Center Column - 3D Viewer */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">3D Viewer</h3>
              <div className="aspect-square">
                <STLViewer
                  stlFile={stlFile}
                  quaternion={quaternion}
                  onQuaternionChange={setQuaternion}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Cost Display */}
          <div className="space-y-6">
            <CostDisplay
              quaternion={quaternion}
              metrics={costMetrics}
              isCalculating={isCalculating}
            />
            
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Instructions</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <span>Upload an STL file using the file upload panel</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span>Adjust the quaternion values to rotate your model</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <span>Watch the real-time cost function update</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <span>Use "Find Best Orientation" to automatically optimize</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;