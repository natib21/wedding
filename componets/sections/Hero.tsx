import React from 'react';

interface HeroProps {
  names: string;
  date: string;
  variant: 'royal' | 'minimal' | 'midnight' | 'boho' | 'glass';
}

export const Hero: React.FC<HeroProps> = ({ names, date, variant }) => {
  const styles = {
    royal: "font-serif bg-stone-50 text-amber-700 border-b-8 border-double border-amber-200",
    minimal: "font-sans bg-white text-black border-b-4 border-black",
    midnight: "bg-slate-950 text-slate-100",
    boho: "bg-[#FFFBF5] text-emerald-900 font-serif",
    glass: "bg-gradient-to-br from-pink-100 to-violet-100 text-white"
  };

  return (
    <header className={`h-screen flex items-center justify-center p-6 ${styles[variant]}`}>
      <section className="text-center animate-fade-in">
        <h1 className={`
          ${variant === 'minimal' ? 'text-7xl md:text-9xl font-black uppercase tracking-tighter' : ''}
          ${variant === 'royal' ? 'text-6xl md:text-8xl italic' : ''}
          ${variant === 'midnight' ? 'text-6xl md:text-9xl font-thin tracking-widest' : ''}
          ${variant === 'boho' ? 'text-5xl md:text-8xl leading-tight' : ''}
        `}>
          {names}
        </h1>
        <p className="mt-6 text-xl tracking-[0.3em] uppercase opacity-80">{date}</p>
      </section>
    </header>
  );
};