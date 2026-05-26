import { useState } from 'react';
import { Check, X, Zap, ArrowRight, Star, Shield, Cpu, Globe, DollarSign, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free Forever',
    price: { monthly: 0, annual: 0 },
    tagline: 'Everything you need to get started.',
    badge: null,
    accent: 'from-slate-500 to-slate-600',
    border: 'border-border',
    highlight: false,
    cta: 'Start Designing Free',
    ctaStyle: 'bg-surface border border-border text-white hover:border-indigo-500/50',
    features: [
      'Unlimited 3D designs',
      'Full 2D floor plan editor',
      '102-item furniture library',
      'Gable roof generation',
      'PNG screenshot export',
      'PDF blueprint export',
      'JSON save & load',
      'ArchAI™ assistant (10 queries/day)',
      'ClimateIQ™ basic',
      'SolarPath™ basic',
      'LiveCost™ estimator',
      'StructureScore™',
      'Walk mode (first-person)',
      'GLTF 3D model export',
      '1 active project',
    ],
    notIncluded: [
      'Unlimited projects',
      'Team collaboration',
      'Client portal',
      'White-label exports',
      'Priority support',
      'BIM/IFC export',
      'API access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 29, annual: 19 },
    tagline: 'For professionals who bill by the project.',
    badge: 'Most Popular',
    accent: 'from-indigo-500 to-cyan-500',
    border: 'border-indigo-500/50',
    highlight: true,
    cta: 'Start Pro Free — 14 Days',
    ctaStyle: 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50',
    features: [
      'Everything in Free',
      'Unlimited projects',
      'ArchAI™ unlimited queries',
      'ClimateIQ™ full data',
      'SolarPath™ full simulation',
      'HD PNG renders (4× resolution)',
      'Watermark-free PDF exports',
      'GLTF + GLB export',
      'Shareable client links',
      'Project history & versioning',
      'Custom branding on exports',
      'Priority email support',
      '500+ material library',
      'Advanced structural analysis',
      'Multi-floor unlimited',
    ],
    notIncluded: [
      'Team seats',
      'Client portal',
      'White-label app',
      'BIM/IFC export',
      'API access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: null, annual: null },
    tagline: 'Custom pricing for firms and studios.',
    badge: 'Custom',
    accent: 'from-violet-500 to-purple-600',
    border: 'border-violet-500/30',
    highlight: false,
    cta: 'Contact Sales',
    ctaStyle: 'bg-violet-500/20 border border-violet-500/40 text-violet-300 hover:bg-violet-500/30',
    features: [
      'Everything in Pro',
      'Unlimited team seats',
      'Client portal (white-labeled)',
      'BIM / IFC export',
      'REST API access',
      'SSO (SAML, Okta)',
      'Custom AI training on your style library',
      'Dedicated success manager',
      'SLA: 99.9% uptime guarantee',
      'Custom domain (archcraft.yourfirm.com)',
      'Advanced analytics dashboard',
      'On-premise deployment option',
      'Custom contract & invoicing',
      'Priority phone + video support',
      'Quarterly roadmap input',
    ],
    notIncluded: [],
  },
];

const COMPARE_ROWS = [
  { label: 'Projects', free: '1', pro: 'Unlimited', ent: 'Unlimited' },
  { label: 'ArchAI™ queries/day', free: '10', pro: 'Unlimited', ent: 'Unlimited + Custom' },
  { label: 'Export: PNG', free: 'Standard', pro: '4× HD', ent: '8× Ultra HD' },
  { label: 'Export: PDF Blueprint', free: 'Watermarked', pro: 'Clean', ent: 'White-label' },
  { label: 'Export: GLTF', free: true, pro: 'GLTF + GLB', ent: 'GLTF + GLB + BIM/IFC' },
  { label: 'Walk Mode', free: true, pro: true, ent: true },
  { label: 'Material Library', free: '102 items', pro: '500+ items', ent: 'Custom library' },
  { label: 'Team Collaboration', free: false, pro: false, ent: true },
  { label: 'Client Portal', free: false, pro: false, ent: 'White-labeled' },
  { label: 'API Access', free: false, pro: false, ent: true },
  { label: 'Custom AI Training', free: false, pro: false, ent: true },
  { label: 'SLA Uptime', free: 'Best effort', pro: '99.5%', ent: '99.9% guaranteed' },
  { label: 'Support', free: 'Community', pro: 'Priority email', ent: 'Dedicated + phone' },
  { label: 'Price / month', free: 'Free', pro: '$29 / $19 annual', ent: 'Custom' },
];

const FAQS = [
  {
    q: 'Is the free plan actually free forever?',
    a: 'Yes. No credit card required, no trial period. The free plan includes all core design tools, exports, AI assistant (10 queries/day), and walk mode. We will never remove features from the free plan.',
  },
  {
    q: 'What happens to my designs if I cancel Pro?',
    a: 'Your designs never disappear. You lose access to Pro-only features (HD renders, unlimited projects) but all 1 project slot stays intact and editable. You can export everything before downgrading.',
  },
  {
    q: 'Can I use ARCHCRAFT commercially on the free plan?',
    a: 'Yes. You can use your designs commercially — show clients, bill for your work, use blueprints in proposals. The only restriction is the watermark on PDF exports, which Pro removes.',
  },
  {
    q: 'How does the 14-day Pro trial work?',
    a: 'Full Pro access, no credit card required. On day 14 you choose to subscribe or drop to free. We will send a reminder on day 12.',
  },
  {
    q: 'Do you offer education or nonprofit discounts?',
    a: 'Yes — 60% off Pro for accredited architecture/design students, and custom pricing for nonprofits and academic institutions. Email us with verification.',
  },
  {
    q: 'What is BIM/IFC export?',
    a: 'BIM (Building Information Modeling) and IFC (Industry Foundation Classes) are the file formats used by professional engineering software like Revit, ArchiCAD, and AutoCAD. Enterprise plan exports your ARCHCRAFT model directly into these formats.',
  },
];

function Cell({ value }) {
  if (value === true) return (
    <div className="flex justify-center">
      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <Check className="w-3 h-3 text-emerald-400" />
      </div>
    </div>
  );
  if (value === false) return (
    <div className="flex justify-center">
      <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center">
        <X className="w-3 h-3 text-rose-500/60" />
      </div>
    </div>
  );
  return <div className="text-center text-xs text-slate-400 font-medium">{value}</div>;
}

function FAQ({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-surface/50 transition-colors">
        <span className="font-semibold text-white text-sm">{item.q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-border/50">
          <div className="pt-4">{item.a}</div>
        </div>
      )}
    </div>
  );
}

