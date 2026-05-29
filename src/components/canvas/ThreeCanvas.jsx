import { useRef, useEffect, useCallback, Suspense, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls, Grid, Environment,
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

// ── 100% manual first-person walk — no drei PointerLockControls ──────────────
// Exposes window.__archLock() and window.__archUnlock() so the HUD overlay
// (which sits outside the Canvas) can trigger pointer lock without dealing
// with the drei abstraction that locks document.body instead of the canvas.
function WalkControls({ onLockChange }) {
  const { camera, gl } = useThree();
  const keysRef    = useRef({});
  const velRef     = useRef(new THREE.Vector3());
  const yawRef     = useRef(0);
  const pitchRef   = useRef(0);
  const lockedRef  = useRef(false);
  const bobRef     = useRef(0);
  const cbRef      = useRef(onLockChange);
  cbRef.current    = onLockChange;

  // Spawn camera inside the first room at eye height
  useEffect(() => {
    const rooms = useDesignStore.getState().rooms;
    const r = rooms[0];
    camera.position.set(r?.x ?? 0, 1.65, r?.z ?? 0);
    yawRef.current   = 0;
    pitchRef.current = 0;
    camera.rotation.order = 'YXZ';
    camera.rotation.set(0, 0, 0);
  }, [camera]);

  // DOM pointer-lock + mouse-look setup
  useEffect(() => {
    const canvas = gl.domElement;

    const onPLChange = () => {
      const locked = document.pointerLockElement === canvas;
      lockedRef.current = locked;
      cbRef.current(locked);
    };

    const onMouseMove = (e) => {
      if (!lockedRef.current) return;
      yawRef.current   -= e.movementX * 0.002;
      pitchRef.current -= e.movementY * 0.002;
      pitchRef.current  = Math.max(-1.35, Math.min(1.35, pitchRef.current));
    };

    const onKeyDown = (e) => { keysRef.current[e.code] = true; };
    const onKeyUp   = (e) => { keysRef.current[e.code] = false; };

    document.addEventListener('pointerlockchange', onPLChange);
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);

    // Global bridge so WalkHUD overlay can call requestPointerLock
    window.__archLock   = () => { if (document.pointerLockElement !== canvas) canvas.requestPointerLock(); };
    window.__archUnlock = () => { if (document.pointerLockElement) document.exitPointerLock(); };

    return () => {
      document.removeEventListener('pointerlockchange', onPLChange);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
      delete window.__archLock;
      delete window.__archUnlock;
    };
  }, [gl]);

  useFrame((_, delta) => {
    // Always keep camera pointed where we aim
    camera.rotation.order = 'YXZ';
    camera.rotation.y     = yawRef.current;
    camera.rotation.x     = pitchRef.current;
    camera.rotation.z     = 0;

    if (!lockedRef.current) return;

    const k      = keysRef.current;
    const sprint = k['ShiftLeft'] || k['ShiftRight'];
    const speed  = sprint ? 7.5 : 3.8;

    // Build world-space movement vector from yaw only (ignore pitch for movement)
    const sinY = Math.sin(yawRef.current);
    const cosY = Math.cos(yawRef.current);
    const fwd   = new THREE.Vector3(-sinY, 0, -cosY);
    const right = new THREE.Vector3( cosY, 0, -sinY);

    const move = new THREE.Vector3();
    if (k['KeyW'] || k['ArrowUp'])    move.addScaledVector(fwd,    1);
    if (k['KeyS'] || k['ArrowDown'])  move.addScaledVector(fwd,   -1);
    if (k['KeyA'] || k['ArrowLeft'])  move.addScaledVector(right, -1);
    if (k['KeyD'] || k['ArrowRight']) move.addScaledVector(right,  1);

    const moving = move.lengthSq() > 0;
    if (moving) {
      move.normalize();
      velRef.current.addScaledVector(move, speed * delta * 12);
    }

    // Friction
    velRef.current.multiplyScalar(Math.max(0, 1 - 8 * delta));
    if (velRef.current.length() > speed) velRef.current.setLength(speed);

    camera.position.x += velRef.current.x * delta;
    camera.position.z += velRef.current.z * delta;

    // Head bob (Y only — no rotation-based sway, keeps it comfortable)
    if (moving) {
      bobRef.current += delta * (sprint ? 14 : 9);
      camera.position.y = 1.65 + Math.sin(bobRef.current) * (sprint ? 0.03 : 0.016);
    } else {
      camera.position.y += (1.65 - camera.position.y) * 0.18;
    }
  });

  return null;
}

