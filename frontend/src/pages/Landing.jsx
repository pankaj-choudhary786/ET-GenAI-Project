import React from 'react';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import CommandCenterPreview from '../components/CommandCenterPreview';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Faq from '../components/Faq';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#00A4BD]/20 selection:text-[#00A4BD] w-full mt-[72px]">
      <Navbar />
      <main className="w-full flex justify-center flex-col items-center overflow-x-hidden">
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Features />
        <CommandCenterPreview />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
