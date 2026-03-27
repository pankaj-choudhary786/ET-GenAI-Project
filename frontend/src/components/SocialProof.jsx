import React from 'react';

const brands = ["Salesforce", "HUBSPOT", "pipedrive", "ZOHO", "Zendesk", "Shopify", "Atlassian", "Twilio", "Sony"];

export default function SocialProof() {
  return (
    <section className="w-full bg-[#F5F8FA] border-b border-slate-200 flex flex-col items-center py-10 px-4 overflow-hidden relative">
      <p className="text-slate-500 font-semibold text-sm mb-6 uppercase tracking-widest text-center z-10 relative">
        Trusted by over 160,000 teams in 120 countries
      </p>
      
      {/* Left/Right Fades to make scroll seamless */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F5F8FA] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F5F8FA] to-transparent z-10 pointer-events-none"></div>

      <div className="w-full overflow-hidden flex pt-4 pb-4">
        <div className="animate-marquee flex items-center gap-16 md:gap-32 pr-16 md:pr-32 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          {/* Double array to create seamless infinite loop */}
          {[...brands, ...brands].map((brand, i) => (
            <h3 key={i} className="text-3xl lg:text-4xl font-black text-[#33475B] tracking-tighter shrink-0 select-none">
              {brand}
            </h3>
          ))}
        </div>
      </div>
    </section>
  );
}
