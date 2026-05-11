import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRSectionProps {
  value: string;
  daysLeft: number;
  variant: 'royal' | 'minimal' | 'midnight' | 'boho' | 'glass';
}

export const QRSection: React.FC<QRSectionProps> = ({ value, daysLeft, variant }) => {
  const containerStyles = {
    royal: "bg-white p-12 rounded-2xl shadow-sm border border-stone-100",
    minimal: "border-t border-black pt-10",
    midnight: "bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10",
    boho: "bg-orange-50/50 border border-orange-100 rounded-[80px] p-12",
    glass: "bg-white/30 backdrop-blur-lg rounded-3xl p-10"
  };

  return (
    <section className={`flex flex-col md:flex-row items-center justify-between ${containerStyles[variant]}`}>
      <article className="text-center md:text-left">
        <h3 className="text-4xl font-bold mb-2">
          {daysLeft} <span className="font-light">Days To Go</span>
        </h3>
        <p className="opacity-70 italic">Scan to RSVP or view location</p>
      </article>
      
      <article className="mt-8 md:mt-0 p-4 bg-white rounded-xl shadow-lg">
        {/* The Actual QR Code Component */}
        <QRCodeSVG 
          value={value} 
          size={128}
          bgColor={"#ffffff"}
          fgColor={variant === 'midnight' ? "#0f172a" : "#000000"}
          level={"L"}
          includeMargin={false}
        />
      </article>
    </section>
  );
};