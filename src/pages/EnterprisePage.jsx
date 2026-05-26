import { useState } from 'react';
import {
  Shield, Users, Globe, Cpu, ArrowRight, Check, Zap,
  Building2, Lock, BarChart3, Layers, Star, ChevronRight,
  FileText, Box, Sparkles, Phone, Mail, Calendar
} from 'lucide-react';

const CAPABILITIES = [
  {
    icon: Users,
    gradient: 'from-indigo-500 to-violet-500',
    glow: 'rgba(99,102,241,0.2)',
    title: 'Team Workspaces',
    desc: 'Unlimited seats. Shared project libraries, real-time collaboration, role-based permissions. Your entire firm in one place.',
    bullets: ['Real-time multi-user editing', 'Role-based access: Admin, Designer, Viewer', 'Shared template & material libraries', 'Project assignment & progress tracking'],
  },
  {
    icon: Building2,
    gradient: 'from-cyan-500 to-blue-500',
    glow: 'rgba(6,182,212,0.2)',
    title: 'Client Portal',
    desc: 'Give clients a white-labeled portal to review designs, leave comments, and approve changes — without giving them studio access.',
    bullets: ['Branded with your firm\'s logo & colors', 'Client comment & approval workflow', 'Version history with comparison view', 'Password-protected shareable links'],
  },
  {
    icon: FileText,
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.2)',
    title: 'BIM / IFC Export',
    desc: 'Export full Building Information Models compatible with Revit, ArchiCAD, and AutoCAD. Bridge digital design to construction documentation.',
    bullets: ['IFC 4.0 and IFC 2x3 formats', 'Revit-ready geometry export', 'ArchiCAD direct import', 'MEP and structural layer separation'],
  },
  {
    icon: Cpu,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.2)',
    title: 'Custom AI Training',
    desc: 'Train ArchAI™ on your firm\'s design library, preferred styles, and proprietary templates. Your AI that speaks your firm\'s design language.',
    bullets: ['Feed your historical project data', 'Style-specific AI recommendations', 'Branded design vocabulary', 'Continuous learning from firm feedback'],
  },
  {
    icon: BarChart3,
    gradient: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.2)',
    title: 'Analytics Dashboard',
    desc: 'Understand how your team designs. Project timelines, revision cycles, client approval rates, and cost estimation accuracy — all tracked.',
    bullets: ['Per-project productivity metrics', 'Client approval rate tracking', 'Design revision analytics', 'Cost estimation accuracy reports'],
  },
  {
    icon: Globe,
    gradient: 'from-rose-500 to-pink-500',
    glow: 'rgba(244,63,94,0.2)',
    title: 'Custom Domain & SSO',
    desc: 'Deploy ARCHCRAFT at design.yourfirm.com with your own branding. Integrate with your firm\'s Okta, Azure AD, or Google Workspace SSO.',
    bullets: ['Custom subdomain deployment', 'SAML 2.0 + OAuth SSO', 'Okta, Azure AD, Google Workspace', 'Custom email domain for notifications'],
  },
];

const CASE_STUDIES = [
  {
    firm: 'Chen & Associates',
    location: 'San Francisco, CA',
    size: '28 architects',
    avatar: 'CA',
    gradient: 'from-indigo-500 to-cyan-500',
    headline: '40% faster client approvals',
    quote: 'The client portal eliminated 3 rounds of back-and-forth per project. Clients see exactly what we\'re designing, in 3D, and approve in days instead of weeks.',
    name: 'Marcus Chen, Principal',
    metrics: [
      { value: '40%', label: 'Faster approvals' },
      { value: '28', label: 'Team seats' },
      { value: '$2.1M', label: 'In billed projects' },
    ],
  },
  {
    firm: 'Meridian Design Group',
    location: 'New York, NY',
    size: '54 architects + staff',
    avatar: 'MD',
    gradient: 'from-violet-500 to-purple-500',
    headline: 'BIM export replaced Revit workflow',
    quote: 'We were paying $8,400/year per Revit license. With ARCHCRAFT Enterprise and BIM export, our junior designers produce Revit-ready models at 1/5th the cost.',
    name: 'Sarah Meridian, CEO',
    metrics: [
      { value: '83%', label: 'License cost savings' },
      { value: '54', label: 'Active users' },
      { value: '120+', label: 'Projects delivered' },
    ],
  },
  {
    firm: 'TerraFirma Developers',
    location: 'Austin, TX',
    size: 'Real estate developer',
    avatar: 'TF',
    gradient: 'from-emerald-500 to-teal-500',
    headline: '3× faster investor presentations',
    quote: 'LiveCost™ and the custom-trained AI means we can walk into an investor meeting with a fully costed 3D design built that morning. It\'s changed how we close deals.',
    name: 'James Whitfield, Development Director',
    metrics: [
      { value: '3×', label: 'Faster presentations' },
      { value: '$47M', label: 'In funded projects' },
      { value: '100%', label: 'Investor close rate' },
    ],
  },
];

