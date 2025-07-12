from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import math
import time
from typing import Dict, List, Tuple

app = Flask(__name__)
CORS(app)

class STLOrientationOptimizer:
    def __init__(self):
        self.support_material_density = 0.02  # g/cm³
        self.print_speed = 50  # mm/s
        self.layer_height = 0.2  # mm
        
    def quaternion_to_rotation_matrix(self, q: Dict[str, float]) -> np.ndarray:
        """Convert quaternion to rotation matrix"""
        w, x, y, z = q['w'], q['x'], q['y'], q['z']
        
        # Normalize quaternion
        norm = math.sqrt(w*w + x*x + y*y + z*z)
        if norm == 0:
            return np.eye(3)
        
        w, x, y, z = w/norm, x/norm, y/norm, z/norm
        
        # Rotation matrix
        R = np.array([
            [1 - 2*(y*y + z*z), 2*(x*y - w*z), 2*(x*z + w*y)],
            [2*(x*y + w*z), 1 - 2*(x*x + z*z), 2*(y*z - w*x)],
            [2*(x*z - w*y), 2*(y*z + w*x), 1 - 2*(x*x + y*y)]
        ])
        
        return R
    
    def calculate_support_volume(self, quaternion: Dict[str, float]) -> float:
        """Calculate support material volume based on orientation"""
        # Simplified support volume calculation
        # In practice, this would analyze the STL geometry
        
        R = self.quaternion_to_rotation_matrix(quaternion)
        
        # Get the up vector in the rotated coordinate system
        up_vector = R @ np.array([0, 0, 1])
        
        # Calculate overhangs based on orientation
        # More vertical surfaces = less support needed
        vertical_component = abs(up_vector[2])
        
        # Base support volume (arbitrary units)
        base_volume = 100
        
        # Reduce support volume for better orientations
        support_volume = base_volume * (1 - vertical_component * 0.7)
        
        # Add some noise based on other quaternion components
        noise = 20 * (math.sin(quaternion['x'] * 10) + math.cos(quaternion['y'] * 8))
        
        return max(0, support_volume + noise)
    
    def calculate_print_time(self, quaternion: Dict[str, float]) -> float:
        """Calculate estimated print time based on orientation"""
        R = self.quaternion_to_rotation_matrix(quaternion)
        
        # Get the up vector
        up_vector = R @ np.array([0, 0, 1])
        
        # Base print time (minutes)
        base_time = 150
        
        # Orientation affects print time due to support and layer count
        orientation_factor = 1 + 0.3 * (1 - abs(up_vector[2]))
        
        # Add complexity based on quaternion
        complexity = 0.2 * (quaternion['x']**2 + quaternion['y']**2)
        
        return base_time * (orientation_factor + complexity)
    
    def calculate_surface_quality(self, quaternion: Dict[str, float]) -> float:
        """Calculate surface quality score (0-1, higher is better)"""
        R = self.quaternion_to_rotation_matrix(quaternion)
        
        # Get the up vector
        up_vector = R @ np.array([0, 0, 1])
        
        # Base quality
        base_quality = 0.8
        
        # Better quality for certain orientations
        orientation_bonus = 0.15 * abs(up_vector[2])
        
        # Add variation based on quaternion
        variation = 0.1 * math.sin(quaternion['x'] * quaternion['y'] * 20)
        
        quality = base_quality + orientation_bonus + variation
        
        return max(0, min(1, quality))
    
    def calculate_total_cost(self, quaternion: Dict[str, float]) -> Dict[str, float]:
        """Calculate total cost and individual components"""
        
        support_volume = self.calculate_support_volume(quaternion)
        print_time = self.calculate_print_time(quaternion)
        surface_quality = self.calculate_surface_quality(quaternion)
        
        # Cost function weights
        support_weight = 0.1
        time_weight = 0.05
        quality_weight = 100
        
        total_cost = (
            support_volume * support_weight +
            print_time * time_weight +
            (1 - surface_quality) * quality_weight
        )
        
        return {
            'supportVolume': support_volume,
            'printTime': print_time,
            'surfaceQuality': surface_quality,
            'totalCost': total_cost
        }

# Global optimizer instance
optimizer = STLOrientationOptimizer()

@app.route('/api/calculate-cost', methods=['POST'])
def calculate_cost():
    """Calculate cost for a given quaternion orientation"""
    try:
        data = request.json
        quaternion = data.get('quaternion')
        
        if not quaternion:
            return jsonify({'error': 'Quaternion is required'}), 400
        
        # Simulate processing time
        time.sleep(0.1 + np.random.random() * 0.2)
        
        result = optimizer.calculate_total_cost(quaternion)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/optimize', methods=['POST'])
def optimize_orientation():
    """Find optimal orientation using grid search"""
    try:
        data = request.json
        sample_count = data.get('sampleCount', 100)
        
        # Generate random quaternion samples
        best_quaternion = {'w': 1, 'x': 0, 'y': 0, 'z': 0}
        best_cost = float('inf')
        
        for _ in range(sample_count):
            # Generate random quaternion
            u1, u2, u3 = np.random.random(3)
            
            w = np.sqrt(1 - u1) * np.sin(2 * np.pi * u2)
            x = np.sqrt(1 - u1) * np.cos(2 * np.pi * u2)
            y = np.sqrt(u1) * np.sin(2 * np.pi * u3)
            z = np.sqrt(u1) * np.cos(2 * np.pi * u3)
            
            quaternion = {'w': w, 'x': x, 'y': y, 'z': z}
            
            # Calculate cost
            result = optimizer.calculate_total_cost(quaternion)
            
            if result['totalCost'] < best_cost:
                best_cost = result['totalCost']
                best_quaternion = quaternion
        
        return jsonify({
            'quaternion': best_quaternion,
            'cost': best_cost
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'STL Orientation Optimizer'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)