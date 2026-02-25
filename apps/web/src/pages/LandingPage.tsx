import React from 'react';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Metrics from '../components/sections/Metrics';
import Features from '../components/sections/Features';
import HowItWorks from '../components/sections/HowItWorks';
import Testimonials from '../components/sections/Testimonials';
import Pricing from '../components/sections/Pricing';
import CTA from '../components/sections/CTA';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <main>
        <Hero />
        <Metrics />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
