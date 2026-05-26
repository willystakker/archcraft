import { useState } from 'react';
import {
  Globe, Cpu, Wind, Sun, DollarSign, Shield, Box, Layers,
  ArrowRight, Check, X, Zap, ChevronDown, Play, Star,
  Footprints, Download, FileText, Map, Sparkles, Eye
} from 'lucide-react';

const FEATURES = [
  {
    id: 'geosite',
    icon: Globe,
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'cyan',
    badge: 'World-First',
    title: 'GeoSite™',
    tagline: 'Real-World Terrain Intelligence',
    headline: 'Your design, on real ground.',
    desc: 'Import actual topography for any location on Earth. Slopes, elevation changes, and soil conditions are baked directly into your model — no guesswork, no flat planes.',
    bullets: [
      'Real USGS + OpenTopo elevation data for 180+ countries',
      'Auto-adapts foundations to terrain grade',
      'Contour line visualization in 2D floor plan',
      'Site boundary import from property records',
    ],
    stat: { value: '180+', label: 'Countries' },
    rival: 'No competitor offers terrain-aware design at this level.',
  },
  {
    id: 'archai',
    icon: Cpu,
    gradient: 'from-indigo-500 to-violet-600',
    glow: 'indigo',
    badge: 'Exclusive',
    title: 'ArchAI™',
    tagline: 'Natural Language Design Engine',
    headline: 'Describe it. Watch it appear.',
    desc: 'ArchAI understands architectural language fluently. Type natural commands and watch your design transform in real-time — no menus, no tutorials.',
    bullets: [
      '"Open-concept kitchen flowing into living room"',
      '"Mediterranean style with terracotta and arches"',
      '"Optimize window placement for passive solar gain"',
      '"Add a master suite with en-suite and walk-in"',
    ],
    stat: { value: '12', label: 'AI Commands' },
    rival: 'Planner 5D has zero AI. RoomSketcher has zero AI.',
  },
  {
    id: 'climateiq',
    icon: Wind,
    gradient: 'from-teal-500 to-emerald-600',
    glow: 'emerald',
    badge: 'Unique',
    title: 'ClimateIQ™',
    tagline: 'Climate-Smart Design Recommendations',
    headline: 'Design for where it actually lives.',
    desc: 'Real climate data for your exact location feeds intelligent recommendations. Your design adapts to heat, humidity, wind patterns, and rainfall — not generic best practices.',
    bullets: [
      'Real-time weather API integration per location',
      'Insulation thickness recommendations by climate zone',
      'Window orientation optimized for prevailing winds',
      'Roof pitch recommendations for local rainfall intensity',
    ],
    stat: { value: '24/7', label: 'Live Weather' },
    rival: 'No other design platform integrates live climate data.',
  },
  {
    id: 'solarpath',
    icon: Sun,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'amber',
    badge: 'Live 3D',
    title: 'SolarPath™',
    tagline: 'Year-Round Sun & Shadow Simulation',
    headline: 'See every shadow before you break ground.',
    desc: 'Animate the exact solar path for your coordinates on any day of the year. Watch shadows sweep across your design and know exactly how each room feels at every hour.',
    bullets: [
      'Precise solar angle calculation by GPS coordinates',
      'Time-of-day and season animation',
      'Shadow casting on neighboring structures',
      'South-facing optimization recommendations',
    ],
    stat: { value: '365', label: 'Days simulated' },
    rival: 'Rivals offer static sun arrows. We animate the full solar year.',
  },
  {
    id: 'livecost',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'emerald',
    badge: 'Live Data',
    title: 'LiveCost™',
    tagline: 'Real-Time Construction Cost Engine',
    headline: 'Every decision updates your budget instantly.',
    desc: 'Professional cost estimation that recalculates with every change you make. Tied to real material costs, regional labor rates, and project complexity factors.',
    bullets: [
      'Room-by-room cost breakdown in real-time',
      'Standard / Premium / Luxury material tiers',
      'Regional labor rate adjustments',
      'ROI projection vs. comparable homes',
    ],
    stat: { value: '$0', label: 'Surprises' },
    rival: 'Competitors charge $200/mo for basic cost tools. Ours is free.',
  },
  {
    id: 'structure',
    icon: Shield,
    gradient: 'from-rose-500 to-pink-600',
    glow: 'rose',
    badge: 'Industry-First',
    title: 'StructureScore™',
    tagline: 'Live Structural Integrity Analysis',
    headline: 'Build confidently. Flag problems early.',
    desc: 'As you design, StructureScore analyzes your structure in real-time. Span lengths, load paths, wall height ratios — flagged before an engineer ever sees the plans.',
    bullets: [
      'Span-to-depth ratio warnings on long beams',
      'Load-bearing wall detection and alerts',
      'Room height structural analysis',
      'Automated structural summary report',
    ],
    stat: { value: '100%', label: 'Integrity score' },
    rival: 'No other consumer design platform does structural analysis.',
  },
];

