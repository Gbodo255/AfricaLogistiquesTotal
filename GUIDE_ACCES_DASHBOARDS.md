# Guide d'Accès aux Dashboards Modérateur et Administrateur

## 📋 Vue d'ensemble

Ce guide explique comment accéder aux dashboards du modérateur et de l'administrateur pour la plateforme A-Logistics.

## 🔐 Comptes de Test (Mode Développement)

Le projet utilise un système de mock pour le développement local. Des comptes de test sont pré-configurés :

### Compte Administrateur
- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`
- **Rôle** : `admin`
- **Accès** : Dashboard administrateur (`/admin`)

### Compte Modérateur
- **Email** : `mod@example.com`
- **Mot de passe** : `mod123`
- **Rôle** : `moderateur`
- **Accès** : Dashboard modérateur (`/moderator`)

### Autres comptes de test
- **Client** : `client@example.com` / `client123`
- **Transporteur** : `transporter@example.com` / `transporter123`

## 🚀 Étapes pour Accéder aux Dashboards

### Option 1 : Utiliser les comptes de test (Recommandé pour développement)

1. **Démarrer l'application** :
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```

2. **Accéder à la page de connexion** :
   - Ouvrez votre navigateur à `http://localhost:3000/auth/login`

3. **Se connecter avec un compte admin ou modérateur** :
   - Pour l'admin : `admin@example.com` / `admin123`
   - Pour le modérateur : `mod@example.com` / `mod123`

4. **Redirection automatique** :
   - Après connexion, vous serez automatiquement redirigé vers votre dashboard selon votre rôle :
     - Admin → `/admin`
     - Modérateur → `/moderator`

### Option 2 : Créer de nouveaux comptes (Production/Supabase réel)

Si vous utilisez Supabase en production, vous devez :

1. **Créer un compte utilisateur via l'interface d'inscription** ou directement dans Supabase Auth

2. **Mettre à jour le rôle dans la base de données** :
   ```sql
   -- Pour créer un modérateur
   UPDATE profiles 
   SET role = 'moderateur', is_verified = true 
   WHERE email = 'votre-email@exemple.com';

   -- Pour créer un administrateur
   UPDATE profiles 
   SET role = 'admin', is_verified = true 
   WHERE email = 'votre-email@exemple.com';
   ```

3. **Exécuter le script SQL** :
   - Utilisez le script `scripts/004-seed-admin-moderator.sql` comme référence
   - Ou exécutez directement dans l'éditeur SQL de Supabase

## 🛡️ Contrôle d'Accès

### Middleware de Protection

Le projet utilise un middleware Next.js (`middleware.ts`) qui :

1. **Vérifie l'authentification** : Redirige vers `/auth/login` si non authentifié
2. **Contrôle les rôles** : Vérifie que l'utilisateur a le bon rôle pour accéder à la route
3. **Gère les redirections** : Redirige automatiquement selon le rôle après connexion

### Routes Protégées

- `/admin/*` : Accessible uniquement aux administrateurs
- `/moderator/*` : Accessible aux modérateurs et administrateurs
- `/transporter/*` : Accessible aux transporteurs
- `/client/*` : Accessible aux clients

### Permissions par Rôle

| Rôle | Dashboard Admin | Dashboard Modérateur | Dashboard Transporteur | Dashboard Client |
|------|----------------|---------------------|------------------------|------------------|
| Admin | ✅ | ✅ | ✅ | ✅ |
| Modérateur | ❌ | ✅ | ✅ | ✅ |
| Transporteur | ❌ | ❌ | ✅ | ❌ |
| Client | ❌ | ❌ | ❌ | ✅ |

## 📊 Fonctionnalités des Dashboards

### Dashboard Administrateur (`/admin`)

**Fonctionnalités principales** :
- Vue d'ensemble complète de la plateforme
- Gestion des utilisateurs (clients, transporteurs, modérateurs)
- Statistiques et KPIs (revenus, demandes, utilisateurs actifs)
- Gestion des transactions et portefeuilles
- Gestion des demandes de transport
- Gestion des litiges
- Configuration de la plateforme
- Logs d'audit

**Pages disponibles** :
- `/admin` - Dashboard principal
- `/admin/users` - Gestion des utilisateurs
- `/admin/requests` - Gestion des demandes
- `/admin/transactions` - Transactions financières
- `/admin/revenue` - Revenus et commissions
- `/admin/roles` - Gestion des rôles

### Dashboard Modérateur (`/moderator`)

**Fonctionnalités principales** :
- Validation des demandes de transport
- Gestion des litiges
- Suivi des missions en cours
- Gestion des transporteurs disponibles
- Statistiques des demandes traitées

**Pages disponibles** :
- `/moderator` - Dashboard principal
- `/moderator/requests` - Validation des demandes
- `/moderator/disputes` - Résolution des litiges

## 🔧 Configuration

### Variables d'Environnement

Pour utiliser Supabase réel (au lieu du mock), configurez :

```env
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
```

**Note** : Actuellement, le projet utilise un client mock par défaut pour le développement.

### Mode Mock vs Production

- **Mode Mock** (développement) : Utilise localStorage et données en mémoire
- **Mode Production** : Utilise Supabase réel avec authentification et base de données PostgreSQL

## 🐛 Dépannage

### Problème : Redirection vers `/auth/login` après connexion

**Solution** :
1. Vérifiez que le compte existe dans les données mock (localStorage)
2. Vérifiez que le profil a le bon rôle (`admin` ou `moderateur`)
3. Vérifiez que `is_active = true` et `is_verified = true`

### Problème : Accès refusé même avec le bon rôle

**Solution** :
1. Vérifiez le middleware dans `middleware.ts`
2. Vérifiez les cookies de session (dans le mode mock, vérifiez localStorage)
3. Réinitialisez les données mock si nécessaire

### Problème : Les données ne s'affichent pas

**Solution** :
1. Vérifiez que les hooks de données fonctionnent (`use-admin.ts`, `use-moderator.ts`)
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez que les données mock sont initialisées correctement

## 📝 Notes Importantes

1. **Sécurité** : Les comptes de test ne doivent JAMAIS être utilisés en production
2. **Données Mock** : Les données sont stockées dans localStorage (client) ou en mémoire (serveur)
3. **Persistance** : Les données mock sont perdues si vous videz le localStorage
4. **Production** : Configurez Supabase réel pour la production avec les bonnes politiques RLS

## 🔗 Liens Utiles

- Page de connexion : `/auth/login`
- Dashboard Admin : `/admin`
- Dashboard Modérateur : `/moderator`
- Documentation Supabase : https://supabase.com/docs
