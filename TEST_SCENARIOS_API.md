# 🧪 Scénarios de Test API - Guide Pratique

## 📋 Prérequis

1. Backend Django démarré sur `http://localhost:8000`
2. Frontend Next.js démarré sur `http://localhost:3000`
3. Base de données PostgreSQL configurée
4. Migrations appliquées

## 🔑 Authentification

Toutes les requêtes (sauf inscription/connexion) nécessitent un header :
```
Authorization: Bearer <token>
```

Le token est obtenu lors de la connexion.

---

## 📝 Scénarios de Test Détaillés

### Scénario 1 : Cycle Complet CLIENT → TRANSPORTEUR → ADMIN

#### Étape 1.1 : Inscription CLIENT

```bash
POST http://localhost:8000/api/africa_logistic/auth/register/
Content-Type: application/json

{
  "firstname": "Jean",
  "lastname": "Dupont",
  "email": "jean.dupont@example.com",
  "password": "MotDePasse123!",
  "role": "PARTICULIER",
  "telephone": "+22912345678",
  "address": "123 Rue de la Paix, Cotonou"
}
```

**Réponse attendue** (201) :
```json
{
  "message": "Veuillez vérifier votre compte en consultant vos mails.",
  "user": {
    "slug": "obj-abc123...",
    "email": "jean.dupont@example.com",
    "role": "PARTICULIER",
    "is_verified": false
  }
}
```

**Action** : Vérifier l'email et noter le code à 6 chiffres.

---

#### Étape 1.2 : Vérification du Compte

```bash
PATCH http://localhost:8000/api/africa_logistic/auth/verify-account/
Content-Type: application/json
Authorization: Bearer <token_obtenu_après_login>

{
  "user_slug": "obj-abc123...",
  "code": "123456"
}
```

**Réponse attendue** (200) :
```json
{
  "message": "Compte vérifié avec succès.",
  "user": {
    "slug": "obj-abc123...",
    "is_verified": true
  }
}
```

---

#### Étape 1.3 : Connexion CLIENT

```bash
POST http://localhost:8000/api/africa_logistic/auth/login/
Content-Type: application/json

{
  "email": "jean.dupont@example.com",
  "password": "MotDePasse123!"
}
```

**Réponse attendue** (200) :
```json
{
  "message": "Connexion réussie.",
  "token": "obj-token123...",
  "user": {
    "slug": "obj-abc123...",
    "email": "jean.dupont@example.com",
    "role": "PARTICULIER"
  }
}
```

**Noter le token** pour les prochaines requêtes.

---

#### Étape 1.4 : CLIENT crée une demande

```bash
POST http://localhost:8000/api/africa_logistic/demandes/create/
Content-Type: application/json
Authorization: Bearer <token_client>

{
  "title": "Transport de meubles",
  "merchandise_type": "FURNITURE",
  "merchandise_description": "3 tables et 6 chaises",
  "weight": 150.5,
  "volume": 2.5,
  "pickup_address": "123 Rue de la Paix, Cotonou",
  "pickup_city": "Cotonou",
  "pickup_coordinates": "6.3725,2.4333",
  "delivery_address": "456 Avenue de la République, Porto-Novo",
  "delivery_city": "Porto-Novo",
  "delivery_coordinates": "6.4969,2.6289",
  "preferred_pickup_date": "2026-02-01T10:00:00Z",
  "preferred_delivery_date": "2026-02-01T16:00:00Z",
  "priority": "NORMAL",
  "recipient_name": "Marie Dupont",
  "recipient_phone": "+22998765432"
}
```

**Réponse attendue** (201) :
```json
{
  "message": "Demande de transport créée avec succès.",
  "transport_request": {
    "slug": "obj-request123...",
    "title": "Transport de meubles",
    "status": "PENDING",
    "client": "obj-abc123..."
  }
}
```

**Noter le slug de la demande** : `obj-request123...`

---

#### Étape 1.5 : Inscription TRANSPORTEUR

```bash
POST http://localhost:8000/api/africa_logistic/auth/register/
Content-Type: application/json

{
  "firstname": "Amadou",
  "lastname": "Diallo",
  "email": "amadou.diallo@example.com",
  "password": "Transporteur123!",
  "role": "TRANSPORTEUR",
  "telephone": "+22987654321",
  "address": "789 Route de l'Aéroport, Cotonou"
}
```

**Action** : Vérifier l'email, noter le code, vérifier le compte, puis se connecter.

**Noter le token du transporteur**.

---

#### Étape 1.6 : TRANSPORTEUR crée un véhicule

