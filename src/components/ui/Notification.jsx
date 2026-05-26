import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import useUIStore from '../../stores/uiStore';

export default function Notification() {
  const { notification } = useUIStore();
  if (!notification) return null;

  const types = {
    success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
    error: { icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
    info: { icon: Info, color: 'text-indigo-400', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' },
  };
  const t = types[notification.type] ?? types.info;
  const Icon = t.icon;

  return (
    <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${t.bg} ${t.border} shadow-xl backdrop-blur-xl animate-pulse-slow`}>
      <Icon className={`w-4 h-4 ${t.color} flex-shrink-0`} />
      <span className="text-xs font-medium text-white">{notification.msg}</span>
    </div>
  );
}
