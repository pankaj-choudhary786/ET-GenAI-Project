import { useState } from 'react';

export default function AddCompetitorModal({ onClose, onSubmit }) {
  const [competitor, setCompetitor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!competitor.trim()) {
      setError('Competitor name is required');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(competitor);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 z-[9999]">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Track New Competitor</h2>
          <p className="text-xs text-gray-500 mb-4">AI will scan the web for recent signals, strengths, and weaknesses.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Competitor Name</label>
              <input 
                autoFocus
                value={competitor} 
                onChange={(e) => { setCompetitor(e.target.value); setError(''); }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="e.g. Gong, Outreach, HubSpot" 
              />
              {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Scanning...' : 'Start Intelligence'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
