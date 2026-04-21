import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, freeText } = body;

    const userInput = JSON.stringify({ answers, freeText });

    const prompt = `
Tu es un expert en structuration d’activité professionnelle.

Ta mission :
Analyser la situation d’une personne (coach, thérapeute, indépendante…) et produire une lecture claire, structurée et crédible.

IMPORTANT :
- Ton ton doit être sobre, professionnel, humain
- Aucune flatterie
- Aucune exagération
- Pas de langage marketing
- Pas de jargon startup
- Tu parles comme un consultant expérimenté

OBJECTIF :
Produire une lecture stratégique structurée.

FORMAT DE SORTIE (JSON STRICT) :

{
  "summary": "",
  "activityStage": "",
  "mainBlock": "",
  "whatAlreadyExists": "",
  "missingStructure": "",
  "nextStep": "",
  "ctaBridge": ""
}

RÈGLES :

- summary : lecture globale (2-3 phrases max)
- activityStage : position actuelle claire
- mainBlock : principal frein réel
- whatAlreadyExists : base solide existante
- missingStructure : ce qui manque concrètement
- nextStep : action logique suivante
- ctaBridge : ouverture naturelle vers accompagnement (sans vendre)

CONTEXTE UTILISATEUR :
${userInput}
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      temperature: 0.4,
    });

    const text = response.output_text;

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("Parsing error:", text);
      return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
