import { useState } from 'react';

export default function AddProspectModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    company: '', domain: '', contactName: '', contactTitle: '',
    contactEmail: '', industry: '', employeeCount: '', notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.company.trim()) e.company = 'Company name is required';
    if (!form.contactEmail.trim()) e.contactEmail = 'Contact email is required';
    if (form.contactEmail && !/\S+@\S+\.\S+/.test(form.contactEmail)) e.contactEmail = 'Invalid email format';
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
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-[9999]" style={{maxHeight:'90vh', overflowY:'auto'}}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Add Prospect Manually</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Company name *</label>
              <input value={form.company} onChange={handleChange('company')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.company ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="Acme Corp" />
              {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Website domain</label>
              <input value={form.domain} onChange={handleChange('domain')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="acme.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contact name</label>
              <input value={form.contactName} onChange={handleChange('contactName')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Smith" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contact title</label>
              <input value={form.contactTitle} onChange={handleChange('contactTitle')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VP of Sales" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Contact email *</label>
              <input value={form.contactEmail} onChange={handleChange('contactEmail')}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contactEmail ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="john@acme.com" type="email" />
              {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Industry</label>
              <select value={form.industry} onChange={handleChange('industry')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select industry</option>
                <option>SaaS / Software</option>
                <option>Fintech</option>
                <option>Healthcare</option>
                <option>E-commerce</option>
                <option>Manufacturing</option>
                <option>Consulting</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Company size</label>
              <select value={form.employeeCount} onChange={handleChange('employeeCount')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select size</option>
                <option value="10">1–10 employees</option>
                <option value="50">11–50 employees</option>
                <option value="200">51–200 employees</option>
                <option value="500">201–500 employees</option>
                <option value="1000">500+ employees</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes (why you're targeting them)</label>
              <textarea value={form.notes} onChange={handleChange('notes')} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Recently raised Series A, hiring VP Sales, competitor to Acme..." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Adding + scoring with AI...' : 'Add Prospect'}
            </button>
          </div>
          {submitting && (
            <p className="text-xs text-center text-gray-500">AI is scoring this prospect and generating outreach emails...</p>
          )}
        </form>
      </div>
    </div>
  );
}