```bash
POST http://localhost:8000/api/africa_logistic/vehicles/create/
Content-Type: application/json
Authorization: Bearer <token_transporteur>

{
  "type": "TRUCK",
  "brand": "Mercedes",
  "model": "Actros",
  "plate_number": "AB-1234-CD",
  "capacity_kg": 5000,
  "insurance_expiry": "2026-12-31",
  "inspection_expiry": "2026-06-30",
  "description": "Camion en excellent état"
}
```

**Réponse attendue** (201) :
```json
{
  "message": "Véhicule créé avec succès.",
  "vehicle": {
    "slug": "obj-vehicle123...",
    "plate_number": "AB-1234-CD",
    "status": "ACTIVE"
  }
}
```

---

#### Étape 1.7 : TRANSPORTEUR voit les demandes disponibles

```bash
GET http://localhost:8000/api/africa_logistic/demandes/
Authorization: Bearer <token_transporteur>
```

**Réponse attendue** (200) :
```json
{
  "message": "Liste des demandes récupérée avec succès.",
  "transport_requests": [
    {
      "slug": "obj-request123...",
      "title": "Transport de meubles",
      "status": "PENDING",
      "client": "obj-abc123...",
      "assigned_transporter": null
    }
  ]
}
```

---

#### Étape 1.8 : TRANSPORTEUR s'auto-assigne

```bash
PATCH http://localhost:8000/api/africa_logistic/admin/demandes/obj-request123.../statut/
Content-Type: application/json
Authorization: Bearer <token_transporteur>

{
  "status": "ASSIGNED"
}
```

**Note** : Pour l'auto-assignation, utiliser `assign_transporter` si disponible, sinon utiliser `update_status` avec `ASSIGNED`.

**Réponse attendue** (200) :
```json
{
  "message": "Statut mis à jour avec succès.",
  "transport_request": {
    "slug": "obj-request123...",
    "status": "ASSIGNED",
    "assigned_transporter": "obj-transporteur123..."
  }
}
```

---

#### Étape 1.9 : TRANSPORTEUR démarre la mission

```bash
PATCH http://localhost:8000/api/africa_logistic/admin/demandes/obj-request123.../statut/
Content-Type: application/json
Authorization: Bearer <token_transporteur>

{
  "status": "IN_PROGRESS",
  "comment": "En route vers le point de collecte"
}
```

**Réponse attendue** (200) : Statut changé à `IN_PROGRESS`

---

#### Étape 1.10 : CLIENT suit sa demande

```bash
GET http://localhost:8000/api/africa_logistic/demandes/obj-request123.../
Authorization: Bearer <token_client>
```

**Réponse attendue** (200) :
```json
{
  "message": "Détails de la demande récupérés avec succès.",
  "transport_request": {
    "slug": "obj-request123...",
    "status": "IN_PROGRESS",
    "status_history": [
      {
        "old_status": "PENDING",
        "new_status": "ASSIGNED",
        "changed_by": "obj-transporteur123...",
        "created_at": "2026-01-26T10:00:00Z"
      },
      {
        "old_status": "ASSIGNED",
        "new_status": "IN_PROGRESS",
        "changed_by": "obj-transporteur123...",
        "created_at": "2026-01-26T11:00:00Z"
      }
    ]
  }
}
```

---

#### Étape 1.11 : TRANSPORTEUR marque comme livré

```bash
PATCH http://localhost:8000/api/africa_logistic/admin/demandes/obj-request123.../statut/
Content-Type: application/json
Authorization: Bearer <token_transporteur>

{
  "status": "DELIVERED",
  "comment": "Livré avec succès à 16h30"
}
```

**Réponse attendue** (200) : Statut changé à `DELIVERED`

---

### Scénario 2 : ADMIN gère le système

#### Étape 2.1 : ADMIN voit toutes les demandes

```bash
GET http://localhost:8000/api/africa_logistic/admin/demandes/
Authorization: Bearer <token_admin>
```

**Réponse attendue** (200) : Liste de toutes les demandes

---

#### Étape 2.2 : ADMIN assigne un transporteur

```bash
PATCH http://localhost:8000/api/africa_logistic/admin/demandes/<request_slug>/assign/
Content-Type: application/json
Authorization: Bearer <token_admin>

{
  "transporter_slug": "obj-transporteur123..."
}
```

**Réponse attendue** (200) : Transporteur assigné

---

#### Étape 2.3 : ADMIN modifie le statut

```bash
PATCH http://localhost:8000/api/africa_logistic/admin/demandes/<request_slug>/statut/
Content-Type: application/json
Authorization: Bearer <token_admin>

{
  "status": "IN_PROGRESS",
  "comment": "Assigné manuellement par l'admin"
}
```

---

### Scénario 3 : DATA ADMIN gère les utilisateurs

#### Étape 3.1 : DATA ADMIN voit tous les utilisateurs

