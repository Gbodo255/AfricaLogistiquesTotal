# 📋 Scénarios Utilisateurs - Plateforme A-Logistics

## Vue d'Ensemble

Ce document décrit tous les scénarios d'utilisation de la plateforme A-Logistics une fois le backend opérationnel. Il couvre les 4 types d'utilisateurs : **Client**, **Transporteur**, **Modérateur** et **Administrateur**.

---

## 🧑‍💼 SCÉNARIOS CLIENT

### Scénario 1 : Inscription d'un nouveau client

**Acteur** : Nouveau visiteur souhaitant devenir client

**Étapes** :
1. Le visiteur accède à la page d'accueil
2. Clique sur "S'inscrire" ou "Créer un compte"
3. Sélectionne le type de compte : "Client"
4. Remplit le formulaire :
   - Email
   - Mot de passe
   - Prénom et Nom
   - Numéro de téléphone
5. Accepte les CGU et CGV
6. Clique sur "Créer mon compte"
7. Reçoit un email de confirmation
8. Clique sur le lien de confirmation
9. Est redirigé vers son tableau de bord client

**Résultat** : Compte client actif avec portefeuille à 0 FCFA

---

### Scénario 2 : Connexion et accès au tableau de bord

**Acteur** : Client existant

**Étapes** :
1. Accède à `/auth/login`
2. Entre son email et mot de passe
3. Clique sur "Se connecter"
4. Est automatiquement redirigé vers `/client`
5. Voit son tableau de bord avec :
   - Solde du portefeuille
   - Demandes récentes
   - Notifications

---

### Scénario 3 : Recharger son portefeuille

**Acteur** : Client connecté

**Étapes** :
1. Va dans "Mon Portefeuille" (`/client/wallet`)
2. Clique sur "Recharger"
3. Choisit le montant (5000, 10000, 25000, 50000 FCFA ou montant personnalisé)
4. Sélectionne le moyen de paiement :
   - Mobile Money (MTN, Moov, Orange Money)
   - Carte bancaire
   - Virement bancaire
5. Confirme le paiement
6. Reçoit une notification de confirmation
7. Le solde est mis à jour instantanément

**Résultat** : Portefeuille crédité, transaction enregistrée

---

### Scénario 4 : Créer une demande de transport

**Acteur** : Client connecté avec fonds suffisants

**Étapes** :
1. Clique sur "Nouvelle demande" ou va dans `/client/requests`
2. Remplit le formulaire de demande :

   **Étape 1 - Type de transport** :
   - Standard (normal)
   - Express (urgent)
   - Fragile (objets délicats)
   - Réfrigéré (produits frais)
   - Dangereux (matières spéciales)

   **Étape 2 - Description du colis** :
   - Description détaillée
   - Poids estimé (kg)
   - Volume estimé (m³)
   - Valeur déclarée (FCFA)
   - Instructions spéciales

   **Étape 3 - Point de collecte** :
   - Adresse complète
   - Ville
   - Coordonnées GPS (optionnel, via carte)
   - Nom du contact
   - Téléphone du contact
   - Date et heure souhaitées

   **Étape 4 - Point de livraison** :
   - Adresse complète
   - Ville
   - Coordonnées GPS (optionnel)
   - Nom du destinataire
   - Téléphone du destinataire
   - Date de livraison souhaitée

3. Voit l'estimation du prix (calculée automatiquement)
4. Confirme la demande
5. Le montant est bloqué sur son portefeuille
6. Reçoit une confirmation avec numéro de suivi

**Résultat** : Demande créée avec statut "En attente" (pending)

---

### Scénario 5 : Suivre une livraison en temps réel

**Acteur** : Client avec une livraison en cours

**Étapes** :
1. Va dans "Suivi" (`/client/tracking`)
2. Sélectionne la demande à suivre
3. Voit la carte avec :
   - Position actuelle du transporteur (en temps réel)
   - Trajet prévu
   - Point de collecte et de livraison
