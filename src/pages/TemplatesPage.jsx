import { useState } from 'react';
import { ArrowRight, Zap, Search, Star, Eye, Box, DollarSign, Maximize2, Sparkles, Filter } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'modern-villa',
    name: 'Modern Villa',
    style: 'Contemporary',
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    cost: '$480k',
    rating: 4.9,
    reviews: 312,
    badge: 'Most Popular',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    tags: ['Open Concept', 'Pool Ready', 'Smart Home'],
    accent: 'from-indigo-500 to-cyan-500',
    bg: 'from-indigo-950/80 to-slate-950',
    emoji: '🏛️',
    desc: 'Clean lines, floor-to-ceiling glass, and flowing indoor-outdoor spaces define this iconic contemporary layout.',
    rooms: ['Living Room', 'Master Suite', 'Guest Rooms ×2', 'Open Kitchen', 'Home Office', 'Garage'],
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    style: 'Mediterranean',
    bedrooms: 5,
    bathrooms: 4,
    area: 410,
    cost: '$590k',
    rating: 4.8,
    reviews: 198,
    badge: 'Architect Fav',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    tags: ['Courtyard', 'Archways', 'Terracotta'],
    accent: 'from-amber-500 to-orange-500',
    bg: 'from-amber-950/80 to-slate-950',
    emoji: '🏺',
    desc: 'Warm stucco walls, arched doorways, and a central courtyard bring timeless Mediterranean character.',
    rooms: ['Grand Entry', 'Courtyard', 'Living Suite', 'Chef Kitchen', 'Guest Wing', 'Rooftop Terrace'],
  },
  {
    id: 'craftsman',
    name: 'Craftsman Bungalow',
    style: 'Craftsman',
    bedrooms: 3,
    bathrooms: 2,
    area: 195,
    cost: '$285k',
    rating: 4.9,
    reviews: 445,
    badge: 'Best Value',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    tags: ['Cozy', 'Wrap Porch', 'Built-ins'],
    accent: 'from-emerald-500 to-teal-500',
    bg: 'from-emerald-950/80 to-slate-950',
    emoji: '🌲',
    desc: 'Tapered columns, exposed rafter tails, and handcrafted character give this plan timeless warmth.',
    rooms: ['Wrap Porch', 'Great Room', 'Dining', 'Kitchen', 'Master Suite', 'Two Bedrooms'],
  },
  {
    id: 'minimalist',
    name: 'Minimalist Cube',
    style: 'Minimalist',
    bedrooms: 3,
    bathrooms: 2,
    area: 220,
    cost: '$340k',
    rating: 4.7,
    reviews: 267,
    badge: 'New',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    tags: ['Flat Roof', 'Zen', 'Concrete'],
    accent: 'from-slate-400 to-slate-600',
    bg: 'from-slate-900 to-slate-950',
    emoji: '⬜',
    desc: 'Radical simplicity. Every element earns its place in this curated, distraction-free living space.',
    rooms: ['Entry Hall', 'Living Loft', 'Open Kitchen', 'Master Suite', 'Study', 'Zen Garden'],
  },
  {
    id: 'colonial',
    name: 'Classic Colonial',
    style: 'Colonial',
    bedrooms: 4,
    bathrooms: 3,
    area: 290,
    cost: '$395k',
    rating: 4.8,
    reviews: 381,
    badge: 'Classic',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    tags: ['Symmetrical', 'Grand Entry', 'Historic'],
    accent: 'from-rose-500 to-pink-500',
    bg: 'from-rose-950/80 to-slate-950',
    emoji: '🏛',
    desc: 'Stately symmetry, columned portico, and formal room proportions honor America\'s most enduring architectural tradition.',
    rooms: ['Formal Entry', 'Parlor', 'Formal Dining', 'Family Kitchen', 'Master + 3BR', 'Mudroom'],
  },
  {
    id: 'barn-house',
    name: 'Modern Barn House',
    style: 'Farmhouse',
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    cost: '$520k',
    rating: 4.9,
    reviews: 523,
    badge: 'Trending',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    tags: ['Barnwood', 'Vaulted', 'Shiplap'],
    accent: 'from-cyan-500 to-blue-500',
    bg: 'from-cyan-950/80 to-slate-950',
    emoji: '🌾',
    desc: 'Vaulted ceilings, board-and-batten siding, and a dramatic central ridge define this modern farmhouse icon.',
    rooms: ['Great Hall', 'Chef Kitchen', 'Mudroom + Pantry', 'Master Loft', 'Guest Wing', 'Wraparound Porch'],
  },
  {
    id: 'japanese',
    name: 'Japandi Retreat',
    style: 'Japandi',
    bedrooms: 3,
    bathrooms: 2,
    area: 210,
    cost: '$310k',
    rating: 4.8,
    reviews: 189,
    badge: 'Award Winner',
    badgeColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    tags: ['Wabi-sabi', 'Engawa', 'Tatami'],
    accent: 'from-violet-500 to-purple-500',
    bg: 'from-violet-950/80 to-slate-950',
    emoji: '⛩️',
    desc: 'The harmony of Japanese restraint and Scandinavian warmth. Every space breathes with intentional calm.',
    rooms: ['Entry Hall', 'Tea Room', 'Living Space', 'Kitchen', 'Master Suite', 'Garden Deck'],
  },
  {
    id: 'luxury-penthouse',
    name: 'Sky Penthouse',
    style: 'Luxury',
    bedrooms: 3,
    bathrooms: 3,
    area: 460,
    cost: '$1.2M',
    rating: 5.0,
    reviews: 97,
    badge: '5-Star',
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    tags: ['360° Views', 'Rooftop Pool', 'Smart Home'],
    accent: 'from-yellow-400 to-amber-500',
    bg: 'from-yellow-950/80 to-slate-950',
    emoji: '🌆',
    desc: 'Floor-to-ceiling glass wraps a sky-high sanctuary. Wine cellar, rooftop pool, and a grand piano room included.',
    rooms: ['Grand Foyer', 'Great Room', 'Master Retreat', '2 Guest Suites', 'Chef Kitchen', 'Rooftop Terrace'],
  },
  {
    id: 'off-grid',
    name: 'Off-Grid Cabin',
    style: 'Eco',
    bedrooms: 2,
    bathrooms: 1,
    area: 115,
    cost: '$155k',
    rating: 4.9,
    reviews: 614,
    badge: 'Eco-Certified',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    tags: ['Solar Ready', 'Rainwater', 'Passive Design'],
    accent: 'from-green-500 to-emerald-500',
    bg: 'from-green-950/80 to-slate-950',
    emoji: '🌿',
    desc: 'Fully self-sufficient design. Passive solar, rainwater collection, and composting systems built into the floor plan.',
    rooms: ['Living/Kitchen', 'Main Bedroom', 'Bunk Room', 'Utility/Storage', 'Solar Deck', 'Rain Garden'],
  },
];

