import { useRef, useEffect, useCallback, Suspense, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls, PointerLockControls, Grid, Environment,
  PerspectiveCamera, ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
import useDesignStore from '../../stores/designStore';
import useUIStore from '../../stores/uiStore';
import Room3D from './Room3D';
import FurnitureItem3D from './FurnitureItem3D';
import DrawingPlane from './DrawingPlane';
import SunLight from './SunLight';
import Roof3D from './Roof3D';
import { registerCanvas, registerScene } from '../../utils/exportUtils';

// ── Register canvas + scene refs for export ───────────────────────────────────
function SceneRegistrar() {
  const { gl, scene } = useThree();
  useEffect(() => {
    registerCanvas(gl.domElement);
    registerScene(scene);
    return () => { registerCanvas(null); registerScene(null); };
  }, [gl, scene]);
  return null;
}

// ── Realistic first-person walk controls ─────────────────────────────────────
function WalkControls({ onLockChange }) {
  const { camera } = useThree();
  const plcRef   = useRef();
  const keys     = useRef({});
  const velocity = useRef(new THREE.Vector3());
  const bobTime  = useRef(0);
  const isMoving = useRef(false);

  // Spawn camera inside centre of first room
  useEffect(() => {
    const rooms = useDesignStore.getState().rooms;
    if (rooms.length > 0) {
      const r = rooms[0];
      camera.position.set(r.x, 1.65, r.z);
    } else {
      camera.position.set(0, 1.65, 0);
    }
    camera.rotation.set(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    const down = e => { keys.current[e.code] = true; };
    const up   = e => { keys.current[e.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame((_, delta) => {
    if (!plcRef.current?.isLocked) return;

    const k = keys.current;
    const sprint = k['ShiftLeft'] || k['ShiftRight'];
    const baseSpeed = sprint ? 7.5 : 3.8;
    const friction  = 8;

    // Input direction (camera-relative)
    const dir = new THREE.Vector3();
    if (k['KeyW'] || k['ArrowUp'])    dir.z -= 1;
    if (k['KeyS'] || k['ArrowDown'])  dir.z += 1;
    if (k['KeyA'] || k['ArrowLeft'])  dir.x -= 1;
    if (k['KeyD'] || k['ArrowRight']) dir.x += 1;

    const moving = dir.lengthSq() > 0;
    isMoving.current = moving;

    if (moving) {
      dir.normalize().applyEuler(camera.rotation);
      dir.y = 0;
      dir.normalize();
      velocity.current.addScaledVector(dir, baseSpeed * delta * 12);
    }

    // Friction / deceleration
    velocity.current.multiplyScalar(Math.max(0, 1 - friction * delta));

    // Clamp max speed
    const maxSpeed = baseSpeed;
    if (velocity.current.length() > maxSpeed) {
      velocity.current.setLength(maxSpeed);
    }

    // Move
    camera.position.addScaledVector(velocity.current, delta);

    // Head bob — subtle, natural
    if (moving) {
      const bobFreq   = sprint ? 14 : 9;
      const bobAmpY   = sprint ? 0.032 : 0.018;
      const bobAmpX   = sprint ? 0.01 : 0.006;
      bobTime.current += delta * bobFreq;
      const eyeBase = 1.65;
      camera.position.y = eyeBase + Math.sin(bobTime.current) * bobAmpY;
      // Subtle side-to-side sway
      camera.rotation.z = Math.sin(bobTime.current * 0.5) * bobAmpX;
    } else {
      // Settle back smoothly
      camera.position.y += (1.65 - camera.position.y) * 0.18;
      camera.rotation.z *= 0.85;
    }
  });

  return (
    <PointerLockControls
      ref={plcRef}
      onLock={() => onLockChange(true)}
      onUnlock={() => onLockChange(false)}
    />
  );
}

// ── Ground plane ──────────────────────────────────────────────────────────────
function GroundPlane({ onClick }) {
  const tex = new THREE.CanvasTexture((() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#111118';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#1e1e2e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 512; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
    return c;
  })());
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(40, 40);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} onClick={onClick} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial map={tex} roughness={0.95} metalness={0} />
    </mesh>
  );
}

// ── Sky background ────────────────────────────────────────────────────────────
function SkyDome() {
  return (
    <mesh>
      <sphereGeometry args={[150, 32, 32]} />
      <meshBasicMaterial
        color="#0a0c1a"
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// ── Full scene ────────────────────────────────────────────────────────────────
function Scene({ onWalkLockChange }) {
  const { rooms, furniture, selectedId, setSelected, clearSelection, addRoom } = useDesignStore();
  const {
    showGrid, showShadows, showWireframe, showMeasurements, activeTool, viewMode,
    showSolar, sunTime, sunAngle, startDrawing, updateDrawing, notify, walkMode
  } = useUIStore();

  const orbitRef = useRef();

  const handleRoomClick = useCallback((id) => {
    if (activeTool === 'select') setSelected(id, 'room');
    else if (activeTool === 'delete') { useDesignStore.getState().deleteRoom(id); notify('Room deleted', 'info'); }
  }, [activeTool, setSelected, notify]);

  const handleFurnitureClick = useCallback((id) => {
    if (activeTool === 'select') setSelected(id, 'furniture');
  }, [activeTool, setSelected]);

  const handleCanvasClick = useCallback(() => {
    if (activeTool === 'select') clearSelection();
  }, [activeTool, clearSelection]);

  const handleDrawComplete = useCallback((x, z, w, l) => {
    if (w < 0.5 || l < 0.5) return;
    addRoom({ x, z, width: Math.max(2, w), length: Math.max(2, l) });
    notify(`Room added (${Math.round(w)}m × ${Math.round(l)}m)`, 'success');
  }, [addRoom, notify]);

  return (
    <>
      <SceneRegistrar />
      <SkyDome />

      {/* ── Cameras + controls ── */}
      {!walkMode && (
        <>
          <PerspectiveCamera makeDefault position={[14, 12, 14]} fov={55} near={0.1} far={500} />
          <OrbitControls
            ref={orbitRef}
            makeDefault
            enablePan
            panSpeed={1.2}
            rotateSpeed={0.6}
            zoomSpeed={1.2}
            minDistance={2}
            maxDistance={100}
            maxPolarAngle={Math.PI / 2.05}
          />
        </>
      )}
      {walkMode && (
        <>
          <PerspectiveCamera makeDefault fov={78} near={0.05} far={300} />
          <WalkControls onLockChange={onWalkLockChange} />
        </>
      )}

      {/* ── Global lighting ── */}
      <ambientLight intensity={walkMode ? 0.35 : 0.22} color="#d4e0f0" />
      <hemisphereLight skyColor="#c8d8f0" groundColor="#302820" intensity={walkMode ? 0.4 : 0.55} />

      {showSolar
        ? <SunLight time={sunTime} angle={sunAngle} />
        : <>
            <directionalLight
              position={[15, 22, 10]}
              intensity={walkMode ? 0.5 : 1.1}
              castShadow={showShadows}
              shadow-mapSize={[2048, 2048]}
              shadow-camera-far={120}
              shadow-camera-left={-40}
              shadow-camera-right={40}
              shadow-camera-top={40}
              shadow-camera-bottom={-40}
              shadow-bias={-0.0002}
              color="#fff8e8"
            />
            <directionalLight position={[-12, 8, -8]} intensity={walkMode ? 0.15 : 0.3} color="#b8c8e8" />
          </>
      }

      <Environment preset="apartment" background={false} />

      {showShadows && !walkMode && (
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.3}
          scale={70}
          blur={2.5}
          far={22}
          color="#080818"
        />
      )}

      {/* ── Grid ── */}
      {showGrid && viewMode === '3d' && !walkMode && (
        <Grid
          args={[60, 60]}
          cellSize={1} cellThickness={0.5} cellColor="#252538"
          sectionSize={5} sectionThickness={1} sectionColor="#353560"
          fadeDistance={50} fadeStrength={1.2}
          position={[0, -0.01, 0]}
        />
      )}

      {/* ── Ground ── */}
      <GroundPlane onClick={handleCanvasClick} />

      {/* ── Rooms ── */}
      {rooms.map(room => (
        <Room3D
          key={room.id}
          room={room}
          selected={selectedId === room.id}
          wireframe={showWireframe}
          showMeasurements={showMeasurements}
          onClick={() => handleRoomClick(room.id)}
        />
      ))}

      {/* ── Furniture ── */}
      {furniture.map(item => (
        <FurnitureItem3D
          key={item.id}
          item={item}
          selected={selectedId === item.id}
          onClick={() => handleFurnitureClick(item.id)}
        />
      ))}

      {/* ── Roof ── */}
      {!walkMode && <Roof3D rooms={rooms} showRoof />}

      {/* ── Draw plane ── */}
      {activeTool === 'room' && !walkMode && (
        <DrawingPlane
          onStart={startDrawing}
          onMove={updateDrawing}
          onEnd={handleDrawComplete}
        />
      )}
    </>
  );
}

// ── Walk HUD overlay ──────────────────────────────────────────────────────────
function WalkHUD({ locked }) {
  const { toggleWalkMode } = useUIStore();

  if (locked) {
    return (
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-6 h-6 opacity-70">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/80 -translate-y-px" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/80 -translate-x-px" />
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full border border-white/50 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Bottom HUD bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4
          bg-black/55 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-2.5 text-xs text-white/70">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Walk Mode Active
          </span>
          <span className="w-px h-3 bg-white/20" />
          <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">W A S D</kbd> Move</span>
          <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">SHIFT</kbd> Sprint</span>
          <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">MOUSE</kbd> Look</span>
          <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">ESC</kbd> Pause</span>
        </div>

        {/* Speed indicator top-left */}
        <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-[10px] text-white/50 font-mono">
          ARCHCRAFT WALK MODE
        </div>
      </div>
    );
  }

  // Pre-lock splash screen
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm cursor-pointer"
      onClick={() => {
        // Trigger pointer lock by clicking the canvas
        const canvas = document.querySelector('canvas');
        canvas?.requestPointerLock?.();
      }}
    >
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />

      <div className="relative z-10 text-center max-w-sm px-6">
        {/* Walking icon animated */}
        <div className="text-6xl mb-6 animate-bounce">🚶</div>

        <div className="text-2xl font-black text-white mb-2 tracking-tight">First-Person Walk Mode</div>
        <div className="text-sm text-slate-400 mb-6 leading-relaxed">
          Click to lock your mouse and walk through<br />your design as if you're really there.
        </div>

        {/* Control cards */}
        <div className="grid grid-cols-2 gap-2 mb-8 text-xs">
          {[
            { key: 'W A S D', label: 'Walk' },
            { key: 'MOUSE', label: 'Look around' },
            { key: 'SHIFT', label: 'Sprint' },
            { key: 'ESC', label: 'Pause / Exit' },
          ].map(c => (
            <div key={c.key} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px] font-bold">{c.key}</kbd>
              <span className="text-slate-400">{c.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-slate-900 font-black rounded-2xl shadow-2xl text-sm hover:bg-white/90 transition-all">
          <span>Click anywhere to enter</span>
          <span className="text-lg">→</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); toggleWalkMode(); }}
          className="mt-4 block mx-auto text-xs text-slate-600 hover:text-slate-400 transition-colors pointer-events-auto underline"
        >
          Exit walk mode
        </button>
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function ThreeCanvas() {
  const { walkMode } = useUIStore();
  const [walkLocked, setWalkLocked] = useState(false);

  return (
    <div className="w-full h-full relative" style={{ background: '#0a0a14' }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
          toneMappingExposure: walkMode ? 1.2 : 1.0,
        }}
        dpr={[1, 2]}
        style={{ background: '#0d0d1a' }}
      >
        <Suspense fallback={null}>
          <Scene onWalkLockChange={setWalkLocked} />
        </Suspense>
      </Canvas>

      {walkMode && <WalkHUD locked={walkLocked} />}
    </div>
  );
}
