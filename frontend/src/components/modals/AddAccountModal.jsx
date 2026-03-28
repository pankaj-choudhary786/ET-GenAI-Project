import { useState } from 'react';

export default function AddAccountModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    companyName: '', contractValue: 0, plan: 'standard', contactEmail: '',
    loginLast7d: 0, loginLast30d: 0, featureAdoptionPct: 50, supportTickets30d: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = 'Company name is required';
    if (!form.contactEmail.trim()) e.contactEmail = 'Contact email is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    const val = (field === 'contractValue' || field === 'loginLast7d' || field === 'loginLast30d' || field === 'featureAdoptionPct' || field === 'supportTickets30d') 
      ? Number(e.target.value) 
      : e.target.value;
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-[9999]" style={{maxHeight:'90vh', overflowY:'auto'}}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Add Account Manually</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Company name *</label>
              <input value={form.companyName} onChange={handleChange('companyName')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.companyName ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="Acme Corp" />
              {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contract Value ($)</label>
              <input value={form.contractValue} onChange={handleChange('contractValue')} type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Plan Level</label>
              <select value={form.plan} onChange={handleChange('plan')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="standard">Standard</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Contact email *</label>
              <input value={form.contactEmail} onChange={handleChange('contactEmail')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${errors.contactEmail ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="admin@acme.com" type="email" />
              {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Logins (7d)</label>
              <input value={form.loginLast7d} onChange={handleChange('loginLast7d')} type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Feature Adoption %</label>
              <input value={form.featureAdoptionPct} onChange={handleChange('featureAdoptionPct')} type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" max="100" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
              {submitting ? 'Adding...' : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
