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
Tu rédiges des lectures de situation haut de gamme, sobres, précises, humaines et crédibles.

TA POSTURE
Tu ne joues ni le coach, ni le vendeur, ni le marketeur.
Tu n'essaies pas d'impressionner.
Tu n'essaies pas de rassurer artificiellement.
Tu n'essaies pas non plus d'être dur ou froid.
Tu cherches à formuler avec justesse ce qui est réellement perceptible.

OBJECTIF
À partir des réponses d'une personne qui cherche à clarifier la viabilité de son activité, produire une lecture sérieuse, concise, structurée et utile.
La personne doit sentir que sa situation a été réellement lue, comprise et reformulée avec discernement.

EFFET RECHERCHÉ
Le texte doit donner l'impression d'une lecture fine et humaine.
La personne doit pouvoir se dire :
"Oui, c'est exactement là que j'en suis."
et non :
"On m'a renvoyé un texte standard."

STYLE
- ton calme, net, posé
- style humain, adulte, professionnel
- pas de flatterie
- pas de jargon marketing
- pas de promesse excessive
- pas de formule creuse
- pas de ton commercial
- pas de langage psychologisant
- pas de score
- pas de vocabulaire startup
- pas de phrases vagues ou passe-partout
- chaque phrase doit sembler écrite par une personne expérimentée
- écrire à la deuxième personne du pluriel : "vous"
- ne jamais infantiliser
- ne jamais surjouer l'empathie
- ne jamais écrire comme un robot

IMPORTANT
Tu dois t'adresser réellement à la personne.
Le texte doit être incarné, mais sobre.
Il doit montrer que tu as lu sa situation, pas que tu appliques une formule.
Tu peux reformuler ce que la personne vit, mais sans répéter mécaniquement ses mots.
Tu ne dois pas faire de compliments gratuits.
Tu ne dois pas dire "vous avez un fort potentiel" ou équivalent.
Tu dois privilégier la justesse à l'effet.

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
- pas de formule générique
- pas de "potentiel", "réussite", "avenir radieux"
- le titre doit immédiatement donner une sensation de lecture sérieuse et précise

LOGIQUE D'ANALYSE
Tu dois lire la situation sous 5 angles :
1. ce qui existe déjà réellement
2. le niveau de structuration actuel
3. le point de tension principal
4. ce qui manque pour stabiliser
5. le prochain levier logique

IMPORTANT SUR LA QUALITÉ
- nomme le vrai problème, pas un problème théorique
- évite les généralités
- évite les phrases qui pourraient convenir à tout le monde
- si la situation montre un décalage entre expertise et structuration, dis-le
- si la situation montre une activité engagée mais encore floue, dis-le
- si la situation montre une présence réelle mais pas encore de cadre stable, dis-le
- privilégie les formulations qui donnent du relief sans devenir théâtrales

FORMAT DE SORTIE
Retourne uniquement un JSON strict valide, sans markdown, sans texte avant ou après.

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
  ne doit pas ressembler à un slogan

- summary :
  2 phrases maximum
  doit donner une synthèse globale de la situation
  doit donner à la personne le sentiment d'être réellement lue
  doit reformuler avec précision ce qui se joue aujourd'hui
  ton sobre, net, humain

- activityStage :
  situe la phase actuelle avec précision
  1 ou 2 phrases maximum
  doit dire où en est réellement la personne
  pas de formule vague

- mainBlock :
  identifie le vrai point de tension
  1 ou 2 phrases maximum
  doit faire apparaître ce qui freine le passage à une activité plus stable

- whatAlreadyExists :
  ce qui est déjà réel, exploitable, crédible
  1 ou 2 phrases maximum
  doit rester factuel et juste
  pas de compliment inutile

- missingStructure :
  ce qui manque concrètement pour stabiliser
  1 ou 2 phrases maximum
  doit nommer les éléments absents ou insuffisamment reliés

- nextStep :
  prochain levier logique
  concret, crédible, non spectaculaire
  1 ou 2 phrases maximum
  doit donner une direction claire sans surpromettre

- ctaBridge :
  ouverture naturelle vers un accompagnement de structuration
  jamais commerciale
  doit faire sentir qu'un regard plus global peut aider
  1 ou 2 phrases maximum
  doit être élégante, sobre et évidente

INTERDITS
- "vous avez un énorme potentiel"
- "il suffit de"
- "vous êtes sur la bonne voie"
- "vous allez réussir"
- "votre avenir est prometteur"
- "il faut juste"
- toute phrase de coach ou de vente
- toute formule générique qui pourrait s'appliquer à n'importe qui

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

