# Documentation Détaillée du Backend - A-Logistics

## 📚 Vue d'Ensemble

Ce document explique en détail le rôle et le fonctionnement du backend pour la plateforme A-Logistics. Le projet utilise **Supabase** comme Backend-as-a-Service (BaaS), combiné avec **Next.js Server Actions** pour la logique métier.

## 🏗️ Architecture du Backend

### Stack Technologique

```
Frontend (Next.js)
    ↓
Server Actions (Next.js)
    ↓
Supabase Client
    ↓
┌─────────────────────────────────────┐
│         SUPABASE BACKEND            │
├─────────────────────────────────────┤
│  • Authentication (Auth)           │
│  • PostgreSQL Database              │
│  • Row Level Security (RLS)          │
│  • Database Functions & Triggers     │
│  • Real-time Subscriptions          │
│  • Storage (fichiers)               │
└─────────────────────────────────────┘
```

## 🗄️ Base de Données PostgreSQL

### Structure des Tables Principales

#### 1. **Table `profiles`** - Profils Utilisateurs

**Rôle** : Étend les informations de `auth.users` de Supabase avec des données métier.

**Colonnes principales** :
- `id` (UUID) : Référence vers `auth.users(id)`
- `email`, `phone` : Coordonnées
- `first_name`, `last_name` : Nom complet
- `role` (ENUM) : `client`, `transporter`, `moderator`, `admin`
- `is_verified` : Statut de vérification
- `is_active` : Compte actif/désactivé
- `address`, `city`, `country` : Localisation

**Fonctionnalités backend** :
- Création automatique via trigger après inscription
- Synchronisation avec `auth.users`
- Gestion des rôles et permissions

#### 2. **Table `wallets`** - Portefeuilles Électroniques

**Rôle** : Gère les soldes des utilisateurs (clients et transporteurs).

**Colonnes principales** :
- `user_id` : Référence vers `profiles(id)`
- `balance` : Solde en FCFA (XOF)
- `currency` : Devise (par défaut XOF)
- `is_active` : Portefeuille actif/bloqué

**Fonctionnalités backend** :
- Création automatique lors de l'inscription
- Calcul automatique des soldes
- Vérification des fonds avant transactions

#### 3. **Table `wallet_transactions`** - Historique des Transactions

**Rôle** : Enregistre toutes les transactions financières.

**Colonnes principales** :
- `wallet_id` : Portefeuille concerné
- `type` (ENUM) : `credit`, `debit`, `penalty`, `commission`, `refund`, `withdrawal`
- `amount` : Montant de la transaction
- `balance_before` / `balance_after` : Soldes avant/après
- `related_request_id` : Lien vers la demande de transport
- `description` : Description de la transaction

**Fonctionnalités backend** :
- Audit complet de toutes les transactions
- Traçabilité financière
- Calcul automatique des soldes

#### 4. **Table `vehicles`** - Véhicules des Transporteurs

**Rôle** : Gère les véhicules enregistrés par les transporteurs.

**Colonnes principales** :
- `owner_id` : Transporteur propriétaire
- `type` (ENUM) : `moto`, `car`, `van`, `truck`, `trailer`
- `brand`, `model`, `plate_number` : Informations véhicule
- `capacity_kg`, `capacity_m3` : Capacités
- `is_available` : Disponibilité
- `is_verified` : Vérification par modérateur
- `insurance_expiry`, `inspection_expiry` : Documents
- `documents` (JSONB) : Documents associés

**Fonctionnalités backend** :
- Validation des documents
- Vérification de disponibilité
- Gestion des expirations d'assurance/inspection

#### 5. **Table `transport_requests`** - Demandes de Transport

**Rôle** : Cœur métier - Gère toutes les demandes de transport.

