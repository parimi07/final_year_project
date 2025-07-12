import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface STLViewerProps {
  stlFile: File | null;
  quaternion: { w: number; x: number; y: number; z: number };
  onQuaternionChange: (q: { w: number; x: number; y: number; z: number }) => void;
}

const STLViewer: React.FC<STLViewerProps> = ({ stlFile, quaternion, onQuaternionChange }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Grid
    const gridHelper = new THREE.GridHelper(100, 50, 0x333333, 0x333333);
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Orientation markers
    const axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    // Add coordinate system labels
    // Simple text geometry for i, j, k labels
    const createTextSprite = (text: string, color: number, position: THREE.Vector3) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 64;
      canvas.height = 64;
      
      context.font = '24px Arial';
      context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
      context.textAlign = 'center';
      context.fillText(text, 32, 40);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(position);
      sprite.scale.set(5, 5, 1);
      
      return sprite;
    };

    scene.add(createTextSprite('i', 0xff0000, new THREE.Vector3(25, 0, 0)));
    scene.add(createTextSprite('j', 0x00ff00, new THREE.Vector3(0, 25, 0)));
    scene.add(createTextSprite('k', 0x0000ff, new THREE.Vector3(0, 0, 25)));

    mountRef.current.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Load STL file
  useEffect(() => {
    if (!stlFile || !sceneRef.current) return;

    setIsLoading(true);
    
    const loader = new STLLoader();
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) return;

      try {
        const geometry = loader.parse(event.target.result as ArrayBuffer);
        geometry.computeVertexNormals();
        
        // Center the geometry
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox!.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);
        
        // Scale to reasonable size
        const size = new THREE.Vector3();
        geometry.boundingBox!.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 30 / maxDim;
        geometry.scale(scale, scale, scale);

        const material = new THREE.MeshPhongMaterial({
          color: 0x00ffff,
          shininess: 100,
          transparent: true,
          opacity: 0.9
        });

        // Remove previous model
        if (modelRef.current) {
          sceneRef.current!.remove(modelRef.current);
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        modelRef.current = mesh;
        sceneRef.current!.add(mesh);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading STL file:', error);
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(stlFile);
  }, [stlFile]);

  // Apply quaternion rotation
  useEffect(() => {
    if (!modelRef.current) return;

    const q = new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    q.normalize();
    modelRef.current.quaternion.copy(q);
  }, [quaternion]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full bg-gray-900 relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-10">
          <div className="text-cyan-400 text-xl">Loading STL...</div>
        </div>
      )}
    </div>
  );
};

export default STLViewer;