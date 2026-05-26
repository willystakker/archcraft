import { useState, useRef, useEffect } from 'react';
import { Cpu, Send, X, Sparkles, RotateCcw, Wand2 } from 'lucide-react';
import useDesignStore from '../../stores/designStore';
import useUIStore from '../../stores/uiStore';

const SUGGESTIONS = [
  'Make this feel more open concept',
  'Add a home office optimized for focus',
  'Suggest Mediterranean style finishes',
  'Optimize layout for natural light',
  'Make the kitchen more functional',
  'Suggest a color palette for the interior',
];

const AI_RESPONSES = {
  'open concept': {
    text: "For an open concept feel, I'd recommend removing the wall between your living and kitchen areas. Consider using kitchen islands instead of full walls — they define spaces while maintaining flow. Raise ceiling heights to 3.2m+ and use consistent flooring throughout to visually expand the space.",
    actions: ['Raise ceiling height to 3.2m', 'Suggest island placement', 'Unify floor materials'],
  },
  'mediterranean': {
    text: "Mediterranean style calls for warm, earthy tones — terracotta tiles, cream stucco walls, and warm wood accents. I'm detecting your current palette is cool-toned. Try switching wall colors to #f5e6d0 (warm sand), floors to terracotta tile, and adding deep ochre accent walls in the dining area.",
    actions: ['Apply warm palette', 'Switch to terracotta floors', 'Add archways'],
  },
  'natural light': {
    text: "Based on your home's orientation, your south-facing rooms (Living Room, Kitchen) have excellent solar access. For maximum natural light: add large windows on south walls (1.8m wide recommended), use lighter wall colors (LRV 70+), and add skylights where rooflines allow. Your bedroom orientation is good for morning light.",
    actions: ['Add south-facing windows', 'Lighten wall colors', 'Show solar analysis'],
  },
  'home office': {
    text: "The ideal home office needs a quiet zone away from living areas. Based on your floor plan, the northeast corner offers the lowest foot traffic. I recommend 3.5m × 3.5m minimum, with the desk facing north to avoid glare. Add a soundproofing wall material and consider an L-shaped desk configuration.",
    actions: ['Add office room', 'Apply acoustic walls', 'Optimize desk placement'],
  },
  default: {
    text: "I've analyzed your floor plan. Your current layout has good flow between living areas, but I notice a few optimization opportunities:\n\n• The kitchen could be repositioned closer to the dining area for better workflow\n• Adding more rooms on the south-facing side would improve passive solar heating\n• The hallway traffic patterns suggest moving the master bedroom entrance\n\nWould you like me to apply any of these improvements automatically?",
    actions: ['Optimize kitchen flow', 'Improve solar access', 'Reroute circulation'],
  },
};

function getResponse(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('open') || lower.includes('concept')) return AI_RESPONSES['open concept'];
  if (lower.includes('mediterr')) return AI_RESPONSES['mediterranean'];
  if (lower.includes('light') || lower.includes('solar') || lower.includes('sun')) return AI_RESPONSES['natural light'];
  if (lower.includes('office') || lower.includes('work')) return AI_RESPONSES['home office'];
  return AI_RESPONSES.default;
}

export default function AIAssistant() {
  const { toggleAI } = useUIStore();
  const { rooms } = useDesignStore();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `Hi! I'm **ArchAI**, your intelligent design assistant. I can analyze your ${rooms.length}-room floor plan, suggest design improvements, apply styles, optimize for climate, and calculate ROI. What would you like to improve?`,
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text, time: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setThinking(true);

    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

    const response = getResponse(text);
    setThinking(false);
    setMessages(m => [...m, { role: 'ai', text: response.text, actions: response.actions, time: new Date() }]);
  };

  const handleAction = (action) => {
    setMessages(m => [...m, {
      role: 'ai',
      text: `✅ Applied: **${action}**. Your design has been updated. The change improves energy efficiency by an estimated 8% and adds ~$12,000 to market value.`,
      time: new Date(),
    }]);
    useUIStore.getState().notify(`ArchAI applied: ${action}`, 'success');
  };

  return (
    <div className="fixed top-14 right-[272px] panel-enter bottom-10 w-80 glass rounded-xl border border-indigo-500/20 shadow-2xl flex flex-col overflow-hidden z-40 panel-enter">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0 bg-indigo-500/10">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            ArchAI™ Assistant
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-[10px] text-indigo-300/70">Powered by design intelligence</div>
        </div>
        <button onClick={toggleAI} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Suggestions */}
      <div className="flex gap-1.5 px-3 py-2 overflow-x-auto flex-shrink-0 border-b border-border">
        {SUGGESTIONS.slice(0, 3).map(s => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-all"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
            <div className={`max-w-[82%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-tr-sm'
                  : 'bg-card border border-border text-slate-300 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
              {msg.actions && (
                <div className="space-y-1 w-full">
                  {msg.actions.map(action => (
                    <button
                      key={action}
                      onClick={() => handleAction(action)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] font-medium hover:bg-indigo-500/20 transition-all"
                    >
                      <Wand2 className="w-3 h-3" />
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex gap-2 items-center">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="bg-card border border-border rounded-xl px-3 py-2 scan-line">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 focus-within:border-indigo-500/60 transition-all">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask ArchAI anything..."
            className="flex-1 bg-transparent text-xs text-white outline-none placeholder-slate-600"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || thinking}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 transition-all"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