const STYLES = ['All', 'Contemporary', 'Mediterranean', 'Craftsman', 'Minimalist', 'Colonial', 'Farmhouse', 'Japandi', 'Luxury', 'Eco'];

function TemplateCard({ template, onUse }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ boxShadow: hovered ? `0 20px 60px rgba(99,102,241,0.15)` : undefined }}
    >
      {/* Preview area */}
      <div className={`relative h-52 bg-gradient-to-br ${template.bg} overflow-hidden flex items-center justify-center`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        {/* Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${template.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        {/* Emoji */}
        <div className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-300">{template.emoji}</div>
        {/* Badge */}
        <div className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border ${template.badgeColor}`}>
          {template.badge}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onUse(template)}
            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${template.accent} text-white text-xs font-bold rounded-xl shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300`}>
            <Zap className="w-3.5 h-3.5" />
            Use Template
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="font-bold text-white text-sm">{template.name}</div>
            <div className="text-xs text-slate-500">{template.style}</div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs text-slate-400 font-semibold">{template.rating}</span>
            <span className="text-xs text-slate-600">({template.reviews})</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{template.desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-slate-500">{t}</span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Box className="w-3 h-3" />{template.bedrooms} bd</span>
            <span>{template.bathrooms} ba</span>
            <span><Maximize2 className="w-3 h-3 inline mr-1" />{template.area}m²</span>
          </div>
          <span className="text-xs font-bold text-emerald-400">{template.cost}</span>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage({ onStart }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = TEMPLATES.filter(t => {
    const matchStyle = filter === 'All' || t.style === filter;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.style.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchStyle && matchSearch;
  });

  const handleUse = (template) => {
    onStart(template.id);
  };

  return (
    <div className="min-h-screen bg-void overflow-auto">
      {/* Hero */}
      <section className="relative pt-40 pb-20 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold mb-6 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              {TEMPLATES.length} Professional Templates
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4 leading-none tracking-tighter">
              Start from<br />
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">perfection.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Architect-designed starting points. Fully editable in the studio. One click to launch.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
              {['All', 'Luxury', 'Eco', 'Farmhouse'].map(s => (
                <button key={s} onClick={() => setFilter(s === filter ? 'All' : s)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${filter === s ? 'bg-indigo-500 text-white' : 'bg-card border border-border text-slate-400 hover:text-white'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Style filter pills */}
      <section className="px-8 pb-8 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          {STYLES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-4 py-2 rounded-full font-medium transition-all ${filter === s ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-card border border-border text-slate-400 hover:border-indigo-500/40 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-8 pb-24 max-w-6xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-lg font-semibold">No templates match your search</div>
            <button onClick={() => { setFilter('All'); setSearch(''); }} className="mt-4 text-indigo-400 text-sm hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(t => (
              <TemplateCard key={t.id} template={t} onUse={handleUse} />
            ))}
          </div>
        )}
      </section>

      {/* Custom CTA */}
      <section className="py-20 px-8 border-t border-border bg-surface/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-4">✏️</div>
          <h2 className="text-3xl font-black text-white mb-4">Don't see what you need?</h2>
          <p className="text-slate-400 mb-8">Start from a blank canvas and let ArchAI™ generate a custom layout from your description. Takes 30 seconds.</p>
          <button onClick={() => onStart()}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5 mx-auto">
            <Zap className="w-5 h-5" />
            Start Blank Design
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
