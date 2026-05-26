import { useEffect } from 'react';
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
          {activeTool === 'room' && viewMode === '3d' && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass rounded-xl px-5 py-3 text-xs text-indigo-300 pointer-events-none flex items-center gap-2 border border-indigo-500/20">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Switch to 2D Floor Plan view to draw rooms, or click Add Room in the panel
            </div>
          )}
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
