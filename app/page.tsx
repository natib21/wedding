"use client";
import { useState } from 'react';
import TemplateOne from '@/components/templates/TemplateOne';
import TemplateTwo from '@/components/templates/TemplateTwo';
import TemplateThree from '@/components/templates/TemplateThree';
import TemplateFour from '@/components/templates/TemplateFour';
// ... Import other templates

export default function Home() {
  const [template, setTemplate] = useState('classic');

  // Unified data object to pass to all templates
  const weddingData = {
    names: "ሄኖክ ብርሀኔ & ፅዮን ገ/ትንሳኤ",
    date: "August 24, 2026",
    location: "The Grand Ballroom, NY",
    features: ["Open Bar", "Live Band", "Photo Booth"],
    qrValue: "https://yourwedding.com/rsvp",
    images: ["/b1.jpg", "/b2.jpg", "/b3.jpg"]
  };

  const renderTemplate = () => {
    switch (template) {
      // case 'classic': return <TemplateOne data={weddingData} />;
      case 'modern': return <TemplateTwo data={weddingData} />;
      case 'elegant': return <TemplateThree data={weddingData} />;
      case 'boho': return <TemplateFour data={weddingData} />;

      default: return <TemplateTwo data={weddingData} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Template Switcher (Sticky Control) */}
      <div className="fixed top-5 right-5 z-50 bg-white/80 p-2 rounded-lg shadow-md flex gap-2">
        <button onClick={() => setTemplate('classic')} className="px-3 py-1 bg-amber-600 text-white rounded">Classic</button>
        <button onClick={() => setTemplate('modern')} className="px-3 py-1 bg-blue-600 text-white rounded">Modern</button>
        <button onClick={() => setTemplate('elegant')} className="px-3 py-1 bg-blue-600 text-white rounded">Elegant</button>
        <button onClick={() => setTemplate('boho')} className="px-3 py-1 bg-blue-600 text-white rounded">Boho</button>

      </div>

      {renderTemplate()}
    </div>
  );
}