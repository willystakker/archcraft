import { create } from 'zustand';

const generateId = () => Math.random().toString(36).slice(2, 9);

const ROOM_COSTS = {
  bedroom: 180,
  living: 165,
  kitchen: 220,
  bathroom: 250,
  dining: 160,
  office: 170,
  garage: 95,
  basement: 85,
  laundry: 190,
  hallway: 120,
};

const MATERIAL_MULTIPLIERS = {
  standard: 1.0,
  premium: 1.4,
  luxury: 2.1,
};

function calcStructuralScore(rooms) {
  if (rooms.length === 0) return 100;
  let score = 100;
  const totalArea = rooms.reduce((s, r) => s + r.width * r.length, 0);
  if (totalArea > 600) score -= 5;
  rooms.forEach(r => {
    if (r.width > 12 || r.length > 14) score -= 8;
    if (r.height > 4) score -= 3;
  });
  return Math.max(60, score);
}

function calcTotalCost(rooms, material = 'standard') {
  const mult = MATERIAL_MULTIPLIERS[material] ?? 1;
  return rooms.reduce((total, r) => {
    const rate = ROOM_COSTS[r.type] ?? 150;
    return total + r.width * r.length * rate * mult;
  }, 0);
}

const DEFAULT_ROOMS = [
  {
    id: generateId(),
    name: 'Living Room',
    type: 'living',
    x: -4,
    z: -3,
    width: 7,
    length: 6,
    height: 2.9,
    floorColor: '#c4a882',
    wallColor: '#f0ebe3',
    ceilingColor: '#ffffff',
    floorMaterial: 'hardwood',
    wallMaterial: 'paint',
    opacity: 1,
    doors: [{ wall: 'east', pos: 0.5 }, { wall: 'south', pos: 0.4 }],
    windows: [{ wall: 'north', pos: 0.3 }, { wall: 'north', pos: 0.7 }],
  },
  {
    id: generateId(),
    name: 'Master Bedroom',
    type: 'bedroom',
    x: 4,
    z: -3,
    width: 5,
    length: 5,
    height: 2.9,
    floorColor: '#8a7355',
    wallColor: '#e8e0d8',
    ceilingColor: '#ffffff',
    floorMaterial: 'carpet',
    wallMaterial: 'paint',
    opacity: 1,
    doors: [{ wall: 'west', pos: 0.5 }],
    windows: [{ wall: 'north', pos: 0.5 }, { wall: 'east', pos: 0.5 }],
  },
  {
    id: generateId(),
    name: 'Kitchen',
    type: 'kitchen',
    x: -2,
    z: 4,
    width: 5,
    length: 4,
    height: 2.9,
    floorColor: '#d4c9b8',
    wallColor: '#f5f5f0',
    ceilingColor: '#ffffff',
    floorMaterial: 'tile',
    wallMaterial: 'tile',
    opacity: 1,
    doors: [{ wall: 'north', pos: 0.5 }],
    windows: [{ wall: 'east', pos: 0.5 }, { wall: 'south', pos: 0.5 }],
  },
];

const DEFAULT_FURNITURE = [
  { id: generateId(), roomId: null, type: 'sofa', x: -4, z: -3, rotation: 0, width: 2.4, depth: 1, color: '#5a6e8a', label: 'Sofa' },
  { id: generateId(), roomId: null, type: 'bed', x: 4, z: -3, rotation: 0, width: 1.8, depth: 2.1, color: '#8b7355', label: 'King Bed' },
  { id: generateId(), roomId: null, type: 'table', x: -2, z: 4, rotation: 0, width: 1.2, depth: 0.8, color: '#6b5e4e', label: 'Island' },
];

