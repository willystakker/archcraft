import * as THREE from 'three';

const cache = new Map();

function getOrCreate(key, factory) {
  if (cache.has(key)) return cache.get(key);
  const tex = factory();
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  cache.set(key, tex);
  return tex;
}

// ─── Hardwood Floor ──────────────────────────────────────────────────────────
function makeHardwood(baseColor = '#c4a882') {
  return getOrCreate(`hardwood_${baseColor}`, () => {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    const plankH = 80;
    const planks = size / plankH;
    const shades = ['#d4b892', '#c4a882', '#b89472', '#cc9e7a', '#a8885e'];
    for (let p = 0; p < planks; p++) {
      const offset = (p % 2) * 200;
      const plankW = 180 + (p * 37) % 100;
      for (let x = offset; x < size + plankW; x += plankW) {
        const shade = shades[(p + Math.floor(x / plankW)) % shades.length];
        ctx.fillStyle = shade;
        ctx.fillRect(x, p * plankH, plankW - 2, plankH - 2);
        // grain lines
        ctx.strokeStyle = 'rgba(80,50,20,0.08)';
        ctx.lineWidth = 0.8;
        for (let g = 5; g < plankH - 5; g += 12) {
          ctx.beginPath();
          ctx.moveTo(x, p * plankH + g);
          const cp1x = x + plankW * 0.3, cp1y = p * plankH + g + (Math.sin(x + g) * 3);
          const cp2x = x + plankW * 0.7, cp2y = p * plankH + g + (Math.cos(x + g) * 3);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x + plankW - 2, p * plankH + g);
          ctx.stroke();
        }
        // knots
        if ((p * 7 + Math.floor(x / plankW) * 3) % 11 === 0) {
          const kx = x + plankW * 0.4, ky = p * plankH + plankH * 0.5;
          const grad = ctx.createRadialGradient(kx, ky, 1, kx, ky, 10);
          grad.addColorStop(0, 'rgba(80,50,20,0.3)');
          grad.addColorStop(1, 'rgba(80,50,20,0)');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(kx, ky, 10, 0, Math.PI * 2); ctx.fill();
        }
      }
      // plank separator
      ctx.fillStyle = 'rgba(60,40,20,0.25)';
      ctx.fillRect(0, p * plankH - 1, size, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.repeat.set(2, 2);
    return tex;
  });
}

// ─── Carpet ──────────────────────────────────────────────────────────────────
function makeCarpet(baseColor = '#9a8aaa') {
  return getOrCreate(`carpet_${baseColor}`, () => {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      const br = Math.random() * 0.25 - 0.1;
      ctx.fillStyle = `rgba(${br > 0 ? 255 : 0},${br > 0 ? 255 : 0},${br > 0 ? 255 : 0},${Math.abs(br)})`;
      ctx.fillRect(x, y, 2, 3);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.repeat.set(3, 3);
    return tex;
  });
}

// ─── Tile ─────────────────────────────────────────────────────────────────────
function makeTile(baseColor = '#d8d4cc') {
  return getOrCreate(`tile_${baseColor}`, () => {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    const tileSize = 128;
    const grout = 4;
    ctx.fillStyle = '#b0a898';
    ctx.fillRect(0, 0, size, size);
    for (let row = 0; row < size / tileSize; row++) {
      for (let col = 0; col < size / tileSize; col++) {
        const x = col * tileSize + grout;
        const y = row * tileSize + grout;
        const w = tileSize - grout * 2;
        const h = tileSize - grout * 2;
        const variation = (row + col) % 2 === 0 ? 10 : -5;
        const r = parseInt(baseColor.slice(1, 3), 16) + variation;
        const g = parseInt(baseColor.slice(3, 5), 16) + variation;
        const b = parseInt(baseColor.slice(5, 7), 16) + variation;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, y, w, h);
        // highlight
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(x, y, w, 8);
        ctx.fillRect(x, y, 8, h);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.repeat.set(2, 2);
    return tex;
  });
}

// ─── Marble ──────────────────────────────────────────────────────────────────
function makeMarble() {
  return getOrCreate('marble', () => {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#e8e4dc';
    ctx.fillRect(0, 0, size, size);
    // veins
    for (let v = 0; v < 8; v++) {
      ctx.strokeStyle = `rgba(${150 + v * 10},${145 + v * 8},${135 + v * 5},0.25)`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      const sx = Math.random() * size, sy = Math.random() * size;
      ctx.moveTo(sx, sy);
      for (let s = 0; s < 6; s++) {
        ctx.quadraticCurveTo(
          Math.random() * size, Math.random() * size,
          Math.random() * size, Math.random() * size
        );
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.repeat.set(1, 1);
    return tex;
  });
}

// ─── Concrete ────────────────────────────────────────────────────────────────
function makeConcrete() {
  return getOrCreate('concrete', () => {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#909090';
    ctx.fillRect(0, 0, size, size);
    const id = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < id.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      id.data[i] = Math.min(255, Math.max(0, id.data[i] + noise));
      id.data[i + 1] = Math.min(255, Math.max(0, id.data[i + 1] + noise));
      id.data[i + 2] = Math.min(255, Math.max(0, id.data[i + 2] + noise));
    }
    ctx.putImageData(id, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.repeat.set(2, 2);
    return tex;
  });
}

// ─── Brick ───────────────────────────────────────────────────────────────────
function makeBrick() {
  return getOrCreate('brick', () => {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#8a7060';
    ctx.fillRect(0, 0, size, size);
    const bw = 100, bh = 42, mortar = 4;
    const rows = Math.ceil(size / bh);
    const brickColors = ['#9a7060', '#8a6050', '#aa8070', '#905848'];
    for (let row = 0; row < rows; row++) {
      const offset = (row % 2) * (bw / 2);
      for (let x = -bw + offset; x < size + bw; x += bw + mortar) {
        const color = brickColors[Math.floor(Math.random() * brickColors.length)];
        ctx.fillStyle = color;
        ctx.fillRect(x, row * (bh + mortar), bw, bh);
        // highlight
        ctx.fillStyle = 'rgba(255,200,150,0.1)';
        ctx.fillRect(x, row * (bh + mortar), bw, 6);
        // shadow
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(x, row * (bh + mortar) + bh - 4, bw, 4);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.repeat.set(1, 2);
    return tex;
  });
}

// ─── Wood Panel ───────────────────────────────────────────────────────────────
function makeWoodPanel() {
  return getOrCreate('woodpanel', () => {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    const plankW = 80;
    const shades = ['#8b6b4b', '#7a5a3a', '#9b7b5b', '#856545'];
    for (let col = 0; col < size / plankW; col++) {
      ctx.fillStyle = shades[col % shades.length];
      ctx.fillRect(col * plankW, 0, plankW - 2, size);
      for (let g = 10; g < size; g += 25) {
        ctx.strokeStyle = 'rgba(40,20,5,0.07)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(col * plankW, g);
        ctx.lineTo(col * plankW + plankW - 2, g + (Math.sin(col + g) * 5));
        ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.repeat.set(1, 2);
    return tex;
  });
}

// ─── Paint (slight texture) ───────────────────────────────────────────────────
function makePaint(color = '#f0ebe3') {
  return getOrCreate(`paint_${color}`, () => {
    const size = 128;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
    const id = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < id.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 8;
      id.data[i] = Math.min(255, Math.max(0, id.data[i] + n));
      id.data[i + 1] = Math.min(255, Math.max(0, id.data[i + 1] + n));
      id.data[i + 2] = Math.min(255, Math.max(0, id.data[i + 2] + n));
    }
    ctx.putImageData(id, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.repeat.set(4, 4);
    return tex;
  });
}

// ─── Rubber (gym floor) ──────────────────────────────────────────────────────
function makeRubber() {
  return getOrCreate('rubber', () => {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 80 : 20},${Math.random() > 0.5 ? 80 : 20},${Math.random() > 0.5 ? 80 : 20},0.6)`;
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size, 2 + Math.random() * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.repeat.set(3, 3);
    return tex;
  });
}

export const FLOOR_TEXTURES = {
  hardwood: () => makeHardwood(),
  carpet: () => makeCarpet(),
  tile: () => makeTile(),
  marble: () => makeMarble(),
  concrete: () => makeConcrete(),
  rubber: () => makeRubber(),
  vinyl: () => makeTile('#c8c0b8'),
};

export const WALL_TEXTURES = {
  paint: (color) => makePaint(color),
  tile: () => makeTile('#e0dcd8'),
  brick: () => makeBrick(),
  wood: () => makeWoodPanel(),
  drywall: (color) => makePaint(color || '#f0ede8'),
  acoustic: () => makeCarpet('#3a3a3a'),
  wallpaper: (color) => makePaint(color),
};

export function clearTextureCache() {
  cache.forEach(t => t.dispose());
  cache.clear();
}
