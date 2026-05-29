import { create } from 'zustand';

const useUIStore = create((set) => ({
  activeTool: 'select',
  viewMode: '3d',
  showGrid: true,
  showShadows: true,
  showWireframe: false,
  showMeasurements: true,
  showFurniture: true,
  activeFloor: 0,

  showAI: false,
  showCost: false,
  showClimate: false,
  showSolar: false,
  showExport: false,
  showStructural: false,
  showLocation: false,
  showTemplates: false,

  walkMode: false,
  cameraAngle: 'perspective',
  sunAngle: 45,
  sunTime: 12,
  canvasZoom: 1,

  isDrawingRoom: false,
  drawStart: null,
  drawCurrent: null,

  notification: null,

  setTool: (tool) => set({ activeTool: tool }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleGrid: () => set(s => ({ showGrid: !s.showGrid })),
  toggleShadows: () => set(s => ({ showShadows: !s.showShadows })),
  toggleWireframe: () => set(s => ({ showWireframe: !s.showWireframe })),
  toggleMeasurements: () => set(s => ({ showMeasurements: !s.showMeasurements })),

  toggleAI: () => set(s => ({ showAI: !s.showAI, showCost: false, showClimate: false, showExport: false })),
  toggleCost: () => set(s => ({ showCost: !s.showCost, showAI: false, showClimate: false, showExport: false })),
  toggleClimate: () => set(s => ({ showClimate: !s.showClimate, showAI: false, showCost: false, showExport: false })),
  toggleSolar: () => set(s => ({ showSolar: !s.showSolar })),
  toggleExport: () => set(s => ({ showExport: !s.showExport, showAI: false, showCost: false, showClimate: false })),
  toggleStructural: () => set(s => ({ showStructural: !s.showStructural })),
  toggleWalkMode: () => set(s => ({ walkMode: !s.walkMode })),
  toggleLocation: () => set(s => ({ showLocation: !s.showLocation })),
  toggleTemplates: () => set(s => ({ showTemplates: !s.showTemplates })),

  setSunAngle: (a) => set({ sunAngle: a }),
  setSunTime: (t) => set({ sunTime: t }),
  setCameraAngle: (a) => set({ cameraAngle: a }),
  setCanvasZoom: (z) => set({ canvasZoom: z }),

  startDrawing: (point) => set({ isDrawingRoom: true, drawStart: point, drawCurrent: point }),
  updateDrawing: (point) => set({ drawCurrent: point }),
  endDrawing: () => set({ isDrawingRoom: false, drawStart: null, drawCurrent: null }),

  notify: (msg, type = 'info') => {
    set({ notification: { msg, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },
}));

export default useUIStore;
