import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Shared materials ──────────────────────────────────────────────────────────
const woodMat = <meshStandardMaterial color="#5a4030" roughness={0.75} />;
const chromeMat = <meshStandardMaterial color="#c8d0d8" metalness={0.9} roughness={0.15} />;

// ── Furniture meshes ──────────────────────────────────────────────────────────

function SofaMesh({ color, w = 2.4, d = 1.0 }) {
  return (
    <group>
      {/* seat */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.18, d * 0.7]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* back cushion */}
      <mesh position={[0, 0.52, -d * 0.31]} castShadow>
        <boxGeometry args={[w - 0.06, 0.44, d * 0.18]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* left arm */}
      <mesh position={[-w / 2 + 0.07, 0.42, 0]} castShadow>
        <boxGeometry args={[0.12, 0.4, d * 0.8]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* right arm */}
      <mesh position={[w / 2 - 0.07, 0.42, 0]} castShadow>
        <boxGeometry args={[0.12, 0.4, d * 0.8]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* base */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[w - 0.1, 0.12, d * 0.75]} />
        <meshStandardMaterial color="#2a2020" roughness={0.9} />
      </mesh>
    </group>
  );
}

function BedMesh({ color, w = 1.8, d = 2.1 }) {
  return (
    <group>
      {/* frame */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.28, d]} />
        <meshStandardMaterial color="#5c4a38" roughness={0.72} />
      </mesh>
      {/* mattress */}
      <mesh position={[0, 0.35, 0.05]} castShadow>
        <boxGeometry args={[w - 0.08, 0.14, d - 0.25]} />
        <meshStandardMaterial color="#f0ede8" roughness={0.9} />
      </mesh>
      {/* duvet */}
      <mesh position={[0, 0.46, 0.12]} castShadow>
        <boxGeometry args={[w - 0.1, 0.09, d - 0.6]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* pillow(s) */}
      {[-w / 4, w / 4].map((px, i) => (
        <mesh key={i} position={[px, 0.45, -d / 2 + 0.25]} castShadow>
          <boxGeometry args={[w / 2 - 0.1, 0.1, 0.4]} />
          <meshStandardMaterial color="#fff8f0" roughness={0.9} />
        </mesh>
      ))}
      {/* headboard */}
      <mesh position={[0, 0.7, -d / 2 + 0.07]} castShadow>
        <boxGeometry args={[w - 0.04, 0.7, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* footboard */}
      <mesh position={[0, 0.5, d / 2 - 0.05]} castShadow>
        <boxGeometry args={[w - 0.04, 0.28, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

function TableMesh({ color, w = 1.2, d = 0.6, h = 0.75 }) {
  return (
    <group>
      <mesh position={[0, h, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.05, d]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.08} />
      </mesh>
      {[[-w / 2 + 0.06, 0, -d / 2 + 0.06], [w / 2 - 0.06, 0, -d / 2 + 0.06],
        [-w / 2 + 0.06, 0, d / 2 - 0.06], [w / 2 - 0.06, 0, d / 2 - 0.06]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.03, 0.03, h * 2, 8]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function ChairMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.08, 0.55]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.62, -0.24]} castShadow>
        <boxGeometry args={[0.53, 0.6, 0.07]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {[[-0.22, 0.12, -0.22], [0.22, 0.12, -0.22], [-0.22, 0.12, 0.22], [0.22, 0.12, 0.22]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.25, 8]} />
          <meshStandardMaterial color="#3a2f20" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function OfficeChairMesh({ color }) {
  return (
    <group>
      {/* seat */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.28, 0.1, 12]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* back */}
      <mesh position={[0, 0.85, -0.25]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* stem */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* base star legs */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle * Math.PI / 180) * 0.22, 0.04, Math.sin(angle * Math.PI / 180) * 0.22]}>
          <boxGeometry args={[0.32, 0.04, 0.05]} />
          <meshStandardMaterial color="#444" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function TVUnitMesh({ color, w = 1.8 }) {
  return (
    <group>
      {/* cabinet */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.55, 0.44]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* TV screen */}
      <mesh position={[0, 0.9, 0.02]} castShadow>
        <boxGeometry args={[w * 0.9, 0.55, 0.06]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={0.4} />
      </mesh>
      {/* screen glow */}
      <mesh position={[0, 0.9, 0.06]}>
        <boxGeometry args={[w * 0.85, 0.48, 0.01]} />
        <meshStandardMaterial color="#1a2a3a" emissive="#1a3050" emissiveIntensity={0.4} roughness={0} />
      </mesh>
      {/* legs */}
      {[-w / 2 + 0.15, w / 2 - 0.15].map((px, i) => (
        <mesh key={i} position={[px, 0.03, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.38]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function BookshelfMesh({ color, w = 0.9, h = 2.1 }) {
  const shelves = 4;
  return (
    <group>
      {/* sides */}
      {[-w / 2 + 0.03, w / 2 - 0.03].map((px, i) => (
        <mesh key={i} position={[px, h / 2, 0]} castShadow>
          <boxGeometry args={[0.03, h, 0.3]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
      ))}
      {/* back panel */}
      <mesh position={[0, h / 2, -0.13]} castShadow>
        <boxGeometry args={[w - 0.06, h, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* shelves */}
      {Array.from({ length: shelves + 1 }).map((_, i) => (
        <mesh key={i} position={[0, (i / shelves) * (h - 0.05) + 0.02, 0]} castShadow>
          <boxGeometry args={[w - 0.06, 0.03, 0.3]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
      ))}
      {/* books on each shelf */}
      {Array.from({ length: shelves }).map((_, si) => {
        const shelfY = ((si + 0.5) / shelves) * (h - 0.05) + 0.08;
        const bookColors = ['#c44', '#48a', '#4a8', '#a84', '#8a4', '#6688aa'];
        const booksPerShelf = Math.floor((w - 0.12) / 0.07);
        return Array.from({ length: booksPerShelf }).map((_, bi) => (
          <mesh key={`${si}-${bi}`} position={[-w / 2 + 0.1 + bi * 0.07, shelfY, 0.01]} castShadow>
            <boxGeometry args={[0.05, 0.18 + (bi % 3) * 0.04, 0.26]} />
            <meshStandardMaterial color={bookColors[(si * 3 + bi) % bookColors.length]} roughness={0.9} />
          </mesh>
        ));
      })}
    </group>
  );
}

function WardrobeMesh({ color, w = 1.8, h = 2.2 }) {
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* door division */}
      <mesh position={[0, h / 2, 0.31]}>
        <boxGeometry args={[0.02, h - 0.04, 0.02]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      {/* handles */}
      {[-0.08, 0.08].map((px, i) => (
        <mesh key={i} position={[px, h * 0.5, 0.32]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#c8a840" metalness={0.85} roughness={0.1} />
        </mesh>
      ))}
      {/* top panel */}
      <mesh position={[0, h + 0.05, 0]}>
        <boxGeometry args={[w + 0.02, 0.06, 0.64]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

function DresserMesh({ color, w = 1.1, h = 0.85 }) {
  const drawers = 4;
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      {Array.from({ length: drawers }).map((_, i) => (
        <group key={i}>
          <mesh position={[0, 0.1 + (i * h) / drawers, 0.26]}>
            <boxGeometry args={[w - 0.06, h / drawers - 0.03, 0.02]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.1 + (i * h) / drawers, 0.28]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#c0a030" metalness={0.8} roughness={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function NightstandMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.58, 0.42]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.32, 0.22]}>
        <boxGeometry args={[0.4, 0.08, 0.01]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.32, 0.235]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial color="#c8a840" metalness={0.8} roughness={0.15} />
      </mesh>
    </group>
  );
}

function FridgeMesh({ color }) {
  return (
    <group>
      {/* body */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.8, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* door divider */}
      <mesh position={[0, 0.58, 0.36]}>
        <boxGeometry args={[0.76, 0.02, 0.02]} />
        <meshStandardMaterial color="#bbb" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* handles */}
      {[0.72, 0.35].map((hy, i) => (
        <mesh key={i} position={[0.32, hy, 0.38]}>
          <boxGeometry args={[0.04, 0.2, 0.04]} />
          <meshStandardMaterial color="#999" metalness={0.7} roughness={0.2} />
        </mesh>
      ))}
      {/* top vent */}
      <mesh position={[0, 1.79, 0]}>
        <boxGeometry args={[0.78, 0.04, 0.65]} />
        <meshStandardMaterial color="#ccc" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}

function StoveMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 0.9, 0.65]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* cooktop */}
      <mesh position={[0, 0.91, 0]}>
        <boxGeometry args={[0.73, 0.02, 0.63]} />
        <meshStandardMaterial color="#222" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* burners */}
      {[[-0.18, -0.15], [0.18, -0.15], [-0.18, 0.15], [0.18, 0.15]].map(([bx, bz], i) => (
        <mesh key={i} position={[bx, 0.925, bz]}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.4} />
        </mesh>
      ))}
      {/* oven window */}
      <mesh position={[0, 0.35, 0.34]}>
        <boxGeometry args={[0.55, 0.28, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.3} />
      </mesh>
    </group>
  );
}

function SinkMesh({ color, w = 0.8 }) {
  return (
    <group>
      {/* counter */}
      <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.88, 0.55]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* basin */}
      <mesh position={[0, 0.9, 0.02]}>
        <boxGeometry args={[w * 0.65, 0.02, 0.38]} />
        <meshStandardMaterial color="#c8d0d4" roughness={0.2} metalness={0.4} />
      </mesh>
      {/* faucet stem */}
      <mesh position={[0, 0.97, -0.1]}>
        <cylinderGeometry args={[0.018, 0.018, 0.15, 8]} />
        <meshStandardMaterial color="#bbb" metalness={0.85} roughness={0.1} />
      </mesh>
      {/* faucet head */}
      <mesh position={[0, 1.04, 0.04]} rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.18, 8]} />
        <meshStandardMaterial color="#bbb" metalness={0.85} roughness={0.1} />
      </mesh>
    </group>
  );
}

function BathtubMesh({ color }) {
  return (
    <group>
      {/* tub body */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.5, 0.75]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.05} />
      </mesh>
      {/* inner basin (slightly smaller, dark) */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[1.55, 0.18, 0.58]} />
        <meshStandardMaterial color="#c8d8e4" roughness={0.15} metalness={0.1} />
      </mesh>
      {/* faucet */}
      <mesh position={[0.72, 0.58, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.14, 8]} />
        <meshStandardMaterial color="#bbb" metalness={0.85} roughness={0.1} />
      </mesh>
    </group>
  );
}

function ToiletMesh({ color }) {
  return (
    <group>
      {/* bowl */}
      <mesh position={[0, 0.22, 0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.42, 12]} />
        <meshStandardMaterial color={color} roughness={0.25} />
      </mesh>
      {/* seat */}
      <mesh position={[0, 0.43, 0.1]}>
        <boxGeometry args={[0.38, 0.04, 0.55]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* tank */}
      <mesh position={[0, 0.5, -0.2]} castShadow>
        <boxGeometry args={[0.36, 0.38, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.25} />
      </mesh>
    </group>
  );
}

function ShowerMesh({ color }) {
  const glassColor = '#a8d0e8';
  const ft = 0.04;
  return (
    <group>
      {/* glass walls */}
      {[
        { pos: [0.5, 1.1, 0], size: [ft, 2.2, 1.0] },
        { pos: [-0.5, 1.1, 0], size: [ft, 2.2, 1.0] },
        { pos: [0, 1.1, -0.5], size: [1.0, 2.2, ft] },
      ].map((p, i) => (
        <mesh key={i} position={p.pos} castShadow>
          <boxGeometry args={p.size} />
          <meshPhysicalMaterial color={glassColor} transparent opacity={0.28} transmission={0.75} roughness={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* door glass */}
      <mesh position={[0, 1.1, 0.5]}>
        <boxGeometry args={[0.6, 2.2, ft]} />
        <meshPhysicalMaterial color={glassColor} transparent opacity={0.22} transmission={0.8} roughness={0} side={THREE.DoubleSide} />
      </mesh>
      {/* shower base */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.0, 0.08, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* shower head */}
      <mesh position={[-0.35, 2.1, -0.35]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
        <meshStandardMaterial color="#bbb" metalness={0.8} roughness={0.15} />
      </mesh>
    </group>
  );
}

function FilingMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 1.3, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      {[0.22, 0.55, 0.88].map((hy, i) => (
        <group key={i}>
          <mesh position={[0, hy, 0.31]}>
            <boxGeometry args={[0.38, 0.28, 0.02]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0.12, hy, 0.325]}>
            <boxGeometry args={[0.1, 0.03, 0.02]} />
            <meshStandardMaterial color="#aaa" metalness={0.7} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BBQMesh({ color }) {
  return (
    <group>
      {/* grill body */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.25, 0.32, 14]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* lid */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.3, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* grate */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.02, 14]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* legs */}
      {[[-0.2, 0, -0.15], [0.2, 0, -0.15], [0, 0, 0.22]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#555" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {/* shelf */}
      <mesh position={[0.3, 0.62, 0]}>
        <boxGeometry args={[0.25, 0.03, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}

// ── Additional mesh types ─────────────────────────────────────────────────────

function PlantMesh({ color, w = 0.6, h = 1.5 }) {
  const foliageColor = color || '#2d7a2d';
  const stemH = h * 0.45;
  const foliageR = w * 0.7;
  return (
    <group>
      <mesh position={[0, stemH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.05, stemH, 8]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.9} />
      </mesh>
      <mesh position={[0, stemH + foliageR * 0.6, 0]} castShadow>
        <sphereGeometry args={[foliageR, 10, 8]} />
        <meshStandardMaterial color={foliageColor} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[w * 0.35, w * 0.3, 0.12, 10]} />
        <meshStandardMaterial color="#7a6050" roughness={0.8} />
      </mesh>
    </group>
  );
}

function FloorLampMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.18, 0.15, 0.04, 12]} />
        <meshStandardMaterial color="#555" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <cylinderGeometry args={[0.0, 0.18, 0.28, 12]} />
        <meshStandardMaterial color={color || '#e8e0c0'} roughness={0.7} />
      </mesh>
      <pointLight position={[0, 1.55, 0]} intensity={0.6} color="#ffe8c0" distance={6} decay={2} />
    </group>
  );
}

function RugMesh({ color, w = 3, d = 2 }) {
  return (
    <group>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[w, 0.02, d]} />
        <meshStandardMaterial color={color || '#7a5a8a'} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[w - 0.15, 0.005, d - 0.15]} />
        <meshStandardMaterial color={color ? color + 'aa' : '#9a7aaa'} roughness={0.95} />
      </mesh>
    </group>
  );
}

function FireplaceMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.1, 0.5]} />
        <meshStandardMaterial color={color || '#5a5050'} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.32, 0.26]}>
        <boxGeometry args={[0.8, 0.6, 0.02]} />
        <meshStandardMaterial color="#1a1010" roughness={0.9} />
      </mesh>
      <pointLight position={[0, 0.35, 0.15]} intensity={0.8} color="#ff6020" distance={4} decay={2} />
    </group>
  );
}

function SectionalMesh({ color, w = 3.2, d = 2.0 }) {
  const c = color || '#5a6e8a';
  return (
    <group>
      <mesh position={[-w * 0.18, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.65, 0.18, d * 0.55]} />
        <meshStandardMaterial color={c} roughness={0.85} />
      </mesh>
      <mesh position={[w * 0.28, 0.22, -d * 0.23]} castShadow>
        <boxGeometry args={[w * 0.35, 0.18, d * 0.55]} />
        <meshStandardMaterial color={c} roughness={0.85} />
      </mesh>
      <mesh position={[-w * 0.18, 0.5, -d * 0.24]} castShadow>
        <boxGeometry args={[w * 0.65, 0.4, 0.18]} />
        <meshStandardMaterial color={c} roughness={0.85} />
      </mesh>
      <mesh position={[w * 0.28, 0.5, d * 0.28]} castShadow>
        <boxGeometry args={[0.18, 0.4, d * 0.55]} />
        <meshStandardMaterial color={c} roughness={0.85} />
      </mesh>
      <mesh position={[-w * 0.43, 0.4, 0]} castShadow>
        <boxGeometry args={[0.16, 0.36, d * 0.55]} />
        <meshStandardMaterial color={c} roughness={0.85} />
      </mesh>
    </group>
  );
}

function BunkBedMesh({ color, w = 1.0, d = 2.0 }) {
  return (
    <group>
      {/* Bottom bunk */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.12, d]} />
        <meshStandardMaterial color="#5c4a38" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[w - 0.06, 0.1, d - 0.15]} />
        <meshStandardMaterial color="#f0ede8" roughness={0.9} />
      </mesh>
      {/* Top bunk */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[w, 0.12, d]} />
        <meshStandardMaterial color="#5c4a38" roughness={0.72} />
      </mesh>
      <mesh position={[0, 1.22, 0]} castShadow>
        <boxGeometry args={[w - 0.06, 0.1, d - 0.15]} />
        <meshStandardMaterial color={color || '#a08070'} roughness={0.9} />
      </mesh>
      {/* Ladder */}
      {[0.28, 0.55, 0.82].map((hy, i) => (
        <mesh key={i} position={[w / 2 + 0.04, hy, d / 2 - 0.15]}>
          <boxGeometry args={[0.08, 0.04, 0.3]} />
          <meshStandardMaterial color="#5c4a38" roughness={0.75} />
        </mesh>
      ))}
      {/* Posts */}
      {[[-w/2+0.04, d/2-0.04], [w/2-0.04, d/2-0.04], [-w/2+0.04, -d/2+0.04], [w/2-0.04, -d/2+0.04]].map(([px,pz],i) => (
        <mesh key={i} position={[px, 0.65, pz]} castShadow>
          <boxGeometry args={[0.06, 1.3, 0.06]} />
          <meshStandardMaterial color="#5c4a38" roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

function GrandPianoMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.08, 2.1]} />
        <meshStandardMaterial color={color || '#1a1a1a'} roughness={0.1} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[1.45, 0.78, 2.05]} />
        <meshStandardMaterial color={color || '#1a1a1a'} roughness={0.1} metalness={0.3} />
      </mesh>
      {/* Keyboard */}
      <mesh position={[0, 0.54, 0.8]}>
        <boxGeometry args={[1.3, 0.02, 0.24]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.3} />
      </mesh>
      {/* Legs */}
      {[[-0.6, 0, -0.7], [0.6, 0, -0.7], [0, 0, 0.7]].map(([px, py, pz], i) => (
        <mesh key={i} position={[px, 0.22, pz]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.44, 8]} />
          <meshStandardMaterial color={color || '#1a1a1a'} roughness={0.1} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function BilliardMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.43, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.08, 1.35]} />
        <meshStandardMaterial color="#2d6a2d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.43, 0]}>
        <boxGeometry args={[2.3, 0.03, 1.15]} />
        <meshStandardMaterial color="#2a5a2a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.39, 0]}>
        <boxGeometry args={[2.52, 0.74, 1.37]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.75} />
      </mesh>
      {[[-1.1, -0.55], [1.1, -0.55], [-1.1, 0.55], [1.1, 0.55]].map(([px,pz],i) => (
        <mesh key={i} position={[px, 0.22, pz]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.44, 8]} />
          <meshStandardMaterial color="#5a3a1a" roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

function TreadmillMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.12, 1.8]} />
        <meshStandardMaterial color={color || '#2a2a3a'} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.22, 0.2]}>
        <boxGeometry args={[0.82, 0.04, 1.35]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      {[-0.35, 0.35].map((px, i) => (
        <mesh key={i} position={[px, 0.85, -0.65]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.35, 8]} />
          <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 1.25, -0.65]}>
        <boxGeometry args={[0.75, 0.06, 0.22]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}

function HotTubMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.43, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.0, 0.85, 16]} />
        <meshStandardMaterial color={color || '#5a7a8a'} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.06, 16]} />
        <meshPhysicalMaterial color="#60a8c8" transparent opacity={0.6} transmission={0.5} roughness={0} />
      </mesh>
    </group>
  );
}

