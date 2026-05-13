import { TemplateProps } from "../type/wedding";

export default function TemplateFour({ data }:TemplateProps) {
  return (
    <div className="bg-[#FFFBF5] text-emerald-900 font-serif">
      <header className="h-[90vh] flex flex-col items-center justify-center p-6 text-center">
        <section className="border-2 border-emerald-900/20 p-12 rounded-t-full">
          <div className="text-5xl md:text-7xl mb-6">{data.names}</div>
          <p className="text-emerald-700/60">— Together with their families —</p>
        </section>
      </header>

      <main className="max-w-5xl mx-auto px-6 space-y-32">
        {/* Features: Floating Pill Shapes */}
        <section>
          <article className="flex flex-wrap justify-center gap-4">
            {data.features.map((f, i) => (
              <span key={i} className="px-8 py-3 bg-orange-100 text-orange-900 rounded-full text-lg shadow-sm">
                {f}
              </span>
            ))}
          </article>
        </section>

        {/* Images: Rounded Corners */}
        <section>
          <article className="grid grid-cols-12 gap-4">
            <div className="col-span-7 h-80 bg-orange-200 rounded-[60px_5px_60px_5px]"></div>
            <div className="col-span-5 h-80 bg-emerald-100 rounded-[5px_60px_5px_60px]"></div>
          </article>
        </section>

        {/* Days & QR: Warm & Nested */}
        <section className="bg-orange-50 rounded-[100px] py-16 px-10 flex flex-col md:flex-row items-center justify-around gap-10">
          <article className="text-center">
            <p className="uppercase tracking-widest text-orange-800 mb-2">Countdown</p>
            <h3 className="text-6xl font-black">45 Days</h3>
          </article>
          <article className="bg-white p-6 rounded-[40px] rotate-3 shadow-xl">
             <div className="w-28 h-28 bg-emerald-50 rounded-lg"></div> {/* QR Placement */}
          </article>
        </section>
      </main>
      <footer className="h-20 bg-emerald-900 text-white mt-20 flex items-center justify-center italic">
        See you in {data.location}
      </footer>
    </div>
  );
}