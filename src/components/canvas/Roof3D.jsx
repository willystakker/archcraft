import { useMemo } from 'react';
import * as THREE from 'three';

function GableRoof({ cx, cz, w, l, baseY, pitch = 0.45 }) {
  const ridgeH = Math.min(w, l) * 0.5 * pitch;
  const topY = baseY + ridgeH;

  // Ridge runs along the longer axis
  const alongZ = l >= w;
  const ridgeLen = (alongZ ? l : w) * 0.92;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const hw = w / 2, hl = l / 2;

    let verts, indices;

    if (alongZ) {
      // Ridge along Z axis, slopes on east/west
      verts = new Float32Array([
        // West slope (4 verts)
        -hw, baseY, -hl,   // 0 SW base
        -hw, baseY,  hl,   // 1 NW base
          0, topY, -ridgeLen / 2, // 2 S ridge
          0, topY,  ridgeLen / 2, // 3 N ridge
        // East slope
         hw, baseY, -hl,   // 4 SE base
         hw, baseY,  hl,   // 5 NE base
        // Gable ends (triangles)
        -hw, baseY, -hl,   // 6 = 0 repeat
         hw, baseY, -hl,   // 7 = 4 repeat
          0, topY, -ridgeLen / 2, // 8 = 2 repeat
        -hw, baseY,  hl,   // 9 = 1 repeat
         hw, baseY,  hl,   // 10 = 5 repeat
          0, topY,  ridgeLen / 2, // 11 = 3 repeat
      ]);
      indices = [
        // West slope
        0, 2, 3,  0, 3, 1,
        // East slope
        4, 5, 3,  4, 3, 2,
        // South gable
        6, 8, 7,
        // North gable
        9, 10, 11,
      ];
    } else {
      // Ridge along X axis
      verts = new Float32Array([
        -hl, baseY, -hw,   // 0
         hl, baseY, -hw,   // 1
        -ridgeLen / 2, topY, 0, // 2
         ridgeLen / 2, topY, 0, // 3
        -hl, baseY,  hw,   // 4
         hl, baseY,  hw,   // 5
        -hl, baseY, -hw,   // 6
        -hl, baseY,  hw,   // 7
        -ridgeLen / 2, topY, 0, // 8
         hl, baseY, -hw,   // 9
         hl, baseY,  hw,   // 10
         ridgeLen / 2, topY, 0, // 11
      ]);
      indices = [
        0, 2, 3,  0, 3, 1,
        4, 5, 3,  4, 3, 2,
        6, 8, 7,
        9, 10, 11,
      ];
    }

    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [w, l, baseY, topY, ridgeLen, alongZ]);

  // Overhang soffits
  const overhang = 0.4;
  const ow = w + overhang * 2, ol = l + overhang * 2;

  return (
    <group position={[cx, 0, cz]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#5a4035" roughness={0.9} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      {/* Fascia boards */}
      <mesh position={[0, baseY - 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.sqrt(ow * ow + ol * ol) / 2 - 0.1, Math.sqrt(ow * ow + ol * ol) / 2, 4, 1]} />
        <meshStandardMaterial color="#4a3025" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function Roof3D({ rooms, showRoof = true }) {
  if (!showRoof || rooms.length === 0) return null;

  // Compute overall bounding box of all rooms
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  rooms.forEach(r => {
    minX = Math.min(minX, r.x - r.width / 2);
    maxX = Math.max(maxX, r.x + r.width / 2);
    minZ = Math.min(minZ, r.z - r.length / 2);
    maxZ = Math.max(maxZ, r.z + r.length / 2);
  });

  const avgHeight = rooms.reduce((s, r) => s + r.height, 0) / rooms.length;
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const w = maxX - minX + 0.5;
  const l = maxZ - minZ + 0.5;

  return (
    <GableRoof
      cx={cx}
      cz={cz}
      w={w}
      l={l}
      baseY={avgHeight}
      pitch={0.42}
    />
  );
}
