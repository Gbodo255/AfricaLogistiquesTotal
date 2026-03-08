"use client"

import { useLanguage } from "@/lib/i18n/context"
import { Card, CardContent } from "@/components/ui/card"

const cguContent = {
  fr: {
    title: "CONDITIONS GÉNÉRALES D'UTILISATION (CGU)",
    subtitle: "Plateforme Africa Logistics (A-Logistics)",
    sections: [
      {
        title: "1. Préambule",
        content: `Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions dans lesquelles les utilisateurs accèdent et utilisent la plateforme numérique Africa Logistics (A-Logistics).
A-Logistics est une plateforme digitale de mise en relation et de gestion logistique permettant à des clients de soumettre des demandes de transport de marchandises et à des transporteurs d'exécuter ces prestations, sous la supervision de modérateurs et d'administrateurs.
Toute utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGU.`,
      },
      {
        title: "2. Définitions",
        content: `Dans les présentes CGU, les termes suivants ont la signification ci-après :
• Plateforme : désigne la plateforme digitale Africa Logistics (A-Logistics).
• Utilisateur : toute personne physique ou morale disposant d'un compte sur la plateforme.
• Client : utilisateur souhaitant faire transporter des biens d'un point A à un point B (Personne physique et morale).
• Transporteur : utilisateur chargé de l'exécution des prestations de transport (chauffeur indépendant, entreprise de transport, gestionnaire de flotte etc).
• Modérateur : utilisateur chargé du traitement, de la qualification et de l'affectation des demandes de transport.
• Administrateur : utilisateur disposant d'un accès global à la plateforme à des fins de gestion, de supervision et de paramétrage.
• Portefeuille (Wallet) : compte virtuel associé à un utilisateur permettant la gestion des fonds.`,
      },
      {
        title: "3. Objet de la plateforme",
        content: `La plateforme A-Logistics a pour objet de :
• Faciliter la mise en relation entre clients et transporteurs ;
• Centraliser les demandes de transport ;
• Assurer un cadre structuré de suivi, de paiement et de contrôle des opérations logistiques.
A-Logistics agit en qualité d'intermédiaire technique et organisationnel et ne saurait être considérée comme partie au contrat de transport conclu entre le client et le transporteur.
AFRICA LOGISTICS NE FOURNIT NI DES PRESTATIONS DE TRANSPORT, NI DES PRESTATIONS DE LIVRAISON, NI TOUT AUTRE FORME DE PRESTATION DE SERVICES. TOUTES CES PRESTATIONS SONT FOURNIES PAR DES TIERS QUI SONT AUTONOMES ET INDEPENDANTS.
L'INTERVENTION DE AFRICA LOGISTICS SE LIMITE A UNE MISE EN RELATION.
LES TIERS OPERANT SUR LA PLATEFORME SONT LES SEULS RESPONSABLES DE LA BONNE EXECUTION DES PRESTATIONS.
LORSQUE VOUS SOLLICITEZ UN SERVICE, VOUS CONCLUEZ DIRECTEMENT UN CONTRAT AVEC LE PRESTATAIRE, AFRICA LOGISTICS N'EST, NI NE DEVIENT PARTIE A CE CONTRAT.`,
      },
      {
        title: "4. Accès à la plateforme",
        content: `4.1 Conditions d'accès
L'accès à la plateforme est réservé aux personnes disposant de la capacité juridique nécessaire ou représentant valablement une personne morale.
Vous devez être majeur pour utiliser le Service. Vous devez être âgé de dix-huit (18) ou vingt-et-un (21) ans en fonction de la législation du lieu d'accès à la Plateforme.

4.2 Création de compte
La création d'un compte est gratuite. L'utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription.
Chaque utilisateur est responsable de la confidentialité de ses identifiants de connexion.
Vous devez disposer de la capacité juridique nécessaire pour contracter et devez utiliser le Service conformément aux Conditions.
Les mineurs ne peuvent pas créer de Compte Utilisateur et par conséquent ne peuvent pas utiliser la Plateforme sans le consentement exprès et l'accompagnement de leurs parents ou représentants légaux.
Toute utilisation des Services par un mineur sera effectuée sous l'entière surveillance et responsabilité de l'Utilisateur, qui sera entièrement responsable de toute utilisation de son Compte.
Vous acceptez de respecter toutes les lois applicables lorsque vous utilisez le Service et de vous engager à n'utiliser le Service qu'à des fins légales.
Vous devez vous équiper d'un appareil compatible pour accéder au Service et effectuer toute mise à jour y afférente.
La Société ne garantit pas que le Service ou toute partie de ce dernier pourront être exploités sur des appareils et systèmes d'exploitation non compatibles.
La Société se réserve le droit de suspendre ou bloquer votre accès au Service en cas de raisons légitimes de penser que : 
(i) Vous utilisez le Service avec un appareil non autorisé, 
(ii) Vous ne respectez pas les lois applicables lors de l'utilisation du Service,
(iii) Vous n'utilisez pas le service conformément aux Conditions, 
(iv) Votre utilisation du Service a un effet négatif sur les droits ou intérêts légitimes de la Société ou de tiers, de sorte qu'une action immédiate est nécessaire pour éviter tout dommage.`,
      },
      {
        title: "5. Description des profils utilisateurs",
        content: `5.1 Clients
Les clients peuvent :
• créer et soumettre des demandes de transport ;
• créditer et consulter leur portefeuille ;
• suivre le traitement et l'exécution de leurs commandes.

5.2 Transporteurs
Les transporteurs peuvent :
• renseigner leurs informations personnelles ou professionnelles ;
• déclarer et gérer leur flotte de véhicules ;
• recevoir et exécuter des missions de transport ;
• consulter leur portefeuille et leurs revenus.

5.3 Modérateurs
Les modérateurs assurent :
• le traitement des demandes de transport ;
• leur affectation aux transporteurs ;
• la modération des utilisateurs et des contenus.

5.4 Administrateurs
Les administrateurs disposent d'un accès global leur permettant d'assurer la supervision, la gestion et le paramétrage de la plateforme.`,
      },
      {
        title: "6. Obligations des utilisateurs",
        content: `Chaque utilisateur s'engage à :
• utiliser la plateforme conformément à sa destination ;
• respecter les lois et réglementations en vigueur ;
• adopter un comportement loyal et respectueux ;
• ne pas porter atteinte au bon fonctionnement de la plateforme.`,
      },
      {
        title: "7. Responsabilités",
        content: `7.1 Responsabilité de la plateforme
A-Logistics met en œuvre les moyens raisonnables pour assurer la disponibilité et le bon fonctionnement de la plateforme. Toutefois, elle ne saurait être tenue responsable :
• des interruptions temporaires du service ;
• des litiges entre clients et transporteurs ;
• de l'exécution matérielle des prestations de transport.

7.2 Responsabilité des utilisateurs
Chaque utilisateur est seul responsable des informations qu'il fournit et des engagements qu'il prend dans le cadre de l'utilisation de la plateforme.`,
      },
      {
        title: "8. Paiements",
        content: `Les paiements sont effectués à l'issue de chaque prestation et sont non remboursables, à moins que la Société n'en décide autrement.
Vous pouvez choisir de payer les prestations en espèces, par monnaie électronique ou par carte bancaire.
Les paiements en monnaie électronique sont assurés par des Etablissement de Monnaie Electronique étant agréés et autorisés à effectuer des opérations de paiement réglementées dans tous les pays où opère la Société.
Pour effectuer des paiements par carte bancaire, vous devez en amont enregistrer une carte valide et vous appartenant.
Vous acceptez que nous puissions vérifier les détails de la carte auprès de votre établissement bancaire.
Nous émettons alors une requête d'autorisation raisonnable, qui ne constitue pas une charge réelle sur votre carte, afin de procéder à cette vérification.
Cette requête sera en suspens puis disparaîtra automatiquement au bout de quelques jours et aucun montant ne sera débité de votre compte.
Si le paiement par carte est traité à l'étranger, des frais bancaires peuvent s'appliquer. Ils sont à votre charge.
La Société n'assume aucune responsabilité pour les paiements dématérialisés. L'Utilisateur doit lui-même s'adresser à l'Etablissement de paiement en cas de dysfonctionnement.
La Société se réserve le droit de suspendre le traitement de toute transaction lorsqu'elle croit raisonnablement que la transaction peut être frauduleuse, illégale, implique une activité criminelle ou qu'elle croit raisonnablement que le Service n'est pas utilisé conformément aux Conditions.
Dans un tel cas, la Société ne saurait être tenue responsable de tout retard, suspension, retenue ou annulation de tout paiement à votre égard.
Il vous faudra coopérer pleinement avec la Société dans le cadre de toute enquête visant à déterminer si une transaction était autorisée.`,
      },
      {
        title: "9. Les pourboires",
        content: `Les pourboires sont facultatifs et laissés à la seule discrétion de l'Utilisateur.
A l'issue d'une prestation, il vous est proposé de définir un montant de pourboire à donner au prestataire, vous êtes libre de ne pas en attribuer ou de le modifier.
L'Utilisateur consent à recevoir un relevé de facturation détaillé par courrier électronique.`,
      },
      {
        title: "10. Les promotions et programmes",
        content: `La Société peut, à sa seule discrétion, proposer des promotions et des programmes avec des caractéristiques différentes selon l'Utilisateur.
Lorsqu'ils sont offerts, ces promotions et programmes sont soumis à des conditions particulières précisées sur l'Application.
La Société se réserve le droit de retenir ou de déduire les crédits ou les avantages obtenus dans le cadre d'une promotion ou d'un programme, dans le cas où elle constaterait ou estimerait que l'utilisation de la promotion ou la réception des codes promotionnels ont été effectuées par erreur, de manière frauduleuse, illégale ou en violation des conditions de la promotion ou du programme applicables.
En cas de fraude, tentative de fraude ou suspicion d'autres activités illégales liées à un code promotionnel ou à son échange, la Société sera autorisée à suspendre, bloquer et supprimer les Comptes d'Utilisateurs correspondants.
La Société pourra demander à l'Utilisateur le remboursement de tout montant obtenu frauduleusement.`,
      },
      {
        title: "11. Licence",
        content: `Sous réserve du respect des Conditions, la Société et ses concédants de licence, le cas échéant, vous accordent une licence limitée, non exclusive, sans droit de sous-licence, révocable et non cessible : 
(i) d'accès et d'utilisation de l'Application sur votre appareil personnel pour ce qui a trait uniquement à l'utilisation du Service ; et
(ii) D'accès et d'utilisation de tout contenu, information et matériel y afférent pouvant être mis à votre disposition dans le cadre du Service, dans chacun des cas uniquement pour une utilisation personnelle. Tous droits non expressément accordés au paragraphe sont réservés à la Société et à ses concédants de licence.`,
      },
      {
        title: "12. Restrictions",
        content: `Vous ne devez pas 
(i) Concéder sous licence, sous-licencier, vendre, revendre, transférer, céder, distribuer, exploiter commercialement ou mettre à la disposition de tiers de quelque manière que ce soit l'Application ; 
(ii) Modifier ou créer des œuvres dérivées basées sur l'Application ; 
(iii) Créer des liens internet vers l'Application, encadrer ou mettre en miroir l'Application sur tout autre serveur ou périphérique sans fil ou basé sur Internet ; 
(iv) Procéder à de l'ingénierie inverse ou accéder à l'Application afin de : (a) créer un produit ou un service concurrentiel, (b) créer un produit en utilisant des idées, fonctionnalités, fonctions ou graphiques semblables à ceux de l'Application, copier des idées, des caractéristiques, des fonctions ou des graphiques de l'Application ;
(v) Lancer un programme ou un script automatisé, y compris, mais sans s'y limiter, des robots Web, des indexeurs Web, bots, virus ou vers, tout programme susceptible de faire plusieurs requêtes serveur par seconde, de surcharger ou entraver indûment le fonctionnement et /ou les performances de l'Application ; 
(vi) Utiliser un robot, une araignée, une recherche de site/application de récupération, ou autre dispositif ou processus manuel/automatique permettant de récupérer, d'indexer, de miner des données, de reproduire ou de contourner de quelque manière que ce soit la structure de navigation ou la présentation du Service ou de son contenu ; 
(vii) Publier, distribuer ou reproduire de quelque manière que ce soit tout matériel protégé par le droit d'auteur, marques de commerce ou autres informations exclusives sans obtenir le consentement préalable du propriétaire de ces droits de propriété ; 
(viii) Supprimer tout avis de droit d'auteur, de marque ou autres avis de droits de propriété contenus dans le Service ; 
(ix) Envoyer des messages à des utilisateurs n'ayant pas sollicité la réception d'informations de votre part.`,
      },
      {
        title: "13. Confidentialité",
        content: `Vous considérerez comme confidentielles et ne pourrez utiliser sans l'accord préalable de la Société les informations suivantes (ci-après les Informations Confidentielles) : 
- Toutes informations ou données sous quelque forme que ce soit, en ce inclus toute information donnée verbalement ainsi que tout document, dossier ou message électronique ou tout autre moyen de matérialiser ou d'enregistrer une information, communiquées par la Société de quelque manière que ce soit.
- Les secrets de commerce et du savoir-faire, les informations que la Société désigne comme confidentielles ou qui, eu égard aux circonstances de leur divulgation ou en raison de leur nature, doivent être traitées comme confidentielles ; 
- Toutes les informations secrètes ou confidentielles relatives aux procédés, produits, stratégie marketing, commerciale, pratiques et procédures de la Société ; 
- Les données personnelles des autres Utilisateurs.
Vous garantissez ne pas utiliser les Informations Confidentielles dans un but autre que votre utilisation du Service.
Toutefois, ne constituent pas des Informations Confidentielles :
- Les informations actuellement accessibles ou devenant accessibles au public sans manquement aux termes des Conditions. 
- Les informations légalement détenues par vous avant leur divulgation par la Société, 
- Les informations valablement obtenues auprès d'un tiers autorisé à transférer ou à divulguer lesdites informations.
Cette obligation de confidentialité perdurera deux ans après le terme des partenariats.`,
      },
      {
        title: "14. Suspension et résiliation des comptes",
        content: `A-Logistics se réserve le droit de suspendre ou de supprimer tout compte en cas de :
• violation des présentes CGU ;
• comportement frauduleux ou abusif ;
• atteinte aux intérêts de la plateforme ou des autres utilisateurs.`,
      },
      {
        title: "15. Protection des Données personnelles",
        content: `Les données personnelles collectées sont traitées conformément à la réglementation en vigueur et à la Politique de confidentialité de la plateforme.
Lors de votre utilisation du Service, nous sommes amenés à vous demander de nous communiquer vos données à caractère personnel.
L'expression « données à caractère personnel » désigne toute information relative à une personne physique identifiée ou identifiable directement ou indirectement, par référence à un numéro d'identification ou à un ou plusieurs éléments, propres à son identité physique, physiologique, génétique, psychique, culturelle, sociale ou économique.
Ce sont notamment vos : nom, prénom, pseudonyme, photographie, adresses postale et électronique, numéros de téléphone, date de naissance.
Nous vous informons, lors de la collecte de vos données personnelles, si certaines données doivent être obligatoirement renseignées ou si elles sont facultatives. Nous vous indiquons également quelles sont les conséquences éventuelles d'un défaut de réponse.
Vos données à caractère personnel sont collectées avec votre consentement, conformément à la législation en vigueur, pour répondre à une ou plusieurs des finalités suivantes :
- Assurer la sécurité et un environnement approprié pour l'accès à la Plateforme en toute sûreté, 
- Vous proposez de participer à des événements, promotions, formations, activités, groupes de discussion ou de recherches, concours, promotions, sondages, enquêtes ou productions… 
- Vérifier votre utilisation du Service conformément aux Conditions, à la Charte de la Communauté, 
- Valider et/ou traiter les paiements, rabais, remboursements, frais, conformément aux présentes Conditions, 
- Développer le Service en vertu des Conditions afin de vous en améliorer l'expérience, 
- Répondre à vos questions et commentaires, communiquer avec vous dans le cadre du Service, 
- Détecter, prévenir et réprimer les manquements aux Conditions, 
- Analyser les données de fonctionnement de la Plateforme, 
- Vous adresser des alertes, des bulletins d'information, des mises à jour, des publipostages, des informations promotionnelles, des avantages, des salutations festives de la part de la Société, de ses partenaires, d'annonceurs ou de sponsors. 
- Vous informer et vous inviter à des événements ou activités organisés par la Société, ses partenaires, des annonceurs ou des sponsors. 
- Répondre à l'ensemble de nos obligations légales, réglementaires ou fiscales, en nous conformant à toute loi et règlement applicable, en les partageant si nécessaire, avec un régulateur ou une autorité compétente.

Nous sommes susceptibles de divulguer vos données à caractère personnelles à nos partenaires.
Vous avez la possibilité de modifier vos données personnelles en envoyant les informations actualisées à notre service support via l'Application.

Les modifications seront enregistrées par le service support sous un délai moyen de quatorze (14) jours ouvrables.`,
      },
      {
        title: "16. Avertissement",
        content: `Le service est fourni «tel quel » et « tel que disponible ». La société dénie toute déclaration et garantie, non expressément formulée, y compris, notamment les garanties implicites de qualité marchande, d'adéquation a une finalité particulière et d'absence de contrefaçon, et ne formule aucune déclaration ni ne donne aucune garantie quant à la fiabilité, a la ponctualité, a la qualité, a la convenance ou à la disponibilité du service, ni quant au fonctionnement du service sans interruptions ou erreurs. Vous acceptez que les risques découlant de votre utilisation du service reposent sur vous seul, dans la mesure permise par la loi. La société ne formule ou ne donne, quelque déclaration ou garantie quant à l'absence de virus ou d'autres composants malveillants à l'égard du service.
La société n'est pas responsable en cas de force majeure, en cas de pannes ou coupures d'internet ou des infrastructures de télécommunications qui ne relèvent pas de son contrôle et qui peuvent conduire à des interruptions de l'accessibilité de la plateforme. La société peut, de façon temporaire et en prenant en compte les intérêts légitimes des utilisateurs (par exemple par une notification préalable), limiter la disponibilité de la plateforme ou de certaines fonctionnalités de la plateforme si cela est nécessaire, pour préserver la sécurité ou l'intégrité de nos serveurs, ou pour effectuer des opérations de maintenance afin d'assurer ou d'améliorer le fonctionnement de la plateforme.`,
      },
      {
        title: "17. Indemnisation",
        content: `Dans les limites autorisées par le droit applicable, vous convenez de tenir la Société ainsi que ses dirigeants, employés, mandataires quittes et indemnes quant à l'ensemble des réclamations, des demandes, des pertes, des responsabilités et des dépenses (y compris, notamment les honoraires raisonnables d'avocats) par suite ou en raison de ce qui suit : 
(i) Votre utilisation du Service ; 
(ii) Votre inexécution ou violation de l'une ou l'autre des présentes Conditions ou de la Charte de la Communauté,
(iii) Votre violation de toute loi, tout règlement ou droit de tiers.`,
      },
      {
        title: "18. Limitation de responsabilité contractuelle",
        content: `Ni la Société ni ses dirigeants, employés ou mandataires ne pourront être tenus responsables de dommages indirects, spécifiques, fortuits, économiques ou consécutifs imputables à votre utilisation ou incapacité à utiliser l'Application ou à celle d'autres personnes se réclamant de vous ou prétendant agir par votre intermédiaire, ou de pertes ou dommages causés ou prétendument causés, directement ou indirectement, par l'Application, indépendamment de la nature du préjudice, y compris non limitativement: une perte ou une interruption d'exploitation ou une perte de bénéfices escomptés, un manque à gagner, les coûts des retards, les dommages liés ou imputables à la perte ou corruption de données, de documentation ou d'informations, les obligations envers des tiers pour quelque motif que ce soit, ou tous autres dommages fortuits, spécifiques, punitifs ou indirects résultant de l'utilisation de l'Application, même si la Société connaissait ou avait été avertie de la possibilité de ces obligations, pertes ou dommages.`,
      },
      {
        title: "19. Interactions entre utilisateurs/tiers",
        content: `La société n'est pas responsable du comportement, en ligne ou hors ligne, de tout utilisateur de la plateforme. L'utilisateur est le seul responsable de ses interactions avec les autres utilisateurs et/ou les tiers.
La société ne sera pas partie des différends, négociations de différends entre vous et tout autre utilisateur de la plateforme.
Vous êtes responsables des dégâts causés à l'intérieur ou à l'extérieur du véhicule d'un prestataire de transport si ces dégâts sont de votre fait.
Vous avez la garde de vos objets personnels à l'intérieur des véhicules des prestataires de transport.`,
      },
      {
        title: "20. Notifications",
        content: `Vous pouvez échanger des informations avec la Société via l'Application, par téléphone, par courrier électronique ou tout moyen laissant trace écrite.`,
      },
      {
        title: "21. Modification des CGU",
        content: `A-Logistics se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle.`,
      },
      {
        title: "22. Droit applicable et juridiction compétente",
        content: `Les présentes CGU sont régies par le droit en vigueur au Bénin. 
Tout différend pouvant survenir de l'exécution ou de l'interprétation du présent sera réglé à l'amiable.
A défaut d'accord, le litige sera tranché selon les règles du droit Béninois et soumis à la compétence des tribunaux du Bénin ; sauf compétence territoriale ou matérielle attribuée à la juridiction du lieu d'exécution de la prestation par l'effet de la loi.
En cas d'interrogation sur les présentes Conditions Générales d'Utilisation, merci de nous écrire par e-mail du support.`,
      },
      {
        title: "Fin des Conditions Générales d'Utilisation",
        content: `Mises à jour le 16/01/2026`,
      },
      {
        title: "FOIRE AUX QUESTIONS",
        content: `Q : AFRICA LOGISTICS est-elle une entreprise de transport ?
R : Non, Africa Logistics n'est pas une entreprise de transport, elle se contente de vous mettre en relation avec des prestataires indépendants qui proposent une variété de services.

Q : Qu'est-ce que la Charte de la Communauté Africa Logistics ?
R : La Charte de la Communauté Africa Logistics établit les principes à respecter afin que chacun puisse bénéficier sur la Plateforme d'une expérience agréable dans le respect et la sécurité.
Le non-respect de l'une de ses clauses peut entraîner la révocation de votre accès à tout ou partie de la Plateforme.

Q : Vous est-il possible de partager les accès de votre compte avec une autre personne ?
R : Non, votre Compte d'Utilisateur est strictement personnel, c'est un gage de sécurité de la Plateforme.

Q : Vous avez des interrogations sur le fonctionnement de l'Application, comment obtenir des réponses ?
R : Il vous suffit d'accéder à la rubrique "aide" de votre Compte d'Utilisateur, vous y trouverez les réponses aux questions les plus fréquemment posées.

Q : Des frais vous sont-ils facturés en cas d'annulation de demande de service ?
R : Des frais peuvent vous être facturés en cas d'annulation, ils servent à dédommager le prestataire.

Q : Quels sont les moyens de paiement acceptés par Africa Logistics ?
R : Il vous est possible de payer par monnaie électronique, par carte bancaire.

Q : Vous rencontrez une difficulté pendant une course, ou lors d'une commande comment contacter la Société ?
R : Vous pouvez contacter le service support de Africa Logistics par le biais de l'Application, ce service est disponible 7j/7 et 24h/24.`,
      },
    ],
  },
  en: {
    title: "TERMS OF USE (TOU)",
    subtitle: "Africa Logistics Platform (A-Logistics)",
    sections: [
      {
        title: "1. Preamble",
        content: `These Terms of Use (hereinafter "TOU") are intended to define the terms and conditions under which users access and use the Africa Logistics (A-Logistics) digital platform.
A-Logistics is a digital platform for connecting and managing logistics that allows clients to submit freight transport requests and transporters to execute these services, under the supervision of moderators and administrators.
Any use of the platform implies full and complete acceptance of these TOU.`,
      },
      {
        title: "2. Definitions",
        content: `In these TOU, the following terms have the meaning set forth below:
• Platform: refers to the Africa Logistics (A-Logistics) digital platform.
• User: any natural or legal person with an account on the platform.
• Client: user wishing to transport goods from point A to point B (Natural and legal persons).
• Transporter: user responsible for executing transport services (independent driver, transport company, fleet manager, etc.).
• Moderator: user responsible for processing, qualifying and assigning transport requests.
• Administrator: user with global access to the platform for management, supervision and configuration purposes.
• Wallet: virtual account associated with a user allowing fund management.`,
      },
      {
        title: "3. Purpose of the platform",
        content: `The A-Logistics platform aims to:
• Facilitate connections between clients and transporters;
• Centralize transport requests;
• Provide a structured framework for tracking, payment and control of logistics operations.
A-Logistics acts as a technical and organizational intermediary and cannot be considered as a party to the transport contract concluded between the client and the transporter.
AFRICA LOGISTICS DOES NOT PROVIDE TRANSPORT SERVICES, DELIVERY SERVICES, OR ANY OTHER FORM OF SERVICE. ALL SUCH SERVICES ARE PROVIDED BY THIRD PARTIES WHO ARE AUTONOMOUS AND INDEPENDENT.
AFRICA LOGISTICS' INTERVENTION IS LIMITED TO A CONNECTION.
THIRD PARTIES OPERATING ON THE PLATFORM ARE SOLELY RESPONSIBLE FOR THE PROPER EXECUTION OF SERVICES.
WHEN YOU REQUEST A SERVICE, YOU ENTER DIRECTLY INTO A CONTRACT WITH THE SERVICE PROVIDER, AFRICA LOGISTICS IS NOT, NOR DOES IT BECOME A PARTY TO THIS CONTRACT.`,
      },
      {
        title: "4. Platform access",
        content: `4.1 Access conditions
Access to the platform is reserved for persons with the necessary legal capacity or validly representing a legal entity.
You must be of legal age to use the Service. You must be eighteen (18) or twenty-one (21) years old depending on the legislation of the place of access to the Platform.

4.2 Account creation
Account creation is free. The user undertakes to provide accurate, complete and up-to-date information during registration.
Each user is responsible for the confidentiality of their login credentials.
You must have the necessary legal capacity to contract and must use the Service in accordance with the Terms.
Minors cannot create a User Account and therefore cannot use the Platform without the express consent and accompaniment of their parents or legal representatives.
Any use of the Services by a minor will be carried out under the full supervision and responsibility of the User, who will be fully responsible for any use of their Account.
You agree to comply with all applicable laws when using the Service and to use the Service only for legal purposes.
You must have a compatible device to access the Service and perform any related updates.
The Company does not guarantee that the Service or any part thereof can be operated on incompatible devices and operating systems.
The Company reserves the right to suspend or block your access to the Service if there are legitimate reasons to believe that:
(i) You are using the Service with an unauthorized device,
(ii) You do not comply with applicable laws when using the Service,
(iii) You are not using the service in accordance with the Terms,
(iv) Your use of the Service has a negative effect on the legitimate rights or interests of the Company or third parties, such that immediate action is necessary to prevent any damage.`,
      },
      {
        title: "5. User profile descriptions",
        content: `5.1 Clients
Clients can:
• create and submit transport requests;
• credit and consult their wallet;
• track the processing and execution of their orders.

5.2 Transporters
Transporters can:
• enter their personal or professional information;
• declare and manage their vehicle fleet;
• receive and execute transport missions;
• consult their wallet and income.

5.3 Moderators
Moderators ensure:
• processing of transport requests;
• their assignment to transporters;
• moderation of users and content.

5.4 Administrators
Administrators have global access allowing them to ensure supervision, management and configuration of the platform.`,
      },
      {
        title: "6. User obligations",
        content: `Each user undertakes to:
• use the platform in accordance with its purpose;
• comply with applicable laws and regulations;
• adopt loyal and respectful behavior;
• not harm the proper functioning of the platform.`,
      },
      {
        title: "7. Responsibilities",
        content: `7.1 Platform responsibility
A-Logistics implements reasonable means to ensure the availability and proper functioning of the platform. However, it cannot be held responsible:
• for temporary service interruptions;
• for disputes between clients and transporters;
• for the physical execution of transport services.

7.2 User responsibility
Each user is solely responsible for the information they provide and the commitments they make in the context of using the platform.`,
      },
      {
        title: "8. Payments",
        content: `Payments are made at the end of each service and are non-refundable, unless the Company decides otherwise.
You can choose to pay for services in cash, by electronic money or by bank card.
Electronic money payments are provided by Electronic Money Institutions that are licensed and authorized to carry out regulated payment operations in all countries where the Company operates.
To make payments by bank card, you must first register a valid card belonging to you.
You agree that we may verify card details with your bank.
We then issue a reasonable authorization request, which does not constitute a real charge on your card, in order to proceed with this verification.
This request will be pending and will automatically disappear after a few days and no amount will be debited from your account.
If card payment is processed abroad, banking fees may apply. They are your responsibility.
The Company assumes no responsibility for dematerialized payments. The User must contact the Payment Institution in case of malfunction.
The Company reserves the right to suspend the processing of any transaction when it reasonably believes that the transaction may be fraudulent, illegal, involves criminal activity or reasonably believes that the Service is not being used in accordance with the Terms.
In such a case, the Company cannot be held responsible for any delay, suspension, retention or cancellation of any payment to you.
You will need to fully cooperate with the Company in any investigation to determine whether a transaction was authorized.`,
      },
      {
        title: "9. Tips",
        content: `Tips are optional and left to the sole discretion of the User.
At the end of a service, you are offered to set a tip amount to give to the service provider, you are free not to assign it or to modify it.
The User consents to receive a detailed billing statement by email.`,
      },
      {
        title: "10. Promotions and programs",
        content: `The Company may, at its sole discretion, offer promotions and programs with different characteristics depending on the User.
When offered, these promotions and programs are subject to specific conditions specified in the Application.
The Company reserves the right to retain or deduct credits or benefits obtained as part of a promotion or program, in the event that it finds or estimates that the use of the promotion or receipt of promotional codes were made in error, fraudulently, illegally or in violation of the applicable promotion or program conditions.
In case of fraud, attempted fraud or suspicion of other illegal activities related to a promotional code or its exchange, the Company will be authorized to suspend, block and delete the corresponding User Accounts.
The Company may request from the User reimbursement of any amount obtained fraudulently.`,
      },
      {
        title: "11. License",
        content: `Subject to compliance with the Terms, the Company and its licensors, if any, grant you a limited, non-exclusive, non-sublicensable, revocable and non-transferable license:
(i) to access and use the Application on your personal device solely for the use of the Service; and
(ii) to access and use any content, information and related material that may be made available to you as part of the Service, in each case solely for personal use. All rights not expressly granted in this paragraph are reserved to the Company and its licensors.`,
      },
      {
        title: "12. Restrictions",
        content: `You must not
(i) License, sublicense, sell, resell, transfer, assign, distribute, commercially exploit or make available to third parties in any way the Application;
(ii) Modify or create derivative works based on the Application;
(iii) Create internet links to the Application, frame or mirror the Application on any other server or wireless or Internet-based device;
(iv) Reverse engineer or access the Application to: (a) create a competitive product or service, (b) create a product using ideas, features, functions or graphics similar to those of the Application, copy ideas, features, functions or graphics from the Application;
(v) Launch an automated program or script, including but not limited to web robots, web indexers, bots, viruses or worms, any program likely to make multiple server requests per second, overload or unduly hinder the operation and/or performance of the Application;
(vi) Use a robot, spider, site/application search retrieval, or other manual/automated device or process to retrieve, index, mine data, reproduce or circumvent in any way the navigation structure or presentation of the Service or its content;
(vii) Publish, distribute or reproduce in any way any material protected by copyright, trademarks or other exclusive information without obtaining the prior consent of the owner of these property rights;
(viii) Remove any copyright, trademark or other property rights notices contained in the Service;
(ix) Send messages to users who have not requested to receive information from you.`,
      },
      {
        title: "13. Confidentiality",
        content: `You will consider as confidential and may not use without the prior agreement of the Company the following information (hereinafter Confidential Information):
- All information or data in any form, including any information given verbally as well as any document, file or electronic message or any other means of materializing or recording information, communicated by the Company in any way.
- Trade secrets and know-how, information that the Company designates as confidential or which, given the circumstances of their disclosure or due to their nature, must be treated as confidential;
- All secret or confidential information relating to the Company's processes, products, marketing strategy, commercial, practices and procedures;
- Personal data of other Users.
You guarantee not to use Confidential Information for any purpose other than your use of the Service.
However, the following do not constitute Confidential Information:
- Information currently accessible or becoming accessible to the public without breach of the Terms.
- Information legally held by you before its disclosure by the Company,
- Information validly obtained from a third party authorized to transfer or disclose such information.
This confidentiality obligation will last two years after the end of partnerships.`,
      },
      {
        title: "14. Account suspension and termination",
        content: `A-Logistics reserves the right to suspend or delete any account in case of:
• violation of these TOU;
• fraudulent or abusive behavior;
• harm to the interests of the platform or other users.`,
      },
      {
        title: "15. Personal Data Protection",
        content: `Personal data collected is processed in accordance with applicable regulations and the platform's Privacy Policy.
During your use of the Service, we may ask you to provide us with your personal data.
The term "personal data" refers to any information relating to an identified or identifiable natural person, directly or indirectly, by reference to an identification number or one or more elements specific to their physical, physiological, genetic, psychological, cultural, social or economic identity.
These include in particular: name, first name, pseudonym, photograph, postal and electronic addresses, telephone numbers, date of birth.
We inform you, when collecting your personal data, if certain data must be mandatory or if they are optional. We also indicate what the possible consequences of a failure to respond are.
Your personal data is collected with your consent, in accordance with applicable legislation, to respond to one or more of the following purposes:
- Ensure security and an appropriate environment for safe access to the Platform,
- Offer you to participate in events, promotions, training, activities, discussion or research groups, contests, promotions, surveys, investigations or productions...
- Verify your use of the Service in accordance with the Terms, the Community Charter,
- Validate and/or process payments, discounts, refunds, fees, in accordance with these Terms,
- Develop the Service under the Terms to improve your experience,
- Respond to your questions and comments, communicate with you as part of the Service,
- Detect, prevent and repress breaches of the Terms,
- Analyze Platform operating data,
- Send you alerts, newsletters, updates, mailings, promotional information, benefits, festive greetings from the Company, its partners, advertisers or sponsors.
- Inform and invite you to events or activities organized by the Company, its partners, advertisers or sponsors.
- Respond to all our legal, regulatory or tax obligations, by complying with any applicable law and regulation, sharing them if necessary with a regulator or competent authority.

We may disclose your personal data to our partners.
You have the possibility to modify your personal data by sending updated information to our support service via the Application.

Modifications will be recorded by the support service within an average period of fourteen (14) working days.`,
      },
      {
        title: "16. Disclaimer",
        content: `The service is provided "as is" and "as available". The company disclaims all representations and warranties, not expressly stated, including, in particular, implied warranties of merchantability, fitness for a particular purpose and non-infringement, and makes no representation or warranty as to the reliability, timeliness, quality, suitability or availability of the service, or as to the operation of the service without interruption or errors. You accept that the risks arising from your use of the service rest solely with you, to the extent permitted by law. The company makes or gives no representation or warranty as to the absence of viruses or other malicious components with respect to the service.
The company is not responsible in case of force majeure, in case of internet or telecommunications infrastructure failures or cuts that are beyond its control and which may lead to interruptions in platform accessibility. The company may, temporarily and taking into account the legitimate interests of users (for example by prior notification), limit the availability of the platform or certain platform features if this is necessary to preserve the security or integrity of our servers, or to perform maintenance operations to ensure or improve platform operation.`,
      },
      {
        title: "17. Indemnification",
        content: `To the extent permitted by applicable law, you agree to hold the Company and its officers, employees, agents harmless and indemnified against all claims, demands, losses, liabilities and expenses (including, in particular, reasonable attorneys' fees) as a result of or in connection with the following:
(i) Your use of the Service;
(ii) Your non-performance or breach of any of these Terms or the Community Charter,
(iii) Your violation of any law, regulation or third party right.`,
      },
      {
        title: "18. Limitation of contractual liability",
        content: `Neither the Company nor its officers, employees or agents may be held liable for indirect, specific, incidental, economic or consequential damages attributable to your use or inability to use the Application or that of other persons claiming to act on your behalf or purporting to act on your behalf, or losses or damages caused or allegedly caused, directly or indirectly, by the Application, regardless of the nature of the damage, including but not limited to: loss or interruption of operations or loss of expected profits, lost profits, costs of delays, damages related or attributable to loss or corruption of data, documentation or information, obligations to third parties for any reason, or any other incidental, specific, punitive or indirect damages resulting from the use of the Application, even if the Company knew or had been warned of the possibility of such obligations, losses or damages.`,
      },
      {
        title: "19. Interactions between users/third parties",
        content: `The company is not responsible for the behavior, online or offline, of any platform user. The user is solely responsible for their interactions with other users and/or third parties.
The company will not be a party to disputes, dispute negotiations between you and any other platform user.
You are responsible for damage caused inside or outside a transport provider's vehicle if such damage is your fault.
You have custody of your personal belongings inside transport provider vehicles.`,
      },
      {
        title: "20. Notifications",
        content: `You can exchange information with the Company via the Application, by phone, by email or any means leaving a written record.`,
      },
      {
        title: "21. Modification of TOU",
        content: `A-Logistics reserves the right to modify these TOU at any time. Users will be informed of any substantial modification.`,
      },
      {
        title: "22. Applicable law and competent jurisdiction",
        content: `These TOU are governed by the law in force in Benin.
Any dispute that may arise from the execution or interpretation of this document will be resolved amicably.
Failing agreement, the dispute will be decided according to the rules of Beninese law and submitted to the jurisdiction of the courts of Benin; except territorial or material jurisdiction attributed to the jurisdiction of the place of execution of the service by effect of the law.
If you have any questions about these Terms of Use, please write to us by support email.`,
      },
      {
        title: "End of Terms of Use",
        content: `Updated on 01/16/2026`,
      },
      {
        title: "FREQUENTLY ASKED QUESTIONS",
        content: `Q: Is AFRICA LOGISTICS a transport company?
A: No, Africa Logistics is not a transport company, it simply connects you with independent service providers who offer a variety of services.

Q: What is the Africa Logistics Community Charter?
A: The Africa Logistics Community Charter establishes the principles to be respected so that everyone can benefit from a pleasant experience on the Platform in respect and safety.
Failure to comply with any of its clauses may result in the revocation of your access to all or part of the Platform.

Q: Is it possible for you to share your account access with another person?
A: No, your User Account is strictly personal, it is a guarantee of Platform security.

Q: You have questions about how the Application works, how to get answers?
A: Simply access the "help" section of your User Account, you will find answers to the most frequently asked questions.

Q: Are you charged fees if you cancel a service request?
A: Fees may be charged in case of cancellation, they serve to compensate the service provider.

Q: What payment methods are accepted by Africa Logistics?
A: You can pay by electronic money, by bank card.

Q: You encounter a difficulty during a ride, or during an order how to contact the Company?
A: You can contact Africa Logistics support service through the Application, this service is available 7 days a week and 24 hours a day.`,
      },
    ],
  },
}

export default function CGUPage() {
  const { t, language } = useLanguage()
  const content = cguContent[language]

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
