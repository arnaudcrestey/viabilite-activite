"use client";

import { useMemo } from "react";

type ProgressMapProps = {
  activityStage: string;
};

const steps = ["Idée", "Début", "Structuration", "Activité stable", "Viabilité"];

function getStepIndex(activityStage: string) {
  const stage = activityStage.toLowerCase();
  if (stage.includes("initialisation") || stage.includes("lancer")) return 1;
  if (stage.includes("engagée") || stage.includes("irrégulière")) return 2;
  if (stage.includes("solide") || stage.includes("stabilité")) return 3;
  if (stage.includes("viable") || stage.includes("durable")) return 4;
  return 2;
}

export function ProgressMap({ activityStage }: ProgressMapProps) {
  const stepIndex = useMemo(() => getStepIndex(activityStage), [activityStage]);
  const positions = [0, 25, 50, 75, 100];

  return (
    <section className="panel-soft mt-10 p-6 md:mt-14 md:p-10">
      <p className="text-xs uppercase tracking-[0.18em] text-[#736b5d]">Carte de position</p>

      <div className="relative mt-10 px-1 md:px-4">
        <div className="h-[2px] w-full bg-[#cdbfa7]" />

        <div
          className="absolute top-0 h-4 w-4 -translate-x-1/2 -translate-y-[45%] rounded-full border border-[#8d6f40] bg-[#efe5d5] shadow-[0_0_0_10px_rgba(141,111,64,0.12)] motion-safe:animate-[mapPulse_900ms_ease-out]"
          style={{ left: `${positions[stepIndex]}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-5 gap-1 text-center text-[11px] text-[#5f584d] md:text-sm">
        {steps.map((step, index) => (
          <span key={step} className={index === stepIndex ? "text-[#3f382f]" : ""}>
            {step}
          </span>
        ))}
      </div>
    </section>
  );
}
