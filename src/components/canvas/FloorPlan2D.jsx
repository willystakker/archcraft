import { useRef, useState, useCallback, useEffect } from 'react';
import useDesignStore from '../../stores/designStore';
import useUIStore from '../../stores/uiStore';

const SCALE = 30; // pixels per meter

// Compute center offset so design fits in the canvas
function computeCenter(rooms, canvasW, canvasH) {
  if (!rooms.length) return { x: canvasW / 2, y: canvasH / 2 };
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  rooms.forEach(r => {
    minX = Math.min(minX, r.x - r.width / 2);
    maxX = Math.max(maxX, r.x + r.width / 2);
    minZ = Math.min(minZ, r.z - r.length / 2);
    maxZ = Math.max(maxZ, r.z + r.length / 2);
  });
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  return { x: canvasW / 2 - cx * SCALE, y: canvasH / 2 - cz * SCALE };
}

const ROOM_COLORS = {
  living: '#6366f1',
  bedroom: '#8b5cf6',
  kitchen: '#06b6d4',
  bathroom: '#10b981',
  dining: '#f59e0b',
  office: '#ec4899',
  garage: '#64748b',
  hallway: '#78716c',
  basement: '#94a3b8',
  laundry: '#7c3aed',
};

const FURNITURE_SHAPES = {
  sofa: '🛋️',
  bed_king: '🛏️', bed_queen: '🛏️', bed_twin: '🛏️',
  coffee_table: '⬛', dining_table: '⬛', desk: '⬛',
  wardrobe: '📦', fridge: '🧊', stove: '🔥',
  toilet: '🚽', bathtub: '🛁', shower: '🚿',
};