// ── Ground plane ──────────────────────────────────────────────────────────────
function GroundPlane({ onClick }) {
  const tex = (() => {
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
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(40, 40);
    return t;
  })();

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} onClick={onClick} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial map={tex} roughness={0.95} metalness={0} />
    </mesh>
  );
}

// ── Sky dome ──────────────────────────────────────────────────────────────────
function SkyDome() {
  return (
    <mesh>
      <sphereGeometry args={[150, 32, 32]} />
      <meshBasicMaterial color="#0a0c1a" side={THREE.BackSide} />
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
          <PerspectiveCamera makeDefault fov={80} near={0.05} far={300} />
          <WalkControls onLockChange={onWalkLockChange} />
        </>
      )}

      {/* ── Global lighting ── */}
      <ambientLight intensity={walkMode ? 0.38 : 0.22} color="#d4e0f0" />
      <hemisphereLight skyColor="#c8d8f0" groundColor="#302820" intensity={walkMode ? 0.42 : 0.55} />

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
            <directionalLight position={[-12, 8, -8]} intensity={walkMode ? 0.18 : 0.3} color="#b8c8e8" />
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

// ── Walk HUD ─────────────────────────────────────────────────────────────────
function WalkHUD({ locked }) {
  const { toggleWalkMode } = useUIStore();

  if (locked) {
    return (
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-5 h-5 opacity-80">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/80 -translate-y-px" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/80 -translate-x-px" />
            <div className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-white/60 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Bottom HUD */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4
          bg-black/55 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-2.5 text-xs text-white/70">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Walk Mode
          </span>
          <span className="w-px h-3 bg-white/20" />
          <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">W A S D</kbd> Move</span>
          <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">SHIFT</kbd> Sprint</span>
          <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">MOUSE</kbd> Look</span>
          <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">ESC</kbd> Pause</span>
        </div>

        <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-[10px] text-white/50 font-mono tracking-widest">
          ARCHCRAFT · WALK
        </div>
      </div>
    );
  }

  // Pre-lock splash — clicking ANYWHERE calls window.__archLock()
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer select-none"
      style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.88) 100%)' }}
      onClick={() => window.__archLock?.()}
    >
      <div className="text-center max-w-sm px-6">
        <div className="text-6xl mb-5 animate-bounce">🚶</div>

        <div className="text-2xl font-black text-white mb-2 tracking-tight">Walk Through Your Design</div>
        <div className="text-sm text-slate-400 mb-7 leading-relaxed">
          Click anywhere to lock your mouse and explore<br />your home in first-person.
        </div>

        <div className="grid grid-cols-2 gap-2 mb-7 text-xs">
          {[
            { key: 'W A S D', label: 'Move' },
            { key: 'MOUSE', label: 'Look' },
            { key: 'SHIFT', label: 'Sprint' },
            { key: 'ESC', label: 'Pause' },
          ].map(c => (
            <div key={c.key} className="flex items-center gap-2 bg-white/6 border border-white/12 rounded-xl px-3 py-2.5">
              <kbd className="font-mono bg-white/15 px-1.5 py-0.5 rounded text-white text-[10px] font-bold">{c.key}</kbd>
              <span className="text-slate-400">{c.label}</span>
            </div>
          ))}
        </div>

        <div className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-slate-900 font-black rounded-2xl text-sm shadow-2xl">
          Click anywhere to enter →
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); toggleWalkMode(); }}
          className="mt-5 block mx-auto text-xs text-slate-600 hover:text-slate-400 transition-colors underline pointer-events-auto"
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
