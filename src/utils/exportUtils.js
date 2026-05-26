import jsPDF from 'jspdf';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

// Canvas + scene references registered from ThreeCanvas
let _canvas = null;
let _scene = null;
export function registerCanvas(el) { _canvas = el; }
export function registerScene(scene) { _scene = scene; }

export function exportGLTF(projectName = 'archcraft-model') {
  if (!_scene) { alert('3D scene not ready — switch to 3D view first.'); return; }
  const exporter = new GLTFExporter();
  exporter.parse(
    _scene,
    (result) => {
      const blob = new Blob(
        [result instanceof ArrayBuffer ? result : JSON.stringify(result, null, 2)],
        { type: result instanceof ArrayBuffer ? 'application/octet-stream' : 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.${result instanceof ArrayBuffer ? 'glb' : 'gltf'}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    (err) => { console.error('GLTF export error:', err); },
    { binary: false, animations: [], includeCustomExtensions: false }
  );
}

export function exportSceneAsPNG(projectName = 'archcraft-design') {
  if (!_canvas) {
    alert('3D view not ready — switch to 3D mode first.');
    return;
  }
  const url = _canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName}.png`;
  a.click();
}

export function exportBlueprintPDF(rooms, furniture, projectName = 'Architectural Blueprint') {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // ── Header ───────────────────────────────────────────────────────────────
  doc.setFillColor(18, 14, 40);
  doc.rect(0, 0, pageW, 30, 'F');

  doc.setTextColor(180, 160, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(projectName, pageW / 2, 13, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 100, 200);
  doc.text('ARCHCRAFT — Professional Architectural Design Platform', pageW / 2, 21, { align: 'center' });

  doc.setTextColor(80, 60, 140);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageW / 2, 27, { align: 'center' });

  if (rooms.length === 0) {
    doc.setTextColor(100);
    doc.setFontSize(11);
    doc.text('No rooms to display.', pageW / 2, pageH / 2, { align: 'center' });
    doc.save(`${projectName}-blueprint.pdf`);
    return;
  }

  // ── Compute bounding box ──────────────────────────────────────────────────
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  rooms.forEach(r => {
    minX = Math.min(minX, r.x - r.width / 2);
    maxX = Math.max(maxX, r.x + r.width / 2);
    minZ = Math.min(minZ, r.z - r.length / 2);
    maxZ = Math.max(maxZ, r.z + r.length / 2);
  });
  const designW = maxX - minX;
  const designH = maxZ - minZ;

  const margin = 18;
  const drawArea = { x: margin, y: 35, w: pageW - margin * 2, h: pageH - 60 };
  const scale = Math.min(drawArea.w / designW, drawArea.h / designH) * 0.82;
  const offsetX = drawArea.x + (drawArea.w - designW * scale) / 2;
  const offsetY = drawArea.y + (drawArea.h - designH * scale) / 2;

  const toX = x => offsetX + (x - minX) * scale;
  const toY = z => offsetY + (z - minZ) * scale;

  // ── Blueprint grid ───────────────────────────────────────────────────────
  doc.setDrawColor(210, 205, 240);
  doc.setLineWidth(0.15);
  for (let gx = 0; gx <= drawArea.w + 1; gx += 10) {
    doc.line(drawArea.x + gx, drawArea.y, drawArea.x + gx, drawArea.y + drawArea.h);
  }
  for (let gy = 0; gy <= drawArea.h + 1; gy += 10) {
    doc.line(drawArea.x, drawArea.y + gy, drawArea.x + drawArea.w, drawArea.y + gy);
  }

  // Border around draw area
  doc.setDrawColor(100, 80, 180);
  doc.setLineWidth(0.5);
  doc.rect(drawArea.x, drawArea.y, drawArea.w, drawArea.h, 'S');

  // ── Rooms ────────────────────────────────────────────────────────────────
  const roomColors = {
    living: [235, 230, 255],
    bedroom: [230, 240, 255],
    kitchen: [255, 245, 225],
    bathroom: [220, 245, 255],
    dining: [255, 240, 235],
    office: [235, 255, 235],
    garage: [245, 245, 245],
    default: [240, 238, 255],
  };

  rooms.forEach(r => {
    const rx = toX(r.x - r.width / 2);
    const ry = toY(r.z - r.length / 2);
    const rw = r.width * scale;
    const rh = r.length * scale;

    const fc = roomColors[r.type] ?? roomColors.default;
    doc.setFillColor(...fc);
    doc.setDrawColor(70, 50, 130);
    doc.setLineWidth(0.7);
    doc.rect(rx, ry, rw, rh, 'FD');

    // Hatch pattern on walls (simplified — just a thick border)
    doc.setFillColor(100, 80, 160);
    const wt = 1.5;
    doc.rect(rx, ry, rw, wt, 'F');
    doc.rect(rx, ry + rh - wt, rw, wt, 'F');
    doc.rect(rx, ry, wt, rh, 'F');
    doc.rect(rx + rw - wt, ry, wt, rh, 'F');

    // Room label
    doc.setTextColor(40, 25, 90);
    doc.setFontSize(Math.max(6, Math.min(10, rw * 0.25)));
    doc.setFont('helvetica', 'bold');
    doc.text(r.name, rx + rw / 2, ry + rh / 2 - 1.5, { align: 'center' });

    // Dimensions inside
    doc.setFontSize(Math.max(5, Math.min(7.5, rw * 0.18)));
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 60, 140);
    doc.text(`${r.width.toFixed(1)}m × ${r.length.toFixed(1)}m`, rx + rw / 2, ry + rh / 2 + 3, { align: 'center' });

    // Dimension lines
    doc.setDrawColor(140, 120, 200);
    doc.setLineWidth(0.25);
    // Top width line
    doc.line(rx, ry - 4, rx + rw, ry - 4);
    doc.line(rx, ry - 6, rx, ry - 2);
    doc.line(rx + rw, ry - 6, rx + rw, ry - 2);
    // Left height line
    doc.line(rx - 4, ry, rx - 4, ry + rh);
    doc.line(rx - 6, ry, rx - 2, ry);
    doc.line(rx - 6, ry + rh, rx - 2, ry + rh);

    // Dimension text on lines
    doc.setFontSize(5.5);
    doc.setTextColor(100, 80, 160);
    doc.text(`${r.width.toFixed(1)}m`, rx + rw / 2, ry - 5.5, { align: 'center' });
    const lbl = `${r.length.toFixed(1)}m`;
    doc.text(lbl, rx - 6, ry + rh / 2 + 2, { align: 'right' });
  });

  // ── Legend / summary ─────────────────────────────────────────────────────
  const legendY = pageH - 21;
  doc.setFillColor(18, 14, 40);
  doc.rect(0, legendY - 2, pageW, pageH - legendY + 2, 'F');

  const totalArea = rooms.reduce((s, r) => s + r.width * r.length, 0);
  const approxScale = Math.round(1000 / scale);

  doc.setTextColor(180, 160, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  const summaryItems = [
    `Rooms: ${rooms.length}`,
    `Total Floor Area: ${totalArea.toFixed(1)} m²  (${(totalArea * 10.764).toFixed(0)} sq ft)`,
    `Furniture Items: ${furniture.length}`,
    `Scale: ~1:${approxScale}`,
  ];
  const colW = pageW / summaryItems.length;
  summaryItems.forEach((txt, i) => {
    doc.text(txt, colW * i + colW / 2, legendY + 5, { align: 'center' });
  });

  doc.setTextColor(80, 60, 140);
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('ARCHCRAFT.IO — FOR PLANNING PURPOSES ONLY — CONSULT A LICENSED ARCHITECT BEFORE CONSTRUCTION', pageW / 2, legendY + 11, { align: 'center' });

  doc.save(`${projectName}-blueprint.pdf`);
}

export function saveProjectJSON(state, projectName) {
  const data = {
    version: '1.0',
    projectName,
    exportedAt: new Date().toISOString(),
    rooms: state.rooms,
    furniture: state.furniture,
    materialTier: state.materialTier,
    location: state.location,
    climate: state.climate,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(projectName || 'archcraft-project').replace(/\s+/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadProjectJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.version || !Array.isArray(data.rooms)) throw new Error('Invalid format');
        resolve(data);
      } catch {
        reject(new Error('Invalid project file — make sure it is an ARCHCRAFT .json file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
