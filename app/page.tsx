"use client";

import { useMemo, useState } from "react";
import TemplateTwo from "@/components/templates/TemplateTwo";
import TemplateThree from "@/components/templates/TemplateThree";
import type { WeddingData } from "@/components/type/wedding";
import CriticalImageBoot from "@/components/CriticalImageBoot";
import { getCriticalUrlsForTemplate, type HomeTemplateId } from "@/lib/weddingImageUrls";
import { DEFAULT_WEDDING_VENUE } from "@/lib/weddingVenue";

type TemplateName = HomeTemplateId;

const WEDDING_DATA: WeddingData = {
  names: "ሄኖክ ብርሀኔ & ፅዮን ገ/ትንሳኤ",
  weddingDate: "2026-03-30",
  location: DEFAULT_WEDDING_VENUE.location,
  locationName: DEFAULT_WEDDING_VENUE.locationName,
  coordinates: DEFAULT_WEDDING_VENUE.coordinates,
  features: ["Open Bar", "Live Band", "Photo Booth"],
  rsvpLink: "https://yourwedding.com/rsvp",
  images: ["/b1.jpg", "/b2.jpg", "/b3.jpg"],
};

const TEMPLATES: Record<TemplateName, { label: string; component: typeof TemplateTwo }> = {
  elegant: { label: "Elegant", component: TemplateThree },
  modern: { label: "Modern", component: TemplateTwo },
};

export default function Home() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>("elegant");

  const Template = TEMPLATES[activeTemplate].component;
  const bootUrls = useMemo(() => getCriticalUrlsForTemplate(activeTemplate), [activeTemplate]);

  return (
    <div className="min-h-screen relative">
      {/* <nav className="fixed top-5 right-5 z-[220] bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md flex gap-2">
        {(Object.entries(TEMPLATES) as [TemplateName, (typeof TEMPLATES)[TemplateName]][]).map(
          ([key, { label }]) => (
            <button
              key={key}
              onClick={() => setActiveTemplate(key)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                activeTemplate === key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          )
        )}
      </nav> */}

      <CriticalImageBoot key={activeTemplate} urls={bootUrls}>
        <Template data={WEDDING_DATA} />
      </CriticalImageBoot>
    </div>
  );
}
