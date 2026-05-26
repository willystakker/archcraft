import { X, Wind, Thermometer, Droplets, Sun, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import useDesignStore from '../../stores/designStore';
import useUIStore from '../../stores/uiStore';

const CLIMATE_DATA = {
  tropical: {
    label: 'Tropical',
    color: 'emerald',
    temp: '26–32°C',
    humidity: '70–90%',
    rainfall: 'High (>2000mm/yr)',
    wind: '15–25 km/h',
    recommendations: [
      { icon: CheckCircle2, text: 'Elevate floor 600mm+ for flood protection', color: 'text-emerald-400' },
      { icon: CheckCircle2, text: 'Louvered windows for cross-ventilation', color: 'text-emerald-400' },
      { icon: AlertTriangle, text: 'Avoid dark roofs — increases cooling load 40%', color: 'text-amber-400' },
      { icon: CheckCircle2, text: 'Deep eaves (900mm) for rain & shade', color: 'text-emerald-400' },
      { icon: AlertTriangle, text: 'Mold-resistant materials essential', color: 'text-amber-400' },
    ],
    energyTip: 'Natural ventilation can reduce cooling costs 60%. Orient long axis east-west.',
    insulation: 'R-10 (walls) · R-15 (roof) minimum',
  },
  subtropical: {
    label: 'Subtropical',
    color: 'amber',
    temp: '20–35°C',
    humidity: '50–75%',
    rainfall: 'Moderate (800–1500mm/yr)',
    wind: '10–20 km/h',
    recommendations: [
      { icon: CheckCircle2, text: 'South-facing overhangs block summer sun', color: 'text-emerald-400' },
      { icon: AlertTriangle, text: 'West-facing windows increase cooling 35%', color: 'text-amber-400' },
      { icon: CheckCircle2, text: 'Thermal mass walls moderate temperature swings', color: 'text-emerald-400' },
      { icon: CheckCircle2, text: 'Light roof colors reduce heat absorption', color: 'text-emerald-400' },
    ],
    energyTip: 'Optimize for passive cooling — proper shading cuts AC costs in half.',
    insulation: 'R-15 (walls) · R-25 (roof)',
  },
  temperate: {
    label: 'Temperate',
    color: 'blue',
    temp: '5–25°C',
    humidity: '40–60%',
    rainfall: 'Moderate (600–1200mm/yr)',
    wind: '15–30 km/h',
    recommendations: [
      { icon: CheckCircle2, text: 'South-facing glass maximizes passive solar heat', color: 'text-emerald-400' },
      { icon: CheckCircle2, text: 'Double-pane windows minimum (triple preferred)', color: 'text-emerald-400' },
      { icon: CheckCircle2, text: 'Thermal mass absorbs day heat, releases at night', color: 'text-emerald-400' },
      { icon: AlertTriangle, text: 'Minimize north-facing windows to limit heat loss', color: 'text-amber-400' },
    ],
    energyTip: 'South window area = 7–12% of floor area for optimal passive solar.',
    insulation: 'R-20 (walls) · R-35 (roof)',
  },
  cold: {
    label: 'Cold / Arctic',
    color: 'cyan',
    temp: '-20–10°C',
    humidity: '30–55%',
    rainfall: 'Low-Moderate (300–800mm/yr)',
    wind: '20–45 km/h',
    recommendations: [
      { icon: AlertTriangle, text: 'Triple-pane windows mandatory for performance', color: 'text-rose-400' },
      { icon: AlertTriangle, text: 'Air sealing is critical — leaks dominate heat loss', color: 'text-rose-400' },
      { icon: CheckCircle2, text: 'Compact form factor reduces surface-to-volume ratio', color: 'text-emerald-400' },
      { icon: CheckCircle2, text: 'Heated crawl space prevents frozen pipes', color: 'text-emerald-400' },
      { icon: AlertTriangle, text: 'Roof designed for 150kg/m² snow load minimum', color: 'text-amber-400' },
    ],
    energyTip: 'Every R-1 of additional insulation saves ~3% on heating costs annually.',
    insulation: 'R-40 (walls) · R-60 (roof) — critical',
  },
};

const SOLAR_DATA = {
  south: { label: 'South (Recommended)', gain: 95, color: 'text-amber-400' },
  east: { label: 'East (Morning Sun)', gain: 65, color: 'text-orange-400' },
  west: { label: 'West (Afternoon Sun)', gain: 55, color: 'text-rose-400' },
  north: { label: 'North (Minimal Gain)', gain: 15, color: 'text-blue-400' },
};

export default function ClimatePanel() {
  const { toggleClimate } = useUIStore();
  const { location, climate, rooms } = useDesignStore();

  const zone = climate?.zone ?? 'temperate';
  const data = CLIMATE_DATA[zone];

  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300' },
  };
  const c = colorMap[data?.color] ?? colorMap.blue;

  return (
    <div className="fixed top-14 right-[272px] panel-enter w-80 glass rounded-xl border border-cyan-500/20 shadow-2xl flex flex-col overflow-hidden z-40 panel-enter">
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-border ${c.bg} flex-shrink-0`}>
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Wind className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-white">ClimateIQ™</div>
          <div className="text-[10px] text-cyan-300/70">
            {location ? `${location.city}, ${location.country}` : 'Climate Intelligence Engine'}
          </div>
        </div>
        <button onClick={toggleClimate} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Climate Zone */}
        <div className={`${c.bg} border ${c.border} rounded-xl p-3`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">Climate Zone</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{data?.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Thermometer, label: 'Temperature', val: data?.temp },
              { icon: Droplets, label: 'Humidity', val: data?.humidity },
              { icon: Wind, label: 'Wind', val: data?.wind },
              { icon: Sun, label: 'Rainfall', val: data?.rainfall },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-1.5">
                  <Icon className={`w-3 h-3 ${c.text} flex-shrink-0`} />
                  <div>
                    <div className="text-[9px] text-slate-600">{item.label}</div>
                    <div className="text-[10px] text-slate-300">{item.val}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Solar Orientation */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Solar Gain by Orientation</div>
          <div className="space-y-1.5">
            {Object.entries(SOLAR_DATA).map(([dir, info]) => (
              <div key={dir} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 w-20 truncate">{info.label}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${info.gain > 80 ? 'bg-amber-400' : info.gain > 50 ? 'bg-orange-400' : info.gain > 30 ? 'bg-rose-400' : 'bg-blue-400'}`}
                    style={{ width: `${info.gain}%` }}
                  />
                </div>
                <span className={`text-[10px] font-semibold w-8 text-right ${info.color}`}>{info.gain}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Design Recommendations */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Design Recommendations</div>
          <div className="space-y-1.5">
            {data?.recommendations.map((rec, i) => {
              const Icon = rec.icon;
              return (
                <div key={i} className="flex gap-2 items-start">
                  <Icon className={`w-3.5 h-3.5 ${rec.color} flex-shrink-0 mt-0.5`} />
                  <span className="text-[11px] text-slate-400 leading-relaxed">{rec.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Energy tip */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
          <div className="flex gap-2 items-start">
            <Zap className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-bold text-indigo-300 mb-0.5">Energy Optimization Tip</div>
              <div className="text-[11px] text-slate-400 leading-relaxed">{data?.energyTip}</div>
            </div>
          </div>
        </div>

        {/* Insulation */}
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Recommended Insulation</div>
          <div className="text-xs text-white font-mono">{data?.insulation}</div>
        </div>

        {!location && (
          <button
            onClick={useUIStore.getState().toggleLocation}
            className="w-full py-2.5 rounded-xl border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/10 transition-all"
          >
            Set Location for Precise Analysis
          </button>
        )}
      </div>
    </div>
  );
}
