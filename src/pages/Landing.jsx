import { useState, useEffect } from 'react';
import {
  ArrowRight, Cpu, Globe, DollarSign, Wind, Sun, Layers, Users, Shield,
  Star, Zap, Box, Map, ChevronRight, Play, Check, Sparkles
} from 'lucide-react';

const FEATURES = [
  {
    icon: Globe,
    color: 'from-cyan-500 to-blue-500',
    glow: 'rgba(6,182,212,0.3)',
    title: 'GeoSite™',
    sub: 'Real-World Terrain',
    desc: 'Import actual topography for any location worldwide. Your design adapts to real slopes, soil, and site conditions automatically.',
    badge: 'World-first',
  },
  {
    icon: Cpu,
    color: 'from-indigo-500 to-purple-500',
    glow: 'rgba(99,102,241,0.3)',
    title: 'ArchAI™',
    sub: 'Design Intelligence',
    desc: 'Natural language design commands. "Make this open-concept," "Add Mediterranean style," or "Optimize for passive solar" — applied instantly.',
    badge: 'Exclusive',
  },
  {
    icon: Wind,
    color: 'from-teal-500 to-emerald-500',
    glow: 'rgba(16,185,129,0.3)',
    title: 'ClimateIQ™',
    sub: 'Smart Climate Design',
    desc: 'Design recommendations based on your real location\'s climate. Insulation, ventilation, window placement — all climate-optimized.',
    badge: 'Unique',
  },
  {
    icon: Sun,
    color: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.3)',
    title: 'SolarPath™',
    sub: 'Year-Round Sun Simulation',
    desc: 'Animate the exact sun position at any time of day and year, casting real shadows. Know how every room feels before you build.',
    badge: 'Live 3D',
  },
  {
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
    title: 'LiveCost™',
    sub: 'Real-Time Cost Engine',
    desc: 'Every design decision updates your cost estimate live. Material quality tiers, room-by-room breakdown, ROI projections.',
    badge: 'Live data',
  },
  {
    icon: Shield,
    color: 'from-rose-500 to-pink-500',
    glow: 'rgba(244,63,94,0.3)',
    title: 'StructureScore™',
    sub: 'Structural Intelligence',
    desc: 'Real-time structural integrity analysis as you design. Span warnings, load calculations, and engineer-grade alerts.',
    badge: 'Industry-first',
  },
];

const STATS = [
  { value: '180+', label: 'Countries Supported', icon: Globe },
  { value: '400+', label: 'Furniture Items', icon: Box },
  { value: '12', label: 'Unique AI Features', icon: Cpu },
  { value: '∞', label: 'Design Possibilities', icon: Sparkles },
];

const TESTIMONIALS = [
  {
    name: 'Marcus Chen',
    role: 'Principal Architect, Chen & Associates',
    rating: 5,
    text: 'The GeoSite terrain integration is unlike anything I\'ve seen. I can design for real hillside lots in 15 minutes. My clients are speechless.',
    avatar: 'MC',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    name: 'Sarah Kovacs',
    role: 'Real Estate Developer, Kovacs Properties',
    rating: 5,
    text: 'LiveCost™ alone saves me 6 hours per project. The ROI calculator has won me 3 investor presentations. This platform is a game-changer.',
    avatar: 'SK',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'James Whitfield',
    role: 'Interior Designer & Home Stager',
    rating: 5,
    text: 'ArchAI understands design language. I typed "Japandi minimalist with warm accents" and it transformed the entire floor plan. Incredible.',
    avatar: 'JW',
    color: 'from-amber-500 to-orange-500',
  },
];

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  return (
    <div
      className="relative group p-6 bg-card rounded-2xl border border-border hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 30% 30%, ${feature.glow}, transparent 70%)` }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
            {feature.badge}
          </span>
        </div>
        <div className="text-xl font-black text-white mb-0.5 group-hover:text-indigo-300 transition-colors">{feature.title}</div>
        <div className="text-xs font-semibold text-slate-500 mb-3">{feature.sub}</div>
        <div className="text-sm text-slate-400 leading-relaxed">{feature.desc}</div>
      </div>
    </div>
  );
}

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === '∞') { setCount('∞'); return; }
    const num = parseInt(target);
    if (isNaN(num)) { setCount(target); return; }
    let start = 0;
    const inc = num / 60;
    const timer = setInterval(() => {
      start += inc;
      if (start >= num) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start) + suffix);
    }, 16);
    return () => clearInterval(timer);
  }, [target, suffix]);
  return <span>{count}</span>;
}