**Colonnes principales** :
- `client_id` : Client demandeur
- `transport_type` (ENUM) : `standard`, `express`, `fragile`, `refrigerated`, `hazardous`
- `cargo_description`, `cargo_weight_kg`, `cargo_volume_m3` : Détails cargaison
- `pickup_address`, `pickup_city`, `pickup_lat/lng` : Point de collecte
- `delivery_address`, `delivery_city`, `delivery_lat/lng` : Point de livraison
- `estimated_price`, `final_price` : Prix
- `platform_commission` : Commission plateforme (15%)
- `transporter_earnings` : Gains transporteur
- `status` (ENUM) : `pending`, `validated`, `assigned`, `in_progress`, `completed`, `cancelled`, `disputed`
- `assigned_transporter_id`, `assigned_vehicle_id` : Assignation
- `validated_by`, `assigned_by` : Qui a validé/assigné

**Fonctionnalités backend** :
- Workflow complet de validation
- Calcul automatique des prix et commissions
- Gestion des statuts
- Traçabilité des actions

#### 6. **Table `tracking_updates`** - Suivi en Temps Réel

**Rôle** : Enregistre les mises à jour de position GPS pendant le transport.

**Colonnes principales** :
- `request_id` : Demande suivie
- `lat`, `lng` : Coordonnées GPS
- `speed`, `heading` : Vitesse et direction
- `status` : Statut actuel
- `notes` : Notes du transporteur
- `created_at` : Horodatage

**Fonctionnalités backend** :
- Mises à jour en temps réel
- Historique de trajet
- Calcul de distance et temps estimé

#### 7. **Table `ratings`** - Système de Notation

**Rôle** : Gère les évaluations entre clients et transporteurs.

**Colonnes principales** :
- `request_id` : Demande évaluée
- `rater_id` : Qui évalue
- `rated_id` : Qui est évalué
- `score` : Note de 1 à 5
- `comment` : Commentaire
- `is_visible` : Visibilité publique

**Fonctionnalités backend** :
- Calcul de moyennes
- Validation des évaluations
- Modération des commentaires

#### 8. **Table `disputes`** - Gestion des Litiges

**Rôle** : Gère les litiges entre clients et transporteurs.

**Colonnes principales** :
- `request_id` : Demande en litige
- `opened_by` : Qui a ouvert le litige
- `assigned_moderator` : Modérateur assigné
- `status` (ENUM) : `open`, `investigating`, `resolved`, `escalated`
- `category` : Type de litige
- `description` : Description
- `resolution` : Résolution finale

**Fonctionnalités backend** :
- Workflow de résolution
- Assignation automatique aux modérateurs
- Escalade vers l'admin si nécessaire

#### 9. **Table `dispute_messages`** - Messages de Litige

**Rôle** : Conversation dans le cadre d'un litige.

**Colonnes principales** :
- `dispute_id` : Litige concerné
- `sender_id` : Expéditeur
- `message` : Contenu
- `attachments` (JSONB) : Pièces jointes

**Fonctionnalités backend** :
- Thread de conversation
- Notifications en temps réel
- Gestion des pièces jointes

#### 10. **Table `notifications`** - Système de Notifications

**Rôle** : Notifications utilisateurs.

**Colonnes principales** :
- `user_id` : Destinataire
- `type` (ENUM) : `request`, `payment`, `assignment`, `tracking`, `dispute`, `system`
- `title`, `message` : Contenu
- `data` (JSONB) : Données supplémentaires
- `is_read` : Lu/non lu

**Fonctionnalités backend** :
- Notifications en temps réel
- Historique des notifications
- Marquage comme lu

#### 11. **Table `audit_logs`** - Logs d'Audit

**Rôle** : Traçabilité de toutes les actions importantes.

**Colonnes principales** :
- `user_id` : Utilisateur ayant effectué l'action
- `action` : Type d'action
- `entity_type` : Type d'entité modifiée
- `entity_id` : ID de l'entité
- `old_data` / `new_data` (JSONB) : État avant/après
- `ip_address`, `user_agent` : Informations de connexion

**Fonctionnalités backend** :
- Audit complet pour sécurité
- Conformité réglementaire
- Détection d'anomalies

