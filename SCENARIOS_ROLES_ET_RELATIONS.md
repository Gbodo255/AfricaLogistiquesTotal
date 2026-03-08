# 🔐 Scénarios de Relations entre Rôles - Guide Complet

## 📊 Vue d'Ensemble des Rôles

### Rôles dans le Système

1. **DATA ADMIN** - Administrateur de données (accès complet)
2. **ADMIN** - Administrateur (gestion globale)
3. **MODERATOR** - Modérateur (validation, litiges)
4. **PME** - Petite/Moyenne Entreprise (client)
5. **AGRICULTEUR** - Agriculteur (client)
6. **PARTICULIER** - Particulier (client)
7. **TRANSPORTEUR** - Transporteur

### Groupes de Rôles

- **Clients** : PME, AGRICULTEUR, PARTICULIER
- **Transporteurs** : TRANSPORTEUR
- **Administrateurs** : ADMIN, DATA ADMIN
- **Modérateurs** : MODERATOR

## 🔗 Relations entre Modèles

### 1. User (Utilisateur)
- **Relations** :
  - `vehicles` (ForeignKey) - Véhicules du transporteur
  - `transport_requests` (ForeignKey) - Demandes créées (client)
  - `assigned_transports` (ForeignKey) - Demandes assignées (transporteur)
  - `legal_documents` (ForeignKey) - Documents légaux
  - `verification_codes` (ForeignKey) - Codes de vérification
  - `two_fa` (OneToOne) - Authentification à deux facteurs
  - `password_reset_tokens` (ForeignKey) - Tokens de réinitialisation
  - `connections` (ForeignKey) - Sessions actives

### 2. TransportRequest (Demande de Transport)
- **Relations** :
  - `client` (ForeignKey → User) - Créateur de la demande
  - `assigned_transporter` (ForeignKey → User) - Transporteur assigné
  - `documents` (ForeignKey → RequestDocument) - Documents de la demande
  - `status_history` (ForeignKey → RequestStatusHistory) - Historique des statuts

### 3. Vehicle (Véhicule)
- **Relations** :
  - `owner` (ForeignKey → User, role=TRANSPORTEUR) - Propriétaire
  - `documents` (ForeignKey → VehicleDocument) - Documents du véhicule

### 4. DocumentLegal (Document Légal)
- **Relations** :
  - `user` (ForeignKey → User) - Propriétaire
  - `type_doc` (ForeignKey → TypeDocumentLegal) - Type de document
  - `validated_by` (ForeignKey → User, role=MODERATOR/ADMIN) - Validateur

## 🎯 Permissions par Rôle

### DATA ADMIN
**Accès complet à tout le système**

✅ **Peut faire** :
- Gérer tous les utilisateurs (CRUD complet)
- Voir toutes les demandes
- Modifier/supprimer n'importe quelle demande
- Gérer les types de documents légaux
- Voir tous les véhicules
- Valider les documents légaux
- Restaurer les éléments supprimés (soft delete)

**Endpoints** :
- `/data-admin/users/` - Liste tous les utilisateurs
- `/data-admin/user/<slug>/alter/` - Modifier utilisateur
- `/data-admin/user/<slug>/delete/` - Supprimer utilisateur
- `/data-admin/user/<slug>/restore/` - Restaurer utilisateur
- `/admin/demandes/` - Toutes les demandes
- `/admin/demandes/<slug>/restore/` - Restaurer demande

### ADMIN
**Gestion globale du système**

✅ **Peut faire** :
- Voir toutes les demandes
- Modifier le statut de n'importe quelle demande
- Assigner des transporteurs
- Voir tous les véhicules
- Voir les statistiques
- Valider les documents

**Endpoints** :
- `/admin/demandes/` - Toutes les demandes
- `/admin/demandes/<slug>/statut/` - Modifier statut
- `/vehicles/` - Tous les véhicules
- `/demandes/<slug>/` - Détails de n'importe quelle demande

### MODERATOR
**Validation et modération**

✅ **Peut faire** :
- Valider les documents légaux
- Voir les demandes (lecture seule)
- Voir les utilisateurs (lecture seule)
- Gérer les litiges (si implémenté)

**Endpoints** :
- `/legal-document/<slug>/validate/` - Valider document
- `/demandes/` - Voir les demandes (selon permissions)

