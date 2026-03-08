# 🚀 Accès Rapide aux Dashboards

## Comptes de Test (Mode Développement)

Le projet utilise un système mock pour le développement. Connectez-vous avec :

### 👨‍💼 Administrateur
- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`
- **URL** : `http://localhost:3000/admin`

### 👨‍⚖️ Modérateur
- **Email** : `mod@example.com`
- **Mot de passe** : `mod123`
- **URL** : `http://localhost:3000/moderator`

## Démarrage Rapide

1. **Installer les dépendances** :
   ```bash
   npm install
   # ou
   pnpm install
   ```

2. **Démarrer le serveur** :
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```

3. **Ouvrir le navigateur** :
   - Aller sur `http://localhost:3000/auth/login`
   - Se connecter avec un des comptes ci-dessus

4. **Accéder au dashboard** :
   - Vous serez automatiquement redirigé selon votre rôle

## Documentation Complète

- 📖 **Guide d'accès détaillé** : Voir `GUIDE_ACCES_DASHBOARDS.md`
- 🔧 **Documentation backend** : Voir `DOCUMENTATION_BACKEND.md`

## Pour la Production (Supabase)

Si vous utilisez Supabase réel :

1. Créez les utilisateurs via l'interface Supabase Auth
2. Exécutez le script `scripts/005-create-admin-moderator-accounts.sql`
3. Connectez-vous avec les identifiants créés

## Support

Pour plus d'informations, consultez les fichiers de documentation dans le projet.
