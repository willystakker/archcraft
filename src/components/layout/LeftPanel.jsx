import { useState } from 'react';
import {
  MousePointer2, Square, Minus, DoorOpen, Blinds, Sofa,
  ArrowUpRight, Ruler, PaintBucket, Trash2, RotateCcw, Move3d,
  ChevronDown, ChevronRight, Plus, Layers, Home
} from 'lucide-react';
import useUIStore from '../../stores/uiStore';
import useDesignStore from '../../stores/designStore';
import { FURNITURE_CATALOG, FURNITURE_CATEGORIES } from '../../data/furniture';
import { HOUSE_TEMPLATES } from '../../data/roomTemplates';

const TOOLS = [
  { id: 'select', label: 'Select', icon: MousePointer2, shortcut: 'V' },
  { id: 'room', label: 'Draw Room', icon: Square, shortcut: 'R' },
  { id: 'wall', label: 'Draw Wall', icon: Minus, shortcut: 'W' },
  { id: 'door', label: 'Add Door', icon: DoorOpen, shortcut: 'D' },
  { id: 'window', label: 'Add Window', icon: Blinds, shortcut: 'N' },
  { id: 'measure', label: 'Measure', icon: Ruler, shortcut: 'M' },
  { id: 'paint', label: 'Material Paint', icon: PaintBucket, shortcut: 'P' },
  { id: 'delete', label: 'Delete', icon: Trash2, shortcut: 'Del', danger: true },
];

const ROOM_PRESETS = [
  { type: 'living', label: 'Living Room', color: '#6366f1', w: 6, l: 5 },
  { type: 'bedroom', label: 'Bedroom', color: '#8b5cf6', w: 4.5, l: 4.5 },
  { type: 'kitchen', label: 'Kitchen', color: '#06b6d4', w: 4, l: 3.5 },
  { type: 'bathroom', label: 'Bathroom', color: '#10b981', w: 2.5, l: 3 },
  { type: 'dining', label: 'Dining Room', color: '#f59e0b', w: 4, l: 4 },
  { type: 'office', label: 'Home Office', color: '#ec4899', w: 3.5, l: 3.5 },
  { type: 'garage', label: 'Garage', color: '#64748b', w: 6, l: 6 },
  { type: 'hallway', label: 'Hallway', color: '#78716c', w: 1.5, l: 5 },
];