### CLIENT (PME, AGRICULTEUR, PARTICULIER)
**Création et suivi de demandes**

✅ **Peut faire** :
- Créer des demandes de transport
- Voir ses propres demandes
- Modifier ses propres demandes (si non livrées)
- Annuler ses demandes (si non en cours)
- Ajouter des documents à ses demandes
- Gérer ses documents légaux
- Voir son profil et le modifier

**Endpoints** :
- `/demandes/create/` - Créer demande
- `/demandes/mes-demandes/` - Mes demandes
- `/demandes/<slug>/update/` - Modifier ma demande
- `/demandes/<slug>/annuler/` - Annuler ma demande
- `/legal-document/add/` - Ajouter document légal
- `/legal-document/me/` - Mes documents légaux
- `/user/me/update/` - Modifier mon profil

### TRANSPORTEUR
**Gestion de flotte et missions**

✅ **Peut faire** :
- Gérer ses véhicules (CRUD complet)
- Gérer les documents de ses véhicules
- Voir les demandes disponibles
- Voir ses demandes assignées
- S'auto-assigner à une demande
- Modifier le statut de ses missions (IN_PROGRESS, DELIVERED)
- Gérer ses documents légaux
- Voir son profil et le modifier

**Endpoints** :
- `/vehicles/create/` - Créer véhicule
- `/vehicles/` - Mes véhicules
- `/vehicles/<slug>/update/` - Modifier véhicule
- `/vehicles/<slug>/delete/` - Supprimer véhicule
- `/vehicles/<slug>/documents/add/` - Ajouter document véhicule
- `/demandes/` - Demandes disponibles + assignées
- `/demandes/<slug>/` - Détails demande (si assignée ou disponible)
- `/admin/demandes/<slug>/statut/` - S'auto-assigner (si disponible)

## 📋 Scénarios de Test Complets

### Scénario 1 : Inscription et Vérification (Tous Rôles)

