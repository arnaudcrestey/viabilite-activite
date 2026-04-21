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
    "Votre activité repose sur des éléments réels, mais l’ensemble reste encore insuffisamment structuré pour devenir stable. La question n’est pas seulement d’en faire plus, mais de rendre l’ensemble plus lisible, plus cohérent et plus soutenable.",
  activityStage:
    "Votre activité semble engagée, avec une base existante, mais encore trop peu structurée pour tenir dans la durée.",
  mainBlock:
    "Le point de tension principal semble être l’absence de cadre clair entre offre, message, visibilité et transformation en demandes.",
  whatAlreadyExists:
    "Une matière réelle est déjà présente : expertise, intention sérieuse, premiers éléments d’activité ou de traction.",
  missingStructure:
    "Il manque une structure plus nette : une offre plus lisible, un message plus clair, un point d’entrée cohérent et une continuité dans la mise en mouvement.",
  nextStep:
    "Le prochain levier logique consiste à clarifier la colonne vertébrale de l’activité avant d’ajouter davantage d’actions ou d’outils.",
  ctaBridge:
    "Un regard extérieur plus structuré peut aider à relier ce qui existe déjà, à hiérarchiser les priorités et à faire émerger une trajectoire plus stable.",
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

function sanitizeResult(data: unknown): DiagnosticResult {
  const raw = (data ?? {}) as Partial<DiagnosticResult>;

  return {
    heroTitle: normalizeText(raw.heroTitle, FALLBACK_RESULT.heroTitle),
    summary: normalizeText(raw.summary, FALLBACK_RESULT.summary),
    activityStage: normalizeText(raw.activityStage, FALLBACK_RESULT.activityStage),
    mainBlock: normalizeText(raw.mainBlock, FALLBACK_RESULT.mainBlock),
    whatAlreadyExists: normalizeText(
      raw.whatAlreadyExists,
      FALLBACK_RESULT.whatAlreadyExists
    ),
    missingStructure: normalizeText(
      raw.missingStructure,
      FALLBACK_RESULT.missingStructure
    ),
    nextStep: normalizeText(raw.nextStep, FALLBACK_RESULT.nextStep),
    ctaBridge: normalizeText(raw.ctaBridge, FALLBACK_RESULT.ctaBridge),
  };
}

function buildPrompt(userInput: string) {
  return `
Tu es un analyste stratégique senior spécialisé dans la structuration d'activités indépendantes.

Tu produis des lectures de situation haut de gamme, sobres, précises et incarnées.
Ton objectif n’est pas d’expliquer, mais de formuler avec justesse ce qui est réellement en train de se jouer.

---

POSTURE

Tu n’es ni coach, ni vendeur, ni consultant classique.

Tu observes, tu comprends, puis tu formules.

Tu ne cherches pas à rassurer.
Tu ne cherches pas à séduire.
Tu ne cherches pas à être dur.

Tu cherches à être juste.

---

EFFET RECHERCHÉ

La personne doit ressentir :

"Ce texte parle vraiment de ma situation."
"Quelqu’un a compris ce qui se passe, sans que j’aie besoin de l’expliquer davantage."

Pas :
"c’est propre"
Pas :
"c’est intéressant"

Mais :
"c’est exactement ça"

---

NIVEAU D’EXIGENCE

Chaque phrase doit :

- apporter une lecture (pas une explication)
- être spécifique (jamais générique)
- pouvoir être contestée (donc réelle)
- refléter une situation concrète

Si une phrase peut s’appliquer à tout le monde → elle est mauvaise → tu la réécris.

---

IMPORTANT : TENSION DOUCE

Tu dois faire apparaître la réalité sans l’exagérer.

Tu peux montrer :
- une dépendance
- une instabilité
- un décalage
- une limite actuelle

Mais sans dramatiser.

---

IMPORTANT : ANCRAGE RÉEL

Tu dois privilégier :

- des formulations concrètes (rythme, demandes, flux, continuité…)
- des situations observables (irrégularité, dépendance, flou, dispersion…)
- des dynamiques réelles (ce qui avance / ce qui bloque)

---

STYLE

- ton calme, posé, adulte
- aucune emphase inutile
- aucune phrase creuse
- aucune formule type coaching
- aucune flatterie
- aucun jargon marketing
- pas de langage psychologique

Tu écris comme quelqu’un qui a vu des dizaines de cas similaires.

---

TITRE

- 6 à 9 mots idéalement
- maximum 10 mots
- une seule idée
- pas de formule générique
- pas de slogan
- doit donner immédiatement une lecture

---

LOGIQUE D’ANALYSE

Tu identifies :

1. ce qui existe réellement
2. ce qui ne tient pas encore
3. le point de tension principal
4. ce qui manque pour stabiliser
5. le prochain levier logique

---

FORMAT (JSON STRICT)

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

heroTitle :
→ lecture immédiate
→ pas explicatif
→ pas marketing

summary :
→ 2 phrases max
→ doit créer un effet miroir réel
→ doit contenir une tension implicite

activityStage :
→ situer précisément
→ éviter les formulations vagues

mainBlock :
→ nommer le vrai blocage
→ éviter les concepts abstraits
→ privilégier une réalité observable

whatAlreadyExists :
→ concret
→ factuel
→ sans valorisation inutile

missingStructure :
→ ce qui manque réellement
→ formulation claire et incarnée

nextStep :
→ levier logique
→ sobre
→ pas spectaculaire

ctaBridge :
→ ouverture naturelle
→ jamais commerciale
→ doit sembler évidente

---

INTERDIT ABSOLU

- phrases génériques
- langage de coach
- projections positives
- flatterie
- “vous êtes sur la bonne voie”
- “vous avez du potentiel”
- “il suffit de”

---

CONTEXTE À ANALYSER

${userInput}
`;
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Clé OpenAI manquante côté serveur." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const answers = body?.answers ?? {};
    const freeText =
      typeof body?.freeText === "string" ? body.freeText.trim() : "";

    const userInput = JSON.stringify(
      {
        answers,
        freeText,
      },
      null,
      2
    );

    const prompt = buildPrompt(userInput);

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      temperature: 0.45,
    });

    const text = response.output_text?.trim();

    if (!text) {
      console.error("OPENAI EMPTY RESPONSE");
      return NextResponse.json(
        { error: "Réponse OpenAI vide." },
        { status: 500 }
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch (error) {
      console.error("OPENAI RAW RESPONSE:", text);
      console.error("JSON PARSE ERROR:", error);

      return NextResponse.json(
        { error: "Réponse OpenAI invalide." },
        { status: 500 }
      );
    }

    const result = sanitizeResult(parsed);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API DIAGNOSTIC ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
