# ✅ Authentification Django - Migration Complète

## 🎯 Objectif

Toutes les inscriptions et connexions utilisent maintenant **uniquement l'API Django**, sans dépendance à Supabase.

## ✅ Modifications Effectuées

### 1. Page de Connexion (`app/auth/login/page.tsx`)

**Avant** : Utilisait Supabase `signInWithPassword()`
**Après** : Utilise `djangoApi.login()`

**Changements** :
- ✅ Import de `djangoApi` au lieu de `createClient` Supabase
- ✅ Appel à `djangoApi.login({ email, password })`
- ✅ Gestion des erreurs Django
- ✅ Vérification `is_verified` et `is_approved`
- ✅ Redirection basée sur le rôle Django (PARTICULIER, TRANSPORTEUR, ADMIN, etc.)
- ✅ Suppression du message de démonstration

### 2. Page d'Inscription (`app/auth/register/page.tsx`)

**Avant** : Utilisait Supabase `signUp()` (code commenté)
**Après** : Utilise uniquement `djangoApi.register()`

**Changements** :
- ✅ Suppression de l'import Supabase
- ✅ Suppression de tout le code Supabase commenté
- ✅ Utilisation exclusive de `djangoApi.register()`
- ✅ Gestion des véhicules et documents lors de l'inscription

### 3. Contexte d'Authentification (`lib/auth/context.tsx`)

**Avant** : Utilisait Supabase `getUser()`, `onAuthStateChange()`
**Après** : Utilise `djangoApi.getCurrentUser()`

**Changements** :
- ✅ Remplacement complet de Supabase par Django
- ✅ Utilisation de `djangoApi.getToken()` pour vérifier l'authentification
- ✅ Appel à `djangoApi.getCurrentUser()` pour récupérer l'utilisateur
- ✅ Vérification périodique du token (toutes les 30 secondes)
- ✅ `signOut()` supprime le token Django et redirige

## 🔄 Flux d'Authentification

### Connexion

1. Utilisateur entre email/password
2. `djangoApi.login({ email, password })` appelé
3. Backend Django vérifie les credentials
4. Si valide → Token retourné et stocké dans `localStorage`
5. Redirection vers le dashboard selon le rôle

### Inscription

1. Utilisateur remplit le formulaire
2. Pour transporteur : étapes véhicules/documents
3. `djangoApi.register(data)` appelé
4. Backend Django crée l'utilisateur
5. Email de vérification envoyé
6. Redirection vers `/auth/pending` ou `/auth/login`

### Vérification de Session

1. `AuthProvider` vérifie `djangoApi.getToken()`
2. Si token existe → `djangoApi.getCurrentUser()` appelé
3. Utilisateur stocké dans le contexte
4. Vérification périodique toutes les 30 secondes

### Déconnexion

1. `djangoApi.setToken(null)` appelé
2. Token supprimé du `localStorage`
3. Utilisateur retiré du contexte
4. Redirection vers `/auth/login`

## 📝 Structure des Données

### Utilisateur Django (AuthUser)

```typescript
interface AuthUser {
  id: string
  slug: string
  email: string
  firstname: string
  lastname: string
  role: string  // PARTICULIER, TRANSPORTEUR, ADMIN, etc.
  is_verified: boolean
  is_active: boolean
  is_approved?: boolean  // Pour transporteurs
  telephone?: string
  address?: string
  profile?: any
  wallet?: any
}
```

### Rôles Django

- `PARTICULIER` → `/client`
- `PME` → `/client`
- `AGRICULTEUR` → `/client`
- `TRANSPORTEUR` → `/transporter`
- `MODERATOR` / `MODERATEUR` → `/moderator`
- `ADMIN` / `DATA ADMIN` → `/admin`

## 🔒 Sécurité

### Vérifications Effectuées

1. **Connexion** :
   - ✅ Email/password requis
   - ✅ Vérification `is_active`
   - ✅ Vérification `is_verified` (email)
   - ✅ Vérification `is_approved` (transporteurs)

2. **Session** :
   - ✅ Token stocké dans `localStorage`
   - ✅ Vérification périodique de validité
   - ✅ Déconnexion automatique si token invalide

3. **Inscription** :
   - ✅ Validation des champs
   - ✅ Vérification email unique
   - ✅ Code de vérification envoyé

## 🧪 Tests à Effectuer

### Test 1 : Connexion
1. Aller sur `/auth/login`
2. Entrer email/password valides
3. ✅ Vérifier que le token est stocké
4. ✅ Vérifier la redirection vers le bon dashboard
5. ✅ Vérifier que l'utilisateur est dans le contexte

### Test 2 : Inscription Client
1. Aller sur `/auth/register`
2. Remplir le formulaire
3. ✅ Vérifier que l'utilisateur est créé dans Django
4. ✅ Vérifier l'email de vérification
5. ✅ Vérifier la redirection

### Test 3 : Inscription Transporteur
1. Aller sur `/auth/register?role=transporter`
2. Remplir les informations
3. Ajouter véhicules/documents
4. ✅ Vérifier que l'utilisateur est créé avec `is_approved=false`
5. ✅ Vérifier la redirection vers `/auth/pending?type=approval`

### Test 4 : Déconnexion
1. Se connecter
2. Cliquer sur déconnexion
3. ✅ Vérifier que le token est supprimé
4. ✅ Vérifier la redirection vers `/auth/login`

### Test 5 : Session Expirée
1. Se connecter
2. Supprimer manuellement le token du localStorage
3. Rafraîchir la page
4. ✅ Vérifier que l'utilisateur est déconnecté
5. ✅ Vérifier la redirection vers `/auth/login`

## ✅ Checklist

- [x] Page de connexion convertie
- [x] Page d'inscription nettoyée
- [x] Contexte d'authentification converti
- [x] Imports Supabase supprimés
- [x] Code commenté Supabase supprimé
- [x] Gestion des erreurs Django
- [x] Redirections basées sur les rôles Django
- [x] Vérifications de sécurité

## 🚀 Prochaines Étapes

1. **Tester** toutes les fonctionnalités d'authentification
2. **Vérifier** que les layouts utilisent bien le nouveau contexte
3. **Adapter** les composants qui utilisent `useAuth()` si nécessaire
4. **Vérifier** que les middlewares/protections de routes fonctionnent

## 📌 Notes Importantes

- Le token Django est stocké dans `localStorage` sous la clé `django_token`
- Les rôles Django sont en MAJUSCULES (PARTICULIER, TRANSPORTEUR, etc.)
- Le contexte vérifie automatiquement la validité du token toutes les 30 secondes
- La déconnexion supprime le token et redirige vers `/auth/login`

**Tout est maintenant connecté à Django !** 🎉