#### 12. **Table `platform_settings`** - Configuration Plateforme

**Rôle** : Paramètres globaux de la plateforme.

**Colonnes principales** :
- `key` : Clé du paramètre
- `value` (JSONB) : Valeur
- `description` : Description
- `updated_by` : Dernier modificateur

**Fonctionnalités backend** :
- Configuration dynamique
- Paramètres modifiables par admin
- Historique des changements

## 🔐 Sécurité : Row Level Security (RLS)

### Principe

RLS permet de définir des politiques au niveau de la base de données pour contrôler l'accès aux lignes selon l'utilisateur connecté.

### Politiques Implémentées

#### 1. **Politiques Profiles**

```sql
-- Les utilisateurs peuvent voir tous les profils (pour afficher les noms)
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "profiles_update_own" ON profiles 
    FOR UPDATE USING (auth.uid() = id);

-- Les admins peuvent modifier n'importe quel profil
CREATE POLICY "profiles_update_admin" ON profiles 
    FOR UPDATE USING (is_admin());
```

#### 2. **Politiques Wallets**

```sql
-- Les utilisateurs voient uniquement leur propre portefeuille
CREATE POLICY "wallets_select_own" ON wallets 
    FOR SELECT USING (user_id = auth.uid());

-- Les admins/moderateurs peuvent voir tous les portefeuilles
CREATE POLICY "wallets_select_admin" ON wallets 
    FOR SELECT USING (is_admin_or_moderator());
```

#### 3. **Politiques Transport Requests**

```sql
-- Les clients voient leurs propres demandes
CREATE POLICY "requests_select_client" ON transport_requests 
    FOR SELECT USING (client_id = auth.uid());

-- Les transporteurs voient les demandes qui leur sont assignées
CREATE POLICY "requests_select_transporter" ON transport_requests 
    FOR SELECT USING (assigned_transporter_id = auth.uid());

-- Les modérateurs/admins voient toutes les demandes
CREATE POLICY "requests_select_moderator" ON transport_requests 
    FOR SELECT USING (is_admin_or_moderator());
```

### Fonctions Helper SQL

