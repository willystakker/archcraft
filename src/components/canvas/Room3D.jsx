import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { FLOOR_TEXTURES, WALL_TEXTURES } from '../../utils/textures';

const WALL_T = 0.18; // wall thickness

// ── Wall panel with hole for door/window ─────────────────────────────────────
function WallPanel({ width, height, color, wallMaterial, opening, wireframe }) {
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
    return new THREE.ExtrudeGeometry(shape, { depth: WALL_T, bevelEnabled: false });
  }, [width, height, opening]);

  const texture = useMemo(() => {
    const fn = WALL_TEXTURES[wallMaterial] ?? WALL_TEXTURES.paint;
    return fn(color);
  }, [wallMaterial, color]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      {/* DoubleSide = visible from inside AND outside */}
      <meshStandardMaterial
        map={texture}
        color={color}
        roughness={wallMaterial === 'tile' ? 0.25 : 0.88}
        metalness={wallMaterial === 'tile' ? 0.04 : 0}
        side={THREE.DoubleSide}
        wireframe={wireframe}
      />
    </mesh>
  );
}

// ── Door frame + leaf ─────────────────────────────────────────────────────────
function DoorGeometry({ opening, wallWidth }) {
  if (!opening || opening.type !== 'door') return null;
  const hx = opening.pos * wallWidth - wallWidth / 2;
  const dw = opening.w, dh = opening.top, ft = 0.05;
  return (
    <group position={[hx, 0, WALL_T / 2]}>
      {/* Frame pieces */}
      {[
        { pos: [-dw / 2 - ft / 2, dh / 2, 0], size: [ft, dh, ft * 2] },
        { pos: [dw / 2 + ft / 2, dh / 2, 0], size: [ft, dh, ft * 2] },
        { pos: [0, dh + ft / 2, 0], size: [dw + ft * 2, ft, ft * 2] },
      ].map((f, i) => (
        <mesh key={i} position={f.pos} castShadow>
          <boxGeometry args={f.size} />
          <meshStandardMaterial color="#6b5a4a" roughness={0.55} />
        </mesh>
      ))}
      {/* Door leaf (slightly ajar for realism) */}
      <mesh position={[-dw * 0.05, dh / 2, -0.02]} castShadow>
        <boxGeometry args={[dw * 0.92, dh * 0.985, 0.045]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.65} />
      </mesh>
      {/* Knob */}
      <mesh position={[dw * 0.28, dh * 0.45, 0.04]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial color="#c8a44a" metalness={0.92} roughness={0.08} />
      </mesh>
    </group>
  );
}

// ── Window frame + glass ─────────────────────────────────────────────────────
function WindowGeometry({ opening, wallWidth }) {
  if (!opening || opening.type !== 'window') return null;
  const hx = opening.pos * wallWidth - wallWidth / 2;
  const ww = opening.w;
  const wh = opening.top - (opening.bottom ?? 0);
  const wy = (opening.bottom ?? 0) + wh / 2;
  const ft = 0.045;
  return (
    <group position={[hx, wy, WALL_T / 2]}>
      {/* Frame */}
      {[
        { pos: [-ww / 2 - ft / 2, 0, 0], size: [ft, wh, ft * 2] },
        { pos: [ww / 2 + ft / 2, 0, 0], size: [ft, wh, ft * 2] },
        { pos: [0, wh / 2 + ft / 2, 0], size: [ww + ft * 2, ft, ft * 2] },
        { pos: [0, -wh / 2 - ft / 2, 0], size: [ww + ft * 2, ft, ft * 2] },
        { pos: [0, 0, 0], size: [ft, wh, ft * 2] },  // center mullion
      ].map((f, i) => (
        <mesh key={i} position={f.pos} castShadow>
          <boxGeometry args={f.size} />
          <meshStandardMaterial color="#e0e8f0" roughness={0.25} />
        </mesh>
      ))}
      {/* Glass pane – visible from both sides */}
      <mesh>
        <planeGeometry args={[ww, wh]} />
        <meshPhysicalMaterial
          color="#b8d8f4"
          transparent opacity={0.18}
          roughness={0.0}
          metalness={0.0}
          transmission={0.9}
          side={THREE.DoubleSide}
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

// ── Baseboard trim ────────────────────────────────────────────────────────────
function Baseboard({ width, length, wallColor }) {
  const bh = 0.12, bd = 0.04;
  const mats = <meshStandardMaterial color={wallColor} roughness={0.5} />;
  return (
    <group position={[0, bh / 2, 0]}>
      <mesh position={[0, 0, -length / 2 + bd / 2]}>
        <boxGeometry args={[width, bh, bd]} />
        {mats}
      </mesh>
      <mesh position={[0, 0, length / 2 - bd / 2]}>
        <boxGeometry args={[width, bh, bd]} />
        {mats}
      </mesh>
      <mesh position={[-width / 2 + bd / 2, 0, 0]}>
        <boxGeometry args={[bd, bh, length]} />
        {mats}
      </mesh>
      <mesh position={[width / 2 - bd / 2, 0, 0]}>
        <boxGeometry args={[bd, bh, length]} />
        {mats}
      </mesh>
    </group>
  );
}

// ── Main Room ─────────────────────────────────────────────────────────────────
export default function Room3D({ room, selected, wireframe, showMeasurements, onClick }) {
  const outlineRef = useRef();

  useFrame((state) => {
    if (outlineRef.current) {
      outlineRef.current.material.opacity = selected
        ? 0.45 + Math.sin(state.clock.elapsedTime * 3) * 0.15 : 0;
    }
  });

  const { x, z, width, length, height, floorMaterial, wallMaterial, wallColor, ceilingColor, floorColor } = room;

  const floorTex = useMemo(() => (FLOOR_TEXTURES[floorMaterial] ?? FLOOR_TEXTURES.hardwood)(), [floorMaterial]);
  const ceilTex  = useMemo(() => WALL_TEXTURES.paint(ceilingColor || '#f8f6f2'), [ceilingColor]);

  const getOpening = (face) => {
    const d = (room.doors || []).find(o => o.wall === face);
    if (d) return { ...d, type: 'door', w: 0.92, top: 2.1, bottom: 0, pos: d.pos ?? 0.5 };
    const w = (room.windows || []).find(o => o.wall === face);
    if (w) return { ...w, type: 'window', w: 1.25, top: 2.05, bottom: 0.88, pos: w.pos ?? 0.5 };
    return null;
  };

  const wallDefs = [
    { face: 'north', pos: [0, 0, -length / 2],           rot: [0, 0, 0],           dim: width },
    { face: 'south', pos: [-width / 2, 0, length / 2 - WALL_T], rot: [0, Math.PI, 0], dim: width },
    { face: 'west',  pos: [-width / 2, 0, -length / 2],  rot: [0, Math.PI / 2, 0], dim: length },
    { face: 'east',  pos: [width / 2 - WALL_T, 0, length / 2], rot: [0, -Math.PI / 2, 0], dim: length },
  ];

  // Ceiling color with slight warm tint
  const ceilColor = ceilingColor || '#f9f7f4';

  return (
    <group position={[x, 0, z]} onClick={(e) => { e.stopPropagation(); onClick(); }}>

      {/* ── Floor ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[width - WALL_T * 2, length - WALL_T * 2]} />
        <meshStandardMaterial map={floorTex} color={floorColor || '#ffffff'} roughness={0.7} metalness={0.02} />
      </mesh>

      {/* ── Ceiling – DoubleSide so it's visible looking up from inside ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]} receiveShadow>
        <planeGeometry args={[width - WALL_T * 2, length - WALL_T * 2]} />
        <meshStandardMaterial
          color={ceilColor}
          roughness={0.92}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Ceiling light fixture ── */}
      <mesh position={[0, height - 0.02, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.06, 16]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.3} emissive="#fff8e0" emissiveIntensity={0.6} />
      </mesh>
      <pointLight
        position={[0, height - 0.15, 0]}
        intensity={height * width * 0.12}
        distance={Math.max(width, length) * 2.2}
        decay={1.8}
        color="#fff5e0"
        castShadow={false}
      />

      {/* ── Walls ── */}
      {wallDefs.map(({ face, pos, rot, dim }) => {
        const opening = getOpening(face);
        return (
          <group key={face} position={pos} rotation={rot}>
            <WallPanel width={dim} height={height} color={wallColor} wallMaterial={wallMaterial} opening={opening} wireframe={wireframe} />
            <DoorGeometry opening={opening} wallWidth={dim} />
            <WindowGeometry opening={opening} wallWidth={dim} />
          </group>
        );
      })}

      {/* ── Baseboard trim ── */}
      <Baseboard width={width - WALL_T * 2} length={length - WALL_T * 2} wallColor={wallColor} />

      {/* ── Crown molding ── */}
      <group position={[0, height - 0.07, 0]}>
        {[
          [0, length / 2 - 0.04],
          [0, -(length / 2 - 0.04)],
        ].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, 0, cz]}>
            <boxGeometry args={[width - WALL_T, 0.08, 0.04]} />
            <meshStandardMaterial color={ceilColor} roughness={0.6} />
          </mesh>
        ))}
        {[
          [width / 2 - 0.04, 0],
          [-(width / 2 - 0.04), 0],
        ].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, 0, cz]}>
            <boxGeometry args={[0.04, 0.08, length - WALL_T]} />
            <meshStandardMaterial color={ceilColor} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* ── Selection outline ── */}
      <mesh ref={outlineRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[width + 0.1, height + 0.1, length + 0.1]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* ── Labels ── */}
      {showMeasurements && (
        <Text position={[0, height + 0.45, 0]} fontSize={0.28} color={selected ? '#818cf8' : '#94a3b8'}
          anchorX="center" rotation={[-Math.PI / 2, 0, 0]} outlineWidth={0.02} outlineColor="#000">
          {room.name}
        </Text>
      )}
      {selected && showMeasurements && (
        <>
          <Text position={[0, 0.22, length / 2 + 0.65]} fontSize={0.24} color="#22d3ee" anchorX="center"
            rotation={[-Math.PI / 2, 0, 0]} outlineWidth={0.02} outlineColor="#000">{width.toFixed(1)}m</Text>
          <Text position={[width / 2 + 0.65, 0.22, 0]} fontSize={0.24} color="#22d3ee" anchorX="center"
            rotation={[-Math.PI / 2, 0, Math.PI / 2]} outlineWidth={0.02} outlineColor="#000">{length.toFixed(1)}m</Text>
          <Text position={[width / 2 + 0.45, height / 2, 0]} fontSize={0.2} color="#f59e0b" anchorX="center"
            outlineWidth={0.02} outlineColor="#000">↕ {height.toFixed(1)}m</Text>
        </>
      )}
    </group>
  );
}
