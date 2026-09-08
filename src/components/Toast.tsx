import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

let toastListeners: ((toast: ToastMessage) => void)[] = [];

export function showToast(toast: Omit<ToastMessage, 'id'>) {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const fullToast = { ...toast, id };
  toastListeners.forEach(listener => listener(fullToast));
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'border-green-400/30 bg-green-500/10',
  error: 'border-red-400/30 bg-red-500/10',
  info: 'border-gold-400/30 bg-gold-400/10',
  warning: 'border-yellow-400/30 bg-yellow-500/10',
};

const iconColors = {
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-gold-400',
  warning: 'text-yellow-400',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: ToastMessage) => {
    setToasts(prev => [...prev, toast]);
    const duration = toast.duration || 4000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, duration);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter(l => l !== addToast);
    };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-20 right-6 z-[200] flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`glass-premium rounded-xl p-4 border ${colors[toast.type]} shadow-2xl`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${iconColors[toast.type]} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-cream-100 font-medium text-sm">{toast.title}</p>
                  {toast.message && (
                    <p className="text-cream-200/50 text-xs mt-0.5">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-cream-200/30 hover:text-cream-200/60 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
