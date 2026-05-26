import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { FLOOR_TEXTURES, WALL_TEXTURES } from '../../utils/textures';

const WALL_THICKNESS = 0.18;

function WallPanel({ width, height, color, wallMaterial, opening, castShadow, wireframe }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2, height);
    shape.lineTo(-width / 2, height);
    shape.closePath();
    if (opening) {
      const hole = new THREE.Path();
      const hx = opening.pos * width - width / 2;
      hole.moveTo(hx - opening.w / 2, opening.bottom ?? 0);
      hole.lineTo(hx + opening.w / 2, opening.bottom ?? 0);
      hole.lineTo(hx + opening.w / 2, opening.top);
      hole.lineTo(hx - opening.w / 2, opening.top);
      hole.closePath();
      shape.holes.push(hole);
    }
    return new THREE.ExtrudeGeometry(shape, { depth: WALL_THICKNESS, bevelEnabled: false });
  }, [width, height, opening]);

  const texture = useMemo(() => {
    const fn = WALL_TEXTURES[wallMaterial] ?? WALL_TEXTURES.paint;
    return fn(color);
  }, [wallMaterial, color]);

  return (
    <mesh geometry={geometry} castShadow={castShadow} receiveShadow>
      <meshStandardMaterial map={texture} color={color} roughness={wallMaterial === 'tile' ? 0.3 : 0.85} metalness={wallMaterial === 'tile' ? 0.05 : 0} wireframe={wireframe} />
    </mesh>
  );
}

function DoorGeometry({ opening, wallWidth }) {
  if (!opening || opening.type !== 'door') return null;
  const hx = opening.pos * wallWidth - wallWidth / 2;
  const dw = opening.w, dh = opening.top, ft = 0.05;
  return (
    <group position={[hx, 0, WALL_THICKNESS / 2]}>
      {[
        { pos: [-dw / 2 - ft / 2, dh / 2, 0], size: [ft, dh, ft] },
        { pos: [dw / 2 + ft / 2, dh / 2, 0], size: [ft, dh, ft] },
        { pos: [0, dh + ft / 2, 0], size: [dw + ft * 2, ft, ft] },
      ].map((f, i) => (
        <mesh key={i} position={f.pos} castShadow>
          <boxGeometry args={f.size} />
          <meshStandardMaterial color="#6b5a4a" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[-dw * 0.1, dh / 2, -0.02]} castShadow>
        <boxGeometry args={[dw * 0.95, dh * 0.98, 0.04]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.7} />
      </mesh>
      <mesh position={[dw * 0.3, dh * 0.45, 0.03]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#c8a84a" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function WindowGeometry({ opening, wallWidth }) {
  if (!opening || opening.type !== 'window') return null;
  const hx = opening.pos * wallWidth - wallWidth / 2;
  const ww = opening.w, wh = opening.top - (opening.bottom ?? 0), wy = (opening.bottom ?? 0) + wh / 2, ft = 0.04;
  return (
    <group position={[hx, wy, WALL_THICKNESS / 2]}>
      {[
        { pos: [-ww / 2 - ft / 2, 0, 0], size: [ft, wh, ft] },
        { pos: [ww / 2 + ft / 2, 0, 0], size: [ft, wh, ft] },
        { pos: [0, wh / 2 + ft / 2, 0], size: [ww + ft * 2, ft, ft] },
        { pos: [0, -wh / 2 - ft / 2, 0], size: [ww + ft * 2, ft, ft] },
        { pos: [0, 0, 0], size: [ft, wh, ft] },
      ].map((f, i) => (
        <mesh key={i} position={f.pos}>
          <boxGeometry args={f.size} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.3} />
        </mesh>
      ))}
      <mesh>
        <planeGeometry args={[ww, wh]} />
        <meshPhysicalMaterial color="#a8d4f0" transparent opacity={0.22} roughness={0} transmission={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function Room3D({ room, selected, wireframe, showMeasurements, onClick }) {
  const outlineRef = useRef();
  useFrame((state) => {
    if (outlineRef.current) {
      outlineRef.current.material.opacity = selected
        ? 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.15 : 0;
    }
  });

  const { x, z, width, length, height, floorMaterial, wallMaterial, wallColor, ceilingColor } = room;

  const floorTex = useMemo(() => (FLOOR_TEXTURES[floorMaterial] ?? FLOOR_TEXTURES.hardwood)(), [floorMaterial]);

  const getOpening = (face) => {
    const d = (room.doors || []).find(o => o.wall === face);
    if (d) return { ...d, type: 'door', w: 0.9, top: 2.1, bottom: 0, pos: d.pos ?? 0.5 };
    const w = (room.windows || []).find(o => o.wall === face);
    if (w) return { ...w, type: 'window', w: 1.2, top: 2.0, bottom: 0.85, pos: w.pos ?? 0.5 };
    return null;
  };

  const wallDefs = [
    { face: 'north', pos: [0, 0, -length / 2], rot: [0, 0, 0], dim: width },
    { face: 'south', pos: [-width / 2, 0, length / 2 - WALL_THICKNESS], rot: [0, Math.PI, 0], dim: width },
    { face: 'west', pos: [-width / 2, 0, -length / 2], rot: [0, Math.PI / 2, 0], dim: length },
    { face: 'east', pos: [width / 2 - WALL_THICKNESS, 0, length / 2], rot: [0, -Math.PI / 2, 0], dim: length },
  ];

  return (
    <group position={[x, 0, z]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[width - WALL_THICKNESS * 2, length - WALL_THICKNESS * 2]} />
        <meshStandardMaterial map={floorTex} roughness={0.72} metalness={0} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={ceilingColor || '#f8f8f8'} roughness={0.95} side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>
      {wallDefs.map(({ face, pos, rot, dim }) => {
        const opening = getOpening(face);
        return (
          <group key={face} position={pos} rotation={rot}>
            <WallPanel width={dim} height={height} color={wallColor} wallMaterial={wallMaterial} opening={opening} castShadow wireframe={wireframe} />
            <DoorGeometry opening={opening} wallWidth={dim} />
            <WindowGeometry opening={opening} wallWidth={dim} />
          </group>
        );
      })}
      <mesh ref={outlineRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[width + 0.08, height + 0.08, length + 0.08]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {showMeasurements && (
        <Text position={[0, height + 0.4, 0]} fontSize={0.3} color={selected ? '#818cf8' : '#94a3b8'} anchorX="center" rotation={[-Math.PI / 2, 0, 0]} outlineWidth={0.02} outlineColor="#000">
          {room.name}
        </Text>
      )}
      {selected && showMeasurements && (
        <>
          <Text position={[0, 0.2, length / 2 + 0.6]} fontSize={0.25} color="#22d3ee" anchorX="center" rotation={[-Math.PI / 2, 0, 0]} outlineWidth={0.02} outlineColor="#000">{width.toFixed(1)}m</Text>
          <Text position={[width / 2 + 0.6, 0.2, 0]} fontSize={0.25} color="#22d3ee" anchorX="center" rotation={[-Math.PI / 2, 0, Math.PI / 2]} outlineWidth={0.02} outlineColor="#000">{length.toFixed(1)}m</Text>
          <Text position={[width / 2 + 0.4, height / 2, 0]} fontSize={0.2} color="#f59e0b" anchorX="center" outlineWidth={0.02} outlineColor="#000">↕ {height.toFixed(1)}m</Text>
        </>
      )}
    </group>
  );
}
