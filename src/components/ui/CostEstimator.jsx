import { X, DollarSign, TrendingUp, Package, Hammer, Zap, Droplets } from 'lucide-react';
import useDesignStore from '../../stores/designStore';
import useUIStore from '../../stores/uiStore';

const ROOM_RATES = { bedroom: 180, living: 165, kitchen: 220, bathroom: 250, dining: 160, office: 170, garage: 95, basement: 85, laundry: 190, hallway: 120 };
const TIER_MULT = { standard: 1.0, premium: 1.4, luxury: 2.1 };

const COST_BREAKDOWN = [
  { label: 'Foundation & Structure', pct: 0.18, icon: Hammer, color: 'text-slate-400' },
  { label: 'Framing & Roofing', pct: 0.14, icon: Hammer, color: 'text-blue-400' },
  { label: 'Electrical', pct: 0.08, icon: Zap, color: 'text-amber-400' },
  { label: 'Plumbing', pct: 0.09, icon: Droplets, color: 'text-cyan-400' },
  { label: 'HVAC', pct: 0.07, icon: Zap, color: 'text-emerald-400' },
  { label: 'Insulation & Drywall', pct: 0.06, icon: Package, color: 'text-purple-400' },
  { label: 'Finishes & Materials', pct: 0.22, icon: Package, color: 'text-indigo-400' },
  { label: 'Labor', pct: 0.16, icon: Hammer, color: 'text-rose-400' },
];

function Bar({ pct, color }) {
  const bgColors = {
    'text-slate-400': 'bg-slate-400',
    'text-blue-400': 'bg-blue-400',
    'text-amber-400': 'bg-amber-400',
    'text-cyan-400': 'bg-cyan-400',
    'text-emerald-400': 'bg-emerald-400',
    'text-purple-400': 'bg-purple-400',
    'text-indigo-400': 'bg-indigo-400',
    'text-rose-400': 'bg-rose-400',
  };
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${bgColors[color]}`} style={{ width: `${pct * 100}%`, transition: 'width 0.5s ease' }} />
    </div>
  );
}

export default function CostEstimator() {
  const { toggleCost } = useUIStore();
  const { rooms, materialTier } = useDesignStore();

  const mult = TIER_MULT[materialTier] ?? 1;
  const totalCost = rooms.reduce((t, r) => t + r.width * r.length * (ROOM_RATES[r.type] ?? 150) * mult, 0);
  const totalArea = rooms.reduce((s, r) => s + r.width * r.length, 0);
  const costPerSqm = totalArea > 0 ? totalCost / totalArea : 0;
  const roiValue = totalCost * 1.28;

  return (
    <div className="fixed top-14 right-[272px] panel-enter w-76 glass rounded-xl border border-emerald-500/20 shadow-2xl flex flex-col overflow-hidden z-40 panel-enter" style={{ width: 320 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-emerald-500/10 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-white">LiveCost™ Estimator</div>
          <div className="text-[10px] text-emerald-300/70">Real-time construction cost analysis</div>
        </div>
        <button onClick={toggleCost} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Total */}
        <div className="bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/25 rounded-xl p-4">
          <div className="text-[10px] text-emerald-300/70 uppercase font-bold tracking-widest mb-1">Estimated Total</div>
          <div className="text-3xl font-black text-white">${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div className="text-xs text-emerald-400 mt-1">${costPerSqm.toFixed(0)}/m² · {materialTier} quality</div>
        </div>

        {/* Room breakdown */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">By Room</div>
          <div className="space-y-1.5">
            {rooms.map(r => {
              const roomCost = r.width * r.length * (ROOM_RATES[r.type] ?? 150) * mult;
              const pct = totalCost > 0 ? roomCost / totalCost : 0;
              return (
                <div key={r.id} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  <span className="text-xs text-slate-400 flex-1 truncate">{r.name}</span>
                  <span className="text-xs font-semibold text-white">${roomCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  <span className="text-[10px] text-slate-600 w-8 text-right">{(pct * 100).toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Construction breakdown */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Construction Breakdown</div>
          <div className="space-y-2">
            {COST_BREAKDOWN.map(item => {
              const Icon = item.icon;
              const amount = totalCost * item.pct;
              return (
                <div key={item.label}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Icon className={`w-3 h-3 ${item.color} flex-shrink-0`} />
                    <span className="text-[10px] text-slate-400 flex-1">{item.label}</span>
                    <span className="text-[10px] font-semibold text-slate-300">${(amount / 1000).toFixed(0)}k</span>
                  </div>
                  <Bar pct={item.pct} color={item.color} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ROI */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/25 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">Projected Market Value</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-black text-amber-400">${roiValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div className="text-[10px] text-amber-300/60">+28% value premium</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-400">+${(roiValue - totalCost).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div className="text-[10px] text-slate-500">equity gain</div>
            </div>
          </div>
        </div>

        <div className="text-[9px] text-slate-600 leading-relaxed">
          * Estimates based on 2024 regional averages. Actual costs vary by location, contractor, and site conditions. Get 3+ contractor quotes for accuracy.
        </div>
      </div>
    </div>
  );
}
