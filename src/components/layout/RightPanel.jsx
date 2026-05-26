import { useState } from 'react';
import { Trash2, RotateCcw, Copy, Lock, ChevronDown, ChevronRight, Move, Maximize2, DoorOpen, Square } from 'lucide-react';
import useDesignStore from '../../stores/designStore';
import useUIStore from '../../stores/uiStore';

const FLOOR_MATERIALS = [
  { id: 'hardwood', label: 'Hardwood', color: '#c4a882' },
  { id: 'carpet', label: 'Carpet', color: '#9a8aaa' },
  { id: 'tile', label: 'Tile', color: '#d8d4cc' },
  { id: 'marble', label: 'Marble', color: '#e8e4dc' },
  { id: 'concrete', label: 'Concrete', color: '#909090' },
  { id: 'vinyl', label: 'Vinyl', color: '#b8b0a8' },
];

const WALL_MATERIALS = [
  { id: 'paint', label: 'Paint' },
  { id: 'tile', label: 'Tile' },
  { id: 'brick', label: 'Exposed Brick' },
  { id: 'wood', label: 'Wood Panel' },
  { id: 'wallpaper', label: 'Wallpaper' },
  { id: 'acoustic', label: 'Acoustic Panel' },
  { id: 'drywall', label: 'Drywall' },
];

const ROOM_TYPES = [
  'living', 'bedroom', 'kitchen', 'bathroom', 'dining', 'office',
  'garage', 'hallway', 'basement', 'laundry',
];

function FieldGroup({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, step = 0.1, min = 0.1, label, unit = 'm' }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-500 w-12">{label}</span>
      <div className="flex-1 flex items-center bg-card border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => onChange(Math.max(min, +(value - step).toFixed(1)))}
          className="px-2 py-1.5 text-slate-400 hover:text-white hover:bg-muted transition-all text-sm leading-none"
        >−</button>
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={e => onChange(+e.target.value)}
          className="flex-1 bg-transparent text-center text-xs text-white outline-none py-1.5 w-0"
        />
        <button
          onClick={() => onChange(+(value + step).toFixed(1))}
          className="px-2 py-1.5 text-slate-400 hover:text-white hover:bg-muted transition-all text-sm leading-none"
        >+</button>
      </div>
      <span className="text-[10px] text-slate-600 w-4">{unit}</span>
    </div>
  );
}

const WALL_FACES = ['north', 'south', 'east', 'west'];

