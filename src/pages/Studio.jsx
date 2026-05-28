import { useEffect } from 'react';
import { MousePointer2, Square, Minus, DoorOpen, Blinds, Ruler, PaintBucket, Info, X } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import LeftPanel from '../components/layout/LeftPanel';
import RightPanel from '../components/layout/RightPanel';
import BottomBar from '../components/layout/BottomBar';
import ThreeCanvas from '../components/canvas/ThreeCanvas';
import FloorPlan2D from '../components/canvas/FloorPlan2D';
import AIAssistant from '../components/ui/AIAssistant';
import CostEstimator from '../components/ui/CostEstimator';
import ClimatePanel from '../components/ui/ClimatePanel';
import SolarPanel from '../components/ui/SolarPanel';
import ExportPanel from '../components/ui/ExportPanel';
import LocationPicker from '../components/ui/LocationPicker';
import Notification from '../components/ui/Notification';
import useUIStore from '../stores/uiStore';
import useDesignStore from '../stores/designStore';

const TOOL_GUIDES = {
  room: {
    icon: Square,
    color: 'indigo',
    title: 'Draw Room',
    steps2d: ['Click and drag on the canvas to draw a new room', 'Release to set size — drag handles to resize', 'Click the room to select & edit in right panel'],
    steps3d: ['Switch to 2D Floor Plan view (top bar) to draw rooms by dragging', 'Or use the Rooms tab → click any preset to instantly add a room', 'Rooms appear immediately in 3D — switch back to explore'],
  },
  wall: {
    icon: Minus,
    color: 'cyan',
    title: 'Draw Wall',
    steps2d: ['Click to place the first endpoint of a wall', 'Move to the second point and click to finish', 'Walls auto-connect to nearby room edges and other walls'],
    steps3d: ['Walls are best placed in 2D Floor Plan mode — switch views in the top bar', 'Use room edges to create shared walls between rooms', 'For interior partitions, draw rooms side-by-side and remove the shared wall face'],
  },
  door: {
    icon: DoorOpen,
    color: 'amber',
    title: 'Add Door',
    steps2d: ['Click a wall edge on any room to toggle a door on that face', 'Or select a room and use the Doors & Windows panel on the right', 'Doors show as openings with frame and leaf in 3D view'],
    steps3d: ['Select a room (click it) → the right panel shows Doors & Windows', 'Click the Door button on any wall face (N/S/E/W) to add or remove', 'Doors appear in real-time on the 3D model'],
  },
  window: {
    icon: Blinds,
    color: 'sky',
    title: 'Add Window',
    steps2d: ['Click a wall edge on any room to toggle a window on that face', 'Or select a room and use the Doors & Windows panel on the right', 'Windows show as glazed openings with frame and glass in 3D'],
    steps3d: ['Select a room (click it) → right panel → Doors & Windows section', 'Click the Win button on any wall face to add glass windows', 'Windows cast realistic light inside the room in 3D walk mode'],
  },
  measure: {
    icon: Ruler,
    color: 'emerald',
    title: 'Measure',
    steps2d: ['Select any room — dimension labels appear at each edge', 'The selected room shows Width × Length × Height in cyan text', 'Total area shown in the right panel under Dimensions'],
    steps3d: ['Enable Show Measurements in the view bar to see floating labels', 'Select a room — cyan dimension arrows appear around it', 'Height is shown on the right side, width and depth at the edges'],
  },
  paint: {
    icon: PaintBucket,
    color: 'pink',
    title: 'Material Paint',
    steps2d: ['Select a room then use the right panel to choose floor, wall and ceiling finishes', 'Wall Color and Ceiling color pickers update live in 3D', 'Floor materials: hardwood, carpet, tile, marble, concrete, vinyl'],
    steps3d: ['Click any room to select it — material controls appear in the right panel', 'Choose floor material tiles (hardwood / carpet / tile / marble / concrete / vinyl)', 'Adjust Wall Color and Ceiling color with the color pickers at the bottom'],
  },
  select: null,
  delete: null,
};

