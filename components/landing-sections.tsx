import Link from "next/link";

export function LandingSections() {
  return (
    <main className="pb-24 pt-10 md:pt-16">
      <section className="section-shell">
        <div className="panel overflow-hidden px-8 py-10 md:px-12 md:py-14">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#746a5d]">
            Lecture stratégique
          </p>

          <div className="mt-5 max-w-5xl">
            <h1 className="font-serif text-[2.7rem] leading-[0.98] tracking-[-0.03em] text-ink md:text-[5.2rem]">
              Votre activité peut-elle réellement devenir viable&nbsp;?
            </h1>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="text-[1.02rem] leading-[1.85] text-[#40392f] md:text-[1.16rem]">
              Une lecture structurée pour voir ce qui, dans votre activité, repose
              déjà sur une base réelle, ce qui fragilise encore l’ensemble, et ce
              qu’il faudrait clarifier pour construire quelque chose de plus stable,
              de plus lisible et de plus durable.
            </p>
          </div>

          <p className="mt-6 text-sm text-[#746a5d]">
            Gratuit • Sans engagement • En quelques minutes
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/diagnostic" className="btn-primary">
              Commencer la lecture
            </Link>

            <a href="#cadre" className="btn-secondary">
              Comprendre la démarche
            </a>
          </div>
        </div>
      </section>

      <section
        id="cadre"
        className="section-shell mt-14 grid gap-6 md:mt-18 md:grid-cols-2"
      >
        <article className="panel-soft p-7 md:p-9">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#746a5d]">
            Ce que cette lecture permet
          </p>

          <h2 className="mt-4 max-w-md font-serif text-[2rem] leading-[1.08] tracking-[-0.02em] text-ink md:text-[2.35rem]">
            Voir plus clairement ce qui peut tenir, et ce qui ne tient pas encore.
          </h2>

          <ul className="mt-6 space-y-4 text-[0.98rem] leading-[1.8] text-[#40392f]">
            <li>
              • Le niveau réel de solidité de votre activité aujourd&apos;hui.
            </li>
            <li>
              • Le degré de clarté de votre positionnement et de votre structure.
            </li>
            <li>
              • Le point de tension principal qui freine encore la stabilité.
            </li>
          </ul>
        </article>

        <article className="panel-soft p-7 md:p-9">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#746a5d]">
            Ce qui est observé
          </p>

          <h2 className="mt-4 max-w-md font-serif text-[2rem] leading-[1.08] tracking-[-0.02em] text-ink md:text-[2.35rem]">
            Lire l’écart entre votre valeur réelle et la manière dont elle prend forme.
          </h2>

          <ul className="mt-6 space-y-4 text-[0.98rem] leading-[1.8] text-[#40392f]">
            <li>
              • La cohérence entre expertise, message, visibilité et passage à la demande.
            </li>
            <li>
              • La solidité de la structure déjà en place, même si elle reste partielle.
            </li>
            <li>
              • Le prochain levier logique pour avancer sans ajouter de dispersion.
            </li>
          </ul>
        </article>
      </section>
    </main>
  );
}
