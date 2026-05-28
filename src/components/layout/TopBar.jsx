import { useState } from 'react';
import {
  Cpu, Save, Download, Share2, Undo2, Redo2, Grid3x3, Sun,
  Eye, EyeOff, Box, Map, DollarSign, Wind, Zap, Users,
  ChevronDown, Settings, Home, ArrowLeft, Layers, Footprints
} from 'lucide-react';
import useDesignStore from '../../stores/designStore';
import useUIStore from '../../stores/uiStore';

function ViewToggle() {
  const { viewMode, setViewMode } = useUIStore();
  return (
    <div className="flex items-center bg-surface rounded-lg border border-border p-0.5 gap-0.5">
      <button
        onClick={() => setViewMode('2d')}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
          viewMode === '2d'
            ? 'bg-indigo-500 text-white shadow-lg'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        2D Plan
      </button>
      <button
        onClick={() => setViewMode('3d')}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
          viewMode === '3d'
            ? 'bg-indigo-500 text-white shadow-lg'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        3D View
      </button>
    </div>
  );
}

function StatusBadge({ score }) {
  const color = score >= 90 ? 'emerald' : score >= 75 ? 'amber' : 'rose';
  const colors = {
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    rose: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
  };
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${colors[color]}`}>
      <span className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />
      Struct. {score}%
    </div>
  );
}

export default function TopBar({ onNavigateHome }) {
  const { projectName, setProjectName, rooms, undo, redo, _past, _future } = useDesignStore();
  const {
    showGrid, toggleGrid, showShadows, toggleShadows, showWireframe, toggleWireframe,
    toggleAI, toggleCost, toggleClimate, toggleSolar, toggleExport, toggleLocation, toggleTemplates,
    showAI, showCost, showClimate, showSolar, showExport,
    walkMode, toggleWalkMode,
    notify,
  } = useUIStore();

  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(projectName);

  const structuralScore = useDesignStore(s => {
    let score = 100;
    s.rooms.forEach(r => {
      if (r.width > 12 || r.length > 14) score -= 8;
      if (r.height > 4) score -= 3;
    });
    if (s.rooms.reduce((a, r) => a + r.width * r.length, 0) > 600) score -= 5;
    return Math.max(60, score);
  });

  const handleSave = () => {
    const data = { projectName, rooms: useDesignStore.getState().rooms, furniture: useDesignStore.getState().furniture };
    localStorage.setItem('archcraft_project', JSON.stringify(data));
    notify('Project saved locally', 'success');
  };

  return (
    <div className="h-14 bg-surface/95 border-b border-border backdrop-blur-xl flex items-center px-3 gap-3 z-50 flex-shrink-0">
      {/* Logo + back */}
      <button onClick={onNavigateHome} className="flex items-center gap-2 group mr-1">
        <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/40 transition-all">
          <Home className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors hidden sm:block">Back</span>
      </button>

      <div className="w-px h-6 bg-border" />

      {/* Project name */}
      {editingName ? (
        <input
          autoFocus
          value={nameVal}
          onChange={e => setNameVal(e.target.value)}
          onBlur={() => { setEditingName(false); setProjectName(nameVal); }}
          onKeyDown={e => { if (e.key === 'Enter') { setEditingName(false); setProjectName(nameVal); } }}
          className="text-sm font-semibold bg-card border border-indigo-500/50 rounded-lg px-2 py-1 text-white outline-none w-48"
        />
      ) : (
        <button
          onClick={() => setEditingName(true)}
          className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors truncate max-w-[160px]"
        >
          {projectName}
        </button>
      )}

      <div className="w-px h-6 bg-border" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!_past?.length}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
            _past?.length
              ? 'hover:bg-muted text-slate-400 hover:text-white'
              : 'text-slate-700 cursor-not-allowed'
          }`}
          title={`Undo${_past?.length ? ` (${_past.length})` : ''} — Ctrl+Z`}
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={!_future?.length}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
            _future?.length
              ? 'hover:bg-muted text-slate-400 hover:text-white'
              : 'text-slate-700 cursor-not-allowed'
          }`}
          title={`Redo${_future?.length ? ` (${_future.length})` : ''} — Ctrl+Y`}
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* View mode */}
      <ViewToggle />

      <div className="w-px h-6 bg-border" />

      {/* View options */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleGrid}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${showGrid ? 'text-indigo-400 bg-indigo-500/15' : 'text-slate-500 hover:text-white hover:bg-muted'}`}
          title="Toggle Grid"
        >
          <Grid3x3 className="w-4 h-4" />
        </button>
        <button
          onClick={toggleShadows}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${showShadows ? 'text-amber-400 bg-amber-500/15' : 'text-slate-500 hover:text-white hover:bg-muted'}`}
          title="Toggle Shadows"
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={toggleWireframe}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${showWireframe ? 'text-cyan-400 bg-cyan-500/15' : 'text-slate-500 hover:text-white hover:bg-muted'}`}
          title="Wireframe"
        >
          <Box className="w-4 h-4" />
        </button>
        <button
          onClick={toggleWalkMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            walkMode ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'text-slate-500 hover:text-white hover:bg-muted'
          }`}
          title="Walk Mode — first-person walkthrough"
        >
          <Footprints className="w-3.5 h-3.5" />
          <span className="hidden lg:block">Walk</span>
        </button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Feature toggles */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleSolar}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showSolar ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-white hover:bg-muted'
          }`}
          title="Solar Simulation"
        >
          <Sun className="w-3.5 h-3.5" />
          <span className="hidden lg:block">Solar</span>
        </button>
        <button
          onClick={toggleClimate}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showClimate ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white hover:bg-muted'
          }`}
          title="Climate Intelligence"
        >
          <Wind className="w-3.5 h-3.5" />
          <span className="hidden lg:block">Climate</span>
        </button>
        <button
          onClick={toggleCost}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showCost ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-white hover:bg-muted'
          }`}
          title="Live Cost Estimator"
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span className="hidden lg:block">Cost</span>
        </button>
        <button
          onClick={toggleAI}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showAI ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' : 'text-slate-400 hover:text-white hover:bg-muted'
          }`}
          title="ArchAI Assistant"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden lg:block">ArchAI</span>
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Structural score */}
      <StatusBadge score={structuralScore} />

      <div className="w-px h-6 bg-border" />

      {/* Save / Export / Share */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-border text-slate-300 hover:text-white text-xs font-medium transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </button>
        <button
          onClick={toggleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-all shadow-lg hover:shadow-indigo-500/40"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
    </div>
  );
}