4. Voit les informations :
   - Nom du transporteur
   - Type de véhicule
   - Numéro de plaque
   - Téléphone (pour contact direct)
   - Temps estimé d'arrivée
5. Reçoit des notifications à chaque étape :
   - "Transporteur en route vers le point de collecte"
   - "Colis récupéré"
   - "En route vers la destination"
   - "Arrivée dans 10 minutes"
   - "Livraison effectuée"

---

### Scénario 6 : Consulter l'historique des demandes

**Acteur** : Client connecté

**Étapes** :
1. Va dans "Historique" (`/client/history`)
2. Voit la liste de toutes ses demandes avec filtres :
   - Par statut (terminées, annulées, en cours)
   - Par période
   - Par ville
3. Peut cliquer sur une demande pour voir les détails :
   - Informations complètes
   - Transporteur assigné
   - Prix final
   - Note donnée
   - Trajet effectué

---

### Scénario 7 : Noter un transporteur après livraison

**Acteur** : Client après réception d'une livraison

**Étapes** :
1. Reçoit une notification "Votre livraison est terminée. Notez votre transporteur !"
2. Clique sur la notification ou va dans l'historique
3. Donne une note de 1 à 5 étoiles
4. Écrit un commentaire (optionnel)
5. Soumet l'évaluation

**Résultat** : Note enregistrée, moyenne du transporteur mise à jour

---

### Scénario 8 : Ouvrir un litige

**Acteur** : Client insatisfait

**Étapes** :
1. Va dans les détails de la demande concernée
2. Clique sur "Signaler un problème"
3. Choisit la catégorie :
   - Colis endommagé
   - Colis non livré
   - Retard excessif
   - Comportement du transporteur
   - Surfacturation
   - Autre
4. Décrit le problème en détail
5. Ajoute des photos/preuves si nécessaire
6. Soumet le litige

**Résultat** : Litige créé, assigné à un modérateur, client notifié

---

### Scénario 9 : Annuler une demande

**Acteur** : Client avec une demande en attente ou validée

**Étapes** :
1. Va dans ses demandes en cours
2. Sélectionne la demande à annuler
3. Clique sur "Annuler la demande"
4. Indique le motif d'annulation
5. Confirme l'annulation

**Conditions et résultats** :
- **Si demande "pending"** : Annulation gratuite, remboursement total
- **Si demande "validated"** : Frais d'annulation de 5%
- **Si demande "assigned" ou "in_progress"** : Frais d'annulation de 15-25%

---

## 🚚 SCÉNARIOS TRANSPORTEUR

### Scénario 10 : Inscription d'un nouveau transporteur

**Acteur** : Nouveau transporteur

**Étapes** :
1. Accède à la page d'inscription
2. Sélectionne "Transporteur"
3. Remplit le formulaire :
   - Informations personnelles (nom, prénom, email, téléphone)
   - Nom de l'entreprise (si applicable)
   - Adresse
   - Documents d'identité
