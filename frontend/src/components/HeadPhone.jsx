import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

const HeadPhone = () => {
    const { scene } = useGLTF('/assets/headphone2.glb'); // Use your exported file path

    return (
        <Canvas camera={{ position: [0, 0, 20] }}> {/* Camera position */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Environment
                files={[
                    "https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/4k/studio_small_09_4k.exr"
                ]}
            />
            <primitive object={scene} position={[0, -8, 0]} scale={[25, 25, 25]} /> {/* Moved model further down */}
            <OrbitControls enableZoom={false} /> {/* Disable zoom on scroll */}
        </Canvas>
    );
};

// Preload the GLTF model
useGLTF.preload('/assets/headphone2.glb');

export default HeadPhone;