function ToolButton({ tool, active, onClick }) {
  const Icon = tool.icon;
  return (
    <button
      onClick={onClick}
      title={`${tool.label} (${tool.shortcut})`}
      className={`tool-btn w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
        active
          ? 'active border-indigo-500/60 bg-indigo-500/20 text-indigo-300'
          : tool.danger
          ? 'border-transparent text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30'
          : 'border-transparent text-slate-400 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 text-left">{tool.label}</span>
      <span className={`text-[10px] px-1 py-0.5 rounded font-mono ${active ? 'bg-indigo-500/30 text-indigo-300' : 'bg-muted text-slate-500'}`}>
        {tool.shortcut}
      </span>
    </button>
  );
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors"
      >
        {title}
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      {open && <div className="px-2 space-y-0.5">{children}</div>}
    </div>
  );
}

function RoomPresetButton({ preset, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-border hover:bg-card text-xs text-slate-400 hover:text-white transition-all group"
    >
      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: preset.color }} />
      <span className="flex-1 text-left">{preset.label}</span>
      <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
    </button>
  );
}

function FurnitureSection() {
  const [activeCat, setActiveCat] = useState('living');
  const { addFurniture } = useDesignStore();

  const items = FURNITURE_CATALOG.filter(f => f.category === activeCat);

  const handleAdd = (item) => {
    addFurniture({
      type: item.type,
      x: (Math.random() - 0.5) * 6,
      z: (Math.random() - 0.5) * 6,
      width: item.width,
      depth: item.depth,
      color: item.color,
      label: item.label,
    });
  };

  return (
    <div>
      <div className="flex gap-1 flex-wrap px-2 mb-2">
        {FURNITURE_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize transition-all ${
              activeCat === cat ? 'bg-indigo-500/30 text-indigo-300' : 'text-slate-500 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="px-2 space-y-0.5 max-h-48 overflow-y-auto">
        {items.map(item => (
          <button
            key={item.type}
            onClick={() => handleAdd(item)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-border hover:bg-card text-xs text-slate-400 hover:text-white transition-all group"
          >
            <span className="text-sm">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            <span className="text-[10px] text-slate-600 group-hover:text-slate-400">
              {item.width}×{item.depth}m
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TemplatesSection() {
  const { loadTemplate, notify } = { ...useDesignStore(), ...useUIStore() };

  return (
    <div className="px-2 space-y-1.5">
      {HOUSE_TEMPLATES.map(t => (
        <button
          key={t.id}
          onClick={() => {
            useDesignStore.getState().loadTemplate(t);
            useUIStore.getState().notify(`Loaded: ${t.name}`, 'success');
          }}
          className="w-full text-left p-2.5 rounded-lg border border-border hover:border-indigo-500/40 bg-card hover:bg-indigo-500/10 transition-all group"
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">{t.name}</span>
            <span className="text-[10px] text-slate-500">{t.sqft.toLocaleString()} ft²</span>
          </div>
          <div className="text-[10px] text-slate-500 truncate">{t.description}</div>
          <div className="flex gap-2 mt-1">
            <span className="text-[10px] text-slate-600">{t.beds}bd · {t.baths}ba</span>
            <span className="text-[10px] text-indigo-500 capitalize">{t.style}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function LeftPanel() {
  const { activeTool, setTool } = useUIStore();
  const { addRoom } = useDesignStore();
  const [activeTab, setActiveTab] = useState('tools');

  const handleAddRoomPreset = (preset) => {
    addRoom({
      type: preset.type,
      name: preset.label,
      x: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 10,
      width: preset.w,
      length: preset.l,
    });
    useUIStore.getState().notify(`Added ${preset.label}`, 'success');
  };

  return (
    <div className="w-56 bg-surface/95 border-r border-border flex flex-col flex-shrink-0 overflow-hidden backdrop-blur-xl">
      {/* Tab selector */}
      <div className="flex border-b border-border p-1.5 gap-1 flex-shrink-0">
        {['tools', 'rooms', 'furniture', 'templates'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-md text-[10px] font-semibold capitalize transition-all ${
              activeTab === tab ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500 hover:text-white'
            }`}
          >
            {tab === 'templates' ? '📐' : tab === 'furniture' ? '🪑' : tab === 'rooms' ? '🏠' : '🔧'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {activeTab === 'tools' && (
          <Section title="Design Tools" defaultOpen>
            {TOOLS.map(tool => (
              <ToolButton
                key={tool.id}
                tool={tool}
                active={activeTool === tool.id}
                onClick={() => setTool(tool.id)}
              />
            ))}
          </Section>
        )}

        {activeTab === 'rooms' && (
          <Section title="Quick Add Room" defaultOpen>
            {ROOM_PRESETS.map(preset => (
              <RoomPresetButton
                key={preset.type}
                preset={preset}
                onClick={() => handleAddRoomPreset(preset)}
              />
            ))}
          </Section>
        )}

        {activeTab === 'furniture' && (
          <Section title="Furniture Library" defaultOpen>
            <FurnitureSection />
          </Section>
        )}

        {activeTab === 'templates' && (
          <Section title="House Templates" defaultOpen>
            <TemplatesSection />
          </Section>
        )}
      </div>

      {/* Floor selector */}
      <div className="border-t border-border p-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Floors</span>
          <button className="w-5 h-5 rounded flex items-center justify-center hover:bg-indigo-500/20 text-indigo-400 transition-all">
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-0.5">
          {['Ground Floor', '2nd Floor', 'Basement'].map((floor, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all ${
                i === 0 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-500 hover:text-white hover:bg-muted'
              }`}
            >
              <Layers className="w-3 h-3" />
              {floor}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
