"use client"

import { useLanguage } from "@/lib/i18n/context"
import { Card, CardContent } from "@/components/ui/card"

const charterContent = {
  fr: {
    title: "CHARTE DES MODÉRATEURS",
    subtitle: "Plateforme Africa Logistics (A-Logistics)",
    sections: [
      {
        title: "1. Objet de la charte",
        content: `La présente Charte des modérateurs définit le rôle, les responsabilités, les obligations et les règles de conduite applicables aux modérateurs de la plateforme Africa Logistics (A-Logistics).
Elle vise à garantir :
• l'impartialité dans le traitement des demandes ;
• la qualité de service ;
• la confiance entre les acteurs ;
• la bonne gouvernance de la plateforme.`,
      },
      {
        title: "2. Rôle du modérateur",
        content: `Le modérateur est un acteur central chargé de :
• analyser les demandes de transport soumises par les clients ;
• vérifier la cohérence et la faisabilité des demandes ;
• affecter les demandes aux transporteurs appropriés ;
• superviser l'exécution des opérations ;
• intervenir en cas de litige.`,
      },
      {
        title: "3. Accès et responsabilités",
        content: `Le modérateur dispose d'un accès spécifique à la plateforme lui permettant de :
• consulter les informations nécessaires à ses missions ;
• agir sur les comptes utilisateurs dans le respect des règles établies ;
• appliquer les politiques et chartes en vigueur.
Toute action est journalisée et traçable.`,
      },
      {
        title: "4. Obligations du modérateur",
        content: `Le modérateur s'engage à :
• agir avec neutralité et professionnalisme ;
• respecter la confidentialité des informations ;
• appliquer strictement les CGU, CGV et politiques associées ;
• éviter tout conflit d'intérêts ;
• signaler toute anomalie ou fraude.`,
      },
      {
        title: "5. Gestion des litiges",
        content: `Le modérateur intervient en cas de litige afin de :
• analyser les faits ;
• recueillir les éléments nécessaires ;
• proposer une solution conforme aux règles de la plateforme ;
• assurer une communication claire entre les parties.`,
      },
      {
        title: "6. Pouvoirs disciplinaires",
        content: `Dans le cadre de ses fonctions, le modérateur peut :
• recommander l'application de pénalités ;
• proposer la suspension d'un compte ;
• signaler des infractions à l'administration.
Toute décision majeure relève de la validation de l'administrateur.`,
      },
      {
        title: "7. Interdictions",
        content: `Il est strictement interdit au modérateur de :
• utiliser ses accès à des fins personnelles ;
• divulguer des informations confidentielles ;
• favoriser un utilisateur ;
• percevoir des avantages indus.`,
      },
      {
        title: "8. Sanctions",
        content: `Tout manquement à la présente charte peut entraîner :
• un avertissement ;
• une suspension ;
• une révocation définitive ;
• des poursuites disciplinaires ou judiciaires.`,
      },
      {
        title: "9. Modification de la charte",
        content: `La présente charte peut être modifiée à tout moment. Toute modification sera communiquée aux modérateurs.`,
      },
      {
        title: "10. Droit applicable",
        content: `La présente Charte des modérateurs est régie par le droit en vigueur au Bénin.`,
      },
      {
        title: "Fin de la Charte des modérateurs",
        content: ``,
      },
    ],
  },
  en: {
    title: "MODERATORS CHARTER",
    subtitle: "Africa Logistics Platform (A-Logistics)",
    sections: [
      {
        title: "1. Purpose of the charter",
        content: `This Moderators Charter defines the role, responsibilities, obligations and rules of conduct applicable to moderators of the Africa Logistics (A-Logistics) platform.
It aims to guarantee:
• impartiality in processing requests;
• service quality;
• trust between actors;
• good governance of the platform.`,
      },
      {
        title: "2. Moderator role",
        content: `The moderator is a central actor responsible for:
• analyzing transport requests submitted by clients;
• verifying the consistency and feasibility of requests;
• assigning requests to appropriate transporters;
• supervising the execution of operations;
• intervening in case of dispute.`,
      },
      {
        title: "3. Access and responsibilities",
        content: `The moderator has specific access to the platform allowing them to:
• consult information necessary for their missions;
• act on user accounts in compliance with established rules;
• apply policies and charters in force.
All actions are logged and traceable.`,
      },
      {
        title: "4. Moderator obligations",
        content: `The moderator undertakes to:
• act with neutrality and professionalism;
• respect the confidentiality of information;
• strictly apply TOU, GTS and associated policies;
• avoid any conflict of interest;
• report any anomaly or fraud.`,
      },
      {
        title: "5. Dispute management",
        content: `The moderator intervenes in case of dispute to:
• analyze the facts;
• gather necessary elements;
• propose a solution in accordance with platform rules;
• ensure clear communication between parties.`,
      },
      {
        title: "6. Disciplinary powers",
        content: `In the context of their functions, the moderator may:
• recommend the application of penalties;
• propose account suspension;
• report offenses to administration.
Any major decision is subject to administrator validation.`,
      },
      {
        title: "7. Prohibitions",
        content: `It is strictly forbidden for the moderator to:
• use their access for personal purposes;
• disclose confidential information;
• favor a user;
• receive undue advantages.`,
      },
      {
        title: "8. Sanctions",
        content: `Any breach of this charter may result in:
• a warning;
• suspension;
• definitive revocation;
• disciplinary or legal proceedings.`,
      },
      {
        title: "9. Modification of the charter",
        content: `This charter may be modified at any time. Any modification will be communicated to moderators.`,
      },
      {
        title: "10. Applicable law",
        content: `This Moderators Charter is governed by the law in force in Benin.`,
      },
      {
        title: "End of Moderators Charter",
        content: ``,
      },
    ],
  },
}

export default function ModeratorCharterPage() {
  const { language } = useLanguage()
  const content = charterContent[language]

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{content.title}</h1>
          <p className="text-lg text-muted-foreground">{content.subtitle}</p>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="p-8 space-y-8">
            {content.sections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
