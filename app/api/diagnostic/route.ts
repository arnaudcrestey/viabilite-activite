import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, freeText } = body;

    const userInput = JSON.stringify(
      { answers, freeText },
      null,
      2
    );

    const prompt = `
Tu es un analyste stratégique senior.
Tu produis une lecture sobre, crédible, structurée, premium.
Tu n'écris jamais comme un coach, un marketeur, un vendeur ou un outil SaaS.

OBJECTIF
À partir des réponses d'un professionnel indépendant, produire une lecture de viabilité claire, sérieuse et utile.

STYLE
- ton calme, net, posé
- aucune flatterie
- aucun jargon marketing
- aucune promesse excessive
- aucune formule creuse
- pas de score
- pas de langage psychologisant
- chaque phrase doit sembler écrite par une personne expérimentée

IMPORTANT
Le titre principal doit être très fort.
Il doit donner une impression de lecture sérieuse et mémorable.
Il ne doit pas être générique.
Il doit ressembler à une phrase de diagnostic éditorial.
Maximum 18 mots.
Pas de deux-points.
Pas de guillemets.
Pas de banalités.

FORMAT DE SORTIE
Retourne uniquement un JSON strict valide, sans texte autour.

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
  fort, éditorial, premium, crédible
  pas de formule marketing
  pas de "potentiel", pas de "réussite", pas de "avenir radieux"

- summary :
  2 ou 3 phrases maximum
  synthèse globale de la situation

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
  le prochain levier logique
  concret, crédible, non spectaculaire
  1 ou 2 phrases maximum

- ctaBridge :
  ouverture naturelle vers un accompagnement de structuration
  jamais commerciale
  doit faire sentir qu'un regard plus global peut aider
  1 ou 2 phrases maximum

CONTEXTE À ANALYSER
${userInput}
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      temperature: 0.5,
    });

    const text = response.output_text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Réponse OpenAI vide." },
        { status: 500 }
      );
    }

    let parsed;
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

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API DIAGNOSTIC ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