**Acteur** : Nouvel utilisateur (n'importe quel rôle)

**Étapes** :
1. POST `/api/africa_logistic/auth/register/`
   - Body: `{firstname, lastname, email, password, role, telephone, address}`
   - ✅ Réponse : Code de vérification envoyé par email
2. Vérifier l'email → Code à 6 chiffres reçu
3. PATCH `/api/africa_logistic/auth/verify-account/`
   - Body: `{user_slug, code}`
   - ✅ Réponse : Compte vérifié
4. POST `/api/africa_logistic/auth/login/`
   - Body: `{email, password}`
   - ✅ Réponse : Token d'authentification

**Résultat attendu** : Utilisateur créé, vérifié, et connecté

---

### Scénario 2 : Client crée une demande de transport

**Acteur** : CLIENT (PME, AGRICULTEUR, ou PARTICULIER)

**Prérequis** : Client connecté et vérifié

**Étapes** :
1. POST `/api/africa_logistic/demandes/create/`
   - Headers: `Authorization: Bearer <token>`
   - Body: `{title, merchandise_description, weight, volume, pickup_address, pickup_city, delivery_address, delivery_city, preferred_pickup_date, recipient_name, recipient_phone, ...}`
   - ✅ Réponse : Demande créée avec statut PENDING

2. GET `/api/africa_logistic/demandes/mes-demandes/`
   - ✅ Réponse : Liste de ses demandes (incluant la nouvelle)

3. GET `/api/africa_logistic/demandes/<request_slug>/`
   - ✅ Réponse : Détails de la demande

**Résultat attendu** : Demande créée et visible par le client

---

### Scénario 3 : Transporteur gère sa flotte

**Acteur** : TRANSPORTEUR

**Prérequis** : Transporteur connecté et vérifié

**Étapes** :
1. **Ajouter un véhicule**
   - POST `/api/africa_logistic/vehicles/create/`
   - Body: `{type: "TRUCK", brand, model, plate_number, capacity_kg, ...}`
   - ✅ Réponse : Véhicule créé

2. **Voir ses véhicules**
   - GET `/api/africa_logistic/vehicles/`
   - ✅ Réponse : Liste de ses véhicules uniquement

3. **Ajouter un document au véhicule**
   - POST `/api/africa_logistic/vehicles/<vehicle_slug>/documents/add/`
   - Body: `{file: base64, document_type: "INSURANCE", name, ...}`
   - ✅ Réponse : Document ajouté

4. **Modifier le véhicule**
   - PATCH `/api/africa_logistic/vehicles/<vehicle_slug>/update/`
   - Body: `{brand: "Nouvelle marque", ...}`
   - ✅ Réponse : Véhicule modifié

5. **Supprimer le véhicule**
   - DELETE `/api/africa_logistic/vehicles/<vehicle_slug>/delete/`
   - ✅ Réponse : Véhicule supprimé (soft delete)

**Résultat attendu** : Transporteur peut gérer complètement sa flotte

---

### Scénario 4 : Transporteur voit et s'auto-assigne à une demande

**Acteur** : TRANSPORTEUR

**Prérequis** : Transporteur connecté, demande disponible créée par un client

**Étapes** :
1. **Voir les demandes disponibles**
   - GET `/api/africa_logistic/demandes/`
   - ✅ Réponse : Demandes non assignées + ses demandes assignées

2. **Voir les détails d'une demande disponible**
   - GET `/api/africa_logistic/demandes/<request_slug>/`
   - ✅ Réponse : Détails de la demande (si non assignée ou assignée à lui)

3. **S'auto-assigner**
   - PATCH `/api/africa_logistic/admin/demandes/<request_slug>/statut/`
   - Body: `{status: "ASSIGNED", transporter_slug: <son_slug>}`
   - ✅ Réponse : Demande assignée, statut changé à ASSIGNED

4. **Voir ses missions assignées**
   - GET `/api/africa_logistic/demandes/`
   - ✅ Réponse : Liste incluant la demande assignée

**Résultat attendu** : Transporteur peut voir et s'assigner aux demandes

---

### Scénario 5 : Transporteur met à jour le statut d'une mission

**Acteur** : TRANSPORTEUR

**Prérequis** : Transporteur connecté, demande assignée à lui

**Étapes** :
1. **Démarrer la mission**
   - PATCH `/api/africa_logistic/admin/demandes/<request_slug>/statut/`
   - Body: `{status: "IN_PROGRESS", comment: "En route"}`
   - ✅ Réponse : Statut changé à IN_PROGRESS

2. **Marquer comme livré**
   - PATCH `/api/africa_logistic/admin/demandes/<request_slug>/statut/`
   - Body: `{status: "DELIVERED", comment: "Livré avec succès"}`
   - ✅ Réponse : Statut changé à DELIVERED

**Résultat attendu** : Statut de la mission mis à jour avec historique

---

### Scénario 6 : Client suit sa demande

**Acteur** : CLIENT

**Prérequis** : Client connecté, demande créée

**Étapes** :
1. **Voir l'historique de sa demande**
   - GET `/api/africa_logistic/demandes/<request_slug>/`
   - ✅ Réponse : Détails avec status_history

2. **Modifier sa demande (si PENDING)**
   - PATCH `/api/africa_logistic/demandes/<request_slug>/update/`
   - Body: `{title: "Nouveau titre", ...}`
   - ✅ Réponse : Demande modifiée

3. **Annuler sa demande (si non IN_PROGRESS)**
   - PATCH `/api/africa_logistic/demandes/<request_slug>/annuler/`
   - Body: `{reason: "Plus besoin"}`
   - ✅ Réponse : Demande annulée

**Résultat attendu** : Client peut suivre et gérer ses demandes

---

### Scénario 7 : Admin gère toutes les demandes

**Acteur** : ADMIN ou DATA ADMIN

**Prérequis** : Admin connecté

**Étapes** :
1. **Voir toutes les demandes**
   - GET `/api/africa_logistic/admin/demandes/`
   - ✅ Réponse : Toutes les demandes (y compris supprimées si include_deleted=true)

2. **Assigner un transporteur**
   - PATCH `/api/africa_logistic/admin/demandes/<request_slug>/statut/`
   - Body: `{status: "ASSIGNED", transporter_slug: <slug>}`
   - ✅ Réponse : Transporteur assigné

3. **Modifier le statut**
   - PATCH `/api/africa_logistic/admin/demandes/<request_slug>/statut/`
   - Body: `{status: "IN_PROGRESS"}`
   - ✅ Réponse : Statut modifié

4. **Restaurer une demande supprimée**
   - PATCH `/api/africa_logistic/admin/demandes/<request_slug>/restore/`
   - ✅ Réponse : Demande restaurée

**Résultat attendu** : Admin a un contrôle total sur les demandes

---

### Scénario 8 : Admin gère les utilisateurs

**Acteur** : DATA ADMIN

**Prérequis** : DATA ADMIN connecté

**Étapes** :
1. **Voir tous les utilisateurs**
   - GET `/api/africa_logistic/data-admin/users/`
   - ✅ Réponse : Liste de tous les utilisateurs

2. **Modifier un utilisateur**
   - PATCH `/api/africa_logistic/data-admin/user/<user_slug>/alter/`
   - Body: `{firstname: "Nouveau", role: "TRANSPORTEUR", ...}`
   - ✅ Réponse : Utilisateur modifié

3. **Désactiver un utilisateur**
   - PATCH `/api/africa_logistic/data-admin/user/<user_slug>/desactivate/`
   - ✅ Réponse : Utilisateur désactivé (is_blocked=True)

4. **Supprimer un utilisateur**
   - DELETE `/api/africa_logistic/data-admin/user/<user_slug>/delete/`
   - ✅ Réponse : Utilisateur supprimé (soft delete)

5. **Restaurer un utilisateur**
   - PATCH `/api/africa_logistic/data-admin/user/<user_slug>/restore/`
   - ✅ Réponse : Utilisateur restauré

**Résultat attendu** : DATA ADMIN peut gérer tous les utilisateurs

---

### Scénario 9 : Modérateur valide un document légal

**Acteur** : MODERATOR

**Prérequis** : Modérateur connecté, document légal soumis par un utilisateur

**Étapes** :
1. **Voir les documents à valider**
   - GET `/api/africa_logistic/legal-document/user/<user_slug>/`
   - ✅ Réponse : Documents de l'utilisateur

2. **Valider un document**
   - POST `/api/africa_logistic/legal-document/<doc_slug>/validate/`
   - ✅ Réponse : Document validé (is_valid=True, validated_by=moderator)

**Résultat attendu** : Document validé par le modérateur

---

### Scénario 10 : Utilisateur gère ses documents légaux

**Acteur** : N'importe quel utilisateur (CLIENT ou TRANSPORTEUR)

**Prérequis** : Utilisateur connecté

**Étapes** :
1. **Ajouter un document légal**
   - POST `/api/africa_logistic/legal-document/add/`
   - FormData: `{file, type_doc: <type_slug>, description}`
   - ✅ Réponse : Document ajouté

2. **Voir ses documents**
   - GET `/api/africa_logistic/legal-document/me/`
   - ✅ Réponse : Liste de ses documents

3. **Modifier un document**
   - PATCH `/api/africa_logistic/legal-document/<doc_slug>/alter/`
   - Body: `{description: "Nouvelle description", file: base64}`
   - ✅ Réponse : Document modifié

4. **Supprimer un document**
   - DELETE `/api/africa_logistic/legal-document/<doc_slug>/delete/`
   - ✅ Réponse : Document supprimé

**Résultat attendu** : Utilisateur peut gérer ses documents légaux

---

## 🔒 Vérification des Permissions

### Tests de Sécurité à Effectuer

#### Test 1 : Client ne peut pas voir les demandes d'autres clients
- **Action** : Client A essaie d'accéder à une demande de Client B
- **Résultat attendu** : Erreur 403 (Accès non autorisé)

#### Test 2 : Transporteur ne peut pas modifier un véhicule d'un autre transporteur
- **Action** : Transporteur A essaie de modifier un véhicule de Transporteur B
- **Résultat attendu** : Erreur 403 (Accès non autorisé)

#### Test 3 : Client ne peut pas créer un véhicule
- **Action** : Client essaie de créer un véhicule
- **Résultat attendu** : Erreur 403 (Transporteur access required)

#### Test 4 : Transporteur ne peut pas créer une demande
- **Action** : Transporteur essaie de créer une demande
- **Résultat attendu** : Erreur 403 (Client access required)

#### Test 5 : Utilisateur non connecté ne peut rien faire
- **Action** : Requête sans token
- **Résultat attendu** : Erreur 401 (Authorization header missing)

#### Test 6 : Modérateur ne peut pas modifier une demande
- **Action** : Modérateur essaie de modifier une demande
- **Résultat attendu** : Erreur 403 (selon l'endpoint)

---

## 📊 Matrice des Permissions

| Action | CLIENT | TRANSPORTEUR | MODERATOR | ADMIN | DATA ADMIN |
|--------|--------|--------------|-----------|-------|------------|
| Créer demande | ✅ | ❌ | ❌ | ✅ | ✅ |
| Voir ses demandes | ✅ | ✅ (assignées) | ❌ | ✅ (toutes) | ✅ (toutes) |
| Modifier sa demande | ✅ | ❌ | ❌ | ✅ | ✅ |
| Annuler sa demande | ✅ | ❌ | ❌ | ✅ | ✅ |
| Créer véhicule | ❌ | ✅ | ❌ | ✅ | ✅ |
| Voir ses véhicules | ❌ | ✅ | ❌ | ✅ (tous) | ✅ (tous) |
| Modifier son véhicule | ❌ | ✅ | ❌ | ✅ | ✅ |
| Voir demandes disponibles | ❌ | ✅ | ❌ | ✅ | ✅ |
| S'auto-assigner | ❌ | ✅ | ❌ | ✅ | ✅ |
| Assigner transporteur | ❌ | ❌ | ❌ | ✅ | ✅ |
| Modifier statut mission | ❌ | ✅ (ses missions) | ❌ | ✅ | ✅ |
| Valider document | ❌ | ❌ | ✅ | ✅ | ✅ |
| Gérer utilisateurs | ❌ | ❌ | ❌ | ❌ | ✅ |
| Voir statistiques | ❌ | ❌ | ❌ | ✅ | ✅ |
| Restaurer éléments | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🧪 Plan de Test Complet

### Phase 1 : Authentification
- [ ] Inscription CLIENT
- [ ] Inscription TRANSPORTEUR
- [ ] Vérification par email
- [ ] Connexion
- [ ] Déconnexion
- [ ] Réinitialisation mot de passe

### Phase 2 : CLIENT
- [ ] Créer demande
- [ ] Voir ses demandes
- [ ] Modifier sa demande
- [ ] Annuler sa demande
- [ ] Ajouter document à demande
- [ ] Gérer documents légaux

### Phase 3 : TRANSPORTEUR
- [ ] Créer véhicule
- [ ] Modifier véhicule
- [ ] Supprimer véhicule
- [ ] Ajouter document véhicule
- [ ] Voir demandes disponibles
- [ ] S'auto-assigner
- [ ] Modifier statut mission
- [ ] Gérer documents légaux

### Phase 4 : ADMIN
- [ ] Voir toutes les demandes
- [ ] Assigner transporteur
- [ ] Modifier statut
- [ ] Voir statistiques
- [ ] Voir tous les véhicules

### Phase 5 : DATA ADMIN
- [ ] Gérer utilisateurs (CRUD)
- [ ] Désactiver/Activer utilisateur
- [ ] Restaurer utilisateur supprimé
- [ ] Gérer types de documents
- [ ] Restaurer demande supprimée

### Phase 6 : MODERATOR
- [ ] Valider document légal
- [ ] Voir documents à valider

### Phase 7 : Sécurité
- [ ] Test accès non autorisé (403)
- [ ] Test sans authentification (401)
- [ ] Test modification données d'autrui
- [ ] Test suppression données d'autrui

---

## ✅ Checklist de Vérification

Avant le déploiement, vérifier que :

- [ ] Tous les endpoints sont protégés par `@is_logged_in`
- [ ] Les permissions spécifiques sont appliquées (`@is_client`, `@is_transporteur`, etc.)
- [ ] Les clients ne peuvent voir que leurs demandes
- [ ] Les transporteurs ne peuvent gérer que leurs véhicules
- [ ] Les admins peuvent tout voir mais pas tout modifier
- [ ] Les DATA ADMIN ont accès complet
- [ ] Les modérateurs peuvent valider les documents
- [ ] Les soft deletes fonctionnent correctement
- [ ] L'historique des statuts est créé
- [ ] Les relations ForeignKey sont correctes

---

## 🎯 Conclusion

Toutes les relations entre les rôles sont bien définies et protégées. Le système permet :

✅ **Séparation claire des responsabilités**
✅ **Permissions granulaires par rôle**
✅ **Relations bien définies entre modèles**
✅ **Sécurité au niveau des endpoints**
✅ **Gestion complète du cycle de vie des données**

Le système est prêt pour les tests et le déploiement ! 🚀
