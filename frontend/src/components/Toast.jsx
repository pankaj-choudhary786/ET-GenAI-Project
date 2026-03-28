import { useStore } from '../store/useStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastProvider = () => {
  const toasts = useStore(state => state.toasts);
  const removeToast = useStore(state => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2">
      {toasts.map((toast) => {
        let bgColor = '';
        let Icon = null;
        
        switch(toast.type) {
            case 'success':
                bgColor = 'bg-emerald-600';
                Icon = CheckCircle;
                break;
            case 'error':
                bgColor = 'bg-rose-600';
                Icon = AlertCircle;
                break;
            case 'info':
                bgColor = 'bg-blue-600';
                Icon = Info;
                break;
            case 'warning':
                bgColor = 'bg-amber-600';
                Icon = AlertTriangle;
                break;
            default:
                bgColor = 'bg-slate-800';
                Icon = Info;
        }

        return (
          <div key={toast.id} className={`${bgColor} text-white px-5 py-4 rounded-xl shadow-2xl flex items-center justify-between min-w-[320px] animate-in slide-in-from-right-4 border border-white/10 backdrop-blur-md`}>
            <div className="flex items-center gap-3 font-bold text-sm">
               <Icon className="w-5 h-5 flex-shrink-0" />
               <p>{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-white/60 hover:text-white outline-none ml-4 transition-colors">
              <X className="w-5 h-5"/>
            </button>
          </div>
        )
      })}
    </div>
  );
};

export default ToastProvider;
