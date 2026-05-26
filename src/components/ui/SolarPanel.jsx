import { X, Sun, Clock, Compass } from 'lucide-react';
import useUIStore from '../../stores/uiStore';

export default function SolarPanel() {
  const { toggleSolar, sunTime, sunAngle, setSunTime, setSunAngle } = useUIStore();

  const hour = Math.round(sunTime);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const timeStr = `${displayHour}:00 ${ampm}`;

  const directions = [
    { deg: 0, label: 'N' }, { deg: 45, label: 'NE' }, { deg: 90, label: 'E' },
    { deg: 135, label: 'SE' }, { deg: 180, label: 'S' }, { deg: 225, label: 'SW' },
    { deg: 270, label: 'W' }, { deg: 315, label: 'NW' },
  ];

  const warmth = 1 - Math.abs(sunTime - 12) / 8;
  const intensity = Math.max(0, Math.sin(((sunTime - 6) / 12) * Math.PI));
  const sunColor = intensity > 0.7
    ? '#fffde8'
    : intensity > 0.3
    ? '#ffe082'
    : '#ff8a65';

  return (
    <div className="fixed top-14 left-[232px] w-72 glass rounded-xl border border-amber-500/20 shadow-2xl overflow-hidden z-40 panel-enter">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-amber-500/10 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
          <Sun className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-white">SolarPath™ Simulation</div>
          <div className="text-[10px] text-amber-300/70">Real-time sun position & shadow casting</div>
        </div>
        <button onClick={toggleSolar} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Sun display */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{
            background: `radial-gradient(circle, ${sunColor}, transparent)`,
            boxShadow: `0 0 30px ${sunColor}60`,
          }}>
            <Sun className="w-8 h-8" style={{ color: sunColor }} />
          </div>
          <div>
            <div className="text-xl font-black text-white">{timeStr}</div>
            <div className="text-xs text-amber-400">
              Intensity: {Math.round(intensity * 100)}%
            </div>
            <div className="text-[10px] text-slate-500">
              {sunTime < 6 ? 'Pre-dawn' : sunTime < 10 ? 'Morning' : sunTime < 14 ? 'Midday' : sunTime < 18 ? 'Afternoon' : 'Evening'}
            </div>
          </div>
        </div>

        {/* Time slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time of Day</span>
            </div>
            <span className="text-xs font-semibold text-amber-400">{timeStr}</span>
          </div>
          <input
            type="range"
            min={0}
            max={24}
            step={0.5}
            value={sunTime}
            onChange={e => setSunTime(+e.target.value)}
            className="w-full"
            style={{ accentColor: sunColor }}
          />
          <div className="flex justify-between text-[9px] text-slate-600 mt-0.5">
            <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span>
          </div>
        </div>

        {/* Azimuth */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sun Azimuth</span>
            </div>
            <span className="text-xs font-semibold text-amber-400">{sunAngle}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={sunAngle}
            onChange={e => setSunAngle(+e.target.value)}
            className="w-full"
          />
          <div className="grid grid-cols-4 gap-1 mt-2">
            {directions.filter((_, i) => i % 2 === 0).map(d => (
              <button
                key={d.label}
                onClick={() => setSunAngle(d.deg)}
                className={`py-1 rounded text-[10px] font-bold transition-all ${
                  Math.abs(sunAngle - d.deg) < 25 ? 'bg-amber-500/25 text-amber-300' : 'bg-card text-slate-500 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick time presets */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Dawn', time: 6.5, icon: '🌅' },
            { label: 'Noon', time: 12, icon: '☀️' },
            { label: 'Dusk', time: 18, icon: '🌇' },
            { label: 'Night', time: 0, icon: '🌙' },
          ].map(preset => (
            <button
              key={preset.label}
              onClick={() => setSunTime(preset.time)}
              className={`py-2 rounded-lg border text-[10px] font-medium text-center transition-all ${
                Math.abs(sunTime - preset.time) < 1
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                  : 'border-border text-slate-500 hover:text-white hover:bg-muted'
              }`}
            >
              <div>{preset.icon}</div>
              <div>{preset.label}</div>
            </button>
          ))}
        </div>

        <div className="text-[10px] text-slate-600 text-center">
          Shadows update live in 3D view. Set location for accurate seasonal data.
        </div>
      </div>
    </div>
  );
}
