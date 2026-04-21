import Link from "next/link";

export function LandingSections() {
  return (
    <main className="pb-20 pt-10 md:pt-16">
      <section className="section-shell">
        <div className="panel overflow-hidden p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6f6658]">Lecture stratégique</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">
            Peut-on réellement construire une activité viable à partir de ce que vous faites ?
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#433d33] md:text-lg">
            Une lecture claire pour comprendre si votre activité peut tenir, ce qui manque aujourd&apos;hui, et comment la structurer sans vous disperser.
          </p>
          <p className="mt-5 text-sm text-[#6f6658]">Gratuit • Sans engagement • En quelques minutes</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/diagnostic" className="btn-primary">
              Commencer la lecture
            </Link>
            <a href="#cadre" className="btn-secondary">
              Comprendre l&apos;approche
            </a>
          </div>
        </div>
      </section>

      <section id="cadre" className="section-shell mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
        <article className="panel-soft p-6 md:p-8">
          <h2 className="font-serif text-3xl text-ink">Ce que cette lecture vous permet de voir</h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#3f392f] md:text-base">
            <li>• Le niveau réel de viabilité de votre activité aujourd&apos;hui.</li>
            <li>• Le degré de maturité de votre positionnement professionnel.</li>
            <li>• Le principal point de blocage qui freine la stabilité.</li>
          </ul>
        </article>
        <article className="panel-soft p-6 md:p-8">
          <h2 className="font-serif text-3xl text-ink">Ce que cette lecture observe</h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#3f392f] md:text-base">
            <li>• Cohérence entre expertise, discours, visibilité et conversion.</li>
            <li>• Solidité de la structure déjà en place.</li>
            <li>• Prochain levier logique pour avancer sans dispersion.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
