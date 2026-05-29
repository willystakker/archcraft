import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Info, Maximize2 } from 'lucide-react';
import useDesignStore from '../../stores/designStore';
import useUIStore from '../../stores/uiStore';

export default function BottomBar() {
  const { rooms, furniture } = useDesignStore();
  const { activeTool, viewMode, notification, canvasZoom, setCanvasZoom } = useUIStore();

  const totalArea = rooms.reduce((s, r) => s + r.width * r.length, 0);
  const sqft = Math.round(totalArea * 10.764);

  const toolTips = {
    select: 'Click objects to select · Drag to orbit · Scroll to zoom',
    room: 'Click and drag on canvas to draw a room',
    wall: 'Click to place wall start · Click again to finish',
    door: 'Click on a wall to place a door',
    window: 'Click on a wall to place a window',
    measure: 'Click two points to measure distance',
    paint: 'Click rooms to apply active material',
    delete: 'Click any object to delete it',
  };

  return (
    <div className="h-9 bg-surface/95 border-t border-border flex items-center px-4 gap-4 flex-shrink-0 backdrop-blur-xl z-50">
      {/* Notification */}
      {notification ? (
        <div className={`flex items-center gap-2 text-xs font-medium animate-pulse ${
          notification.type === 'success' ? 'text-emerald-400' :
          notification.type === 'error' ? 'text-rose-400' : 'text-indigo-400'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {notification.msg}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info className="w-3 h-3" />
          {toolTips[activeTool] || 'Ready'}
        </div>
      )}

      <div className="flex-1" />

      {/* Stats */}
      <div className="flex items-center gap-4 text-[11px]">
        <span className="text-slate-500">
          <span className="text-slate-300 font-medium">{rooms.length}</span> rooms ·{' '}
          <span className="text-slate-300 font-medium">{furniture.length}</span> furniture
        </span>
        <span className="text-slate-500">
          Area: <span className="text-emerald-400 font-medium">{totalArea.toFixed(0)} m²</span>
          <span className="text-slate-600 ml-1">({sqft.toLocaleString()} ft²)</span>
        </span>
        <span className="text-slate-500 capitalize">
          View: <span className="text-indigo-400 font-medium">{viewMode === '3d' ? '3D' : 'Floor Plan'}</span>
        </span>
      </div>

      <div className="w-px h-4 bg-border" />

      {/* Zoom (2D only — in 3D use scroll to zoom) */}
      {viewMode === '2d' ? (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCanvasZoom?.(Math.max(0.25, (canvasZoom ?? 1) - 0.25))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted text-slate-500 hover:text-white transition-all"
            title="Zoom out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-[11px] text-slate-400 w-10 text-center">
            {Math.round((canvasZoom ?? 1) * 100)}%
          </span>
          <button
            onClick={() => setCanvasZoom?.(Math.min(4, (canvasZoom ?? 1) + 0.25))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted text-slate-500 hover:text-white transition-all"
            title="Zoom in"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="text-[11px] text-slate-600 flex items-center gap-1">
          <ZoomIn className="w-3 h-3" />
          Scroll to zoom
        </div>
      )}

      {/* Powered by */}
      <div className="text-[10px] text-slate-700 font-mono">ARCHCRAFT v1.0</div>
    </div>
  );
}
