import React, { useEffect } from 'react';
import { Check, Info, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={`toast-item ${toast.type || 'info'}`}>
      <span className="toast-icon">
        {toast.type === 'success' ? <Check size={14} /> : <Info size={14} />}
      </span>
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close-btn"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={12} />
      </button>
    </div>
  );
}
