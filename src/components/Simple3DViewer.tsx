import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, Center, Bounds } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';

interface Layer {
  url: string;
  color: string;
  opacity?: number;
}

function Model({ url, color, opacity = 1 }: { url: string; color: string; opacity?: number }) {
  const geometry = useLoader(STLLoader, url);
  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial 
        color={color} 
        roughness={0.4} 
        metalness={0.1}
        transparent={opacity < 1}
        opacity={opacity}
        envMapIntensity={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function Simple3DViewer({ 
  modelUrl, 
  color = "#3b82f6",
  layers = [],
  showBadge = true,
  showControls = true
}: { 
  modelUrl?: string; 
  color?: string;
  layers?: Layer[];
  showBadge?: boolean;
  showControls?: boolean;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] dark:from-[#0f1115] dark:to-[#1a1b1e] rounded-[12px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Combine single URL with layers for rendering
  const allLayers = layers.length > 0 ? layers : (modelUrl ? [{ url: modelUrl, color }] : []);

  return (
    <div className={`w-full h-full bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] dark:from-[#0f1115] dark:to-[#1a1b1e] overflow-hidden relative ${showControls ? 'rounded-[12px] border border-ai-border/50 shadow-inner' : ''}`}>
      <Canvas>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} shadows={false} adjustCamera={false}>
            <Bounds fit clip observe margin={showControls ? 1.2 : 1.8}>
              <Center top>
                <group>
                  {allLayers.map((layer, idx) => (
                    <Model key={idx} url={layer.url} color={layer.color} opacity={layer.opacity} />
                  ))}
                </group>
              </Center>
            </Bounds>
          </Stage>
          {showControls && (
            <OrbitControls 
              enablePan={false} 
              enableZoom={true} 
              autoRotate 
              autoRotateSpeed={1}
              makeDefault 
            />
          )}
        </Suspense>
      </Canvas>
      
      {/* Visual Indicator */}
      {showBadge && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-sm pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-bold text-ai-text-secondary uppercase tracking-widest">High-Fidelity Preview</span>
        </div>
      )}
    </div>
  );
}
