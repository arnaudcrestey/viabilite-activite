"use client";

import { useState } from "react";
import type { DiagnosticResult } from "@/lib/diagnostic";
import { ProgressMap } from "@/components/progress-map";

type Props = {
  result: DiagnosticResult;
};

export function ResultView({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = "Lecture de situation professionnelle";

  async function handleCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="section-shell pb-20 pt-8 md:pb-28 md:pt-14">
      <section className="panel overflow-hidden px-5 py-6 shadow-[0_24px_70px_rgba(81,61,31,0.05)] sm:px-7 sm:py-8 md:px-12 md:py-12">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#7a6f62] md:text-[11px]">
                Lecture de situation
              </p>
              <p className="mt-1 text-xs text-[#7a6f62] md:text-sm">
                Restitution structurée • lecture guidée
              </p>
            </div>

            <div className="mx-auto w-fit rounded-full border border-[#ddd1bd] bg-[#fbf7ef] px-3 py-1.5 text-[11px] text-[#685f53] md:mx-0 md:px-4 md:py-2 md:text-sm">
              Activité • positionnement • structure
            </div>
          </div>

          <div className="mx-auto max-w-[19rem] text-center sm:max-w-[28rem] md:mx-0 md:max-w-[42rem] md:text-left lg:max-w-[48rem]">
            <h1 className="font-serif text-[2.25rem] leading-[0.98] tracking-[-0.03em] text-ink sm:text-[2.9rem] md:text-[3.8rem] lg:text-[4.35rem]">
              {result.heroTitle}
            </h1>
          </div>

          <div className="mx-auto max-w-3xl text-center md:mx-0 md:text-left">
            <p className="text-[0.98rem] leading-[1.75] text-[#443c31] md:text-[1.12rem] md:leading-[1.85]">
              {result.summary}
            </p>
          </div>

          <div className="mt-1">
            <ProgressMap activityStage={result.activityStage} />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
        <InsightCard
          eyebrow="Lecture globale"
          title="Ce que cette lecture fait apparaître"
          content={result.activityStage}
        />

        <InsightCard
          eyebrow="Point de tension"
          title="Ce qui freine encore la stabilité"
          content={result.mainBlock}
          emphasis
        />

        <InsightCard
          eyebrow="Base existante"
          title="Ce qui est déjà présent et exploitable"
          content={result.whatAlreadyExists}
        />

        <InsightCard
          eyebrow="Direction utile"
          title="Le prochain levier logique à clarifier"
          content={result.nextStep}
        />
      </section>

      <section className="panel-soft mt-8 px-5 py-6 sm:px-7 sm:py-7 md:mt-12 md:px-10 md:py-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#7a6f62] md:text-[11px]">
            Suite possible
          </p>

          <h2 className="mt-3 font-serif text-[1.9rem] leading-[1.04] tracking-[-0.025em] text-ink sm:text-[2.25rem] md:mt-4 md:text-[3rem]">
            Quand une base existe, le vrai enjeu n’est plus de repartir de zéro.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-[0.98rem] leading-[1.75] text-[#443c31] md:mt-5 md:text-[1.08rem] md:leading-[1.85]">
            {result.missingStructure}
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-[0.98rem] leading-[1.75] text-[#443c31] md:mt-5 md:text-[1.08rem] md:leading-[1.85]">
            {result.ctaBridge}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-5 md:mt-10 md:gap-6">
          <a
            className="btn-primary"
            href="https://arnaudcrestey.com"
            target="_blank"
            rel="noreferrer"
          >
            Faire un point sur votre situation
          </a>

          <BrandSignature />
        </div>
      </section>

      <section className="panel-soft mt-8 px-5 py-6 sm:px-7 sm:py-7 md:mt-12 md:px-8 md:py-8">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#7a6f62] md:text-[11px]">
            Partage
          </p>

          <h2 className="mt-3 font-serif text-[1.9rem] leading-[1.08] text-ink sm:text-[2.2rem]">
            Partager cette lecture
          </h2>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              className="btn-secondary"
              target="_blank"
              rel="noreferrer"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                shareUrl
              )}`}
            >
              LinkedIn
            </a>

            <a
              className="btn-secondary"
              target="_blank"
              rel="noreferrer"
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `${shareText} ${shareUrl}`
              )}`}
            >
              WhatsApp
            </a>

            <button type="button" className="btn-secondary" onClick={handleCopy}>
              {copied ? "Lien copié" : "Copier le lien"}
            </button>
          </div>
        </div>
      </section>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.18em] text-[#857a6d] md:mt-12 md:text-[11px]">
        Lecture de viabilité • arnaudcrestey.com
      </p>
    </main>
  );
}

function InsightCard({
  eyebrow,
  title,
  content,
  emphasis = false,
}: {
  eyebrow: string;
  title: string;
  content: string;
  emphasis?: boolean;
}) {
  return (
    <article
      className={[
        "panel-soft h-full px-5 py-5 text-center sm:px-6 sm:py-6 md:px-7 md:py-7 md:text-left",
        emphasis
          ? "border-[#ccb38a] bg-[linear-gradient(180deg,#fffaf1_0%,#f8f0e2_100%)] shadow-[0_18px_42px_rgba(112,82,38,0.06)]"
          : "",
      ].join(" ")}
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-[#7a6f62] md:text-[11px]">
        {eyebrow}
      </p>

      <h3 className="mt-3 font-serif text-[1.45rem] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[1.6rem] md:mt-4 md:text-[2rem]">
        {title}
      </h3>

      <p className="mt-4 text-[0.96rem] leading-[1.75] text-[#433c31] md:mt-5 md:text-base md:leading-[1.85]">
        {content}
      </p>
    </article>
  );
}

function BrandSignature() {
  return (
    <a
      href="https://arnaudcrestey.com"
      target="_blank"
      rel="noreferrer"
      aria-label="Découvrir arnaudcrestey.com"
      className="group inline-flex w-fit flex-col items-center justify-center rounded-[1.3rem] border border-[#ddd1bd] bg-[#fbf7ef] px-6 py-5 text-center transition hover:border-[#c9b28c] hover:bg-[#fcf8f1]"
    >
      <span className="font-serif text-[3rem] leading-none tracking-[-0.06em] text-ink sm:text-[3.5rem] md:text-[3.9rem]">
        AC
      </span>

      <span className="-mt-1 font-serif text-[1.05rem] leading-none text-ink sm:text-[1.18rem] md:text-[1.24rem]">
        arnaudcrestey.com
      </span>

      <span className="mt-4 h-px w-16 bg-[#d8cab3] transition-all duration-300 group-hover:w-20" />
    </a>
  );
}
