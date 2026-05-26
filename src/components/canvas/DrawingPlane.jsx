import { useRef, useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DrawingPlane({ onStart, onMove, onEnd }) {
  const { camera, gl } = useThree();
  const [dragging, setDragging] = useState(false);
  const startRef = useRef(null);
  const currentRef = useRef(null);
  const previewRef = useRef();

  const plane = useMemo_plane();

  const getPoint = useCallback((event) => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x, y }, camera);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, target);
    return target ? { x: Math.round(target.x * 2) / 2, z: Math.round(target.z * 2) / 2 } : null;
  }, [camera, gl, plane]);

  const handlePointerDown = useCallback((e) => {
    e.stopPropagation();
    const pt = getPoint(e.nativeEvent);
    if (!pt) return;
    setDragging(true);
    startRef.current = pt;
    currentRef.current = pt;
    onStart(pt);
  }, [getPoint, onStart]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    const pt = getPoint(e.nativeEvent);
    if (!pt) return;
    currentRef.current = pt;
    onMove(pt);

    if (previewRef.current && startRef.current) {
      const sx = startRef.current.x;
      const sz = startRef.current.z;
      const cx = pt.x;
      const cz = pt.z;
      const w = Math.abs(cx - sx);
      const l = Math.abs(cz - sz);
      const mx = (sx + cx) / 2;
      const mz = (sz + cz) / 2;
      previewRef.current.position.set(mx, 0.05, mz);
      previewRef.current.scale.set(Math.max(0.1, w), 1, Math.max(0.1, l));
    }
  }, [dragging, getPoint, onMove]);

  const handlePointerUp = useCallback((e) => {
    if (!dragging || !startRef.current || !currentRef.current) return;
    setDragging(false);
    const s = startRef.current;
    const c = currentRef.current;
    const w = Math.abs(c.x - s.x);
    const l = Math.abs(c.z - s.z);
    const mx = (s.x + c.x) / 2;
    const mz = (s.z + c.z) / 2;
    onEnd(mx, mz, w, l);
    startRef.current = null;
    currentRef.current = null;
    if (previewRef.current) previewRef.current.scale.set(0, 1, 0);
  }, [dragging, onEnd]);

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Preview box */}
      <mesh ref={previewRef} position={[0, 0.05, 0]} scale={[0, 1, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.3} wireframe={false} />
      </mesh>
    </group>
  );
}

function useMemo_plane() {
  return new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
}