function CarMesh({ color, w = 1.85, d = 4.5, h = 1.45 }) {
  return (
    <group>
      <mesh position={[0, h * 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h * 0.55, d]} />
        <meshStandardMaterial color={color || '#6a7a8a'} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, h * 0.72, 0]}>
        <boxGeometry args={[w * 0.85, h * 0.45, d * 0.55]} />
        <meshStandardMaterial color={color || '#6a7a8a'} roughness={0.3} metalness={0.4} />
      </mesh>
      {[[-w/2+0.25, 0.18, d/2-0.7], [w/2-0.25, 0.18, d/2-0.7],
        [-w/2+0.25, 0.18, -d/2+0.7], [w/2-0.25, 0.18, -d/2+0.7]].map(([px,py,pz],i) => (
        <mesh key={i} position={[px,py,pz]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 14]} rotation={[0, 0, Math.PI/2]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function FirePitMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.45, 0.45, 14]} />
        <meshStandardMaterial color={color || '#6a5a4a'} roughness={0.85} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 14]} />
        <meshStandardMaterial color="#2a1a1a" roughness={0.9} />
      </mesh>
      <pointLight position={[0, 0.6, 0]} intensity={1.0} color="#ff5010" distance={5} decay={2} />
    </group>
  );
}

function PergolaFromMesh({ color, w = 3, d = 3, h = 2.4 }) {
  const c = color || '#c8b090';
  const beams = 4;
  return (
    <group>
      {/* Posts */}
      {[[-w/2+0.1, -d/2+0.1], [w/2-0.1, -d/2+0.1], [-w/2+0.1, d/2-0.1], [w/2-0.1, d/2-0.1]].map(([px,pz],i) => (
        <mesh key={i} position={[px, h/2, pz]} castShadow>
          <boxGeometry args={[0.12, h, 0.12]} />
          <meshStandardMaterial color={c} roughness={0.8} />
        </mesh>
      ))}
      {/* Cross beams */}
      {Array.from({length: beams}).map((_, i) => (
        <mesh key={i} position={[0, h, -d/2 + (i/(beams-1))*d]} castShadow>
          <boxGeometry args={[w, 0.08, 0.1]} />
          <meshStandardMaterial color={c} roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[-w/2+0.1, h, 0]} castShadow>
        <boxGeometry args={[0.12, 0.1, d]} />
        <meshStandardMaterial color={c} roughness={0.8} />
      </mesh>
      <mesh position={[w/2-0.1, h, 0]} castShadow>
        <boxGeometry args={[0.12, 0.1, d]} />
        <meshStandardMaterial color={c} roughness={0.8} />
      </mesh>
    </group>
  );
}

function GenericBox({ color, w = 1, d = 1, h = 0.8 }) {
  return (
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.75} metalness={0.05} />
    </mesh>
  );
}

// ── Dispatch map ──────────────────────────────────────────────────────────────
const FURNITURE_COMPONENTS = {
  // Living
  sofa: SofaMesh,
  loveseat: (p) => <SofaMesh {...p} w={1.6} d={0.9} />,
  sectional: (p) => <SectionalMesh {...p} />,
  armchair: ChairMesh,
  recliner: ChairMesh,
  office_chair: OfficeChairMesh,
  patio_chair: ChairMesh,
  patio_sofa: (p) => <SofaMesh {...p} w={2.2} d={0.9} />,

  coffee_table: (p) => <TableMesh {...p} w={1.2} d={0.6} h={0.45} />,
  side_table: (p) => <TableMesh {...p} w={0.5} d={0.5} h={0.55} />,
  console_table: (p) => <TableMesh {...p} w={1.2} d={0.35} h={0.8} />,
  dining_table: (p) => <TableMesh {...p} w={1.8} d={0.95} h={0.75} />,
  dining_table_round: (p) => <TableMesh {...p} w={1.2} d={1.2} h={0.75} />,
  patio_table: (p) => <TableMesh {...p} w={1.2} d={1.2} h={0.75} />,
  island: (p) => <TableMesh {...p} w={1.5} d={0.9} h={0.9} />,
  kitchen_counter: (p) => <TableMesh {...p} w={2.4} d={0.6} h={0.9} />,
  desk: (p) => <TableMesh {...p} w={1.5} d={0.7} h={0.75} />,
  desk_l: (p) => <TableMesh {...p} w={2.0} d={1.5} h={0.75} />,
  conference_table: (p) => <TableMesh {...p} w={3.0} d={1.2} h={0.75} />,
  garden_bench: (p) => <TableMesh {...p} w={1.5} d={0.55} h={0.85} />,

  tv_unit: TVUnitMesh,
  entertainment: (p) => <TVUnitMesh {...p} w={2.4} />,
  bookshelf: BookshelfMesh,
  bookcase: (p) => <BookshelfMesh {...p} w={1.2} />,
  wardrobe: WardrobeMesh,
  dresser: DresserMesh,
  nightstand: NightstandMesh,
  filing: FilingMesh,

  floor_lamp: FloorLampMesh,
  table_lamp: (p) => <FloorLampMesh {...p} />,
  rug_large: (p) => <RugMesh {...p} w={3} d={2} />,
  rug_small: (p) => <RugMesh {...p} w={1.5} d={1} />,
  playmat: (p) => <RugMesh {...p} w={2} d={2} />,
  yoga_mat: (p) => <RugMesh {...p} w={0.6} d={1.8} />,
  plant_large: (p) => <PlantMesh {...p} h={1.5} />,
  plant_small: (p) => <PlantMesh {...p} h={0.5} />,
  planter: (p) => <PlantMesh {...p} h={0.7} />,
  fireplace: FireplaceMesh,
  fire_pit: FirePitMesh,

  // Bedroom
  bed_king: (p) => <BedMesh {...p} w={2.0} d={2.2} />,
  bed_queen: (p) => <BedMesh {...p} w={1.6} d={2.0} />,
  bed_twin: (p) => <BedMesh {...p} w={1.0} d={2.0} />,
  bunk_bed: BunkBedMesh,
  bunk_bed_kids: BunkBedMesh,
  crib: (p) => <GenericBox {...p} h={0.95} />,
  bench: (p) => <GenericBox {...p} h={0.5} />,
  home_theater_seat: ChairMesh,
  bean_bag: (p) => <GenericBox {...p} h={0.7} />,

  // Kitchen / Bathroom
  fridge: FridgeMesh,
  fridge_french: FridgeMesh,
  stove: StoveMesh,
  sink_kitchen: (p) => <SinkMesh {...p} w={0.8} />,
  sink_bath: (p) => <SinkMesh {...p} w={0.5} />,
  sink_double: (p) => <SinkMesh {...p} w={1.2} />,
  bathtub: BathtubMesh,
  bathtub_freestand: BathtubMesh,
  toilet: ToiletMesh,
  shower: ShowerMesh,
  bbq: BBQMesh,
  hot_tub: HotTubMesh,

  // Luxury
  grand_piano: GrandPianoMesh,
  billiard_table: BilliardMesh,

  // Gym / Garage
  treadmill: TreadmillMesh,
  exercise_bike: (p) => <GenericBox {...p} h={1.2} />,
  weight_bench: (p) => <GenericBox {...p} h={0.5} />,
  rowing_machine: (p) => <GenericBox {...p} h={0.5} />,
  weights_rack: (p) => <GenericBox {...p} h={1.5} />,
  punching_bag: (p) => <GenericBox {...p} h={1.2} />,
  car_sedan: (p) => <CarMesh {...p} w={1.85} d={4.5} h={1.45} />,
  car_suv: (p) => <CarMesh {...p} w={2.0} d={4.8} h={1.7} />,

  // Outdoor structures
  pergola: (p) => <PergolaFromMesh {...p} />,
};

export default function FurnitureItem3D({ item, selected, onClick }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = selected
      ? Math.sin(state.clock.elapsedTime * 2.5) * 0.015
      : 0;
  });

  const FurnitureComponent = FURNITURE_COMPONENTS[item.type] || GenericBox;

  return (
    <group
      ref={groupRef}
      position={[item.x, 0, item.z]}
      rotation={[0, (item.rotation || 0) * Math.PI / 180, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <FurnitureComponent color={item.color} w={item.width} d={item.depth} />

      {selected && (
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[(item.width || 1) + 0.12, 1.4, (item.depth || 1) + 0.12]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.1} side={THREE.BackSide} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
