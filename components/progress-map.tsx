import { useMemo } from "react";

type Props = {
  activityStage: string;
};

const STAGES = [
  { label: "Idée", x: 8 },
  { label: "Début", x: 28 },
  { label: "Structuration", x: 50 },
  { label: "Activité stable", x: 74 },
  { label: "Viabilité", x: 92 },
];

export function ProgressMap({ activityStage }: Props) {
  const stage = useMemo(() => resolveStage(activityStage), [activityStage]);

  return (
    <section className="mt-7 rounded-[1.4rem] border border-[#d9cdb9] bg-[linear-gradient(180deg,#fcf8f1_0%,#f7f0e3_100%)] px-4 py-5 shadow-[0_14px_36px_rgba(95,71,35,0.05)] sm:px-5 sm:py-6 md:mt-10 md:rounded-[1.6rem] md:px-8 md:py-8">
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#7b7062] md:text-[11px]">
            Carte de position
          </p>
          <h2 className="mt-2 font-serif text-[1.35rem] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[1.6rem] md:mt-3 md:text-[2.2rem]">
            Position actuelle dans la dynamique de structuration
          </h2>
        </div>

        <div className="w-fit rounded-full border border-[#d8cab3] bg-[#fbf7ef] px-3 py-1.5 text-[11px] text-[#6a6053] md:px-4 md:py-2 md:text-sm">
          Lecture estimée : {stage.label}
        </div>
      </div>

      <div className="mt-7">
        <div className="relative px-1 sm:px-2 md:px-4">
          <div className="absolute left-[2%] right-[2%] top-[22px] h-[2px] bg-[#cfbea1] md:top-[28px]" />

          <div
            className="absolute top-[12px] h-[20px] w-[20px] -translate-x-1/2 rounded-full border border-[#ab8750] bg-[#f7efdf] shadow-[0_0_0_6px_rgba(171,135,80,0.12),0_8px_18px_rgba(120,90,43,0.14)] md:top-[16px] md:h-[26px] md:w-[26px] md:shadow-[0_0_0_7px_rgba(171,135,80,0.12),0_10px_20px_rgba(120,90,43,0.15)]"
            style={{ left: `${stage.x}%` }}
          >
            <div className="absolute inset-[4px] rounded-full bg-[#ab8750] md:inset-[5px]" />
          </div>

          <div className="relative grid grid-cols-5 gap-1 pt-9 md:gap-2 md:pt-12">
            {STAGES.map((item) => {
              const active = item.label === stage.label;
              const passed = item.x < stage.x;

              return (
                <div key={item.label} className="text-center">
                  <div
                    className={[
                      "mx-auto h-2 w-2 rounded-full border transition-all duration-300 md:h-2.5 md:w-2.5",
                      active
                        ? "border-[#ab8750] bg-[#ab8750] shadow-[0_0_0_4px_rgba(171,135,80,0.12)] md:shadow-[0_0_0_5px_rgba(171,135,80,0.12)]"
                        : passed
                        ? "border-[#c5ad85] bg-[#dcc7a6]"
                        : "border-[#d6cab8] bg-[#f7f2e8]",
                    ].join(" ")}
                  />
                  <p
                    className={[
                      "mt-3 text-[9px] leading-relaxed sm:text-[10px] md:mt-4 md:text-xs",
                      active ? "font-medium text-[#5a4b37]" : "text-[#7f7365]",
                    ].join(" ")}
                  >
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-[1rem] border border-[#dfd2be] bg-[#fdf9f1] px-4 py-3 text-center md:mt-7 md:rounded-[1.2rem] md:px-6 md:py-4">
          <p className="mx-auto max-w-3xl text-[13px] leading-[1.7] text-[#4a4237] md:text-[15px] md:leading-[1.8]">
            Cette carte situe votre activité comme un niveau de structuration
            actuellement perceptible à partir de votre situation, de vos tensions
            et de votre degré de clarification.
          </p>
        </div>
      </div>
    </section>
  );
}

function resolveStage(activityStage: string) {
  const text = activityStage.toLowerCase();

  if (
    text.includes("viable") ||
    text.includes("très solide") ||
    text.includes("très stable")
  ) {
    return STAGES[4];
  }

  if (
    text.includes("stable") ||
    text.includes("cadre explicite") ||
    text.includes("activité lisible") ||
    text.includes("soutenable")
  ) {
    return STAGES[3];
  }

  if (
    text.includes("structure") ||
    text.includes("structuration") ||
    text.includes("positionnement") ||
    text.includes("clarifier") ||
    text.includes("cadre")
  ) {
    return STAGES[2];
  }

  if (
    text.includes("début") ||
    text.includes("premiers clients") ||
    text.includes("premières demandes") ||
    text.includes("préparation") ||
    text.includes("traction")
  ) {
    return STAGES[1];
  }

  return STAGES[0];
}
