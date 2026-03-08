# Checklist de Déploiement

## ✅ Vérifications Pré-Déploiement

### Backend Django

- [x] CORS configuré pour autoriser le frontend
- [x] Modèles Vehicle et VehicleDocument créés
- [x] Endpoints API créés pour véhicules et documents
- [x] Routes configurées dans urls.py
- [x] Double vérification par email implémentée
- [ ] **À FAIRE : Créer les migrations**
  ```bash
  cd AFRICA-PROJECT-BACKEND-main/africa_project
  python manage.py makemigrations
  python manage.py migrate
  ```
- [ ] **À FAIRE : Vérifier la configuration de la base de données**
  - Vérifier que PostgreSQL est installé et en cours d'exécution
  - Vérifier les paramètres dans `settings.py` (DATABASES)
- [ ] **À FAIRE : Vérifier la configuration email**
  - Vérifier les paramètres SMTP dans `settings.py`
  - Tester l'envoi d'email

### Frontend Next.js

- [x] Service API Django créé (`lib/api/django.ts`)
- [x] Hooks adaptés pour utiliser l'API Django
- [x] Page Fleet adaptée pour utiliser les slugs
- [x] Types de véhicules alignés avec le backend
- [x] Types de documents alignés avec le backend
- [ ] **À FAIRE : Configurer la variable d'environnement**
  - Créer/modifier `.env.local` :
    ```
    NEXT_PUBLIC_DJANGO_API_URL=http://localhost:8000/api/africa_logistic
    ```
- [ ] **À FAIRE : Installer les dépendances**
  ```bash
  npm install
  # ou
  pnpm install
  ```

## 🚀 Étapes de Déploiement

### 1. Backend Django

```bash
# 1. Aller dans le dossier backend
cd AFRICA-PROJECT-BACKEND-main

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Aller dans le dossier du projet
cd africa_project

# 4. Créer les migrations
python manage.py makemigrations

# 5. Appliquer les migrations
python manage.py migrate

# 6. Créer un superutilisateur (optionnel)
python manage.py createsuperuser

# 7. Démarrer le serveur
python manage.py runserver
```

Le serveur Django sera accessible sur `http://localhost:8000`

### 2. Frontend Next.js

```bash
# 1. À la racine du projet
# 2. Installer les dépendances (si pas déjà fait)
npm install
# ou
pnpm install

# 3. Configurer .env.local
# Créer le fichier .env.local avec :
# NEXT_PUBLIC_DJANGO_API_URL=http://localhost:8000/api/africa_logistic

# 4. Démarrer le serveur de développement
npm run dev
# ou
pnpm dev
```

Le frontend sera accessible sur `http://localhost:3000`

## 🧪 Tests à Effectuer

### Authentification
- [ ] Inscription d'un nouvel utilisateur
- [ ] Réception du code de vérification par email
- [ ] Vérification du compte avec le code
- [ ] Connexion
- [ ] Déconnexion

### Gestion des Véhicules (Transporteur)
- [ ] Ajouter un véhicule
- [ ] Modifier un véhicule
- [ ] Supprimer un véhicule
- [ ] Voir la liste des véhicules
- [ ] Voir les détails d'un véhicule

### Gestion des Documents Véhicules
- [ ] Ajouter un document à un véhicule
- [ ] Modifier un document
- [ ] Supprimer un document
- [ ] Voir la liste des documents d'un véhicule

### Gestion des Documents Légaux
- [ ] Ajouter un document légal
- [ ] Modifier un document légal
- [ ] Supprimer un document légal
- [ ] Voir la liste des documents légaux

## 🔧 Configuration Production

### Backend Django

1. **ALLOWED_HOSTS** : Ajouter le domaine de production
2. **DEBUG** : Mettre à `False`
3. **SECRET_KEY** : Utiliser une clé sécurisée
4. **Base de données** : Configurer une base de données de production
5. **Media files** : Configurer le stockage des fichiers (S3, etc.)
6. **CORS** : Configurer les origines autorisées

### Frontend Next.js

1. **Variables d'environnement** : Configurer pour la production
2. **Build** : `npm run build`
3. **Déploiement** : Vercel, Netlify, ou autre

## 📝 Notes Importantes

1. **CORS** : Le backend autorise actuellement `http://localhost:3000`. Pour la production, ajouter le domaine de production.

2. **Authentification** : Le token est stocké dans le localStorage. Pour la production, considérer l'utilisation de cookies httpOnly.

3. **Fichiers** : Les fichiers sont stockés localement dans `media/`. Pour la production, utiliser un service de stockage cloud.

4. **Email** : La configuration email utilise Gmail. Pour la production, utiliser un service email professionnel.

5. **Base de données** : Utiliser PostgreSQL en production avec des sauvegardes régulières.

## 🐛 Problèmes Connus et Solutions

### Problème : Les migrations ne se créent pas
**Solution** : Vérifier que les modèles sont bien dans `models.py` et que l'app est dans `INSTALLED_APPS`

### Problème : CORS bloque les requêtes
**Solution** : Vérifier que `corsheaders` est dans `INSTALLED_APPS` et `CorsMiddleware` est dans `MIDDLEWARE`

### Problème : Les fichiers ne s'affichent pas
**Solution** : Vérifier que `MEDIA_URL` et `MEDIA_ROOT` sont bien configurés et que les fichiers sont servis correctement

### Problème : L'authentification ne fonctionne pas
**Solution** : Vérifier que le token est bien envoyé dans le header `Authorization: Bearer <token>`
