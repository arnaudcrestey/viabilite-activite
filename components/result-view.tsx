"use client";

import type { DiagnosticResult } from "@/lib/diagnostic";
import { ProgressMap } from "@/components/progress-map";

type Props = {
  result: DiagnosticResult;
};

export function ResultView({ result }: Props) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = "Lecture de situation professionnelle";

  return (
    <main className="section-shell pb-24 pt-12 md:pb-28 md:pt-16">
      <section className="panel p-8 md:p-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6f6658]">Lecture de situation</p>
        <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.08] text-ink md:text-6xl">
          Votre activité repose sur une base réelle. Elle a besoin d&apos;une structure pour devenir stable.
        </h1>
        <p className="mt-7 max-w-3xl text-base leading-relaxed text-[#433d33] md:text-xl">
          Cette lecture met en évidence votre position actuelle, ce qui freine aujourd&apos;hui la stabilité, et la prochaine direction à clarifier.
        </p>

        <ProgressMap activityStage={result.activityStage} />
      </section>

      <section className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
        <Card title="Lecture globale" content={result.summary} />
        <Card title="Position actuelle" content={result.activityStage} />
        <Card title="Ce qui bloque aujourd'hui" content={result.mainBlock} />
        <Card title="Ce qui existe déjà" content={result.whatAlreadyExists} />
        <Card title="Ce qui manque pour stabiliser" content={result.missingStructure} />
        <Card title="Prochaine étape" content={result.nextStep} />
      </section>

      <section className="panel-soft mt-10 p-7 md:mt-14 md:p-10">
        <p className="text-base leading-relaxed text-[#3f392f] md:text-lg">
          Ce que vous cherchez à construire ne repose pas uniquement sur votre métier, mais sur un ensemble structuré.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a className="btn-primary" href="https://arnaudcrestey.com" target="_blank" rel="noreferrer">
            Découvrir une approche plus structurée
          </a>
          <a
            href="https://arnaudcrestey.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#5f574b] underline-offset-4 hover:underline"
          >
            arnaudcrestey.com
          </a>
        </div>
      </section>

      <section className="mt-10 panel-soft p-6 md:mt-14 md:p-8">
        <h2 className="font-serif text-2xl text-ink">Partager cette lecture</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            className="btn-secondary"
            target="_blank"
            rel="noreferrer"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          >
            LinkedIn
          </a>
          <a
            className="btn-secondary"
            target="_blank"
            rel="noreferrer"
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
          >
            WhatsApp
          </a>
          <button type="button" className="btn-secondary" onClick={() => navigator.clipboard.writeText(shareUrl)}>
            Copier le lien
          </button>
        </div>
      </section>

      <p className="mt-10 text-center text-xs uppercase tracking-[0.14em] text-[#7b7263] md:mt-14">
        Lecture de viabilité •{" "}
        <a href="https://arnaudcrestey.com" className="underline-offset-4 hover:underline">
          arnaudcrestey.com
        </a>
      </p>
    </main>
  );
}

function Card({ title, content }: { title: string; content: string }) {
  return (
    <article className="panel-soft p-6 md:p-7">
      <h3 className="text-xs uppercase tracking-[0.14em] text-[#6f6658]">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-[#3f392f] md:text-base">{content}</p>
    </article>
  );
}
