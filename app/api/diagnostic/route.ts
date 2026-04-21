import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type DiagnosticResult = {
  heroTitle: string;
  summary: string;
  activityStage: string;
  mainBlock: string;
  whatAlreadyExists: string;
  missingStructure: string;
  nextStep: string;
  ctaBridge: string;
};

const FALLBACK_RESULT: DiagnosticResult = {
  heroTitle: "Une base existe, la structure manque encore",
  summary:
    "Votre activité repose sur des éléments réels, mais reste encore insuffisamment structurée pour devenir stable.",
  activityStage:
    "Votre activité semble engagée, mais ne repose pas encore sur un cadre suffisamment solide pour tenir dans la durée.",
  mainBlock:
    "Le point de tension principal semble être l’absence de continuité entre votre offre, votre message et l’arrivée de demandes.",
  whatAlreadyExists:
    "Une base réelle est déjà présente : une expertise, une intention claire et des premiers éléments d’activité.",
  missingStructure:
    "Il manque une structuration plus nette permettant de relier votre offre, votre positionnement et un flux de demandes plus régulier.",
  nextStep:
    "Le prochain levier consiste à clarifier la colonne vertébrale de votre activité avant d’ajouter davantage d’actions.",
  ctaBridge:
    "Un regard extérieur peut aider à relier ce qui existe déjà et à structurer une trajectoire plus stable.",
};

function normalizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;

  const cleaned = value
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();

  return cleaned.length > 0 ? cleaned : fallback;
}

function sanitizeResult(data: any): DiagnosticResult {
  return {
    heroTitle: normalizeText(data.heroTitle, FALLBACK_RESULT.heroTitle),
    summary: normalizeText(data.summary, FALLBACK_RESULT.summary),
    activityStage: normalizeText(
      data.activityStage,
      FALLBACK_RESULT.activityStage
    ),
    mainBlock: normalizeText(data.mainBlock, FALLBACK_RESULT.mainBlock),
    whatAlreadyExists: normalizeText(
      data.whatAlreadyExists,
      FALLBACK_RESULT.whatAlreadyExists
    ),
    missingStructure: normalizeText(
      data.missingStructure,
      FALLBACK_RESULT.missingStructure
    ),
    nextStep: normalizeText(data.nextStep, FALLBACK_RESULT.nextStep),
    ctaBridge: normalizeText(data.ctaBridge, FALLBACK_RESULT.ctaBridge),
  };
}

function buildPrompt(userInput: string) {
  return `
Tu es un analyste stratégique senior spécialisé dans la structuration d'activités indépendantes.

Tu produis des lectures de situation haut de gamme, sobres, précises et incarnées.

---

POSTURE

Tu n’es ni coach, ni vendeur, ni consultant classique.

Tu observes, tu comprends, puis tu formules avec justesse.

Tu ne cherches pas à rassurer.
Tu ne cherches pas à séduire.
Tu ne cherches pas à impressionner.

Tu cherches uniquement à être juste.

---

EFFET RECHERCHÉ

La personne doit ressentir :

"Ce texte parle exactement de ma situation."
"Je n’aurais pas su le formuler comme ça, mais c’est juste."

---

EXIGENCE DE RÉALITÉ (CRITIQUE)

Chaque phrase doit être spécifique.

Si une phrase peut s’appliquer à n’importe qui → elle est incorrecte → tu la réécris.

Tu dois privilégier :

- des situations concrètes (irrégularité, dépendance, manque de flux…)
- des dynamiques réelles (ce qui avance / ce qui bloque)
- des formulations incarnées

Tu dois éviter :

- toute phrase générique
- toute formulation “propre mais vide”
- toute logique de conseil ou de coaching

---

TENSION DOUCE

Tu peux faire apparaître :

- une instabilité
- une dépendance
- une limite actuelle

Mais sans dramatiser.

---

STYLE

- ton calme, posé, adulte
- aucune flatterie
- aucune projection positive
- aucune phrase creuse
- aucun jargon marketing

---

TITRE

- 6 à 9 mots idéalement
- maximum 10 mots
- une seule idée
- pas de slogan
- doit donner une lecture immédiate

---

FORMAT JSON STRICT

{
  "heroTitle": "",
  "summary": "",
  "activityStage": "",
  "mainBlock": "",
  "whatAlreadyExists": "",
  "missingStructure": "",
  "nextStep": "",
  "ctaBridge": ""
}

---

RÈGLES PAR CHAMP

summary :
→ 2 phrases max
→ effet miroir réel

mainBlock :
→ nommer le vrai blocage
→ concret, observable

nextStep :
→ levier logique
→ sobre

ctaBridge :
→ ouverture naturelle
→ jamais commerciale

---

CONTEXTE À ANALYSER

${userInput}
`;
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Clé OpenAI manquante." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const userInput = JSON.stringify(
      {
        answers: body?.answers ?? {},
        freeText: body?.freeText ?? "",
      },
      null,
      2
    );

    const prompt = buildPrompt(userInput);

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      input: prompt,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "diagnostic",
          schema: {
            type: "object",
            properties: {
              heroTitle: { type: "string" },
              summary: { type: "string" },
              activityStage: { type: "string" },
              mainBlock: { type: "string" },
              whatAlreadyExists: { type: "string" },
              missingStructure: { type: "string" },
              nextStep: { type: "string" },
              ctaBridge: { type: "string" },
            },
            required: [
              "heroTitle",
              "summary",
              "activityStage",
              "mainBlock",
              "whatAlreadyExists",
              "missingStructure",
              "nextStep",
              "ctaBridge",
            ],
          },
        },
      },
    });

    console.log("OPENAI RESPONSE:", JSON.stringify(response, null, 2));

    let text = response.output_text?.trim();

    if (!text && response.output) {
      try {
        const content = response.output[0]?.content?.[0];

        if (content?.type === "output_text" && content.text) {
          text = content.text.trim();
        } else if (content?.type === "output_json" && content.json) {
          return NextResponse.json(sanitizeResult(content.json));
        }
      } catch (e) {
        console.error("FALLBACK PARSE ERROR:", e);
      }
    }

    if (!text) {
      console.error("EMPTY RESPONSE");
      return NextResponse.json(FALLBACK_RESULT);
    }

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("JSON PARSE ERROR:", err);
      console.error("RAW TEXT:", text);
      return NextResponse.json(FALLBACK_RESULT);
    }

    return NextResponse.json(sanitizeResult(parsed));
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(FALLBACK_RESULT);
  }
}
