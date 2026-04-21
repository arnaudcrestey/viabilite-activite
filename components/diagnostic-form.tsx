"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/diagnostic";

export function DiagnosticForm() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [freeText, setFreeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const question = questions[index];
  const totalSteps = questions.length + 1;

  const progress = useMemo(() => {
    return Math.round(((index + 1) / totalSteps) * 100);
  }, [index, totalSteps]);

  const isLastChoiceStep = index === questions.length - 1;
  const isFreeTextStep = index === questions.length;

  const canContinue = isFreeTextStep
    ? freeText.trim().length > 4
    : Boolean(question && answers[question.id]);

  async function handleNext() {
    if (index < questions.length) {
      if (index < questions.length - 1) {
        setIndex((current) => current + 1);
        return;
      }

      setIndex((current) => current + 1);
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, freeText }),
      });

      const result = await response.json();
      const encoded = encodeURIComponent(JSON.stringify(result));

      router.push(`/lecture?data=${encoded}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handlePrevious() {
    setIndex((current) => Math.max(current - 1, 0));
  }

  return (
    <main className="section-shell py-10 md:py-16">
      <div className="panel mx-auto max-w-3xl px-6 py-7 shadow-[0_24px_70px_rgba(80,62,32,0.06)] md:px-10 md:py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#746a5d]">
              Diagnostic de viabilité
            </p>
            <p className="mt-2 text-sm text-[#746a5d]">
              Étape {Math.min(index + 1, totalSteps)} sur {totalSteps}
            </p>
          </div>

          <p className="hidden text-sm text-[#746a5d] md:block">
            Lecture guidée • environ 3 minutes
          </p>
        </div>

        <div className="mt-5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#d9cfbf]">
            <div
              className="h-full rounded-full bg-[#9a7844] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!isFreeTextStep && question ? (
          <div className="mt-9 md:mt-10">
            <h1 className="max-w-2xl font-serif text-[2.15rem] leading-[1.08] tracking-[-0.025em] text-ink md:text-[3rem]">
              {question.title}
            </h1>

            <div className="mt-7 space-y-3">
              {question.options.map((option) => {
                const selected = answers[question.id] === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: option,
                      }))
                    }
                    className={`group w-full rounded-[1.15rem] border px-5 py-4 text-left text-[15px] leading-[1.65] transition-all duration-200 md:px-6 md:py-4 md:text-base ${
                      selected
                        ? "border-[#9a7844] bg-[#f5ede0] text-[#2f2922] shadow-[0_10px_24px_rgba(120,92,48,0.08)]"
                        : "border-[#d7cdbd] bg-[#fdfaf4] text-[#40392f] hover:border-[#c6b08a] hover:bg-[#f7f0e4]"
                    }`}
                  >
                    <span className="block pr-6">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-9 md:mt-10">
            <h1 className="max-w-2xl font-serif text-[2.15rem] leading-[1.08] tracking-[-0.025em] text-ink md:text-[3rem]">
              Si vous deviez résumer votre situation actuelle en une phrase
            </h1>

            <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-[#4b4338] md:text-base">
              Quelques mots suffisent. L’idée n’est pas de tout raconter, mais de
              faire apparaître clairement votre point de départ.
            </p>

            <textarea
              value={freeText}
              onChange={(event) => setFreeText(event.target.value)}
              placeholder="Décrivez votre situation de manière simple, directe et concrète."
              className="mt-6 min-h-[180px] w-full rounded-[1.35rem] border border-[#d7cdbd] bg-[#fdfaf4] px-5 py-4 text-[15px] leading-[1.7] text-[#3d372d] outline-none transition focus:border-[#9a7844] focus:ring-2 focus:ring-[#9a7844]/20 md:px-6 md:py-5 md:text-base"
            />
          </div>
        )}

        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#e3d9c9] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={index === 0 || isLoading}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Étape précédente
          </button>

          <button
            type="button"
            disabled={!canContinue || isLoading}
            onClick={handleNext}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "Lecture en cours..."
              : isFreeTextStep
              ? "Accéder à la lecture"
              : isLastChoiceStep
              ? "Continuer"
              : "Continuer"}
          </button>
        </div>
      </div>
    </main>
  );
}
