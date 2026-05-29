import { useState, useEffect } from 'react';
import { X, Check, Zap, Star, Crown, ArrowRight, Sparkles, Shield } from 'lucide-react';

const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    icon: Zap,
    color: 'indigo',
    gradient: 'from-indigo-500 to-blue-500',
    glow: 'rgba(99,102,241,0.25)',
    border: 'border-indigo-500/40',
    badge: null,
    features: [
      'Unlimited rooms & floors',
      'Full 3D first-person walk mode',
      'PDF & PNG blueprint export',
      'All furniture & material presets',
      'Real-time cost estimator',
      'Cloud auto-save',
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: 59.99,
    icon: Star,
    color: 'violet',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.3)',
    border: 'border-violet-500/60',
    badge: 'Most Popular',
    features: [
      'Everything in Pro',
      'ArchAI™ natural language design',
      'ClimateIQ™ climate optimization',
      'SolarPath™ sun simulation',
      '3D model GLTF export',
      'Team collaboration (5 seats)',
      'Priority support',
    ],
  },
  {
    id: 'expert',
    name: 'Expert',
    price: 129.99,
    icon: Crown,
    color: 'amber',
    gradient: 'from-amber-400 to-orange-500',
    glow: 'rgba(245,158,11,0.28)',
    border: 'border-amber-500/50',
    badge: 'Full Power',
    features: [
      'Everything in Advanced',
      'BIM / IFC export',
      'Custom branding & white-label',
      'API access',
      'Unlimited team seats',
      'Dedicated account manager',
      '99.9% SLA + phone support',
    ],
  },
];

const COLOR_MAP = {
  indigo: {
    pill:    'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    btn:     'bg-indigo-600 hover:bg-indigo-500 text-white',
    check:   'text-indigo-400',
    iconBg:  'bg-indigo-500/20 text-indigo-400',
  },
  violet: {
    pill:    'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    btn:     'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white',
    check:   'text-violet-400',
    iconBg:  'bg-violet-500/20 text-violet-400',
  },
  amber: {
    pill:    'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    btn:     'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900',
    check:   'text-amber-400',
    iconBg:  'bg-amber-500/20 text-amber-400',
  },
};

function PlanCard({ plan, selected, onSelect }) {
  const c  = COLOR_MAP[plan.color];
  const Icon = plan.icon;
  const isSelected = selected === plan.id;

  return (
    <div
      onClick={() => onSelect(plan.id)}
      className={`relative flex flex-col rounded-2xl border cursor-pointer transition-all duration-200 p-5
        ${isSelected
          ? `${plan.border} bg-white/[0.05] shadow-xl scale-[1.02]`
          : 'border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.035]'
        }`}
      style={isSelected ? { boxShadow: `0 0 32px ${plan.glow}` } : {}}
    >
      {/* Popular badge */}
      {plan.badge && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${c.pill}`}>
          {plan.badge}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.iconBg}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">{plan.name}</div>
          <div className="flex items-end gap-1 leading-none mt-0.5">
            <span className="text-2xl font-black text-white">${plan.price}</span>
            <span className="text-xs text-slate-500 mb-0.5">/mo</span>
          </div>
        </div>
        {isSelected && (
          <div className="ml-auto w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-slate-900" />
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
            <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${c.check}`} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SubscriptionModal({ onClose, onSubscribe }) {
  const [selected, setSelected]   = useState('advanced');
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [visible, setVisible]     = useState(false);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const plan = PLANS.find(p => p.id === selected);
  const c    = COLOR_MAP[plan.color];

  const handleSubscribe = () => {
    setLoading(true);
    // Simulate checkout handoff (replace with Stripe / payment link)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      localStorage.setItem('archcraft_plan', selected);
      localStorage.setItem('archcraft_subscribed', '1');
      setTimeout(() => {
        onSubscribe?.(selected);
        onClose?.();
      }, 1800);
    }, 1400);
  };

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center p-4 transition-all duration-300
        ${visible ? 'bg-black/80 backdrop-blur-md' : 'bg-black/0 backdrop-blur-none'}`}
    >
      <div
        className={`relative w-full max-w-3xl bg-[#0d0f1a] border border-white/10 rounded-3xl shadow-2xl
          overflow-hidden transition-all duration-300
          ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-6'}`}
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)' }}
      >
        {/* Top gradient bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

        {/* Ambient glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-8 w-48 h-48 bg-violet-600/8 rounded-full blur-2xl pointer-events-none" />

        {/* Close (skip) button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/6 hover:bg-white/12 text-slate-400 hover:text-white flex items-center justify-center transition-all z-10"
          title="Continue without subscribing"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-7 pb-6 relative z-10">
          {success ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-5">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white mb-2">You're in!</div>
              <div className="text-sm text-slate-400">
                {plan.name} plan activated. Launching your studio…
              </div>
            </div>
          ) : (
            <>
              {/* ── Header ── */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-3">
                  <Sparkles className="w-3 h-3" />
                  Unlock the full ARCHCRAFT experience
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1.5">
                  Design without limits
                </h2>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Professional-grade architectural tools. Choose the plan that fits your workflow.
                </p>
              </div>

              {/* ── Plan cards ── */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {PLANS.map(p => (
                  <PlanCard
                    key={p.id}
                    plan={p}
                    selected={selected}
                    onSelect={setSelected}
                  />
                ))}
              </div>

              {/* ── CTA row ── */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all duration-200
                    ${c.btn} ${loading ? 'opacity-70 cursor-wait' : 'shadow-lg'}`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      Get {plan.name} — ${plan.price}/mo
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={handleDismiss}
                  className="px-4 py-3.5 rounded-xl border border-white/10 text-sm text-slate-500 hover:text-white hover:border-white/20 transition-all whitespace-nowrap"
                >
                  Try free first
                </button>
              </div>

              {/* ── Trust row ── */}
              <div className="flex items-center justify-center gap-5 mt-4 pt-4 border-t border-white/6">
                {[
                  { icon: Shield, text: '256-bit encryption' },
                  { icon: Check, text: 'Cancel anytime' },
                  { icon: Star, text: '14-day money back' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <Icon className="w-3 h-3" />
                    {text}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom gradient bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>
    </div>
  );
}
