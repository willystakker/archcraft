import { useState } from 'react';
import { X, MapPin, Search, Globe, Loader2 } from 'lucide-react';
import useDesignStore from '../../stores/designStore';
import useUIStore from '../../stores/uiStore';

const POPULAR = [
  { city: 'New York', country: 'USA', lat: 40.7, lng: -74.0, climate: 'temperate', flag: '🇺🇸' },
  { city: 'Dubai', country: 'UAE', lat: 25.2, lng: 55.3, climate: 'subtropical', flag: '🇦🇪' },
  { city: 'London', country: 'UK', lat: 51.5, lng: -0.1, climate: 'temperate', flag: '🇬🇧' },
  { city: 'Sydney', country: 'Australia', lat: -33.9, lng: 151.2, climate: 'subtropical', flag: '🇦🇺' },
  { city: 'Tokyo', country: 'Japan', lat: 35.7, lng: 139.7, climate: 'temperate', flag: '🇯🇵' },
  { city: 'Singapore', country: 'Singapore', lat: 1.3, lng: 103.8, climate: 'tropical', flag: '🇸🇬' },
  { city: 'Oslo', country: 'Norway', lat: 59.9, lng: 10.7, climate: 'cold', flag: '🇳🇴' },
  { city: 'Miami', country: 'USA', lat: 25.8, lng: -80.2, climate: 'subtropical', flag: '🇺🇸' },
  { city: 'Paris', country: 'France', lat: 48.9, lng: 2.3, climate: 'temperate', flag: '🇫🇷' },
  { city: 'Cape Town', country: 'South Africa', lat: -33.9, lng: 18.4, climate: 'subtropical', flag: '🇿🇦' },
  { city: 'Toronto', country: 'Canada', lat: 43.7, lng: -79.4, climate: 'cold', flag: '🇨🇦' },
  { city: 'Mumbai', country: 'India', lat: 19.1, lng: 72.9, climate: 'tropical', flag: '🇮🇳' },
];

const CLIMATE_LABELS = {
  tropical: { label: 'Tropical', color: 'text-emerald-400 bg-emerald-500/15' },
  subtropical: { label: 'Subtropical', color: 'text-amber-400 bg-amber-500/15' },
  temperate: { label: 'Temperate', color: 'text-blue-400 bg-blue-500/15' },
  cold: { label: 'Cold', color: 'text-cyan-400 bg-cyan-500/15' },
};

export default function LocationPicker() {
  const { toggleLocation } = useUIStore();
  const { setLocation, location } = useDesignStore();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const filtered = search
    ? POPULAR.filter(c => c.city.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()))
    : POPULAR;

  const handleSelect = async (loc) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLocation(loc);
    setLoading(false);
    toggleLocation();
    useUIStore.getState().notify(`Location set: ${loc.city}, ${loc.country}`, 'success');
  };

  const handleManual = () => {
    const manual = { city: search || 'Custom Location', country: 'Custom', lat: 35, lng: 0 };
    handleSelect(manual);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[480px] glass rounded-2xl border border-indigo-500/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-indigo-500/10">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">GeoSite™ Location Engine</div>
            <div className="text-[11px] text-indigo-300/70">Design anywhere in the world with real terrain & climate data</div>
          </div>
          <button onClick={toggleLocation} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Current */}
          {location && (
            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="flex-1 text-xs text-emerald-300">
                Currently set: <span className="font-bold text-white">{location.city}, {location.country}</span>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleManual()}
              placeholder="Search city or country..."
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-3 text-sm text-white outline-none focus:border-indigo-500/60 transition-all placeholder-slate-600"
              autoFocus
            />
            {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 animate-spin" />}
          </div>

          {/* City grid */}
          <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
            {filtered.map(loc => {
              const cl = CLIMATE_LABELS[loc.climate];
              return (
                <button
                  key={`${loc.city}-${loc.country}`}
                  onClick={() => handleSelect(loc)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border hover:border-indigo-500/40 bg-card hover:bg-indigo-500/10 text-left transition-all group"
                >
                  <span className="text-xl">{loc.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">{loc.city}</div>
                    <div className="text-[10px] text-slate-500">{loc.country}</div>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cl?.color} flex-shrink-0`}>
                    {cl?.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-slate-600">or enter coordinates</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            onClick={handleManual}
            className="w-full py-2.5 rounded-xl border border-indigo-500/30 text-indigo-400 text-xs font-semibold hover:bg-indigo-500/10 transition-all"
          >
            Use Custom Location: "{search || 'Enter city name above'}"
          </button>
        </div>
      </div>
    </div>
  );
}
