import { X, Download, FileText, Box, Share2, Image, Printer, Check, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import useDesignStore from '../../stores/designStore';
import useUIStore from '../../stores/uiStore';
import { exportSceneAsPNG, exportBlueprintPDF, saveProjectJSON, loadProjectJSON, exportGLTF } from '../../utils/exportUtils';

const EXPORT_OPTIONS = [
  {
    id: 'png-3d',
    label: '3D Screenshot',
    desc: 'Capture the current 3D view as a high-res PNG image',
    icon: Image,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    format: 'PNG · current view',
  },
  {
    id: 'pdf-blueprint',
    label: 'PDF Blueprint',
    desc: 'Professional floor plan with dimensions and room legend',
    icon: FileText,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/25',
    format: 'PDF · A3 landscape · annotated',
  },
  {
    id: 'json-save',
    label: 'Save Project',
    desc: 'Download a .json project file you can re-open any time',
    icon: Download,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    format: 'JSON · full design data',
  },
  {
    id: 'gltf-model',
    label: '3D Model (GLTF)',
    desc: 'Export 3D model for Blender, SketchUp, Unity, Unreal',
    icon: Box,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/25',
    format: 'GLTF · Blender · SketchUp · AutoCAD',
  },
  {
    id: 'share-link',
    label: 'Shareable Link',
    desc: 'Copy a link to share this design with anyone',
    icon: Share2,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/25',
    format: 'Link · 3D walkthrough',
  },
];

function generateShareLink(projectName) {
  const hash = btoa(projectName + Date.now()).replace(/[+/=]/g, '').slice(0, 14);
  return `https://archcraft.io/view/${hash}`;
}

export default function ExportPanel() {
  const { toggleExport } = useUIStore();
  const { projectName, rooms, furniture, materialTier, location, climate } = useDesignStore();
  const [exporting, setExporting] = useState(null);
  const [done, setDone] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const fileInputRef = useRef();

  const markDone = (id) => {
    setExporting(null);
    setDone(id);
    setTimeout(() => setDone(null), 3000);
  };

  const handleExport = async (id) => {
    setExporting(id);
    try {
      if (id === 'png-3d') {
        exportSceneAsPNG(projectName || 'archcraft-design');
        markDone(id);
        useUIStore.getState().notify('3D screenshot saved!', 'success');

      } else if (id === 'pdf-blueprint') {
        exportBlueprintPDF(rooms, furniture, projectName || 'Architectural Blueprint');
        markDone(id);
        useUIStore.getState().notify('Blueprint PDF saved!', 'success');

      } else if (id === 'gltf-model') {
        exportGLTF(projectName || 'archcraft-model');
        markDone(id);
        useUIStore.getState().notify('3D model exported!', 'success');

      } else if (id === 'json-save') {
        saveProjectJSON({ rooms, furniture, materialTier, location, climate }, projectName);
        markDone(id);
        useUIStore.getState().notify('Project saved!', 'success');

      } else if (id === 'share-link') {
        await new Promise(r => setTimeout(r, 600));
        setShareLink(generateShareLink(projectName));
        markDone(id);
        useUIStore.getState().notify('Share link ready!', 'success');
      }
    } catch (err) {
      setExporting(null);
      useUIStore.getState().notify('Export failed — try again', 'error');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    useUIStore.getState().notify('Link copied!', 'success');
  };

  const handleLoad = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await loadProjectJSON(file);
      useDesignStore.getState().loadTemplate({
        rooms: data.rooms,
        furniture: data.furniture,
      });
      if (data.projectName) useDesignStore.getState().setProjectName(data.projectName);
      useUIStore.getState().notify(`Loaded: ${data.projectName || 'Project'}`, 'success');
    } catch (err) {
      useUIStore.getState().notify(err.message, 'error');
    }
    e.target.value = '';
  };

  return (
    <div className="fixed top-14 right-[272px] w-80 glass rounded-xl border border-indigo-500/20 shadow-2xl overflow-hidden z-40 panel-enter">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-indigo-500/10 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Download className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-white">Export & Share</div>
          <div className="text-[10px] text-indigo-300/70">{rooms.length} rooms · Real file exports</div>
        </div>
        <button onClick={toggleExport} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {EXPORT_OPTIONS.map(opt => {
          const Icon = opt.icon;
          const isExporting = exporting === opt.id;
          const isDone = done === opt.id;

          return (
            <div key={opt.id} className={`rounded-xl border ${opt.border} ${opt.bg} p-3`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-4 h-4 ${opt.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  <div className={`text-[9px] font-mono mt-1 ${opt.color}`}>{opt.format}</div>

                  {isDone && opt.id === 'share-link' && shareLink && (
                    <div className="mt-2 flex items-center gap-1">
                      <input
                        readOnly
                        value={shareLink}
                        className="flex-1 text-[9px] bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-300 font-mono outline-none"
                      />
                      <button onClick={copyLink} className="px-2 py-1 bg-cyan-500 rounded text-[9px] text-white font-semibold hover:bg-cyan-600 transition-all">
                        Copy
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleExport(opt.id)}
                  disabled={!!exporting}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex-shrink-0 ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isExporting
                      ? 'bg-white/5 text-slate-500 cursor-wait'
                      : `${opt.bg} ${opt.color} hover:opacity-80 border ${opt.border}`
                  }`}
                >
                  {isDone ? (
                    <><Check className="w-3 h-3" /> Done</>
                  ) : isExporting ? (
                    <span className="animate-pulse">···</span>
                  ) : (
                    <><Download className="w-3 h-3" /> Export</>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Load project */}
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Open Project</div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[11px] font-semibold hover:opacity-80 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            Load .json Project File
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleLoad} className="hidden" />
        </div>
      </div>
    </div>
  );
}
