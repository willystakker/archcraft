import { useRef, useEffect, useCallback, Suspense, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PointerLockControls, Grid, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import useDesignStore from '../../stores/designStore';
import useUIStore from '../../stores/uiStore';
import Room3D from './Room3D';
import FurnitureItem3D from './FurnitureItem3D';
import DrawingPlane from './DrawingPlane';
import SunLight from './SunLight';
import Roof3D from './Roof3D';
import { registerCanvas, registerScene } from '../../utils/exportUtils';

// ── Canvas + Scene registrar ──────────────────────────────────────────────────
function SceneRegistrar() {
  const { gl, scene } = useThree();
  useEffect(() => {
    registerCanvas(gl.domElement);
    registerScene(scene);
    return () => { registerCanvas(null); registerScene(null); };
  }, [gl, scene]);
  return null;
}

// ── Walk Mode controls (WASD + mouse look) ────────────────────────────────────
function WalkControls({ onLockChange }) {
  const { camera } = useThree();
  const plcRef = useRef();
  const keys = useRef({});

  useEffect(() => {
    const down = e => { keys.current[e.code] = true; };
    const up = e => { keys.current[e.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useEffect(() => {
    // Set camera to eye level when entering walk mode
    camera.position.y = 1.65;
  }, [camera]);

  useFrame((_, delta) => {
    if (!plcRef.current?.isLocked) return;
    const speed = 4 * delta;
    const dir = new THREE.Vector3();
    const k = keys.current;
    if (k['KeyW'] || k['ArrowUp'])    dir.z -= 1;
    if (k['KeyS'] || k['ArrowDown'])  dir.z += 1;
    if (k['KeyA'] || k['ArrowLeft'])  dir.x -= 1;
    if (k['KeyD'] || k['ArrowRight']) dir.x += 1;
    dir.normalize().multiplyScalar(speed);
    dir.applyEuler(camera.rotation);
    dir.y = 0;
    camera.position.add(dir);
    camera.position.y = 1.65; // lock to ground
  });

  return (
    <PointerLockControls
      ref={plcRef}
      onLock={() => onLockChange(true)}
      onUnlock={() => onLockChange(false)}
    />
  );
}

// ── Main Scene ────────────────────────────────────────────────────────────────
function Scene({ onWalkLockChange }) {
  const { rooms, furniture, selectedId, setSelected, clearSelection, addRoom } = useDesignStore();
  const { showGrid, showShadows, showWireframe, showMeasurements, activeTool, viewMode,
    showSolar, sunTime, sunAngle, startDrawing, updateDrawing, notify, walkMode } = useUIStore();

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

      {!walkMode && (
        <>
          <PerspectiveCamera makeDefault position={[14, 12, 14]} fov={55} />
          <OrbitControls
            ref={orbitRef}
            makeDefault
            enablePan
            panSpeed={1.2}
            rotateSpeed={0.6}
            zoomSpeed={1.2}
            minDistance={3}
            maxDistance={80}
            maxPolarAngle={Math.PI / 2.1}
          />
        </>
      )}

      {walkMode && (
        <>
          <PerspectiveCamera makeDefault fov={75} />
          <WalkControls onLockChange={onWalkLockChange} />
        </>
      )}

      {/* Lighting */}
      <hemisphereLight skyColor="#c8d8f0" groundColor="#302820" intensity={0.55} />

      {showSolar
        ? <SunLight time={sunTime} angle={sunAngle} />
        : <>
            <directionalLight
              position={[15, 20, 10]}
              intensity={1.1}
              castShadow={showShadows}
              shadow-mapSize={[2048, 2048]}
              shadow-camera-far={100}
              shadow-camera-left={-30}
              shadow-camera-right={30}
              shadow-camera-top={30}
              shadow-camera-bottom={-30}
              shadow-bias={-0.0002}
              color="#fff8e8"
            />
            <directionalLight position={[-12, 8, -8]} intensity={0.3} color="#b8c8e8" />
            <pointLight position={[0, 6, -20]} intensity={0.25} color="#e8c890" distance={40} decay={2} />
          </>
      }

      <Environment preset="city" />

      {showShadows && (
        <ContactShadows position={[0, -0.01, 0]} opacity={0.3} scale={60} blur={2.5} far={20} color="#080818" />
      )}

      {showGrid && viewMode === '3d' && (
        <Grid
          args={[60, 60]}
          cellSize={1} cellThickness={0.5} cellColor="#252538"
          sectionSize={5} sectionThickness={1} sectionColor="#353560"
          fadeDistance={45} fadeStrength={1}
          position={[0, -0.01, 0]}
        />
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} onClick={handleCanvasClick} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial opacity={0.0} transparent />
      </mesh>

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

      {furniture.map(item => (
        <FurnitureItem3D
          key={item.id}
          item={item}
          selected={selectedId === item.id}
          onClick={() => handleFurnitureClick(item.id)}
        />
      ))}

      <Roof3D rooms={rooms} showRoof />

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

// ── Walk mode overlay ─────────────────────────────────────────────────────────
function WalkOverlay({ locked }) {
  const { toggleWalkMode } = useUIStore();
  if (locked) {
    return (
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass rounded-xl px-5 py-2.5 text-xs text-slate-300 pointer-events-none flex items-center gap-3 border border-white/10 z-20">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded">WASD</kbd> Move</span>
        <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded">Mouse</kbd> Look</span>
        <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded">ESC</kbd> Exit</span>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20 cursor-pointer backdrop-blur-sm">
      <div className="text-center space-y-3">
        <div className="text-4xl mb-2">🚶</div>
        <div className="text-xl font-bold text-white">Walk Mode</div>
        <div className="text-slate-400 text-sm">Click anywhere to start walking through your design</div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
          <span><kbd className="font-mono bg-white/10 text-white px-1.5 py-0.5 rounded border border-white/20">WASD</kbd> Move</span>
          <span><kbd className="font-mono bg-white/10 text-white px-1.5 py-0.5 rounded border border-white/20">Mouse</kbd> Look</span>
          <span><kbd className="font-mono bg-white/10 text-white px-1.5 py-0.5 rounded border border-white/20">ESC</kbd> Exit</span>
        </div>
        <button
          onClick={toggleWalkMode}
          className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-white border border-white/20 transition-all pointer-events-auto"
        >
          Exit Walk Mode
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
    <div className="w-full h-full bg-[#0a0a12] relative">
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

      {walkMode && <WalkOverlay locked={walkLocked} />}
    </div>
  );
}
