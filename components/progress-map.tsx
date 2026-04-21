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
    <section className="mt-8 rounded-[1.6rem] border border-[#d9cdb9] bg-[linear-gradient(180deg,#fcf8f1_0%,#f7f0e3_100%)] px-6 py-6 shadow-[0_16px_40px_rgba(95,71,35,0.06)] md:mt-10 md:px-8 md:py-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#7b7062]">
            Carte de position
          </p>
          <h2 className="mt-3 font-serif text-[1.7rem] leading-[1.08] tracking-[-0.02em] text-ink md:text-[2.2rem]">
            Position actuelle dans la dynamique de structuration
          </h2>
        </div>

        <div className="rounded-full border border-[#d8cab3] bg-[#fbf7ef] px-4 py-2 text-sm text-[#6a6053]">
          Lecture estimée : {stage.label}
        </div>
      </div>

      <div className="mt-8">
        <div className="relative px-2 md:px-4">
          <div className="absolute left-[2%] right-[2%] top-[28px] h-[2px] bg-[#cfbea1]" />

          <div
            className="absolute top-[18px] h-[22px] w-[22px] -translate-x-1/2 rounded-full border border-[#ab8750] bg-[#f7efdf] shadow-[0_0_0_7px_rgba(171,135,80,0.11),0_10px_20px_rgba(120,90,43,0.15)]"
            style={{ left: `${stage.x}%` }}
          >
            <div className="absolute inset-[5px] rounded-full bg-[#ab8750]" />
          </div>

          <div className="relative grid grid-cols-5 gap-2 pt-12">
            {STAGES.map((item) => {
              const active = item.label === stage.label;
              const passed = item.x < stage.x;

              return (
                <div key={item.label} className="text-center">
                  <div
                    className={[
                      "mx-auto h-2.5 w-2.5 rounded-full border transition-all duration-300",
                      active
                        ? "border-[#ab8750] bg-[#ab8750] shadow-[0_0_0_5px_rgba(171,135,80,0.12)]"
                        : passed
                        ? "border-[#c5ad85] bg-[#dcc7a6]"
                        : "border-[#d6cab8] bg-[#f7f2e8]",
                    ].join(" ")}
                  />
                  <p
                    className={[
                      "mt-4 text-[11px] leading-relaxed md:text-xs",
                      active
                        ? "font-medium text-[#5a4b37]"
                        : "text-[#7f7365]",
                    ].join(" ")}
                  >
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-7 rounded-[1.2rem] border border-[#dfd2be] bg-[#fdf9f1] px-5 py-4 md:px-6">
          <p className="text-sm leading-[1.8] text-[#4a4237] md:text-[15px]">
            Cette carte situe votre activité non comme un score, mais comme un
            niveau de structuration actuellement perceptible à partir de votre
            situation, de vos tensions et de votre degré de clarification.
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