const useDesignStore = create((set, get) => ({
  projectName: 'Dream Home',
  location: null,
  climate: null,
  materialTier: 'standard',

  rooms: DEFAULT_ROOMS,
  furniture: DEFAULT_FURNITURE,
  doors: [],
  windows: [],

  selectedId: null,
  selectedType: null,

  history: [],
  historyIndex: -1,

  // Computed
  get totalArea() {
    return get().rooms.reduce((s, r) => s + r.width * r.length, 0);
  },

  get estimatedCost() {
    return calcTotalCost(get().rooms, get().materialTier);
  },

  get structuralScore() {
    return calcStructuralScore(get().rooms);
  },

  setProjectName: (name) => set({ projectName: name }),

  setLocation: (location) => set({
    location,
    climate: deriveClimate(location),
  }),

  setMaterialTier: (tier) => set({ materialTier: tier }),

  setSelected: (id, type) => set({ selectedId: id, selectedType: type }),

  clearSelection: () => set({ selectedId: null, selectedType: null }),

  addRoom: (roomData) => {
    const room = {
      id: generateId(),
      name: roomData.name || 'New Room',
      type: roomData.type || 'living',
      x: roomData.x ?? 0,
      z: roomData.z ?? 0,
      width: roomData.width ?? 4,
      length: roomData.length ?? 4,
      height: 2.9,
      floorColor: '#c4a882',
      wallColor: '#f0ebe3',
      ceilingColor: '#ffffff',
      floorMaterial: 'hardwood',
      wallMaterial: 'paint',
      opacity: 1,
      doors: [],
      windows: [],
      ...roomData,
    };
    set(s => ({ rooms: [...s.rooms, room], selectedId: room.id, selectedType: 'room' }));
    return room.id;
  },

  updateRoom: (id, updates) => {
    set(s => ({
      rooms: s.rooms.map(r => r.id === id ? { ...r, ...updates } : r),
    }));
  },

  deleteRoom: (id) => {
    set(s => ({
      rooms: s.rooms.filter(r => r.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
  },

  addFurniture: (data) => {
    const item = {
      id: generateId(),
      type: data.type || 'chair',
      x: data.x ?? 0,
      z: data.z ?? 0,
      rotation: 0,
      width: data.width ?? 1,
      depth: data.depth ?? 1,
      color: data.color ?? '#5a6e8a',
      label: data.label ?? 'Furniture',
    };
    set(s => ({ furniture: [...s.furniture, item], selectedId: item.id, selectedType: 'furniture' }));
    return item.id;
  },

  updateFurniture: (id, updates) => {
    set(s => ({
      furniture: s.furniture.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
  },

  deleteFurniture: (id) => {
    set(s => ({
      furniture: s.furniture.filter(f => f.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
  },

  addDoor: (roomId, face, pos = 0.5) => {
    set(s => ({
      rooms: s.rooms.map(r => {
        if (r.id !== roomId) return r;
        const doors = (r.doors || []).filter(d => d.wall !== face);
        return { ...r, doors: [...doors, { wall: face, pos }] };
      }),
    }));
  },

  removeDoor: (roomId, face) => {
    set(s => ({
      rooms: s.rooms.map(r =>
        r.id !== roomId ? r : { ...r, doors: (r.doors || []).filter(d => d.wall !== face) }
      ),
    }));
  },

  addWindow: (roomId, face, pos = 0.5) => {
    set(s => ({
      rooms: s.rooms.map(r => {
        if (r.id !== roomId) return r;
        const windows = (r.windows || []).filter(w => w.wall !== face);
        return { ...r, windows: [...windows, { wall: face, pos }] };
      }),
    }));
  },

  removeWindow: (roomId, face) => {
    set(s => ({
      rooms: s.rooms.map(r =>
        r.id !== roomId ? r : { ...r, windows: (r.windows || []).filter(w => w.wall !== face) }
      ),
    }));
  },

  clearAll: () => set({
    rooms: [],
    furniture: [],
    doors: [],
    windows: [],
    selectedId: null,
    selectedType: null,
  }),

  duplicateRoom: (id) => {
    const room = get().rooms.find(r => r.id === id);
    if (!room) return;
    const copy = { ...room, id: generateId(), x: room.x + 1, z: room.z + 1, name: room.name + ' Copy' };
    set(s => ({ rooms: [...s.rooms, copy], selectedId: copy.id, selectedType: 'room' }));
  },

  loadTemplate: (template) => {
    set({
      rooms: template.rooms.map(r => ({ ...r, id: generateId(), doors: r.doors || [], windows: r.windows || [] })),
      furniture: template.furniture?.map(f => ({ ...f, id: generateId() })) ?? [],
      selectedId: null,
      selectedType: null,
    });
  },

  autoSave: () => {
    const s = get();
    try {
      localStorage.setItem('archcraft_autosave', JSON.stringify({
        version: '1.0',
        savedAt: Date.now(),
        projectName: s.projectName,
        rooms: s.rooms,
        furniture: s.furniture,
        materialTier: s.materialTier,
        location: s.location,
      }));
    } catch {}
  },
}));

function deriveClimate(location) {
  if (!location) return null;
  const lat = Math.abs(location.lat ?? 35);
  if (lat < 15) return { zone: 'tropical', label: 'Tropical', insights: ['High humidity insulation needed', 'Consider elevated floors', 'Large overhangs for rain protection'] };
  if (lat < 30) return { zone: 'subtropical', label: 'Subtropical', insights: ['Cross-ventilation critical', 'Solar shading on west walls', 'Consider light-colored exterior'] };
  if (lat < 50) return { zone: 'temperate', label: 'Temperate', insights: ['South-facing windows maximize solar gain', 'Good insulation R-20+', 'Thermal mass recommended'] };
  return { zone: 'cold', label: 'Cold/Arctic', insights: ['Triple-pane windows required', 'R-40+ insulation critical', 'Compact form factor saves energy'] };
}

export default useDesignStore;
