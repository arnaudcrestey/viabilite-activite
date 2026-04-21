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
  const progress = useMemo(() => Math.round(((index + 1) / (questions.length + 1)) * 100), [index]);

  const handleNext = async () => {
    if (index < questions.length - 1) {
      setIndex((current) => current + 1);
      return;
    }

    setIsLoading(true);
    const response = await fetch("/api/diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, freeText })
    });

    const result = await response.json();
    const encoded = encodeURIComponent(JSON.stringify(result));
    router.push(`/lecture?data=${encoded}`);
  };

  const canContinue = index < questions.length ? Boolean(answers[question?.id]) : freeText.trim().length > 4;

  return (
    <main className="section-shell py-10 md:py-14">
      <div className="panel mx-auto max-w-3xl p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.18em] text-[#6f6658]">Diagnostic de viabilité</p>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#ddd3c2]">
          <div className="h-full rounded-full bg-[#8a6d3f] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {index < questions.length ? (
          <div className="mt-8">
            <h1 className="font-serif text-3xl leading-snug text-ink md:text-4xl">{question.title}</h1>
            <div className="mt-6 space-y-3">
              {question.options.map((option) => {
                const selected = answers[question.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                    className={`w-full rounded-2xl border px-5 py-4 text-left text-sm leading-relaxed transition md:text-base ${
                      selected
                        ? "border-[#8a6d3f] bg-[#f3ecdd] text-[#2d2922]"
                        : "border-[#d8cebc] bg-[#fcf9f2] text-[#3d372d] hover:bg-[#f4ecdf]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <h1 className="font-serif text-3xl leading-snug text-ink md:text-4xl">
              Si vous deviez résumer votre situation actuelle en une phrase…
            </h1>
            <textarea
              value={freeText}
              onChange={(event) => setFreeText(event.target.value)}
              className="mt-5 min-h-36 w-full rounded-2xl border border-[#d8cebc] bg-[#fcf9f2] p-4 text-sm text-[#3d372d] outline-none ring-[#8a6d3f] transition focus:ring-2"
              placeholder="Décrivez votre contexte de manière simple et directe."
            />
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setIndex((current) => Math.max(current - 1, 0))}
            disabled={index === 0}
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
            {isLoading ? "Lecture en cours..." : index === questions.length - 1 ? "Passer à la lecture" : "Continuer"}
          </button>
        </div>
      </div>
    </main>
  );
}