```sql
-- Vérifier si l'utilisateur est admin ou modérateur
CREATE FUNCTION is_admin_or_moderator() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Vérifier si l'utilisateur est admin
CREATE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

## ⚙️ Fonctions et Triggers SQL

### Triggers Automatiques

#### 1. **Création Automatique de Profil**

```sql
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
```

**Rôle** : Crée automatiquement un profil dans `profiles` quand un utilisateur s'inscrit.

#### 2. **Création Automatique de Portefeuille**

```sql
CREATE TRIGGER create_wallet_on_profile
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION create_user_wallet();
```

**Rôle** : Crée automatiquement un portefeuille pour chaque nouvel utilisateur.

#### 3. **Mise à Jour des Soldes**

```sql
CREATE TRIGGER update_wallet_balance
AFTER INSERT ON wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION update_wallet_balance();
```

**Rôle** : Met à jour automatiquement le solde du portefeuille après chaque transaction.

#### 4. **Calcul des Commissions**

```sql
CREATE TRIGGER calculate_commission
BEFORE UPDATE ON transport_requests
FOR EACH ROW
WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
EXECUTE FUNCTION calculate_platform_commission();
```

**Rôle** : Calcule automatiquement la commission plateforme (15%) et les gains transporteur lors de la complétion.

### Fonctions Métier

#### 1. **Fonction de Validation de Demande**

```sql
CREATE FUNCTION validate_transport_request(request_uuid UUID, moderator_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Vérifier que le modérateur a les droits
    -- Mettre à jour le statut
    -- Créer une notification
    -- Logger l'action
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. **Fonction d'Assignation**

```sql
CREATE FUNCTION assign_transporter(
    request_uuid UUID, 
    transporter_uuid UUID, 
    vehicle_uuid UUID,
    assigned_by_uuid UUID
) RETURNS BOOLEAN AS $$
BEGIN
    -- Vérifier la disponibilité
    -- Assigner le transporteur
    -- Mettre à jour le statut
    -- Créer des notifications
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 3. **Fonction de Paiement**

```sql
CREATE FUNCTION process_payment(
    request_uuid UUID,
    amount DECIMAL
) RETURNS BOOLEAN AS $$
BEGIN
    -- Vérifier les fonds du client
    -- Débiter le portefeuille client
    -- Créer la transaction
    -- Mettre en attente le paiement transporteur
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔄 Server Actions (Next.js)

### Authentification

**Fichier** : `lib/auth/actions.ts`

#### `login(formData)`
- Vérifie les identifiants via Supabase Auth
- Récupère le profil utilisateur
- Vérifie le statut actif/vérifié
- Redirige selon le rôle

#### `register(formData)`
- Crée un compte dans Supabase Auth
- Crée le profil dans `profiles`
- Crée le portefeuille dans `wallets`
- Envoie l'email de confirmation

#### `logout()`
- Déconnecte l'utilisateur
- Nettoie la session
- Redirige vers la page de connexion

### Gestion des Profils

#### `updateProfile(formData)`
- Met à jour les informations du profil
- Valide les données
- Enregistre dans `profiles`

### Gestion des Demandes

**Fichier** : `lib/hooks/use-transport-requests.ts`

- Récupération des demandes selon le rôle
- Filtrage par statut
- Tri et pagination
- Mises à jour en temps réel

### Gestion Admin

**Fichier** : `lib/hooks/use-admin.ts`

#### `useAdminKPIs()`
- Calcule les statistiques globales
- Compte les utilisateurs par rôle
- Calcule les revenus
- Statistiques des demandes

#### `useAdminUsers()`
- Liste tous les utilisateurs
- Filtrage par rôle
- Recherche et tri

#### `useAdminTransactions()`
- Historique des transactions
- Filtrage par type
- Statistiques financières

### Gestion Modérateur

**Fichier** : `lib/hooks/use-moderator.ts`

#### `usePendingRequests()`
- Liste les demandes en attente de validation
- Tri par date de création
- Filtrage par type de transport

#### `useModeratorDisputes()`
- Liste les litiges ouverts
- Filtrage par statut
- Assignation aux modérateurs

## 📡 Real-time Subscriptions

### Principe

Supabase permet de s'abonner aux changements en temps réel via WebSockets.

### Utilisations

#### 1. **Suivi des Demandes**

```typescript
const subscription = supabase
  .channel('transport_requests')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'transport_requests',
    filter: `id=eq.${requestId}`
  }, (payload) => {
    // Mettre à jour l'interface
  })
  .subscribe()
```

#### 2. **Notifications en Temps Réel**

```typescript
const subscription = supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Afficher la notification
  })
  .subscribe()
```

#### 3. **Tracking GPS en Temps Réel**

```typescript
const subscription = supabase
  .channel('tracking')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'tracking_updates',
    filter: `request_id=eq.${requestId}`
  }, (payload) => {
    // Mettre à jour la carte
  })
  .subscribe()
```

## 💰 Gestion Financière

### Workflow de Paiement

1. **Client crée une demande** → Statut `pending`
2. **Modérateur valide** → Statut `validated`
3. **Modérateur assigne un transporteur** → Statut `assigned`
4. **Client paie** → Débit du portefeuille client, statut `in_progress`
5. **Transporteur complète** → Statut `completed`
6. **Paiement transporteur** :
   - Commission plateforme (15%) → Crédité au compte plateforme
   - Gains transporteur (85%) → Crédité au portefeuille transporteur

### Calcul Automatique

```sql
-- Exemple de calcul de commission
platform_commission = final_price * 0.15
transporter_earnings = final_price * 0.85
```

### Transactions Automatiques

- **Débit client** : Lors de la validation de la demande
- **Crédit transporteur** : Lors de la complétion
- **Commission plateforme** : Lors de la complétion
- **Remboursement** : En cas d'annulation ou litige résolu en faveur du client

## 🔍 Recherche et Filtrage

### Indexes de Performance

```sql
-- Index pour recherche rapide
CREATE INDEX idx_requests_status ON transport_requests(status);
CREATE INDEX idx_requests_client ON transport_requests(client_id);
CREATE INDEX idx_requests_transporter ON transport_requests(assigned_transporter_id);
CREATE INDEX idx_requests_dates ON transport_requests(pickup_date, delivery_date);

-- Index pour recherche géographique
CREATE INDEX idx_requests_pickup_location ON transport_requests USING GIST (
    ll_to_earth(pickup_lat, pickup_lng)
);
```

### Requêtes Optimisées

- Utilisation de `SELECT` avec `count: 'exact'` pour les statistiques
- Pagination avec `range()` pour limiter les résultats
- Filtrage au niveau base de données plutôt qu'en JavaScript

## 📊 Analytics et Reporting

### Données Collectées

1. **Métriques Utilisateurs** :
   - Nombre d'inscriptions par jour
   - Taux de conversion transporteur
   - Utilisateurs actifs

2. **Métriques Demandes** :
   - Demandes créées/complétées/annulées
   - Temps moyen de traitement
   - Taux de réussite

3. **Métriques Financières** :
   - Revenus par période
   - Commissions collectées
   - Volume de transactions

4. **Métriques Qualité** :
   - Notes moyennes
   - Nombre de litiges
   - Taux de résolution

### Génération de Rapports

- Requêtes SQL agrégées
- Calculs en temps réel
- Export possible vers CSV/PDF

## 🚨 Gestion des Erreurs

### Types d'Erreurs Gérées

1. **Erreurs d'Authentification** :
   - Identifiants invalides
   - Compte désactivé
   - Email non vérifié

2. **Erreurs de Validation** :
   - Données manquantes
   - Formats invalides
   - Contraintes violées

3. **Erreurs Métier** :
   - Fonds insuffisants
   - Véhicule non disponible
   - Demande déjà assignée

4. **Erreurs Système** :
   - Connexion base de données
   - Timeout
   - Erreurs réseau

### Logging

- Toutes les erreurs sont loggées dans `audit_logs`
- Notifications aux admins pour erreurs critiques
- Monitoring via Supabase Dashboard

## 🔄 Synchronisation et Cohérence

### Transactions Atomiques

Toutes les opérations critiques utilisent des transactions PostgreSQL pour garantir la cohérence :

```sql
BEGIN;
  -- Débiter le portefeuille client
  -- Créditer le portefeuille transporteur
  -- Créer les transactions
  -- Mettre à jour le statut de la demande
COMMIT;
```

### Contraintes d'Intégrité

- Foreign keys pour maintenir les relations
- Unique constraints pour éviter les doublons
- Check constraints pour valider les données
- Not null constraints pour les champs obligatoires

## 🎯 Points Clés du Backend

1. **Sécurité** : RLS garantit que les utilisateurs ne voient que leurs données
2. **Performance** : Indexes et requêtes optimisées
3. **Scalabilité** : Architecture Supabase gère la montée en charge
4. **Fiabilité** : Transactions atomiques et contraintes d'intégrité
5. **Traçabilité** : Audit logs complets
6. **Temps Réel** : Subscriptions WebSocket pour mises à jour instantanées
7. **Automatisation** : Triggers et fonctions SQL pour logique métier

## 📝 Conclusion

Le backend A-Logistics est une architecture robuste basée sur Supabase qui fournit :

- ✅ Authentification et autorisation sécurisées
- ✅ Base de données relationnelle performante
- ✅ Sécurité au niveau des lignes (RLS)
- ✅ Fonctions métier automatisées
- ✅ Temps réel pour tracking et notifications
- ✅ Gestion financière complète
- ✅ Audit et traçabilité
- ✅ Scalabilité automatique

Cette architecture permet de se concentrer sur la logique métier sans gérer l'infrastructure backend traditionnelle.
