export type Question = {
  id: string;
  title: string;
  options: string[];
};

export type DiagnosticPayload = {
  answers: Record<string, string>;
  freeText: string;
};

export type DiagnosticResult = {
  summary: string;
  activityStage: string;
  mainBlock: string;
  whatAlreadyExists: string;
  missingStructure: string;
  nextStep: string;
  ctaBridge: string;
};

export const questions: Question[] = [
  {
    id: "concreteActivity",
    title: "Aujourd'hui, que faites-vous concrètement ?",
    options: [
      "J'ai une expertise claire mais je l'exerce encore de façon ponctuelle.",
      "Je rends déjà des prestations, mais sans cadre stable.",
      "Je suis en préparation et je formalise encore mon offre.",
      "Je suis en activité, avec un positionnement encore diffus."
    ]
  },
  {
    id: "stage",
    title: "Où en êtes-vous dans votre activité ?",
    options: [
      "Je réfléchis sérieusement à me lancer.",
      "Je viens de démarrer et je cherche une base solide.",
      "Je suis lancé·e mais l'activité reste irrégulière.",
      "L'activité existe, mais sa structure limite la croissance."
    ]
  },
  {
    id: "clarity",
    title: "Êtes-vous capable d'expliquer clairement ce que vous proposez ?",
    options: [
      "Pas encore, mon discours varie selon les situations.",
      "Partiellement, avec des zones de flou.",
      "Oui, mais pas encore assez différencié.",
      "Oui, de façon claire et cohérente."
    ]
  },
  {
    id: "demandSource",
    title: "Aujourd'hui, comment viennent vos demandes ?",
    options: [
      "Principalement par mon réseau proche.",
      "Au fil des opportunités, sans régularité.",
      "Par recommandation, avec un début de constance.",
      "Par plusieurs canaux déjà identifiés."
    ]
  },
  {
    id: "support",
    title: "Avez-vous un support clair pour présenter votre activité ?",
    options: [
      "Non, rien de structuré pour l'instant.",
      "Quelques éléments, mais dispersés.",
      "Un support existe, mais il ne convainc pas encore.",
      "Oui, j'ai une base claire et utilisable."
    ]
  },
  {
    id: "blocker",
    title: "Qu'est-ce qui vous bloque le plus aujourd'hui ?",
    options: [
      "Clarifier une offre lisible et crédible.",
      "Trouver un flux de demandes plus régulier.",
      "Structurer mon parcours client de bout en bout.",
      "Prioriser sans me disperser."
    ]
  },
  {
    id: "expectation",
    title: "Qu'attendez-vous réellement maintenant ?",
    options: [
      "Valider la viabilité réelle de mon activité.",
      "Stabiliser mes demandes et mon organisation.",
      "Construire une structure professionnelle durable.",
      "Passer un cap vers une activité stable et assumée."
    ]
  }
];

const stageScore: Record<string, number> = {
  "Je réfléchis sérieusement à me lancer.": 0,
  "Je viens de démarrer et je cherche une base solide.": 1,
  "Je suis lancé·e mais l'activité reste irrégulière.": 2,
  "L'activité existe, mais sa structure limite la croissance.": 3
};

const clarityScore: Record<string, number> = {
  "Pas encore, mon discours varie selon les situations.": 0,
  "Partiellement, avec des zones de flou.": 1,
  "Oui, mais pas encore assez différencié.": 2,
  "Oui, de façon claire et cohérente.": 3
};

const supportScore: Record<string, number> = {
  "Non, rien de structuré pour l'instant.": 0,
  "Quelques éléments, mais dispersés.": 1,
  "Un support existe, mais il ne convainc pas encore.": 2,
  "Oui, j'ai une base claire et utilisable.": 3
};

const demandScore: Record<string, number> = {
  "Principalement par mon réseau proche.": 1,
  "Au fil des opportunités, sans régularité.": 0,
  "Par recommandation, avec un début de constance.": 2,
  "Par plusieurs canaux déjà identifiés.": 3
};

export function buildDiagnostic(payload: DiagnosticPayload): DiagnosticResult {
  const stage = stageScore[payload.answers.stage] ?? 1;
  const clarity = clarityScore[payload.answers.clarity] ?? 1;
  const support = supportScore[payload.answers.support] ?? 1;
  const demand = demandScore[payload.answers.demandSource] ?? 1;

  const global = stage + clarity + support + demand;

  const activityStage =
    global <= 3
      ? "Le projet est en phase d'initialisation. L'expertise existe, mais la base d'activité reste à consolider."
      : global <= 7
        ? "L'activité est engagée, avec des signaux réels. Elle demande maintenant un cadre plus explicite pour tenir."
        : "L'activité a une base solide. Le prochain enjeu est d'unifier les éléments pour gagner en stabilité et en lisibilité.";

  const mainBlockMap: Record<string, string> = {
    "Clarifier une offre lisible et crédible.":
      "Le blocage principal est la formulation de l'offre : la valeur est là, mais elle n'est pas encore traduite en proposition nette.",
    "Trouver un flux de demandes plus régulier.":
      "Le frein majeur est la régularité des demandes : l'activité fonctionne, mais l'acquisition reste trop dépendante des opportunités.",
    "Structurer mon parcours client de bout en bout.":
      "Le point de tension se situe dans le parcours : l'offre existe, mais le passage de l'intérêt à la décision manque de continuité.",
    "Prioriser sans me disperser.":
      "Le blocage tient surtout à la dispersion : plusieurs pistes sont ouvertes, sans ordre de priorité suffisamment ferme."
  };

  const whatAlreadyExists =
    stage >= 2
      ? "Vous disposez déjà d'une activité réelle, d'une expertise reconnue et d'un début de traction. Cette base est exploitable."
      : "Votre expertise est identifiable et votre intention est sérieuse. C'est une base crédible pour structurer une activité viable.";

  const missingStructure =
    clarity <= 1
      ? "Il manque un socle de positionnement clair : qui vous aidez, sur quoi précisément, et avec quelle situation cible."
      : support <= 1
        ? "Il manque une architecture de présentation stable : offre, preuve, parcours et point d'entrée doivent être alignés."
        : "Il manque surtout une orchestration : transformer des éléments déjà présents en système cohérent et reproductible.";

  const nextStep =
    "Le levier immédiat consiste à fixer une colonne vertébrale simple : une offre principale, un message directeur, un parcours de contact unique et un rythme de suivi des demandes.";

  const summary =
    "Votre situation montre une matière professionnelle réelle. L'enjeu n'est pas de repartir de zéro, mais de transformer une expertise en activité lisible, pilotable et soutenable.";

  const ctaBridge =
    "Ce que vous cherchez à construire ne repose pas uniquement sur votre métier, mais sur une structure complète. Une approche plus cadrée permet d'accélérer sans vous disperser.";

  return {
    summary,
    activityStage,
    mainBlock: mainBlockMap[payload.answers.blocker] ?? mainBlockMap["Prioriser sans me disperser."],
    whatAlreadyExists,
    missingStructure,
    nextStep,
    ctaBridge: payload.freeText ? `${ctaBridge} Votre synthèse confirme un besoin de clarté opérationnelle.` : ctaBridge
  };
}