export default function Landing({ onStart }) {
  const [hovered, setHovered] = useState(null);
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setTimeout(() => onStart(), 400);
  };

  return (
    <div className={`min-h-screen bg-void overflow-auto transition-opacity duration-400 ${started ? 'opacity-0' : 'opacity-100'}`}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-void/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg glow-indigo">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">ARCH<span className="text-gradient">CRAFT</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Templates', 'Pricing', 'Enterprise'].map(item => (
            <a key={item} href="#" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="text-sm text-slate-400 hover:text-white transition-colors font-medium px-4 py-2">Sign In</button>
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5"
          >
            Launch Studio
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-8 overflow-hidden noise">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-semibold mb-8 animate-pulse-slow">
            <Sparkles className="w-4 h-4" />
            The world's most advanced 3D home design platform
            <ChevronRight className="w-4 h-4" />
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tighter">
            Design homes
            <br />
            <span className="text-gradient">anywhere on Earth.</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Professional 3D home design with real terrain, AI intelligence, live cost estimation,
            climate-smart recommendations, and solar simulation. Features no other platform dares to build.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={handleStart}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-indigo-500/50 transition-all hover:-translate-y-1 glow-indigo"
            >
              <Zap className="w-5 h-5" />
              Start Designing Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-3 px-8 py-4 border border-border bg-card/50 text-white text-lg font-bold rounded-2xl hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all">
              <Play className="w-5 h-5 text-indigo-400" />
              Watch Demo
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['No credit card required', 'Browser-based · No install', '180+ countries', 'Professional export', 'AI-powered'].map(feat => (
              <div key={feat} className="flex items-center gap-1.5 text-xs text-slate-500 px-3 py-1.5 rounded-full bg-surface border border-border">
                <Check className="w-3 h-3 text-emerald-400" />
                {feat}
              </div>
            ))}
          </div>
        </div>

        {/* Preview window */}
        <div className="relative z-10 max-w-5xl mx-auto mt-16">
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-indigo-500/20">
            <div className="bg-surface border-b border-border flex items-center gap-2 px-4 py-3">
              {['#f43f5e', '#f59e0b', '#10b981'].map(c => (
                <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
              ))}
              <span className="ml-2 text-xs text-slate-500 font-mono">archcraft.io/studio · Dream Home · 3D View</span>
            </div>
            <div className="bg-[#0d0d1a] h-80 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
              <div className="absolute inset-0 bg-radial-glow opacity-40" />
              <div className="relative z-10 text-center">
                <div className="text-8xl mb-4">🏠</div>
                <div className="text-indigo-400 text-xl font-bold">3D Studio Preview</div>
                <div className="text-slate-500 text-sm mt-1">Click "Start Designing" to launch</div>
              </div>
              {/* Floating UI elements */}
              <div className="absolute top-4 right-4 glass rounded-xl p-3 w-36">
                <div className="text-[10px] text-slate-500 mb-1">StructureScore™</div>
                <div className="text-2xl font-black text-emerald-400">98%</div>
                <div className="h-1.5 bg-muted rounded-full mt-1.5">
                  <div className="h-full w-[98%] bg-emerald-400 rounded-full" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 glass rounded-xl p-3 w-44">
                <div className="text-[10px] text-slate-500 mb-1">LiveCost™ Estimate</div>
                <div className="text-xl font-black text-white">$284,500</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">+28% projected value</div>
              </div>
              <div className="absolute top-4 left-4 glass rounded-xl p-2.5">
                <div className="text-[10px] text-slate-500 mb-1">ArchAI™</div>
                <div className="text-xs text-indigo-300 font-medium">Analyzing design...</div>
                <div className="flex gap-0.5 mt-1.5">
                  {[0,1,2].map(i => <span key={i} className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-surface/50">
        <div className="max-w-4xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <div className="text-4xl font-black text-white mb-1">
                  <AnimatedCounter target={stat.value} />
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles className="w-3 h-3" />
              Features that redefine the industry
            </div>
            <h2 className="text-5xl font-black text-white mb-4">Capabilities no one else has.</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built by architects for architects. Every feature is a competitive moat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-8 bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Trusted by design professionals.</h2>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
              <span className="ml-2 text-slate-400 text-sm">4.9/5 from 2,400+ professionals</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-6 hover:border-indigo-500/30 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-black text-white mb-6">
            Your dream home starts<br /><span className="text-gradient">right now.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Join 48,000+ architects, designers, and homeowners building the future.
          </p>
          <button
            onClick={handleStart}
            className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xl font-black rounded-2xl shadow-2xl hover:shadow-indigo-500/50 transition-all hover:-translate-y-1 mx-auto glow-indigo"
          >
            <Zap className="w-6 h-6" />
            Start Designing Now — Free
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="text-sm text-slate-600 mt-4">No signup required · Instant access · Professional grade</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white">ARCH<span className="text-gradient">CRAFT</span></span>
            <span className="text-slate-600 text-sm ml-2">© 2025 · All rights reserved</span>
          </div>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact', 'Blog', 'API'].map(link => (
              <a key={link} href="#" className="text-sm text-slate-600 hover:text-white transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