function OpeningsEditor({ room }) {
  const { addDoor, removeDoor, addWindow, removeWindow } = useDesignStore();

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Doors & Windows</div>
      <div className="grid grid-cols-2 gap-1.5">
        {WALL_FACES.map(face => {
          const hasDoor = (room.doors || []).some(d => d.wall === face);
          const hasWindow = (room.windows || []).some(w => w.wall === face);
          return (
            <div key={face} className="bg-card border border-border rounded-lg p-2 space-y-1.5">
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest capitalize">{face}</div>
              <div className="flex gap-1">
                <button
                  onClick={() => hasDoor ? removeDoor(room.id, face) : addDoor(room.id, face, 0.5)}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[9px] font-semibold transition-all ${
                    hasDoor ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-muted text-slate-500 hover:text-white'
                  }`}
                  title={hasDoor ? 'Remove door' : 'Add door'}
                >
                  <DoorOpen className="w-3 h-3" />
                  {hasDoor ? 'Door ✓' : 'Door'}
                </button>
                <button
                  onClick={() => hasWindow ? removeWindow(room.id, face) : addWindow(room.id, face, 0.5)}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[9px] font-semibold transition-all ${
                    hasWindow ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-muted text-slate-500 hover:text-white'
                  }`}
                  title={hasWindow ? 'Remove window' : 'Add window'}
                >
                  <Square className="w-3 h-3" />
                  {hasWindow ? 'Win ✓' : 'Win'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoomProperties({ room }) {
  const { updateRoom, deleteRoom, duplicateRoom } = useDesignStore();
  const { notify } = useUIStore();

  const update = (key, val) => updateRoom(room.id, { [key]: val });

  return (
    <div className="space-y-5">
      {/* Name & Type */}
      <FieldGroup label="Room Identity">
        <input
          value={room.name}
          onChange={e => update('name', e.target.value)}
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60 transition-all"
          placeholder="Room name"
        />
        <select
          value={room.type}
          onChange={e => update('type', e.target.value)}
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60 transition-all capitalize"
        >
          {ROOM_TYPES.map(t => (
            <option key={t} value={t} className="bg-card capitalize">{t}</option>
          ))}
        </select>
      </FieldGroup>

      {/* Dimensions */}
      <FieldGroup label="Dimensions">
        <NumberInput label="Width" value={room.width} onChange={v => update('width', v)} min={1} />
        <NumberInput label="Length" value={room.length} onChange={v => update('length', v)} min={1} />
        <NumberInput label="Height" value={room.height} onChange={v => update('height', v)} min={2} max={6} step={0.1} />
        <div className="mt-1.5 p-2 bg-card rounded-lg border border-border flex items-center justify-between">
          <span className="text-[10px] text-slate-500">Floor Area</span>
          <span className="text-xs font-semibold text-emerald-400">
            {(room.width * room.length).toFixed(1)} m²
            <span className="text-slate-600 ml-1">
              ({Math.round(room.width * room.length * 10.764)} ft²)
            </span>
          </span>
        </div>
      </FieldGroup>

      {/* Position */}
      <FieldGroup label="Position">
        <NumberInput label="X" value={room.x} onChange={v => update('x', v)} step={0.5} min={-100} />
        <NumberInput label="Z" value={room.z} onChange={v => update('z', v)} step={0.5} min={-100} />
      </FieldGroup>

      {/* Floor Material */}
      <FieldGroup label="Floor Material">
        <div className="grid grid-cols-3 gap-1.5">
          {FLOOR_MATERIALS.map(m => (
            <button
              key={m.id}
              onClick={() => { update('floorMaterial', m.id); update('floorColor', m.color); }}
              className={`py-2 px-1 rounded-lg border text-[10px] font-medium transition-all flex flex-col items-center gap-1 ${
                room.floorMaterial === m.id
                  ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
                  : 'border-border text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              <span className="w-5 h-5 rounded-sm" style={{ background: m.color }} />
              {m.label}
            </button>
          ))}
        </div>
      </FieldGroup>

      {/* Wall Color & Material */}
      <FieldGroup label="Wall Finish">
        <select
          value={room.wallMaterial || 'paint'}
          onChange={e => update('wallMaterial', e.target.value)}
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60 transition-all"
        >
          {WALL_MATERIALS.map(m => (
            <option key={m.id} value={m.id} className="bg-card">{m.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-2 mt-1.5">
          <label className="text-[10px] text-slate-500 flex-1">Wall Color</label>
          <input
            type="color"
            value={room.wallColor || '#f0ebe3'}
            onChange={e => update('wallColor', e.target.value)}
            className="w-8 h-8 rounded-lg cursor-pointer"
          />
          <label className="text-[10px] text-slate-500">Ceiling</label>
          <input
            type="color"
            value={room.ceilingColor || '#ffffff'}
            onChange={e => update('ceilingColor', e.target.value)}
            className="w-8 h-8 rounded-lg cursor-pointer"
          />
        </div>
      </FieldGroup>

      {/* Openings editor */}
      <OpeningsEditor room={room} />

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => { deleteRoom(room.id); notify('Room deleted', 'info'); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
        <button
          onClick={() => { duplicateRoom(room.id); notify('Room duplicated', 'success'); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-slate-400 hover:text-white hover:bg-muted text-xs font-medium transition-all"
        >
          <Copy className="w-3.5 h-3.5" />
          Duplicate
        </button>
      </div>
    </div>
  );
}

function FurnitureProperties({ item }) {
  const { updateFurniture, deleteFurniture } = useDesignStore();
  const { notify } = useUIStore();
  const update = (key, val) => updateFurniture(item.id, { [key]: val });

  return (
    <div className="space-y-5">
      <FieldGroup label="Label">
        <input
          value={item.label}
          onChange={e => update('label', e.target.value)}
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60 transition-all"
        />
      </FieldGroup>

      <FieldGroup label="Position">
        <NumberInput label="X" value={item.x} onChange={v => update('x', v)} step={0.25} min={-100} />
        <NumberInput label="Z" value={item.z} onChange={v => update('z', v)} step={0.25} min={-100} />
      </FieldGroup>

      <FieldGroup label="Rotation">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={360}
            step={15}
            value={item.rotation || 0}
            onChange={e => update('rotation', +e.target.value)}
            className="flex-1"
          />
          <span className="text-xs text-slate-400 w-10 text-right">{item.rotation || 0}°</span>
        </div>
        <div className="grid grid-cols-4 gap-1 mt-1">
          {[0, 90, 180, 270].map(deg => (
            <button
              key={deg}
              onClick={() => update('rotation', deg)}
              className={`py-1 rounded text-[10px] font-medium transition-all ${
                (item.rotation || 0) === deg
                  ? 'bg-indigo-500/30 text-indigo-300'
                  : 'bg-card text-slate-500 hover:text-white'
              }`}
            >
              {deg}°
            </button>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="Color">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={item.color}
            onChange={e => update('color', e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer"
          />
          <span className="text-xs text-slate-400 font-mono">{item.color}</span>
        </div>
      </FieldGroup>

      <div className="flex gap-2">
        <button
          onClick={() => { deleteFurniture(item.id); notify('Removed', 'info'); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>
    </div>
  );
}

function ProjectInfo() {
  const { rooms, furniture, materialTier, setMaterialTier } = useDesignStore();
  const totalArea = rooms.reduce((s, r) => s + r.width * r.length, 0);

  const cost = rooms.reduce((total, r) => {
    const rates = { bedroom: 180, living: 165, kitchen: 220, bathroom: 250, dining: 160, office: 170, garage: 95, basement: 85, laundry: 190, hallway: 120 };
    const mults = { standard: 1, premium: 1.4, luxury: 2.1 };
    return total + r.width * r.length * (rates[r.type] ?? 150) * (mults[materialTier] ?? 1);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Rooms', value: rooms.length, color: 'text-indigo-400' },
          { label: 'Furniture', value: furniture.length, color: 'text-cyan-400' },
          { label: 'Total Area', value: `${totalArea.toFixed(0)} m²`, color: 'text-emerald-400' },
          { label: 'Est. Cost', value: `$${(cost / 1000).toFixed(0)}k`, color: 'text-amber-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <FieldGroup label="Material Quality">
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'standard', label: 'Standard', desc: '1×' },
            { id: 'premium', label: 'Premium', desc: '1.4×' },
            { id: 'luxury', label: 'Luxury', desc: '2.1×' },
          ].map(tier => (
            <button
              key={tier.id}
              onClick={() => setMaterialTier(tier.id)}
              className={`py-2 px-1 rounded-lg border text-[10px] font-medium transition-all flex flex-col items-center gap-0.5 ${
                materialTier === tier.id
                  ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
                  : 'border-border text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              <span className="font-semibold text-xs">{tier.label}</span>
              <span className="opacity-60">{tier.desc}</span>
            </button>
          ))}
        </div>
      </FieldGroup>
    </div>
  );
}

export default function RightPanel() {
  const { selectedId, selectedType, rooms, furniture } = useDesignStore();

  const selectedRoom = selectedType === 'room' ? rooms.find(r => r.id === selectedId) : null;
  const selectedFurniture = selectedType === 'furniture' ? furniture.find(f => f.id === selectedId) : null;

  return (
    <div className="w-64 bg-surface/95 border-l border-border flex flex-col flex-shrink-0 overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <div className="text-xs font-bold text-white">
          {selectedRoom ? `✏️ ${selectedRoom.name}` : selectedFurniture ? `🪑 ${selectedFurniture.label}` : '📋 Project'}
        </div>
        {(selectedRoom || selectedFurniture) && (
          <div className="text-[10px] text-slate-500 mt-0.5">
            {selectedRoom ? `Room · ${selectedRoom.type}` : `Furniture · ${selectedFurniture.type}`}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedRoom && <RoomProperties room={selectedRoom} />}
        {selectedFurniture && <FurnitureProperties item={selectedFurniture} />}
        {!selectedRoom && !selectedFurniture && <ProjectInfo />}
      </div>
    </div>
  );
}
