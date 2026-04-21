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
Tu es un analyste stratégique senior.
Tu rédiges une lecture de viabilité sobre, crédible, structurée et haut de gamme.
Tu n'écris jamais comme un coach, un marketeur, un vendeur ou un outil SaaS.

OBJECTIF
À partir des réponses d'un professionnel indépendant, produire une lecture sérieuse, utile, concise et directement exploitable.

STYLE
- ton calme, net, posé
- aucune flatterie
- aucun jargon marketing
- aucune promesse excessive
- aucune formule creuse
- pas de score
- pas de vocabulaire psychologisant
- pas de ton commercial
- chaque phrase doit sembler écrite par une personne expérimentée

IMPORTANT POUR LE TITRE
- le titre principal doit être court, fort, éditorial, crédible
- maximum 10 mots
- idéalement 6 à 9 mots
- une seule idée centrale
- pas de phrase longue explicative
- pas de deux-points
- pas de guillemets
- pas de banalités
- pas de formulation dramatique forcée
- pas de "potentiel", "réussite", "avenir radieux"

FORMAT DE SORTIE
Retourne uniquement un JSON strict valide, sans markdown, sans texte autour.

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

RÈGLES PAR CHAMP

- heroTitle :
  titre principal de la lecture
  court, fort, éditorial, premium, crédible
  10 mots maximum
  une seule idée
  immédiatement lisible

- summary :
  2 phrases maximum
  synthèse globale de la situation
  doit être dense, claire et sobre

- activityStage :
  situe la phase actuelle avec précision
  1 ou 2 phrases maximum

- mainBlock :
  identifie le vrai point de tension
  1 ou 2 phrases maximum

- whatAlreadyExists :
  ce qui est déjà réel, exploitable, crédible
  1 ou 2 phrases maximum

- missingStructure :
  ce qui manque concrètement pour stabiliser
  1 ou 2 phrases maximum

- nextStep :
  prochain levier logique
  concret, crédible, non spectaculaire
  1 ou 2 phrases maximum

- ctaBridge :
  ouverture naturelle vers un accompagnement de structuration
  jamais commerciale
  doit faire sentir qu'un regard plus global peut aider
  1 ou 2 phrases maximum

CONTEXTE À ANALYSER
${userInput}
`.trim();
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
    const freeText = typeof body?.freeText === "string" ? body.freeText.trim() : "";

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
      temperature: 0.5,
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
