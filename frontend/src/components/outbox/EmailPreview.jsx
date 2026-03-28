import React, { useState } from 'react';
import { Send, Edit3, RefreshCw, Trash2, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function EmailPreview({ draft, onApprove, onDiscard }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bodyText, setBodyText] = useState(draft?.body || '');
  const [regenNotes, setRegenNotes] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Reset state when draft changes
  React.useEffect(() => {
    setBodyText(draft?.body || '');
    setIsEditing(false);
    setRegenNotes('');
  }, [draft]);

  if (!draft) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
        Select a draft to review
      </div>
    );
  }

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setBodyText("Here is the revised version of the email making it shorter and more direct, as requested.\n\n" + bodyText);
      setRegenNotes('');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-y-auto custom-scrollbar">
      
      {/* Header Info */}
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{draft.subject}</h2>
        
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-12 text-slate-400">To:</span>
            <span className="font-medium text-slate-800">{draft.contactName} &lt;{draft.contactEmail}&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 text-slate-400">From:</span>
            <span className="font-medium text-slate-800">You (via NexusAI)</span>
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="p-6 flex-1 text-slate-800 text-[15px] leading-relaxed relative">
        {isRegenerating && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
             <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-lg border border-slate-100 text-[#00A4BD] font-medium">
               <RefreshCw className="w-4 h-4 animate-spin" />
               Regenerating draft...
             </div>
          </div>
        )}
        
        {isEditing ? (
          <textarea 
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="w-full h-full min-h-[300px] p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A4BD]/50 font-sans resize-none"
          />
        ) : (
          <div className="whitespace-pre-wrap">{bodyText}</div>
        )}
      </div>

      {/* Why the AI wrote this */}
      <div className="mx-6 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
          <Info className="w-4 h-4 text-[#00A4BD]" />
          Why the AI wrote this
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {draft.reasoning}
        </p>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center sticky bottom-0 z-20 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.02)]">
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Regeneration notes (e.g. 'Make it shorter')"
            className="text-sm px-3 py-2 border border-slate-200 rounded-lg w-full sm:w-64 focus:outline-none focus:border-[#00A4BD]"
            value={regenNotes}
            onChange={(e) => setRegenNotes(e.target.value)}
          />
          <button 
            onClick={handleRegenerate}
            disabled={isRegenerating || !regenNotes}
            className="p-2 text-slate-500 hover:text-[#00A4BD] hover:bg-slate-50 rounded-lg transition-colors border border-transparent disabled:opacity-50"
            title="Regenerate with notes"
          >
            <RefreshCw className={clsx("w-5 h-5", isRegenerating && "animate-spin")} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => onDiscard(draft.id)}
            className="flex items-center gap-2 px-4 py-2 text-rose-600 font-medium hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Discard
          </button>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 border border-slate-200 font-medium hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? "Save Edits" : "Edit"}
          </button>
          
          <button 
            onClick={() => onApprove(draft.id)}
            className="flex items-center gap-2 px-6 py-2 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold rounded-lg shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            Approve & Send
          </button>
        </div>

      </div>
    </div>
  );
}