const SECURITY = [
  { icon: Lock, title: 'SOC 2 Type II', desc: 'Annually audited security controls' },
  { icon: Shield, title: 'GDPR Compliant', desc: 'EU data residency available' },
  { icon: Globe, title: '99.9% SLA', desc: 'Guaranteed uptime with credits' },
  { icon: Layers, title: 'E2E Encryption', desc: 'At rest and in transit, AES-256' },
];

export default function EnterprisePage({ onStart }) {
  const [formState, setFormState] = useState({ name: '', firm: '', email: '', size: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-void overflow-auto">
      {/* Hero */}
      <section className="relative pt-40 pb-24 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold mb-6 uppercase tracking-widest">
              <Building2 className="w-3.5 h-3.5" />
              Enterprise & Professional Firms
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
              ARCHCRAFT for<br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                architecture firms.
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
              Team workspaces, BIM export, client portals, custom AI training, and SSO integration.
              Purpose-built for firms of 5 to 500.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#contact"
                className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:-translate-y-0.5">
                <Calendar className="w-4 h-4" />
                Book a Demo
              </a>
              <a href="#capabilities"
                className="flex items-center gap-2 px-7 py-3.5 border border-border bg-card text-white font-semibold rounded-xl hover:border-violet-500/40 transition-all">
                See Capabilities
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right — stat cards */}
          <div className="flex-shrink-0 grid grid-cols-2 gap-4 w-full lg:w-96">
            {[
              { value: '500+', label: 'Firms worldwide', icon: Building2, g: 'from-indigo-500 to-violet-500' },
              { value: '99.9%', label: 'Uptime SLA', icon: Shield, g: 'from-emerald-500 to-teal-500' },
              { value: '83%', label: 'Avg cost saved vs. Revit', icon: BarChart3, g: 'from-amber-500 to-orange-500' },
              { value: '10min', label: 'Avg onboarding time', icon: Zap, g: 'from-cyan-500 to-blue-500' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-5 hover:border-violet-500/30 transition-all">
                  <div className={`w-8 h-8 bg-gradient-to-br ${s.g} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white mb-0.5">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="py-24 px-8 border-t border-border bg-surface/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Enterprise Capabilities</div>
            <h2 className="text-4xl font-black text-white mb-4">Everything a firm needs.</h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">Six systems designed for multi-user, multi-project, client-facing professional work.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map(cap => {
              const Icon = cap.icon;
              return (
                <div key={cap.title} className="group relative p-6 bg-card rounded-2xl border border-border hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{ background: `radial-gradient(circle at 20% 20%, ${cap.glow}, transparent 70%)` }} />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-br ${cap.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-lg font-black text-white mb-2">{cap.title}</div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{cap.desc}</p>
                    <ul className="space-y-2">
                      {cap.bullets.map(b => (
                        <li key={b} className="flex items-start gap-2 text-xs text-slate-400">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Case Studies</div>
            <h2 className="text-4xl font-black text-white mb-4">Real results from real firms.</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {CASE_STUDIES.map(cs => (
              <div key={cs.firm} className="bg-card border border-border rounded-2xl p-7 hover:border-violet-500/30 transition-all">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 bg-gradient-to-br ${cs.gradient} rounded-xl flex items-center justify-center text-white font-black text-sm`}>
                    {cs.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{cs.firm}</div>
                    <div className="text-xs text-slate-500">{cs.location} · {cs.size}</div>
                  </div>
                </div>

                <div className="text-lg font-black text-white mb-3">{cs.headline}</div>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">"{cs.quote}"</p>
                <div className="text-xs text-slate-600 mb-6">— {cs.name}</div>

                <div className="grid grid-cols-3 gap-3 pt-5 border-t border-border">
                  {cs.metrics.map(m => (
                    <div key={m.label} className="text-center">
                      <div className={`text-xl font-black bg-gradient-to-r ${cs.gradient} bg-clip-text text-transparent`}>{m.value}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16 px-8 border-y border-border bg-surface/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Security & Compliance</div>
            <h2 className="text-2xl font-black text-white">Enterprise-grade security. Built in from day one.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SECURITY.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="flex flex-col items-center text-center p-5 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="font-bold text-white text-sm mb-1">{s.title}</div>
                  <div className="text-xs text-slate-500">{s.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 px-8">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
          {/* Left */}
          <div className="flex-1">
            <div className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">Get in Touch</div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">Let's talk about<br />your firm.</h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Our enterprise team will walk you through a custom demo built around your firm's workflow, project types, and team size.
            </p>

            <div className="space-y-5">
              {[
                { icon: Calendar, title: 'Book a live demo', desc: '30-min video call with our enterprise team. We\'ll demo with your project type.' },
                { icon: Phone, title: 'Talk to sales', desc: 'Direct line: +1 (480) 798-0753 · Available Mon–Fri 9am–6pm ET' },
                { icon: Mail, title: 'Email us', desc: 'enterprise@archcraft.io · Response within 2 business hours' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 w-full">
            {submitted ? (
              <div className="bg-card border border-emerald-500/30 rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <div className="text-xl font-black text-white mb-2">We'll be in touch.</div>
                <div className="text-slate-400 text-sm">Our enterprise team will reach out within 2 business hours.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-7 space-y-4">
                <div className="text-lg font-black text-white mb-1">Request a demo</div>
                <div className="text-xs text-slate-500 mb-2">No commitment. Customized to your firm.</div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: 'name', label: 'Your Name', placeholder: 'Marcus Chen' },
                    { id: 'firm', label: 'Firm Name', placeholder: 'Chen & Associates' },
                  ].map(f => (
                    <div key={f.id}>
                      <label className="text-xs text-slate-400 font-semibold block mb-1.5">{f.label}</label>
                      <input
                        required
                        placeholder={f.placeholder}
                        value={formState[f.id]}
                        onChange={e => setFormState(s => ({ ...s, [f.id]: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-violet-500/50 transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1.5">Work Email</label>
                  <input
                    required type="email" placeholder="marcus@chenstudio.com"
                    value={formState.email}
                    onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1.5">Team Size</label>
                  <select
                    value={formState.size}
                    onChange={e => setFormState(s => ({ ...s, size: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-white text-sm outline-none focus:border-violet-500/50 transition-colors appearance-none"
                  >
                    <option value="" className="bg-slate-900">Select team size</option>
                    <option value="2-5" className="bg-slate-900">2–5 people</option>
                    <option value="6-15" className="bg-slate-900">6–15 people</option>
                    <option value="16-50" className="bg-slate-900">16–50 people</option>
                    <option value="50+" className="bg-slate-900">50+ people</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1.5">Tell us about your project types</label>
                  <textarea
                    rows={3}
                    placeholder="Residential, commercial, hospitality... what do you primarily design?"
                    value={formState.message}
                    onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-violet-500/50 transition-colors resize-none"
                  />
                </div>

                <button type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Request Demo
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center text-[10px] text-slate-600">We respond within 2 business hours · No spam, ever</div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