function ToolGuide({ activeTool, viewMode }) {
  const guide = TOOL_GUIDES[activeTool];
  if (!guide) return null;
  const Icon = guide.icon;
  const steps = viewMode === '2d' ? guide.steps2d : guide.steps3d;
  const colorMap = {
    indigo: { bar: 'bg-indigo-500/10 border-indigo-500/30', icon: 'bg-indigo-500/20 text-indigo-400', dot: 'bg-indigo-400', title: 'text-indigo-300', num: 'bg-indigo-500/30 text-indigo-300' },
    cyan: { bar: 'bg-cyan-500/10 border-cyan-500/30', icon: 'bg-cyan-500/20 text-cyan-400', dot: 'bg-cyan-400', title: 'text-cyan-300', num: 'bg-cyan-500/30 text-cyan-300' },
    amber: { bar: 'bg-amber-500/10 border-amber-500/30', icon: 'bg-amber-500/20 text-amber-400', dot: 'bg-amber-400', title: 'text-amber-300', num: 'bg-amber-500/30 text-amber-300' },
    sky: { bar: 'bg-sky-500/10 border-sky-500/30', icon: 'bg-sky-500/20 text-sky-400', dot: 'bg-sky-400', title: 'text-sky-300', num: 'bg-sky-500/30 text-sky-300' },
    emerald: { bar: 'bg-emerald-500/10 border-emerald-500/30', icon: 'bg-emerald-500/20 text-emerald-400', dot: 'bg-emerald-400', title: 'text-emerald-300', num: 'bg-emerald-500/30 text-emerald-300' },
    pink: { bar: 'bg-pink-500/10 border-pink-500/30', icon: 'bg-pink-500/20 text-pink-400', dot: 'bg-pink-400', title: 'text-pink-300', num: 'bg-pink-500/30 text-pink-300' },
  };
  const c = colorMap[guide.color];
  return (
    <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 ${c.bar} border backdrop-blur-xl rounded-2xl px-5 py-3.5 pointer-events-none flex items-start gap-3 max-w-lg w-[92%] shadow-xl`}>
      <div className={`w-8 h-8 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className={`text-xs font-bold ${c.title} mb-1.5`}>{guide.title} — {viewMode === '2d' ? '2D Mode' : '3D Mode'}</div>
        <div className="space-y-1">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`${c.num} text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5`}>{i + 1}</span>
              <span className="text-[10px] text-slate-400 leading-snug">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Studio({ onNavigateHome }) {
  const {
    viewMode, showAI, showCost, showClimate, showSolar, showExport, showLocation,
    setTool, activeTool,
  } = useUIStore();

  // Keyboard shortcuts
  useEffect(() => {
    const keyMap = {
      'v': 'select', 'r': 'room', 'w': 'wall', 'd': 'door',
      'n': 'window', 'm': 'measure', 'p': 'paint',
    };
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useDesignStore.getState().undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        useDesignStore.getState().redo();
        return;
      }
      const tool = keyMap[e.key.toLowerCase()];
      if (tool) setTool(tool);
      if (e.key === 'Escape') useDesignStore.getState().clearSelection();
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const { selectedId, selectedType, deleteRoom, deleteFurniture } = useDesignStore.getState();
        if (selectedId && selectedType === 'room') deleteRoom(selectedId);
        if (selectedId && selectedType === 'furniture') deleteFurniture(selectedId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setTool]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-void">
      <TopBar onNavigateHome={onNavigateHome} />

      <div className="flex flex-1 overflow-hidden relative">
        <LeftPanel />

        {/* Main canvas area */}
        <div className="flex-1 relative overflow-hidden">
          {viewMode === '3d' ? <ThreeCanvas /> : <FloorPlan2D />}

          {/* Canvas overlay instructions */}
          <ToolGuide activeTool={activeTool} viewMode={viewMode} />
        </div>

        <RightPanel />
      </div>

      {/* Floating panels — fixed so they escape overflow-hidden containers */}
      {showAI && <AIAssistant />}
      {showCost && <CostEstimator />}
      {showClimate && <ClimatePanel />}
      {showSolar && <SolarPanel />}
      {showExport && <ExportPanel />}

      <BottomBar />

      {/* Location picker modal */}
      {showLocation && <LocationPicker />}

      {/* Global notification */}
      <Notification />
    </div>
  );
}