export default function PricingPage({ onStart }) {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-void overflow-auto">
      {/* Hero */}
      <section className="relative pt-40 pb-16 px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-bold mb-6 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent pricing. No surprises.
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 leading-none tracking-tighter">
            Free by default.<br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Pro when you scale.</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10">
            Every core feature is free forever. Pro unlocks the tools that professionals bill with.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-surface border border-border rounded-xl">
            <button onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!annual ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${annual ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
              Annual
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">–34%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="px-8 pb-20 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.id}
              className={`relative rounded-2xl border ${plan.border} bg-card overflow-hidden transition-all duration-300 ${plan.highlight ? 'scale-105 shadow-2xl shadow-indigo-500/20' : ''}`}>
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500" />
              )}
              {plan.badge && (
                <div className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  plan.highlight ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="p-7">
                {/* Header */}
                <div className={`w-10 h-10 bg-gradient-to-br ${plan.accent} rounded-xl flex items-center justify-center mb-4`}>
                  {plan.id === 'free' ? <Zap className="w-5 h-5 text-white" /> :
                   plan.id === 'pro' ? <Star className="w-5 h-5 text-white" /> :
                   <Shield className="w-5 h-5 text-white" />}
                </div>
                <div className="text-lg font-black text-white mb-1">{plan.name}</div>
                <div className="text-xs text-slate-500 mb-5">{plan.tagline}</div>

                {/* Price */}
                <div className="mb-6">
                  {plan.price.monthly === null ? (
                    <div className="text-3xl font-black text-white">Custom</div>
                  ) : plan.price.monthly === 0 ? (
                    <div className="flex items-end gap-1">
                      <div className="text-5xl font-black text-white">$0</div>
                      <div className="text-slate-500 mb-2">/ forever</div>
                    </div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <div className="text-5xl font-black text-white">
                        ${annual ? plan.price.annual : plan.price.monthly}
                      </div>
                      <div className="text-slate-500 mb-2">/ mo</div>
                    </div>
                  )}
                  {annual && plan.price.annual && plan.price.annual > 0 && (
                    <div className="text-xs text-emerald-400 mt-1">
                      Save ${(plan.price.monthly - plan.price.annual) * 12}/year
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button onClick={() => plan.id !== 'enterprise' && onStart()}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 ${plan.ctaStyle}`}>
                  {plan.cta}
                </button>

                {/* Features */}
                <div className="mt-6 space-y-2.5">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 bg-gradient-to-br ${plan.accent} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-xs text-slate-300 leading-relaxed">{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.length > 0 && (
                    <div className="pt-2 border-t border-border/50 space-y-2">
                      {plan.notIncluded.map(f => (
                        <div key={f} className="flex items-start gap-2.5 opacity-40">
                          <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-2.5 h-2.5 text-slate-600" />
                          </div>
                          <span className="text-xs text-slate-600 line-through">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="py-12 px-8 border-y border-border bg-surface/20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center sm:text-left">
          {[
            { value: '48,000+', label: 'Active designers', icon: Globe },
            { value: '4.9★', label: 'Average rating', icon: Star },
            { value: '100%', label: 'Free to start', icon: Zap },
            { value: '$0', label: 'To get professional results', icon: DollarSign },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">Full plan comparison</h2>
          <p className="text-slate-400">Exactly what you get at each tier.</p>
        </div>
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-4 bg-surface border-b border-border">
            <div className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Feature</div>
            {PLANS.map(p => (
              <div key={p.id} className={`p-4 text-center ${p.highlight ? 'bg-indigo-500/5' : ''}`}>
                <div className="text-sm font-black text-white">{p.name}</div>
              </div>
            ))}
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div key={row.label} className={`grid grid-cols-4 border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-surface/20'}`}>
              <div className="p-4 text-xs text-slate-400 flex items-center">{row.label}</div>
              <div className="p-4"><Cell value={row.free} /></div>
              <div className={`p-4 ${PLANS[1].highlight ? 'bg-indigo-500/5' : ''}`}><Cell value={row.pro} /></div>
              <div className="p-4"><Cell value={row.ent} /></div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-8 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-3">Frequently asked</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map(faq => <FAQ key={faq.q} item={faq} />)}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-8 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 to-cyan-500/4" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Start free. No card needed.</h2>
          <p className="text-slate-400 mb-8">Join 48,000+ architects and designers already building with ARCHCRAFT.</p>
          <button onClick={() => onStart()}
            className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-lg font-black rounded-2xl shadow-2xl hover:shadow-indigo-500/40 transition-all hover:-translate-y-1 mx-auto">
            <Zap className="w-5 h-5" />
            Launch Studio — Free Forever
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
