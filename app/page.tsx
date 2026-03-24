import { LumiaChat } from "@/components/lumia/lumia-chat";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-zinc-100">
      <section className="mx-auto flex max-w-3xl flex-col items-start gap-6">
        <p className="text-xs text-zinc-500 uppercase tracking-[0.35em]">
          Accueil
        </p>
        <h1 className="font-light text-5xl tracking-[0.25em]">L&apos;ARCHE</h1>
        <a
          className="rounded-full border border-white/40 px-6 py-3 text-sm uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
          href="#miroir-lumia"
        >
          Miroir de Lumia
        </a>
      </section>

      <div id="miroir-lumia">
        <LumiaChat />
      </div>
    </main>
  );
}
