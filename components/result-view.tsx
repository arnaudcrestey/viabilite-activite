"use client";

import { useMemo, useState } from "react";
import type { DiagnosticResult } from "@/lib/diagnostic";
import { ProgressMap } from "@/components/progress-map";

type Props = {
  result: DiagnosticResult;
};

export function ResultView({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = "Lecture de situation professionnelle";

  const heroTitle = useMemo(() => getHeroTitle(result), [result]);
  const heroIntro = useMemo(() => getHeroIntro(result), [result]);

  async function handleCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="section-shell pb-24 pt-10 md:pb-28 md:pt-16">
      <section className="panel overflow-hidden px-7 py-8 shadow-[0_28px_80px_rgba(81,61,31,0.06)] md:px-12 md:py-12">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a6f62]">
                Lecture de situation
              </p>
              <p className="mt-2 text-sm text-[#7a6f62]">
                Restitution structurée • lecture guidée
              </p>
            </div>

            <div className="rounded-full border border-[#ddd1bd] bg-[#fbf7ef] px-4 py-2 text-sm text-[#685f53]">
              Activité • positionnement • structure
            </div>
          </div>

          <div className="max-w-5xl">
            <h1 className="font-serif text-[2.45rem] leading-[0.98] tracking-[-0.03em] text-ink md:text-[4.9rem]">
              {heroTitle}
            </h1>
          </div>

          <div className="max-w-3xl">
            <p className="text-[1rem] leading-[1.85] text-[#443c31] md:text-[1.16rem]">
              {heroIntro}
            </p>
          </div>

          <div className="mt-1">
            <ProgressMap activityStage={result.activityStage} />
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:mt-14 md:grid-cols-12 md:gap-6">
        <InsightCard
          className="md:col-span-7"
          eyebrow="Lecture globale"
          title="Ce que cette lecture fait apparaître"
          content={result.summary}
        />

        <InsightCard
          className="md:col-span-5"
          eyebrow="Position actuelle"
          title="Là où votre activité se situe aujourd’hui"
          content={result.activityStage}
        />

        <InsightCard
          className="md:col-span-6"
          eyebrow="Point de tension"
          title="Ce qui freine encore la stabilité"
          content={result.mainBlock}
        />

        <InsightCard
          className="md:col-span-6"
          eyebrow="Base existante"
          title="Ce qui est déjà présent et exploitable"
          content={result.whatAlreadyExists}
        />

        <InsightCard
          className="md:col-span-6"
          eyebrow="Structure manquante"
          title="Ce qu’il manque pour rendre l’ensemble plus solide"
          content={result.missingStructure}
        />

        <InsightCard
          className="md:col-span-6"
          eyebrow="Direction utile"
          title="Le prochain levier logique à clarifier"
          content={result.nextStep}
          emphasis
        />
      </section>

      <section className="panel-soft mt-10 px-7 py-8 md:mt-14 md:px-10 md:py-10">
        <div className="max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#7a6f62]">
            Suite possible
          </p>

          <h2 className="mt-4 max-w-3xl font-serif text-[2rem] leading-[1.05] tracking-[-0.025em] text-ink md:text-[3rem]">
            Quand une base existe, le vrai enjeu n’est plus de repartir de zéro.
          </h2>

          <p className="mt-5 max-w-3xl text-[1rem] leading-[1.85] text-[#443c31] md:text-[1.08rem]">
            L’enjeu devient de structurer proprement ce qui est déjà là&nbsp;:
            clarifier l’offre, rendre le message plus lisible, organiser le point
            d’entrée, et créer un ensemble qui tienne dans la durée.
          </p>

          <p className="mt-5 max-w-3xl text-[1rem] leading-[1.85] text-[#443c31] md:text-[1.08rem]">
            {result.ctaBridge}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            className="btn-primary"
            href="https://arnaudcrestey.com"
            target="_blank"
            rel="noreferrer"
          >
            Découvrir arnaudcrestey.com
          </a>

          <a
            href="https://arnaudcrestey.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#675d51] underline-offset-4 hover:underline"
          >
            Une approche plus structurée, plus claire, plus durable
          </a>
        </div>
      </section>

      <section className="panel-soft mt-10 px-7 py-7 md:mt-14 md:px-8 md:py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#7a6f62]">
              Partage
            </p>
            <h2 className="mt-3 font-serif text-[1.7rem] leading-[1.1] text-ink md:text-[2.15rem]">
              Partager cette lecture
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-[#645b4f]">
            Vous pouvez conserver cette lecture, l’envoyer, ou la reprendre plus tard.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
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

          <button type="button" className="btn-secondary" onClick={handleCopy}>
            {copied ? "Lien copié" : "Copier le lien"}
          </button>
        </div>
      </section>

      <p className="mt-10 text-center text-[11px] uppercase tracking-[0.18em] text-[#857a6d] md:mt-14">
        Lecture de viabilité •{" "}
        <a
          href="https://arnaudcrestey.com"
          className="underline-offset-4 hover:underline"
        >
          arnaudcrestey.com
        </a>
      </p>
    </main>
  );
}

function InsightCard({
  eyebrow,
  title,
  content,
  className = "",
  emphasis = false,
}: {
  eyebrow: string;
  title: string;
  content: string;
  className?: string;
  emphasis?: boolean;
}) {
  return (
    <article
      className={[
        "panel-soft h-full px-6 py-6 md:px-7 md:py-7",
        emphasis
          ? "border-[#ccb38a] bg-[linear-gradient(180deg,#fffaf1_0%,#f8f0e2_100%)] shadow-[0_18px_42px_rgba(112,82,38,0.07)]"
          : "",
        className,
      ].join(" ")}
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#7a6f62]">
        {eyebrow}
      </p>

      <h3 className="mt-4 max-w-lg font-serif text-[1.7rem] leading-[1.08] tracking-[-0.02em] text-ink md:text-[2rem]">
        {title}
      </h3>

      <p className="mt-5 text-[15px] leading-[1.85] text-[#433c31] md:text-base">
        {content}
      </p>
    </article>
  );
}

function getHeroTitle(result: DiagnosticResult) {
  const base = `${result.activityStage} ${result.missingStructure} ${result.mainBlock}`.toLowerCase();

  if (
    base.includes("base réelle") ||
    base.includes("base solide") ||
    base.includes("crédible") ||
    base.includes("identifiable")
  ) {
    return "Votre activité repose sur quelque chose de réel. Elle doit maintenant trouver sa forme stable.";
  }

  if (
    base.includes("diffus") ||
    base.includes("flou") ||
    base.includes("clarifier") ||
    base.includes("positionnement")
  ) {
    return "Votre activité ne manque pas forcément de fond. Elle manque surtout de clarté structurante.";
  }

  if (
    base.includes("demandes") ||
    base.includes("régularité") ||
    base.includes("visibilité") ||
    base.includes("conversion")
  ) {
    return "Le sujet n’est pas seulement de faire plus. Le sujet est de rendre l’ensemble plus cohérent et plus stable.";
  }

  return "Votre activité peut tenir. Mais elle a besoin d’un cadre plus net pour devenir réellement viable.";
}

function getHeroIntro(result: DiagnosticResult) {
  if (result.summary?.trim()) {
    return result.summary;
  }

  return "Cette lecture met en évidence votre position actuelle, le point de tension principal, ce qui existe déjà, et ce qui devrait être clarifié pour construire une activité plus stable, plus lisible et plus durable.";
}
