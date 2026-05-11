import { TemplateProps } from "../type/wedding";


export default function TemplateThree({ data }: TemplateProps) {
  return (
    <div className="bg-slate-950 text-slate-100 selection:bg-indigo-500">
      <header className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
        <section className="relative z-10 text-center">
          <div className="text-sm tracking-[0.8em] text-indigo-400 uppercase mb-8">Save the Date</div>
          <div className="text-7xl md:text-9xl font-extralight tracking-widest">{data.names}</div>
        </section>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-24 space-y-40">
        {/* Features: Cards */}
        <section>
          <article className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.features.map((f, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm">
                <div className="h-1 w-10 bg-indigo-500 mb-4"></div>
                <h4 className="text-xl">{f}</h4>
              </div>
            ))}
          </article>
        </section>

        {/* Images: Cinematic Wide */}
        <section>
          <article className="h-[500px] w-full bg-slate-800 rounded-3xl overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
          </article>
        </section>

        {/* Days & QR: Glow Effect */}
        <section className="flex flex-col items-center">
          <article className="text-center mb-12">
            <h3 className="text-5xl font-thin tracking-tighter italic">Forty Five Days Until Forever</h3>
          </article>
          <article className="p-6 bg-white rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.3)]">
             <div className="w-32 h-32 bg-slate-200"></div> {/* QR Placement */}
          </article>
        </section>
      </main>
    </div>
  );
}