const EXPORTS = [
  { icon: FileText, label: 'PDF Blueprint', desc: 'A3, dimension lines, legend, scale bar', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { icon: Box, label: 'GLTF 3D Model', desc: 'Blender, SketchUp, Unity, Unreal', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { icon: Eye, label: 'PNG Screenshot', desc: 'High-res 3D render, any angle', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Download, label: 'Project JSON', desc: 'Full save/load, share with clients', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Footprints, label: 'Walk Mode', desc: 'First-person WASD client walkthrough', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Map, label: 'Share Link', desc: 'Instant shareable 3D viewer URL', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
];

const COMPARE = [
  { feature: 'Terrain Import (Real GPS)', archcraft: true, planner: false, roomsketcher: false },
  { feature: 'AI Natural Language Commands', archcraft: true, planner: false, roomsketcher: false },
  { feature: 'Live Climate Intelligence', archcraft: true, planner: false, roomsketcher: false },
  { feature: 'Solar Path Animation', archcraft: true, planner: false, roomsketcher: false },
  { feature: 'Real-Time Cost Estimation', archcraft: true, planner: false, roomsketcher: 'Paid' },
  { feature: 'Structural Score Analysis', archcraft: true, planner: false, roomsketcher: false },
  { feature: 'GLTF 3D Model Export', archcraft: true, planner: false, roomsketcher: false },
  { feature: 'PDF Blueprint Export', archcraft: true, planner: 'Paid', roomsketcher: 'Paid' },
  { feature: 'First-Person Walk Mode', archcraft: true, planner: 'Paid', roomsketcher: false },
  { feature: 'Per-Wall Door/Window Editor', archcraft: true, planner: false, roomsketcher: false },
  { feature: 'Free to Use', archcraft: true, planner: 'Limited', roomsketcher: false },
];

function FeatureSection({ feature, index }) {
  const Icon = feature.icon;
  const isEven = index % 2 === 0;

  const glowColors = {
    cyan: 'rgba(6,182,212,0.15)',
    indigo: 'rgba(99,102,241,0.15)',
    emerald: 'rgba(16,185,129,0.15)',
    amber: 'rgba(245,158,11,0.15)',
    rose: 'rgba(244,63,94,0.15)',
  };

  return (
    <div className="relative py-20 px-8 border-b border-border/50 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at ${isEven ? '20%' : '80%'} 50%, ${glowColors[feature.glow]}, transparent 60%)` }} />

      <div className={`relative z-10 max-w-6xl mx-auto flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
              {feature.badge}
            </span>
          </div>

          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{feature.tagline}</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            <span className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>{feature.title}</span>
            <br />{feature.headline}
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-8">{feature.desc}</p>

          <ul className="space-y-3 mb-8">
            {feature.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`w-5 h-5 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-slate-300 text-sm leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          <div className="text-xs text-slate-600 italic border-l-2 border-indigo-500/30 pl-3">{feature.rival}</div>
        </div>

        {/* Visual card */}
        <div className="flex-shrink-0 w-full lg:w-80">
          <div className={`relative rounded-2xl border border-border bg-card overflow-hidden`}
            style={{ boxShadow: `0 0 60px ${glowColors[feature.glow]}` }}>
            {/* Mock terminal/panel header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/50">
              {['#f43f5e', '#f59e0b', '#10b981'].map(c => (
                <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
              <span className="text-xs text-slate-600 font-mono ml-2">{feature.id}.panel</span>
            </div>
            {/* Stat display */}
            <div className="p-8 text-center">
              <div className={`text-7xl font-black bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent mb-2`}>
                {feature.stat.value}
              </div>
              <div className="text-slate-500 text-sm font-semibold uppercase tracking-widest">{feature.stat.label}</div>
            </div>
            {/* Animated bar */}
            <div className="px-6 pb-6">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${feature.gradient} rounded-full animate-pulse`} style={{ width: '85%' }} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-slate-600">Processing</span>
                <span className="text-[10px] text-slate-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesPage({ onStart }) {
  return (
    <div className="min-h-screen bg-void overflow-auto">
      {/* Hero */}
      <section className="relative pt-40 pb-24 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold mb-8 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Full Feature Breakdown
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-none tracking-tighter">
            Every feature is<br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              an industry first.
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Six core systems that no competitor has built. Each one changes how professionals design, present, and deliver.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <a key={f.id} href={`#${f.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-indigo-500/40 text-slate-400 hover:text-white text-sm font-medium transition-all">
                  <Icon className="w-4 h-4" />
                  {f.title}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature sections */}
      {FEATURES.map((feature, i) => (
        <div id={feature.id} key={feature.id}>
          <FeatureSection feature={feature} index={i} />
        </div>
      ))}

      {/* Export capabilities */}
      <section className="py-24 px-8 bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">Export & Deliver</div>
            <h2 className="text-4xl font-black text-white mb-4">Professional deliverables. Instantly.</h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">Six export formats designed for every stakeholder — from clients to contractors to engineers.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EXPORTS.map(exp => {
              const Icon = exp.icon;
              return (
                <div key={exp.label} className={`flex items-start gap-4 p-5 rounded-2xl ${exp.bg} border border-white/5 hover:border-white/10 transition-all`}>
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${exp.color}`} />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${exp.color} mb-0.5`}>{exp.label}</div>
                    <div className="text-xs text-slate-500">{exp.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">Zero Bias Comparison</div>
            <h2 className="text-4xl font-black text-white mb-4">ARCHCRAFT vs. the competition.</h2>
          </div>
          <div className="rounded-2xl border border-border overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 bg-surface border-b border-border">
              <div className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Feature</div>
              <div className="p-4 text-center">
                <div className="text-sm font-black text-white">ARCHCRAFT</div>
                <div className="text-xs text-indigo-400">Free</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-sm font-semibold text-slate-400">Planner 5D</div>
                <div className="text-xs text-slate-600">$9.99/mo</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-sm font-semibold text-slate-400">RoomSketcher</div>
                <div className="text-xs text-slate-600">$49/mo</div>
              </div>
            </div>
            {COMPARE.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-surface/20'}`}>
                <div className="p-4 text-sm text-slate-300 flex items-center">{row.feature}</div>
                <div className="p-4 flex items-center justify-center">
                  {row.archcraft === true ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  ) : (
                    <span className="text-xs text-amber-400 font-semibold">{row.archcraft}</span>
                  )}
                </div>
                <div className="p-4 flex items-center justify-center">
                  {row.planner === false ? (
                    <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-rose-500" />
                    </div>
                  ) : (
                    <span className="text-xs text-amber-400 font-semibold">{row.planner}</span>
                  )}
                </div>
                <div className="p-4 flex items-center justify-center">
                  {row.roomsketcher === false ? (
                    <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-rose-500" />
                    </div>
                  ) : (
                    <span className="text-xs text-amber-400 font-semibold">{row.roomsketcher}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 to-cyan-500/5" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Every feature. Zero cost.</h2>
          <p className="text-lg text-slate-400 mb-8">No paywalls. No feature locks. Everything you just read is available the moment you click.</p>
          <button onClick={onStart}
            className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-lg font-black rounded-2xl shadow-2xl hover:shadow-indigo-500/40 transition-all hover:-translate-y-1 mx-auto">
            <Zap className="w-5 h-5" />
            Launch Studio Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
