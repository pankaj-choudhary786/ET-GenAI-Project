import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1F36] text-[#EAF0F6] py-20 px-6 flex flex-col items-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-white font-black text-2xl mb-6 tracking-tight">NexusAI</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            Autonomous CRM Layer built for high-velocity sales teams. We identify risks, generate plays, and automate outreach so your reps focus on closing.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Product</h4>
          <ul className="text-md space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Prospecting Agent</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Deal Intelligence</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Revenue Retention</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Resources</h4>
          <ul className="text-md space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Customer Stories</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Company</h4>
          <ul className="text-md space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl w-full mt-20 pt-8 border-t border-slate-700 text-sm flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
        <p>© 2026 NexusAI, Inc. All rights reserved.</p>
        <div className="flex space-x-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
