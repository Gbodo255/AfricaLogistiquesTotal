# 🚀 Guide de Démarrage Rapide

## Prérequis

- Python 3.8+ installé
- PostgreSQL installé et en cours d'exécution
- Node.js 18+ installé
- npm ou pnpm installé

## Démarrage en 5 Minutes

### 1. Backend Django (Terminal 1)

```bash
# Aller dans le dossier backend
cd AFRICA-PROJECT-BACKEND-main

# Installer les dépendances
pip install -r requirements.txt

# Aller dans le projet
cd africa_project

# Créer les migrations (IMPORTANT - Première fois seulement)
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Démarrer le serveur
python manage.py runserver
```

✅ Le backend est maintenant accessible sur `http://localhost:8000`

### 2. Frontend Next.js (Terminal 2)

```bash
# À la racine du projet (pas dans AFRICA-PROJECT-BACKEND-main)

# Installer les dépendances (si pas déjà fait)
npm install
# ou
pnpm install

# Créer le fichier .env.local
echo "NEXT_PUBLIC_DJANGO_API_URL=http://localhost:8000/api/africa_logistic" > .env.local

# Démarrer le serveur
npm run dev
# ou
pnpm dev
```

✅ Le frontend est maintenant accessible sur `http://localhost:3000`

## 🧪 Test Rapide

1. **Ouvrir** `http://localhost:3000`
2. **S'inscrire** comme transporteur
3. **Vérifier** votre email pour le code de vérification
4. **Vérifier** votre compte avec le code
5. **Aller** sur `/transporter/fleet`
6. **Ajouter** un véhicule
7. **Ajouter** un document au véhicule

Si tout fonctionne, vous êtes prêt ! 🎉

## ⚠️ Problèmes Courants

### Erreur: "No module named 'corsheaders'"
**Solution**: `pip install django-cors-headers`

### Erreur: "relation does not exist"
**Solution**: Exécuter `python manage.py migrate`

### Erreur: "Connection refused" (Frontend)
**Solution**: Vérifier que le backend Django est bien démarré sur le port 8000

### Erreur: "CORS policy"
**Solution**: Vérifier que `corsheaders` est dans `INSTALLED_APPS` et `CorsMiddleware` dans `MIDDLEWARE`

## 📚 Documentation Complète

- `INTEGRATION_DJANGO.md` - Documentation détaillée de l'intégration
- `DEPLOYMENT_CHECKLIST.md` - Checklist complète de déploiement
- `VERIFICATION_COMPLETE.md` - Vérification complète du système
