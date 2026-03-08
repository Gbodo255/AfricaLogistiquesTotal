"use client"

import { useLanguage } from "@/lib/i18n/context"
import { Card, CardContent } from "@/components/ui/card"

const cgvContent = {
  fr: {
    title: "CONDITIONS GÉNÉRALES DE VENTE (CGV)",
    subtitle: "Plateforme Africa Logistics (A-Logistics)",
    sections: [
      {
        title: "1. Préambule",
        content: `Les présentes Conditions Générales de Vente (ci-après « CGV ») ont pour objet de définir les conditions financières et commerciales applicables à l'utilisation des services proposés par la plateforme Africa Logistics (A-Logistics).
Les CGV complètent les Conditions Générales d'Utilisation (CGU). Toute utilisation des services payants de la plateforme implique l'acceptation pleine et entière des présentes CGV.`,
      },
      {
        title: "2. Champ d'application",
        content: `Les présentes CGV s'appliquent à l'ensemble des prestations de services proposées via la plateforme A-Logistics, notamment :
• la soumission et le traitement des demandes de transport ;
• la mise en relation entre clients et transporteurs ;
• l'utilisation du portefeuille électronique (wallet) ;
• la gestion des paiements, commissions et pénalités.`,
      },
      {
        title: "3. Description des services payants",
        content: `A-Logistics propose des services de mise en relation, de coordination et de suivi logistique. La plateforme agit exclusivement en qualité d'intermédiaire et ne réalise pas elle-même les prestations de transport.
Les prestations de transport sont exécutées par les transporteurs sous leur seule responsabilité.`,
      },
      {
        title: "4. Tarification",
        content: `4.1 Prix des prestations
Les tarifs applicables aux prestations de transport sont déterminés sur la base des informations fournies par le client et validés lors du traitement de la demande par les modérateurs.
Les prix sont exprimés en monnaie locale et peuvent inclure les frais de service de la plateforme.

4.2 Commission de la plateforme
A-Logistics perçoit une commission sur chaque prestation réalisée via la plateforme. Le taux de commission est fixé par la plateforme et peut être modifié à tout moment, sous réserve d'information préalable des utilisateurs.`,
      },
      {
        title: "5. Portefeuille électronique (Wallet)",
        content: `5.1 Principe général
La plateforme met à disposition des clients et des transporteurs un portefeuille électronique permettant la gestion des flux financiers liés aux prestations.
Chaque utilisateur dispose d'un portefeuille personnel, non rémunéré.

5.2 Crédit du portefeuille client
• Le client doit obligatoirement créditer son portefeuille avant la soumission d'une demande de transport ;
• Le crédit s'effectue via les moyens de paiement disponibles sur la plateforme (Mobile Money, carte bancaire, etc.) ;
• Le solde du portefeuille constitue une avance et une garantie financière.

5.3 Utilisation du portefeuille client
Le solde du portefeuille client est utilisé pour :
• le paiement des prestations de transport ;
• le paiement des frais et commissions applicables ;
• le prélèvement d'éventuelles pénalités.`,
      },
      {
        title: "6. Annulation et pénalités",
        content: `6.1 Principe
Les règles d'annulation visent à protéger les transporteurs et à garantir le sérieux des engagements pris par les clients.

6.2 Annulation après affectation et début de déplacement
Lorsqu'une demande de transport :
• a été traitée et validée par les modérateurs ;
• a été affectée à un transporteur ;
• et que le transporteur a déjà commencé le déplacement,
Toute annulation effectuée par le client entraîne l'application d'une pénalité équivalente à 10 % du montant total de la commande.
Cette pénalité est automatiquement prélevée du portefeuille du client.

6.3 Autres cas d'annulation
Les conditions applicables aux autres cas d'annulation (avant affectation, avant début de déplacement, force majeure) sont précisées dans la Politique d'annulation de la plateforme.`,
      },
      {
        title: "7. Paiement des transporteurs",
        content: `• Les montants dus aux transporteurs sont crédités sur leur portefeuille après exécution effective de la prestation ;
• Les commissions de la plateforme sont déduites avant le crédit ;
• Le transporteur peut demander le retrait des fonds selon les modalités définies par la plateforme.`,
      },
      {
        title: "8. Facturation",
        content: `Des factures et reçus électroniques sont générés automatiquement et mis à disposition des utilisateurs dans leur espace personnel.`,
      },
      {
        title: "9. Remboursements",
        content: `Sauf disposition contraire prévue par la Politique d'annulation, les sommes créditées sur le portefeuille ne sont pas automatiquement remboursables.
Les modalités de remboursement éventuel sont définies par la plateforme au cas par cas.`,
      },
      {
        title: "10. Responsabilité financière",
        content: `A-Logistics ne saurait être tenue responsable des conséquences financières résultant d'informations erronées fournies par les utilisateurs ou de l'inexécution des prestations par les transporteurs.`,
      },
      {
        title: "11. Modification des CGV",
        content: `A-Logistics se réserve le droit de modifier les présentes CGV à tout moment. Les utilisateurs seront informés de toute modification substantielle.`,
      },
      {
        title: "12. Droit applicable et juridiction compétente",
        content: `Les présentes CGV sont régies par le droit en vigueur au Bénin. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence des juridictions compétentes.`,
      },
      {
        title: "Fin des Conditions Générales de Vente",
        content: ``,
      },
    ],
  },
  en: {
    title: "GENERAL TERMS OF SALE (GTS)",
    subtitle: "Africa Logistics Platform (A-Logistics)",
    sections: [
      {
        title: "1. Preamble",
        content: `These General Terms of Sale (hereinafter "GTS") are intended to define the financial and commercial conditions applicable to the use of services offered by the Africa Logistics (A-Logistics) platform.
The GTS complement the Terms of Use (TOU). Any use of the platform's paid services implies full and complete acceptance of these GTS.`,
      },
      {
        title: "2. Scope of application",
        content: `These GTS apply to all service offerings provided through the A-Logistics platform, including:
• submission and processing of transport requests;
• connection between clients and transporters;
• use of the electronic wallet;
• management of payments, commissions and penalties.`,
      },
      {
        title: "3. Description of paid services",
        content: `A-Logistics offers connection, coordination and logistics tracking services. The platform acts exclusively as an intermediary and does not itself perform transport services.
Transport services are performed by transporters under their sole responsibility.`,
      },
      {
        title: "4. Pricing",
        content: `4.1 Service prices
Prices applicable to transport services are determined based on information provided by the client and validated during request processing by moderators.
Prices are expressed in local currency and may include platform service fees.

4.2 Platform commission
A-Logistics receives a commission on each service performed through the platform. The commission rate is set by the platform and may be modified at any time, subject to prior notice to users.`,
      },
      {
        title: "5. Electronic wallet",
        content: `5.1 General principle
The platform provides clients and transporters with an electronic wallet allowing management of financial flows related to services.
Each user has a personal, non-remunerated wallet.

5.2 Client wallet credit
• The client must credit their wallet before submitting a transport request;
• Credit is made via payment methods available on the platform (Mobile Money, bank card, etc.);
• The wallet balance constitutes an advance and financial guarantee.

5.3 Client wallet use
The client wallet balance is used for:
• payment of transport services;
• payment of applicable fees and commissions;
• deduction of any penalties.`,
      },
      {
        title: "6. Cancellation and penalties",
        content: `6.1 Principle
Cancellation rules aim to protect transporters and ensure the seriousness of commitments made by clients.

6.2 Cancellation after assignment and start of movement
When a transport request:
• has been processed and validated by moderators;
• has been assigned to a transporter;
• and the transporter has already started the movement,
Any cancellation made by the client results in the application of a penalty equivalent to 10% of the total order amount.
This penalty is automatically deducted from the client's wallet.

6.3 Other cancellation cases
Conditions applicable to other cancellation cases (before assignment, before start of movement, force majeure) are specified in the platform's Cancellation Policy.`,
      },
      {
        title: "7. Transporter payment",
        content: `• Amounts due to transporters are credited to their wallet after effective execution of the service;
• Platform commissions are deducted before credit;
• The transporter may request withdrawal of funds according to modalities defined by the platform.`,
      },
      {
        title: "8. Invoicing",
        content: `Electronic invoices and receipts are automatically generated and made available to users in their personal space.`,
      },
      {
        title: "9. Refunds",
        content: `Unless otherwise provided in the Cancellation Policy, amounts credited to the wallet are not automatically refundable.
Modalities for any refund are defined by the platform on a case-by-case basis.`,
      },
      {
        title: "10. Financial responsibility",
        content: `A-Logistics cannot be held responsible for financial consequences resulting from erroneous information provided by users or non-execution of services by transporters.`,
      },
      {
        title: "11. Modification of GTS",
        content: `A-Logistics reserves the right to modify these GTS at any time. Users will be informed of any substantial modification.`,
      },
      {
        title: "12. Applicable law and competent jurisdiction",
        content: `These GTS are governed by the law in force in Benin. Any dispute relating to their interpretation or execution falls under the jurisdiction of competent courts.`,
      },
      {
        title: "End of General Terms of Sale",
        content: ``,
      },
    ],
  },
}

export default function CGVPage() {
  const { language } = useLanguage()
  const content = cgvContent[language]

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
