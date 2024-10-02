import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

const HeadphoneModel = () => {
    const { scene } = useGLTF('/assets/headphone2.glb');
    const modelRef = useRef();

    useFrame(() => {
        if (modelRef.current) {
            modelRef.current.rotation.y += 0.004;
        }
    });

    return (
        <primitive ref={modelRef} object={scene} position={[0, -7, 0]} scale={[27, 27, 27]} />
    );
};

const HeadPhone = () => {
    return (
        <Canvas camera={{ position: [0, 0, 20] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Environment
                files={[
                    "https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/4k/shanghai_bund_4k.exr"
                ]}
            />
            <HeadphoneModel />
            <OrbitControls 
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
            />
        </Canvas>
    );
};

useGLTF.preload('/assets/headphone2.glb');

export default HeadPhone;
