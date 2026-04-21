import { ResultView } from "@/components/result-view";
import type { DiagnosticResult } from "@/lib/diagnostic";

function parseData(data: string | undefined): DiagnosticResult {
  if (!data) {
    return {
      heroTitle: "Aucune lecture disponible pour le moment.",
      summary: "Aucune lecture disponible pour le moment.",
      activityStage: "Démarrez le diagnostic pour obtenir une lecture précise.",
      mainBlock: "Non disponible.",
      whatAlreadyExists: "Non disponible.",
      missingStructure: "Non disponible.",
      nextStep: "Non disponible.",
      ctaBridge:
        "Vous pouvez relancer le diagnostic pour accéder à une restitution complète.",
    };
  }

  try {
    return JSON.parse(decodeURIComponent(data)) as DiagnosticResult;
  } catch {
    return {
      heroTitle: "Les données de restitution sont incomplètes.",
      summary: "Les données de restitution sont incomplètes.",
      activityStage: "Relancez le diagnostic pour une lecture complète.",
      mainBlock: "Non disponible.",
      whatAlreadyExists: "Non disponible.",
      missingStructure: "Non disponible.",
      nextStep: "Non disponible.",
      ctaBridge: "Revenez au diagnostic pour régénérer la lecture.",
    };
  }
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const params = await searchParams;
  const result = parseData(params.data);

  return <ResultView result={result} />;
}