```bash
GET http://localhost:8000/api/africa_logistic/data-admin/users/
Authorization: Bearer <token_data_admin>
```

**Réponse attendue** (200) :
```json
{
  "nb": 10,
  "users": [
    {
      "slug": "obj-abc123...",
      "email": "jean.dupont@example.com",
      "role": "PARTICULIER",
      "is_verified": true,
      "is_blocked": false
    },
    ...
  ]
}
```

---

#### Étape 3.2 : DATA ADMIN désactive un utilisateur

```bash
PATCH http://localhost:8000/api/africa_logistic/data-admin/user/<user_slug>/desactivate/
Authorization: Bearer <token_data_admin>
```

**Réponse attendue** (200) : Utilisateur désactivé

---

#### Étape 3.3 : DATA ADMIN supprime un utilisateur

```bash
DELETE http://localhost:8000/api/africa_logistic/data-admin/user/<user_slug>/delete/
Authorization: Bearer <token_data_admin>
```

**Réponse attendue** (200) : Utilisateur supprimé (soft delete)

---

#### Étape 3.4 : DATA ADMIN restaure un utilisateur

```bash
PATCH http://localhost:8000/api/africa_logistic/data-admin/user/<user_slug>/restore/
Authorization: Bearer <token_data_admin>
```

**Réponse attendue** (200) : Utilisateur restauré

---

### Scénario 4 : MODERATOR valide un document

#### Étape 4.1 : MODERATOR valide un document légal

```bash
POST http://localhost:8000/api/africa_logistic/legal-document/<doc_slug>/validate/
Authorization: Bearer <token_moderator>
```

**Réponse attendue** (200) :
```json
{
  "message": "Document validé avec succès.",
  "document": {
    "slug": "obj-doc123...",
    "is_valid": true,
    "validated_by": "obj-moderator123...",
    "validated_at": "2026-01-26T12:00:00Z"
  }
}
```

---

## 🔒 Tests de Sécurité

### Test 1 : Accès non autorisé

```bash
# CLIENT essaie de créer un véhicule
POST http://localhost:8000/api/africa_logistic/vehicles/create/
Authorization: Bearer <token_client>
Content-Type: application/json

{
  "type": "TRUCK",
  "brand": "Test",
  ...
}
```

**Réponse attendue** (403) :
```json
{
  "error": "Transporteur access required"
}
```

---

### Test 2 : Modification de données d'autrui

```bash
# TRANSPORTEUR A essaie de modifier un véhicule de TRANSPORTEUR B
PATCH http://localhost:8000/api/africa_logistic/vehicles/<vehicle_slug_transporteur_b>/update/
Authorization: Bearer <token_transporteur_a>
Content-Type: application/json

{
  "brand": "Hacké"
}
```

**Réponse attendue** (403) :
```json
{
  "error": "Vous ne pouvez modifier que vos propres véhicules."
}
```

---

### Test 3 : Accès sans authentification

```bash
GET http://localhost:8000/api/africa_logistic/vehicles/
```

**Réponse attendue** (401) :
```json
{
  "error": "Authorization header missing"
}
```

---

## 📊 Checklist de Test

### Authentification
- [ ] Inscription CLIENT
- [ ] Vérification par email
- [ ] Connexion CLIENT
- [ ] Inscription TRANSPORTEUR
- [ ] Vérification TRANSPORTEUR
- [ ] Connexion TRANSPORTEUR

### CLIENT
- [ ] Créer demande
- [ ] Voir ses demandes
- [ ] Modifier sa demande
- [ ] Annuler sa demande
- [ ] Voir détails demande
- [ ] Ajouter document légal

### TRANSPORTEUR
- [ ] Créer véhicule
- [ ] Voir ses véhicules
- [ ] Modifier véhicule
- [ ] Supprimer véhicule
- [ ] Ajouter document véhicule
- [ ] Voir demandes disponibles
- [ ] S'auto-assigner
- [ ] Modifier statut mission

### ADMIN
- [ ] Voir toutes les demandes
- [ ] Assigner transporteur
- [ ] Modifier statut
- [ ] Voir tous les véhicules

### DATA ADMIN
- [ ] Voir tous les utilisateurs
- [ ] Modifier utilisateur
- [ ] Désactiver utilisateur
- [ ] Supprimer utilisateur
- [ ] Restaurer utilisateur

### MODERATOR
- [ ] Valider document légal

### Sécurité
- [ ] Test accès non autorisé (403)
- [ ] Test sans token (401)
- [ ] Test modification données d'autrui (403)

---

## 🎯 Résultat Attendu

Si tous les tests passent, le système est fonctionnel et prêt pour le déploiement ! ✅
