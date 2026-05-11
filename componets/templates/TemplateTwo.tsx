import { TemplateProps } from '@/componets/type/wedding';   // ← fixed typo

export default function TemplateOne({ data }:TemplateProps) {
  return (
    <div className="font-serif bg-stone-50 text-stone-800">
      {/* HERO SECTION */}
      <header className="h-screen flex items-center justify-center border-b-8 border-double border-amber-200">
        <section className="text-center">
          <div className="text-6xl md:text-8xl mb-4 italic text-amber-700">{data.names}</div>
          <div className="text-xl tracking-[0.5em] uppercase">{data.date}</div>
        </section>
      </header>

      <main className="max-w-4xl mx-auto py-20 px-6">
        {/* FEATURES SECTION */}
        <section className="mb-20 text-center">
          <h2 className="text-3xl mb-10">Wedding Highlights</h2>
          <article className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.features.map((f, i) => (
              <div key={i} className="p-6 border border-amber-200 rounded-full">{f}</div>
            ))}
          </article>
        </section>

        {/* IMAGES SECTION */}
        <section className="mb-20">
          <article className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-stone-200 rounded-lg"></div>
            <div className="h-64 bg-stone-200 rounded-lg translate-y-8"></div>
          </article>
        </section>

        {/* DAYS/COUNTDOWN & QR SECTION */}
        <section className="flex flex-col md:flex-row items-center justify-between bg-white p-12 rounded-2xl shadow-sm">
          <article className="text-center md:text-left">
            <h3 className="text-4xl font-bold mb-2 text-amber-800">45 Days To Go</h3>
            <p>We can't wait to see you there!</p>
          </article>
          
          <article className="mt-8 md:mt-0 p-4 bg-stone-100 rounded-xl border-4 border-white shadow-inner">
             {/* Replace with a QR Library later */}
             <div className="w-32 h-32 flex items-center justify-center bg-white">QR CODE</div>
          </article>
        </section>
      </main>

      <footer className="py-10 text-center text-sm text-stone-400">
        &copy; 2026 {data.names}
      </footer>
    </div>
  );
}