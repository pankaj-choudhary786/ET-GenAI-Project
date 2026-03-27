import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center pt-2">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-6">{description}</p>
        
        <div className="flex w-full gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors ${
              isDestructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#00A4BD] hover:bg-[#008f9c]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
