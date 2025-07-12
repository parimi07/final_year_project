interface CostMetrics {
  supportVolume: number;
  printTime: number;
  surfaceQuality: number;
  totalCost: number;
}

interface CostRequest {
  quaternion: { w: number; x: number; y: number; z: number };
  stlData?: ArrayBuffer;
}

class CostApiService {
  private baseUrl = 'http://localhost:5000/api';

  async calculateCost(request: CostRequest): Promise<CostMetrics> {
    // Simulate API call with mock data for now
    // In production, this would call the actual Flask/FastAPI backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const { quaternion } = request;
        
        // Mock cost calculation based on quaternion
        const magnitude = Math.sqrt(
          quaternion.w * quaternion.w +
          quaternion.x * quaternion.x +
          quaternion.y * quaternion.y +
          quaternion.z * quaternion.z
        );
        
        // Simulate different cost components
        const supportVolume = 50 + Math.sin(quaternion.x * 10) * 20 + Math.cos(quaternion.y * 8) * 15;
        const printTime = 120 + Math.sin(quaternion.z * 12) * 30 + Math.cos(quaternion.w * 6) * 25;
        const surfaceQuality = 0.8 + Math.sin(quaternion.x * quaternion.y * 20) * 0.15;
        
        // Combined cost function
        const totalCost = 
          supportVolume * 0.1 +           // Support volume penalty
          printTime * 0.05 +              // Print time penalty
          (1 - surfaceQuality) * 100;     // Surface quality penalty
        
        resolve({
          supportVolume: Math.max(0, supportVolume),
          printTime: Math.max(60, printTime),
          surfaceQuality: Math.max(0, Math.min(1, surfaceQuality)),
          totalCost: Math.max(0, totalCost)
        });
      }, 300 + Math.random() * 200); // Simulate network delay
    });
  }

  async optimizeOrientation(stlData?: ArrayBuffer): Promise<{ w: number; x: number; y: number; z: number }> {
    // Simulate optimization process
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock optimization result
        const optimizedQuaternion = {
          w: 0.7071,
          x: 0.7071,
          y: 0.0,
          z: 0.0
        };
        
        resolve(optimizedQuaternion);
      }, 2000 + Math.random() * 3000); // Simulate longer optimization time
    });
  }

  async generateQuaternionSamples(count: number): Promise<Array<{ w: number; x: number; y: number; z: number }>> {
    const samples = [];
    
    for (let i = 0; i < count; i++) {
      // Generate random quaternion
      const u1 = Math.random();
      const u2 = Math.random();
      const u3 = Math.random();
      
      const w = Math.sqrt(1 - u1) * Math.sin(2 * Math.PI * u2);
      const x = Math.sqrt(1 - u1) * Math.cos(2 * Math.PI * u2);
      const y = Math.sqrt(u1) * Math.sin(2 * Math.PI * u3);
      const z = Math.sqrt(u1) * Math.cos(2 * Math.PI * u3);
      
      samples.push({ w, x, y, z });
    }
    
    return samples;
  }
}

export const costApi = new CostApiService();
export type { CostMetrics, CostRequest };