4. Ajoute son premier véhicule :
   - Type (moto, voiture, camionnette, camion, remorque)
   - Marque et modèle
   - Numéro de plaque
   - Capacité (kg et m³)
   - Photos du véhicule
   - Assurance (date d'expiration)
   - Contrôle technique (date d'expiration)
5. Soumet sa demande

**Résultat** : Compte créé avec statut "En attente de vérification"

---

### Scénario 11 : Validation du compte transporteur (par modérateur)

**Acteur** : Transporteur en attente

**Étapes** :
1. Le transporteur attend la validation
2. Un modérateur vérifie :
   - Documents d'identité
   - Documents du véhicule
   - Assurance valide
   - Contrôle technique valide
3. Si tout est valide, le modérateur approuve
4. Le transporteur reçoit un email "Votre compte a été validé"
5. Peut maintenant accéder à son tableau de bord

---

### Scénario 12 : Recevoir et accepter une mission

**Acteur** : Transporteur connecté et disponible

**Étapes** :
1. Reçoit une notification "Nouvelle mission disponible"
2. Voit les détails :
   - Point de collecte et livraison
   - Type de colis
   - Rémunération proposée
   - Date et heure
3. Peut accepter ou refuser
4. S'il accepte, la mission lui est assignée
5. Voit la mission dans son tableau de bord

**Note** : En réalité, c'est le modérateur qui assigne, mais le transporteur peut être notifié et doit confirmer sa disponibilité.

---

### Scénario 13 : Effectuer une livraison

**Acteur** : Transporteur avec mission assignée

**Étapes** :

**Phase 1 - Préparation** :
1. Consulte les détails de la mission
2. Vérifie l'itinéraire sur la carte
3. Contacte le client si besoin de clarifications
4. Clique sur "Démarrer la mission"

**Phase 2 - Collecte** :
1. Se rend au point de collecte
2. Active le GPS pour le suivi en temps réel
3. Arrive sur place
4. Vérifie le colis avec le contact
5. Prend des photos du colis (optionnel)
6. Clique sur "Colis récupéré"

**Phase 3 - Transport** :
1. Se dirige vers le point de livraison
2. Sa position est visible par le client en temps réel
3. Peut ajouter des notes si problème (embouteillage, etc.)

**Phase 4 - Livraison** :
1. Arrive à destination
2. Contacte le destinataire
3. Remet le colis
4. Fait signer le destinataire (ou prend photo de preuve)
5. Clique sur "Livraison effectuée"

**Résultat** : Mission terminée, gains crédités sur portefeuille (moins commission 15%)

---

### Scénario 14 : Consulter ses gains et retirer de l'argent

**Acteur** : Transporteur connecté

**Étapes** :
1. Va dans "Mon Portefeuille" (`/transporter/wallet`)
2. Voit :
   - Solde disponible
   - Gains du jour/semaine/mois
   - Historique des transactions
3. Pour retirer :
   - Clique sur "Retirer"
   - Indique le montant
   - Choisit le mode de retrait (Mobile Money, virement)
   - Confirme
4. Reçoit l'argent sous 24-48h

---

### Scénario 15 : Gérer ses véhicules

**Acteur** : Transporteur connecté

**Étapes** :
1. Va dans "Mes Véhicules" (`/transporter/profile`)
2. Peut :
   - Ajouter un nouveau véhicule
   - Modifier les informations d'un véhicule
   - Mettre à jour les documents (assurance, contrôle technique)
   - Marquer un véhicule comme disponible/indisponible
   - Supprimer un véhicule

---

### Scénario 16 : Consulter ses évaluations

**Acteur** : Transporteur connecté

**Étapes** :
1. Va dans "Mes Évaluations" (`/transporter/ratings`)
2. Voit :
   - Note moyenne globale
   - Nombre total d'évaluations
   - Commentaires des clients
   - Évolution de la note dans le temps
3. Peut répondre aux commentaires (si fonctionnalité activée)

---

## 👨‍⚖️ SCÉNARIOS MODÉRATEUR

### Scénario 17 : Connexion au dashboard modérateur

**Acteur** : Modérateur

**Identifiants de test** :
- Email : `mod@example.com`
- Mot de passe : `mod123`

**Étapes** :
1. Accède à `/auth/login`
2. Entre les identifiants
3. Est redirigé vers `/moderator`
4. Voit son tableau de bord avec :
   - Demandes en attente de validation
   - Litiges ouverts
   - Statistiques du jour

---

### Scénario 18 : Valider une demande de transport

**Acteur** : Modérateur connecté

**Étapes** :
1. Va dans "Demandes" (`/moderator/requests`)
2. Voit la liste des demandes en attente (status: pending)
3. Clique sur une demande pour voir les détails :
   - Informations client
   - Description du colis
   - Points de collecte et livraison
   - Prix estimé
4. Vérifie la cohérence :
   - Le prix est-il correct ?
   - Les adresses sont-elles valides ?
   - Le type de transport est-il approprié ?
5. Peut modifier le prix si nécessaire
6. Clique sur "Valider" ou "Rejeter"
7. Si rejet, indique le motif

**Résultat** : Demande passe en statut "validated" ou est rejetée

---

### Scénario 19 : Assigner un transporteur à une demande

**Acteur** : Modérateur avec demande validée

**Étapes** :
1. Sélectionne une demande validée
2. Clique sur "Assigner un transporteur"
3. Voit la liste des transporteurs disponibles avec :
   - Nom et évaluation
   - Type de véhicule
   - Localisation actuelle
   - Historique de fiabilité
4. Sélectionne le transporteur le plus approprié
5. Sélectionne le véhicule à utiliser
6. Confirme l'assignation
7. Le transporteur et le client sont notifiés

**Résultat** : Demande passe en statut "assigned"

---

### Scénario 20 : Valider un nouveau transporteur

**Acteur** : Modérateur

**Étapes** :
1. Va dans "Utilisateurs" (`/moderator/users`)
2. Filtre par "Transporteurs en attente"
3. Sélectionne un transporteur
4. Vérifie les documents :
   - Pièce d'identité
   - Documents du véhicule
   - Assurance
   - Contrôle technique
5. Si tout est conforme :
   - Clique sur "Approuver"
   - Le transporteur est notifié
6. Si problème :
   - Clique sur "Rejeter" ou "Demander des documents supplémentaires"
   - Indique le motif
   - Le transporteur est notifié

---

### Scénario 21 : Gérer un litige

**Acteur** : Modérateur avec litige assigné

**Étapes** :
1. Va dans "Litiges" (`/moderator/disputes`)
2. Voit la liste des litiges ouverts
3. Sélectionne un litige
4. Voit tous les détails :
   - Demande concernée
   - Client et transporteur impliqués
   - Catégorie et description du problème
   - Preuves fournies
5. Peut :
   - Contacter le client (via messagerie interne)
   - Contacter le transporteur
   - Demander des preuves supplémentaires
6. Après investigation :
   - Décide de la résolution
   - Applique les actions :
     * Remboursement partiel ou total au client
     * Pénalité au transporteur
     * Avertissement
   - Rédige la résolution
7. Ferme le litige

**Résultat** : Litige résolu, parties notifiées, actions appliquées

---

### Scénario 22 : Suivre les livraisons en cours

**Acteur** : Modérateur

**Étapes** :
1. Va dans "Suivi" (`/moderator/tracking`)
2. Voit la carte avec toutes les livraisons en cours
3. Peut :
   - Cliquer sur un marqueur pour voir les détails
   - Filtrer par transporteur, ville, statut
   - Identifier les retards ou problèmes
4. Si problème détecté :
   - Contacte le transporteur
   - Avertit le client si nécessaire

---

### Scénario 23 : Envoyer des notifications

**Acteur** : Modérateur

**Étapes** :
1. Va dans "Notifications" (`/moderator/notifications`)
2. Peut envoyer des notifications :
   - À un utilisateur spécifique
   - À tous les clients
   - À tous les transporteurs
   - À une catégorie d'utilisateurs
3. Rédige le message
4. Choisit le type (info, alerte, promotion)
5. Envoie

---

## 👨‍💼 SCÉNARIOS ADMINISTRATEUR

### Scénario 24 : Connexion au dashboard administrateur

**Acteur** : Administrateur

**Identifiants de test** :
- Email : `admin@example.com`
- Mot de passe : `admin123`

**Étapes** :
1. Accède à `/auth/login`
2. Entre les identifiants
3. Est redirigé vers `/admin`
4. Voit son tableau de bord complet avec :
   - KPIs globaux (utilisateurs, demandes, revenus)
   - Graphiques d'activité
   - Alertes système

---

### Scénario 25 : Gérer les utilisateurs

**Acteur** : Administrateur

**Étapes** :
1. Va dans "Utilisateurs" (`/admin/users`)
2. Voit la liste complète avec filtres :
   - Par rôle (client, transporteur, modérateur, admin)
   - Par statut (actif, inactif, en attente)
   - Par date d'inscription
3. Peut pour chaque utilisateur :
   - Voir le profil complet
   - Modifier les informations
   - Changer le rôle (ex: promouvoir en modérateur)
   - Activer/Désactiver le compte
   - Réinitialiser le mot de passe
   - Supprimer le compte

---

### Scénario 26 : Créer un compte modérateur

**Acteur** : Administrateur

**Étapes** :
1. Va dans "Utilisateurs"
2. Clique sur "Ajouter un utilisateur"
3. Remplit le formulaire :
   - Email
   - Mot de passe temporaire
   - Prénom et Nom
   - Rôle : Modérateur
4. Envoie une invitation
5. Le nouveau modérateur reçoit un email avec ses identifiants

---

### Scénario 27 : Gérer les portefeuilles et transactions

**Acteur** : Administrateur

**Étapes** :
1. Va dans "Portefeuilles" (`/admin/wallets`)
2. Voit :
   - Liste de tous les portefeuilles
   - Solde total sur la plateforme
   - Transactions récentes
3. Peut :
   - Créditer manuellement un portefeuille (cas de remboursement)
   - Bloquer un portefeuille suspect
   - Exporter les transactions en CSV

---

### Scénario 28 : Consulter les revenus et commissions

**Acteur** : Administrateur

**Étapes** :
1. Va dans "Rapports" (`/admin/reports`)
2. Voit les statistiques financières :
   - Revenus totaux (commissions)
   - Revenus par période (jour, semaine, mois)
   - Évolution des revenus (graphique)
   - Répartition par type de transport
3. Peut :
   - Filtrer par période
   - Exporter les rapports en PDF/Excel

---

### Scénario 29 : Superviser toutes les demandes

**Acteur** : Administrateur

**Étapes** :
1. Va dans "Demandes" (`/admin/requests`)
2. Voit toutes les demandes avec tous les statuts
3. Peut :
   - Filtrer par statut, période, ville, transporteur
   - Voir les détails complets de chaque demande
   - Intervenir si nécessaire (annuler, réassigner, etc.)
   - Identifier les tendances (types de colis populaires, trajets fréquents)

---

### Scénario 30 : Gérer les litiges escaladés

**Acteur** : Administrateur

**Étapes** :
1. Reçoit une notification de litige escaladé
2. Va dans les litiges
3. Voit le litige avec l'historique des interventions du modérateur
4. Prend une décision finale
5. Peut appliquer des sanctions plus sévères :
   - Suspension temporaire de compte
   - Bannissement définitif
   - Remboursement exceptionnel

---

### Scénario 31 : Configurer la plateforme

**Acteur** : Administrateur

**Étapes** :
1. Va dans "Paramètres" (`/admin/settings`)
2. Peut configurer :
   - Taux de commission (par défaut 15%)
   - Frais d'annulation
   - Limites de retrait
   - Zones géographiques couvertes
   - Types de transport disponibles
   - Notifications automatiques

---

### Scénario 32 : Consulter les logs d'audit

**Acteur** : Administrateur

**Étapes** :
1. Va dans "Logs" (`/admin/logs`)
2. Voit toutes les actions effectuées :
   - Connexions/déconnexions
   - Modifications de profils
   - Transactions
   - Actions des modérateurs
3. Peut :
   - Filtrer par utilisateur, type d'action, période
   - Exporter les logs
   - Détecter des activités suspectes

---

### Scénario 33 : Générer des rapports statistiques

**Acteur** : Administrateur

**Étapes** :
1. Va dans "Rapports" (`/admin/reports`)
2. Choisit le type de rapport :
   - Rapport d'activité (demandes, livraisons)
   - Rapport financier (revenus, transactions)
   - Rapport utilisateurs (inscriptions, rétention)
   - Rapport qualité (notes, litiges)
3. Sélectionne la période
4. Génère le rapport
5. Télécharge en PDF ou Excel

---

## 🔄 SCÉNARIOS TRANSVERSAUX

### Scénario 34 : Réinitialisation de mot de passe

**Acteur** : Tout utilisateur

**Étapes** :
1. Clique sur "Mot de passe oublié" sur la page de connexion
2. Entre son email
3. Reçoit un email avec un lien de réinitialisation
4. Clique sur le lien
5. Entre un nouveau mot de passe
6. Confirme
7. Peut se connecter avec le nouveau mot de passe

---

### Scénario 35 : Modifier son profil

**Acteur** : Tout utilisateur connecté

**Étapes** :
1. Va dans "Mon Profil"
2. Peut modifier :
   - Photo de profil
   - Nom et prénom
   - Numéro de téléphone
   - Adresse
3. Sauvegarde les modifications

---

### Scénario 36 : Consulter les notifications

**Acteur** : Tout utilisateur connecté

**Étapes** :
1. Clique sur l'icône de notification dans le header
2. Voit la liste des notifications récentes
3. Peut :
   - Marquer comme lue
   - Cliquer pour accéder au contenu lié
   - Voir toutes les notifications

---

## 📊 RÉSUMÉ DES FLUX PRINCIPAUX

### Flux d'une Demande de Transport

```
┌─────────┐    ┌───────────┐    ┌────────────┐    ┌─────────────┐
│ Client  │───▶│ Demande   │───▶│ Modérateur │───▶│ Transporteur│
│ Crée    │    │ (pending) │    │ Valide     │    │ Assigné     │
└─────────┘    └───────────┘    └────────────┘    └─────────────┘
                                      │                   │
                                      ▼                   ▼
                               ┌────────────┐    ┌─────────────┐
                               │ Modérateur │    │ Transport   │
                               │ Assigne    │───▶│ En cours    │
                               └────────────┘    └─────────────┘
                                                       │
                                                       ▼
                                               ┌─────────────┐
                                               │ Livraison   │
                                               │ Terminée    │
                                               └─────────────┘
                                                       │
                                                       ▼
                                               ┌─────────────┐
                                               │ Paiement    │
                                               │ Transporteur│
                                               └─────────────┘
```

### Flux d'un Litige

```
┌─────────┐    ┌───────────┐    ┌────────────┐    ┌─────────────┐
│ Client  │───▶│ Litige    │───▶│ Modérateur │───▶│ Résolution  │
│ Ouvre   │    │ (open)    │    │ Investigue │    │             │
└─────────┘    └───────────┘    └────────────┘    └─────────────┘
                                      │
                                      ▼ (si complexe)
                               ┌────────────┐
                               │ Admin      │
                               │ Décide     │
                               └────────────┘
```

### Flux Financier

```
┌─────────────┐    ┌───────────────┐    ┌─────────────────┐
│ Client      │───▶│ Paiement      │───▶│ Fonds bloqués   │
│ Recharge    │    │ (Mobile Money)│    │ sur portefeuille│
└─────────────┘    └───────────────┘    └─────────────────┘
                                               │
                                               ▼
                                        ┌─────────────────┐
                                        │ Livraison       │
                                        │ Terminée        │
                                        └─────────────────┘
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         ▼                                           ▼
                  ┌─────────────┐                            ┌─────────────┐
                  │ Commission  │                            │ Transporteur│
                  │ Plateforme  │                            │ Reçoit 85%  │
                  │ 15%         │                            │             │
                  └─────────────┘                            └─────────────┘
```

---

## 🎯 Points d'Attention pour le Développement

1. **Temps réel** : Le suivi GPS doit être mis à jour en temps réel (WebSocket)
2. **Notifications** : Chaque changement de statut déclenche une notification
3. **Sécurité** : Vérification des permissions à chaque action
4. **Validation** : Tous les formulaires doivent être validés côté client ET serveur
5. **Audit** : Toutes les actions critiques doivent être loggées
6. **Mobile** : L'interface doit être responsive pour les transporteurs sur le terrain

---

Ce document couvre les scénarios principaux. Des scénarios supplémentaires peuvent être ajoutés selon les besoins métier spécifiques.
