import { motion } from "framer-motion";

const EthiopianCalendar = () => {
  // Mapping for Ginbot 2018 (May/June 2026)
  // Ginbot 1, 2018 is May 9, 2026 (Saturday)
  const daysHeader = [
    { am: "ሰኞ", en: "M" },
    { am: "ማክ", en: "T" },
    { am: "ረቡ", en: "W" },
    { am: "ሐሙ", en: "T" },
    { am: "አር", en: "F" },
    { am: "ቅዳ", en: "S" },
    { am: "እሁ", en: "S" },
  ];

  const geezNumerals = [
    "፩", "፪", "፫", "፬", "፭", "፮", "፯", "፰", "፱", "፲",
    "፲፩", "፲፪", "፲፫", "፲፬", "፲፭", "፲፮", "፲፯", "፲፰", "፲፱", "፳",
    "፳፩", "፳፪", "፳፫", "፳፬", "፳፭", "፳፮", "፳፯", "፳፰", "፳፱", "፴"
  ];

  const weddingDayEth = 22; // May 30
  const startPadding = 5; // Starts on Saturday

  return (
    <section className="py-12 px-4 bg-[#FDFCF8] ">
      <div className="max-w-sm mx-auto text-center">
        {/* Compact Header */}
        <header className="mb-6">
          <h3 className="text-5xl mb-1" style={{ color: '#e1ff00', fontFamily: 'Parisienne, cursive' }}>
            Save the Date
          </h3>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-light">
            May 30 • ግንቦት ፳፪ • 2026
          </p>
        </header>

        {/* Minimalist Calendar Card */}
        <div className="bg-white rounded-1xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-5 border border-slate-100">
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-sm font-bold tracking-widest text-slate-800">ግንቦት</span>
            <span className="text-[10px] text-slate-800 font-bold uppercase tracking-tighter ">May / June 2026</span>
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {/* Ultra-clean Day Headers */}
            {daysHeader.map((day, i) => (
              <div key={i} className="flex flex-col items-center mb-2">
                <span className="text-[15px] font-extralight text-slate-400 leading-none">{day.am}</span>
                <span className={`text-[8px] font-medium ${i >= 5 ? 'text-[#e1ff00]' : 'text-slate-400'}`}>{day.en}</span>
              </div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}

            {/* Compact Days */}
            {geezNumerals.map((geez, i) => {
              const dayEth = i + 1;
              const dayGregorian = dayEth + 8;
              const isWeddingDay = dayEth === weddingDayEth;
              const gDate = dayGregorian > 31 ? dayGregorian - 31 : dayGregorian;

              return (
                <motion.div
                  key={dayEth}
                  whileTap={{ scale: 0.95 }}
                  className={`relative h-10 flex flex-col items-center justify-center  transition-all duration-300
                    ${isWeddingDay 
                      ? 'bg-[#C0522E] text-white shadow-md z-10 scale-110' 
                      : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span className={`text-sm font-extralight text-slate-700 ${isWeddingDay ? 'mt-0.5 text-white' : ''}`}>
                    {geez}
                  </span>
                  <span className={`text-[9px] font-medium opacity-60 ${isWeddingDay ? 'text-white' : 'text-slate-900'}`}>
                    {gDate}
                  </span>
                  
                  {/* Subtle Indicator for wedding day */}
                  {isWeddingDay && (
                    <motion.div 
                      layoutId="ring"
                      className="absolute inset-0 border border-white/30 rounded-lg"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Minimal Footer */}
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center items-center gap-2">
             <div className="h-[1px] w-4 bg-slate-200" />
             <span className="text-[9px] font-bold text-slate-400 tracking-[0.3em]">፪፲፻፲፰ ዓ.ም</span>
             <div className="h-[1px] w-4 bg-slate-200" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EthiopianCalendar;