export default function FloorPlan2D() {
  const canvasRef = useRef();
  const svgRef = useRef();
  const { rooms, furniture, selectedId, setSelected, clearSelection, updateRoom } = useDesignStore();
  const { activeTool, showGrid, showMeasurements, showFurniture, isDrawingRoom, drawStart, drawCurrent, startDrawing, updateDrawing, endDrawing, addRoom, canvasZoom, setCanvasZoom } = useUIStore();

  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, z: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [zoom, setZoomLocal] = useState(canvasZoom ?? 1);
  // Sync external zoom (from BottomBar) → local zoom without causing loop
  const extZoomRef = useRef(canvasZoom ?? 1);
  const setZoom = useCallback((val) => {
    const v = typeof val === 'function' ? val(extZoomRef.current) : val;
    extZoomRef.current = v;
    setZoomLocal(v);
    setCanvasZoom(v);
  }, [setCanvasZoom]);
  useEffect(() => {
    if (canvasZoom !== extZoomRef.current) {
      extZoomRef.current = canvasZoom;
      setZoomLocal(canvasZoom);
    }
  }, [canvasZoom]);
  const [svgDraw, setSvgDraw] = useState(null);
  const [centered, setCentered] = useState(false);

  // Center the view on first render / when rooms change (once)
  useEffect(() => {
    if (!svgRef.current || centered) return;
    const { width, height } = svgRef.current.getBoundingClientRect();
    if (width < 10) return; // not mounted yet
    const center = computeCenter(rooms, width, height);
    setPan(center);
    setCentered(true);
  }, [rooms, centered]);

  const fitView = useCallback(() => {
    if (!svgRef.current) return;
    const { width, height } = svgRef.current.getBoundingClientRect();
    if (!rooms.length) { setPan({ x: width / 2, y: height / 2 }); setZoom(1); return; }
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    rooms.forEach(r => {
      minX = Math.min(minX, r.x - r.width / 2);
      maxX = Math.max(maxX, r.x + r.width / 2);
      minZ = Math.min(minZ, r.z - r.length / 2);
      maxZ = Math.max(maxZ, r.z + r.length / 2);
    });
    const dw = (maxX - minX) * SCALE;
    const dh = (maxZ - minZ) * SCALE;
    const pad = 60;
    const newZoom = Math.min((width - pad) / dw, (height - pad) / dh, 3);
    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;
    setZoom(newZoom);
    setPan({ x: width / (2 * newZoom) - cx * SCALE, y: height / (2 * newZoom) - cz * SCALE });
  }, [rooms]);

  const toScreen = useCallback((wx, wz) => ({
    x: (wx * SCALE + pan.x) * zoom,
    y: (wz * SCALE + pan.y) * zoom,
  }), [pan, zoom]);

  const toWorld = useCallback((sx, sy) => ({
    x: (sx / zoom - pan.x) / SCALE,
    z: (sy / zoom - pan.y) / SCALE,
  }), [pan, zoom]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(4, Math.max(0.3, z * delta)));
  };

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    const rect = svgRef.current.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = toWorld(sx, sy);

    if (activeTool === 'room') {
      setSvgDraw({ startX: sx, startY: sy, curX: sx, curY: sy });
      startDrawing(world);
    }
    if (activeTool === 'select') {
      clearSelection();
    }
  }, [activeTool, pan, toWorld, startDrawing, clearSelection]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning && panStart) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }

    if (svgDraw && activeTool === 'room') {
      const rect = svgRef.current.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      setSvgDraw(d => ({ ...d, curX: sx, curY: sy }));
      updateDrawing(toWorld(sx, sy));
    }

    if (dragging) {
      const rect = svgRef.current.getBoundingClientRect();
      const world = toWorld(e.clientX - rect.left, e.clientY - rect.top);
      const snapped = { x: Math.round(world.x * 2) / 2, z: Math.round(world.z * 2) / 2 };
      updateRoom(dragging, { x: snapped.x - dragOffset.x, z: snapped.z - dragOffset.z });
    }
  }, [isPanning, panStart, svgDraw, activeTool, dragging, dragOffset, toWorld, updateDrawing, updateRoom]);

  const handleMouseUp = useCallback((e) => {
    setIsPanning(false);
    setPanStart(null);

    if (svgDraw && activeTool === 'room' && isDrawingRoom) {
      const rect = svgRef.current.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const start = toWorld(svgDraw.startX, svgDraw.startY);
      const end = toWorld(sx, sy);
      const w = Math.abs(end.x - start.x);
      const l = Math.abs(end.z - start.z);
      if (w > 0.5 && l > 0.5) {
        const mx = (start.x + end.x) / 2;
        const mz = (start.z + end.z) / 2;
        useDesignStore.getState().addRoom({ x: mx, z: mz, width: Math.max(2, w), length: Math.max(2, l) });
        useUIStore.getState().notify(`Room added (${w.toFixed(1)}m × ${l.toFixed(1)}m)`, 'success');
      }
      setSvgDraw(null);
      endDrawing();
    }
    setDragging(null);
  }, [svgDraw, activeTool, isDrawingRoom, toWorld, endDrawing]);

  const handleRoomMouseDown = useCallback((e, room) => {
    e.stopPropagation();
    if (activeTool === 'select') {
      setSelected(room.id, 'room');
      const rect = svgRef.current.getBoundingClientRect();
      const world = toWorld(e.clientX - rect.left, e.clientY - rect.top);
      setDragging(room.id);
      setDragOffset({ x: world.x - room.x, z: world.z - room.z });
    } else if (activeTool === 'delete') {
      useDesignStore.getState().deleteRoom(room.id);
    }
  }, [activeTool, setSelected, toWorld]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#08080f] cursor-crosshair select-none">
      {/* Background grid */}
      {showGrid && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
          <defs>
            <pattern id="smallGrid" width={SCALE * zoom} height={SCALE * zoom}
              x={pan.x * zoom % (SCALE * zoom)}
              y={pan.y * zoom % (SCALE * zoom)}
              patternUnits="userSpaceOnUse">
              <path d={`M ${SCALE * zoom} 0 L 0 0 0 ${SCALE * zoom}`} fill="none" stroke="#252538" strokeWidth="0.5" />
            </pattern>
            <pattern id="bigGrid" width={SCALE * zoom * 5} height={SCALE * zoom * 5}
              x={pan.x * zoom % (SCALE * zoom * 5)}
              y={pan.y * zoom % (SCALE * zoom * 5)}
              patternUnits="userSpaceOnUse">
              <rect width={SCALE * zoom * 5} height={SCALE * zoom * 5} fill="url(#smallGrid)" />
              <path d={`M ${SCALE * zoom * 5} 0 L 0 0 0 ${SCALE * zoom * 5}`} fill="none" stroke="#353560" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bigGrid)" />
        </svg>
      )}

      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: activeTool === 'room' ? 'crosshair' : activeTool === 'select' ? 'default' : 'default' }}
      >
        {/* Rooms */}
        {rooms.map(room => {
          const s = toScreen(room.x - room.width / 2, room.z - room.length / 2);
          const w = room.width * SCALE * zoom;
          const h = room.length * SCALE * zoom;
          const isSelected = selectedId === room.id;
          const color = ROOM_COLORS[room.type] ?? '#6366f1';

          return (
            <g key={room.id} onMouseDown={e => handleRoomMouseDown(e, room)} style={{ cursor: activeTool === 'select' ? 'move' : 'pointer' }}>
              {/* Fill */}
              <rect
                x={s.x} y={s.y} width={w} height={h}
                fill={color}
                fillOpacity={isSelected ? 0.25 : 0.12}
                stroke={isSelected ? color : `${color}60`}
                strokeWidth={isSelected ? 2 : 1}
                rx={2}
              />
              {/* Selection glow */}
              {isSelected && (
                <rect
                  x={s.x - 2} y={s.y - 2} width={w + 4} height={h + 4}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  rx={3}
                  opacity={0.6}
                />
              )}
              {/* Room label */}
              {w > 60 && h > 40 && (
                <>
                  <text x={s.x + w / 2} y={s.y + h / 2 - 6} textAnchor="middle" dominantBaseline="middle"
                    fill={isSelected ? color : '#e2e8f0'} fontSize={Math.min(14, w / 8)} fontWeight="600" fontFamily="Inter, sans-serif">
                    {room.name}
                  </text>
                  {showMeasurements && (
                    <text x={s.x + w / 2} y={s.y + h / 2 + 10} textAnchor="middle" dominantBaseline="middle"
                      fill={isSelected ? `${color}bb` : '#64748b'} fontSize={Math.min(11, w / 10)} fontFamily="Inter, sans-serif">
                      {room.width.toFixed(1)}×{room.length.toFixed(1)}m
                    </text>
                  )}
                </>
              )}
              {/* Resize handles when selected */}
              {isSelected && [
                [s.x + w / 2, s.y], [s.x + w, s.y + h / 2],
                [s.x + w / 2, s.y + h], [s.x, s.y + h / 2],
              ].map(([hx, hy], i) => (
                <circle key={i} cx={hx} cy={hy} r={4} fill={color} opacity={0.8} style={{ cursor: 'se-resize' }} />
              ))}
            </g>
          );
        })}

        {/* Furniture */}
        {showFurniture && furniture.map(item => {
          const s = toScreen(item.x, item.z);
          const icon = FURNITURE_SHAPES[item.type] ?? '⬜';
          const selected = selectedId === item.id;
          return (
            <g key={item.id} onMouseDown={e => { e.stopPropagation(); setSelected(item.id, 'furniture'); }}
              style={{ cursor: 'pointer' }}>
              {selected && <circle cx={s.x} cy={s.y} r={20} fill="#22d3ee" fillOpacity={0.15} stroke="#22d3ee" strokeWidth={1.5} />}
              <text x={s.x} y={s.y} textAnchor="middle" dominantBaseline="middle" fontSize={20} style={{ userSelect: 'none' }}>
                {icon}
              </text>
            </g>
          );
        })}

        {/* Drawing preview */}
        {svgDraw && activeTool === 'room' && isDrawingRoom && (
          <rect
            x={Math.min(svgDraw.startX, svgDraw.curX)}
            y={Math.min(svgDraw.startY, svgDraw.curY)}
            width={Math.abs(svgDraw.curX - svgDraw.startX)}
            height={Math.abs(svgDraw.curY - svgDraw.startY)}
            fill="#6366f1"
            fillOpacity={0.2}
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="6 4"
            rx={2}
          />
        )}

        {/* North arrow */}
        <g transform="translate(30, 30)">
          <circle cx={0} cy={0} r={18} fill="#111120" stroke="#252538" />
          <polygon points="0,-14 5,6 0,2 -5,6" fill="#e2e8f0" />
          <polygon points="0,14 5,-6 0,-2 -5,-6" fill="#64748b" />
          <text x={0} y={-18} textAnchor="middle" dominantBaseline="auto" fill="#e2e8f0" fontSize={9} fontWeight="700">N</text>
        </g>

        {/* Scale indicator */}
        <g transform={`translate(60, 30)`}>
          <line x1={0} y1={0} x2={SCALE * zoom} y2={0} stroke="#64748b" strokeWidth={1.5} />
          <line x1={0} y1={-3} x2={0} y2={3} stroke="#64748b" strokeWidth={1.5} />
          <line x1={SCALE * zoom} y1={-3} x2={SCALE * zoom} y2={3} stroke="#64748b" strokeWidth={1.5} />
          <text x={SCALE * zoom / 2} y={12} textAnchor="middle" fill="#64748b" fontSize={9} fontFamily="mono">1m</text>
        </g>
      </svg>

      {/* Hint */}
      {activeTool === 'room' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-lg px-4 py-2 text-xs text-indigo-300 pointer-events-none">
          Click and drag to draw a room
        </div>
      )}

      {/* Fit view button */}
      <button
        onClick={fitView}
        title="Fit all rooms in view"
        className="absolute bottom-3 right-3 w-7 h-7 flex items-center justify-center glass rounded-lg border border-border text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all text-xs font-bold"
      >
        ⊞
      </button>
    </div>
  );
}
