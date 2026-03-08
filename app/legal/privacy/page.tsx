"use client"

import { useLanguage } from "@/lib/i18n/context"
import { Card, CardContent } from "@/components/ui/card"

const privacyContent = {
  fr: {
    title: "POLITIQUE DE CONFIDENTIALITÉ ET DE PROTECTION DES DONNÉES",
    subtitle: "Plateforme Africa Logistics (A-Logistics)",
    sections: [
      {
        title: "1. Objet de la politique",
        content: `La présente Politique de confidentialité a pour objet d'informer les utilisateurs de la plateforme Africa Logistics (A-Logistics) sur la manière dont leurs données personnelles sont collectées, utilisées, protégées et conservées.
A-Logistics accorde une importance particulière à la protection de la vie privée et au respect des réglementations en vigueur relatives à la protection des données personnelles.`,
      },
      {
        title: "2. Responsable du traitement",
        content: `Le responsable du traitement des données personnelles collectées via la plateforme est Africa Logistics (A-Logistics), initiative portée par le groupe Africa Project (AFRI-PRO), basé à Abomey-Calavi, Bénin.`,
      },
      {
        title: "3. Données collectées",
        content: `Dans le cadre de l'utilisation de la plateforme, A-Logistics est amenée à collecter les catégories de données suivantes :

3.1 Données d'identification
• Nom et prénoms / raison sociale ;
• Adresse email ;
• Numéro de téléphone ;
• Identifiants de connexion.

3.2 Données professionnelles
• Informations relatives aux entreprises de transport ;
• Données liées aux flottes de véhicules (types, documents administratifs) ;
• Informations déclarées par les gestionnaires de flotte.

3.3 Données financières
• Informations relatives aux transactions ;
• Soldes et historiques des portefeuilles électroniques (wallets) ;
• Données liées aux paiements et pénalités.

3.4 Données de localisation
• Données de géolocalisation des véhicules dans le cadre du module A-TRACKER ;
• Données de suivi des trajets.

3.5 Données techniques
• Adresse IP ;
• Données de connexion et de navigation ;
• Journaux d'activité.`,
      },
      {
        title: "4. Finalités du traitement",
        content: `Les données collectées sont utilisées pour :
• la création et la gestion des comptes utilisateurs ;
• le traitement et l'exécution des demandes de transport ;
• la gestion des portefeuilles électroniques et des paiements ;
• le suivi des opérations logistiques ;
• la prévention des fraudes et des abus ;
• l'amélioration continue des services ;
• le respect des obligations légales et réglementaires.`,
      },
      {
        title: "5. Base légale du traitement",
        content: `Les traitements de données personnelles reposent sur :
• l'exécution d'un contrat (CGU et CGV) ;
• le consentement de l'utilisateur lorsque requis ;
• le respect d'obligations légales ;
• l'intérêt légitime de la plateforme à assurer la sécurité et le bon fonctionnement des services.`,
      },
      {
        title: "6. Destinataires des données",
        content: `Les données personnelles sont accessibles uniquement :
• aux équipes internes habilitées de A-Logistics ;
• aux modérateurs et administrateurs dans le cadre de leurs missions ;
• aux prestataires techniques et financiers strictement nécessaires à l'exécution des services.
Aucune donnée personnelle n'est vendue à des tiers.`,
      },
      {
        title: "7. Conservation des données",
        content: `Les données personnelles sont conservées pendant la durée strictement nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, et conformément aux obligations légales en vigueur.
Les données financières et transactionnelles peuvent être conservées plus longtemps à des fins comptables et légales.`,
      },
      {
        title: "8. Sécurité des données",
        content: `A-Logistics met en œuvre des mesures techniques et organisationnelles appropriées afin de garantir la sécurité, l'intégrité et la confidentialité des données personnelles, notamment :
• chiffrement des communications ;
• contrôle des accès ;
• journalisation des opérations sensibles ;
• sauvegardes régulières.`,
      },
      {
        title: "9. Droits des utilisateurs",
        content: `Conformément à la réglementation applicable, chaque utilisateur dispose des droits suivants :
• droit d'accès à ses données ;
• droit de rectification ;
• droit à l'effacement, sous réserve des obligations légales ;
• droit à la limitation du traitement ;
• droit d'opposition, lorsque applicable.
Les demandes relatives à l'exercice de ces droits peuvent être adressées à A-Logistics via les canaux de contact officiels.`,
      },
      {
        title: "10. Cookies et technologies similaires",
        content: `La plateforme peut utiliser des cookies ou technologies similaires afin d'améliorer l'expérience utilisateur, assurer la sécurité et analyser l'utilisation des services.`,
      },
      {
        title: "11. Modification de la politique de confidentialité",
        content: `La présente politique peut être modifiée à tout moment. Toute modification substantielle sera notifiée aux utilisateurs.`,
      },
      {
        title: "12. Droit applicable",
        content: `La présente Politique de confidentialité est régie par le droit en vigueur au Bénin. Tout litige relatif à son interprétation ou à son application relève de la compétence des juridictions compétentes.`,
      },
      {
        title: "Fin de la Politique de confidentialité et de protection des données",
        content: ``,
      },
    ],
  },
  en: {
    title: "PRIVACY AND DATA PROTECTION POLICY",
    subtitle: "Africa Logistics Platform (A-Logistics)",
    sections: [
      {
        title: "1. Purpose of the policy",
        content: `This Privacy Policy is intended to inform users of the Africa Logistics (A-Logistics) platform about how their personal data is collected, used, protected and retained.
A-Logistics places particular importance on privacy protection and compliance with applicable regulations relating to personal data protection.`,
      },
      {
        title: "2. Data controller",
        content: `The controller of personal data collected through the platform is Africa Logistics (A-Logistics), an initiative carried by the Africa Project (AFRI-PRO) group, based in Abomey-Calavi, Benin.`,
      },
      {
        title: "3. Data collected",
        content: `In the context of using the platform, A-Logistics collects the following categories of data:

3.1 Identification data
• Name and first names / company name;
• Email address;
• Phone number;
• Login credentials.

3.2 Professional data
• Information relating to transport companies;
• Data related to vehicle fleets (types, administrative documents);
• Information declared by fleet managers.

3.3 Financial data
• Transaction information;
• Electronic wallet balances and history;
• Data related to payments and penalties.

3.4 Location data
• Vehicle geolocation data in the context of the A-TRACKER module;
• Route tracking data.

3.5 Technical data
• IP address;
• Connection and navigation data;
• Activity logs.`,
      },
      {
        title: "4. Processing purposes",
        content: `The data collected is used for:
• creation and management of user accounts;
• processing and execution of transport requests;
• management of electronic wallets and payments;
• tracking of logistics operations;
• fraud and abuse prevention;
• continuous service improvement;
• compliance with legal and regulatory obligations.`,
      },
      {
        title: "5. Legal basis for processing",
        content: `Personal data processing is based on:
• execution of a contract (TOU and GTS);
• user consent when required;
• compliance with legal obligations;
• the platform's legitimate interest in ensuring security and proper functioning of services.`,
      },
      {
        title: "6. Data recipients",
        content: `Personal data is accessible only to:
• authorized internal teams of A-Logistics;
• moderators and administrators in the context of their missions;
• technical and financial service providers strictly necessary for service execution.
No personal data is sold to third parties.`,
      },
      {
        title: "7. Data retention",
        content: `Personal data is retained for the period strictly necessary to achieve the purposes for which it was collected, and in accordance with applicable legal obligations.
Financial and transactional data may be retained longer for accounting and legal purposes.`,
      },
      {
        title: "8. Data security",
        content: `A-Logistics implements appropriate technical and organizational measures to ensure the security, integrity and confidentiality of personal data, including:
• communication encryption;
• access control;
• logging of sensitive operations;
• regular backups.`,
      },
      {
        title: "9. User rights",
        content: `In accordance with applicable regulations, each user has the following rights:
• right of access to their data;
• right to rectification;
• right to erasure, subject to legal obligations;
• right to limitation of processing;
• right to object, when applicable.
Requests relating to the exercise of these rights may be addressed to A-Logistics via official contact channels.`,
      },
      {
        title: "10. Cookies and similar technologies",
        content: `The platform may use cookies or similar technologies to improve user experience, ensure security and analyze service usage.`,
      },
      {
        title: "11. Modification of the privacy policy",
        content: `This policy may be modified at any time. Any substantial modification will be notified to users.`,
      },
      {
        title: "12. Applicable law",
        content: `This Privacy Policy is governed by the law in force in Benin. Any dispute relating to its interpretation or application falls under the jurisdiction of competent courts.`,
      },
      {
        title: "End of Privacy and Data Protection Policy",
        content: ``,
      },
    ],
  },
}

export default function PrivacyPage() {
  const { language } = useLanguage()
  const content = privacyContent[language]

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
