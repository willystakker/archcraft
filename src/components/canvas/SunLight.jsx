import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SunLight({ time = 12, angle = 45 }) {
  const lightRef = useRef();
  const helperRef = useRef();

  // time: 0-24 hours, angle: azimuth in degrees
  const hourAngle = ((time - 6) / 12) * Math.PI; // 6am = 0, 6pm = π
  const elevation = Math.sin(hourAngle) * 70; // max 70 deg at noon
  const azimuth = (angle * Math.PI) / 180;

  const x = Math.cos(azimuth) * Math.cos((elevation * Math.PI) / 180) * 30;
  const y = Math.max(2, Math.sin((elevation * Math.PI) / 180) * 30);
  const z = Math.sin(azimuth) * Math.cos((elevation * Math.PI) / 180) * 30;

  // Sun color shifts warm at dawn/dusk
  const warmth = 1 - Math.abs(time - 12) / 8;
  const sunColor = new THREE.Color(
    1,
    0.85 + warmth * 0.15,
    0.6 + warmth * 0.4
  );

  const intensity = Math.max(0, Math.sin(hourAngle)) * 1.8;

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[x, y, z]}
        intensity={intensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      {/* Sun sphere for visual */}
      <mesh position={[x * 0.8, y * 0.8, z * 0.8]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={sunColor} />
      </mesh>
    </>
  );
}
