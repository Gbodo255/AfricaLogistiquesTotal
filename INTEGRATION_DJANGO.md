# Intégration Backend Django avec Frontend Next.js

Ce document explique comment configurer et utiliser l'intégration entre le backend Django et le frontend Next.js.

## Configuration

### Backend Django

1. **Installer les dépendances** :
```bash
cd AFRICA-PROJECT-BACKEND-main
pip install -r requirements.txt
```

2. **Configurer la base de données** :
   - Assurez-vous que PostgreSQL est installé et en cours d'exécution
   - Créez une base de données nommée `africa_project`
   - Modifiez les paramètres dans `africa_project/settings.py` si nécessaire

3. **Créer les migrations** :
```bash
cd africa_project
python manage.py makemigrations
python manage.py migrate
```

4. **Démarrer le serveur Django** :
```bash
python manage.py runserver
```

Le serveur Django sera accessible sur `http://localhost:8000`

### Frontend Next.js

1. **Configurer la variable d'environnement** :
   Créez un fichier `.env.local` à la racine du projet frontend :
```env
NEXT_PUBLIC_DJANGO_API_URL=http://localhost:8000/api/africa_logistic
```

2. **Démarrer le serveur Next.js** :
```bash
npm run dev
# ou
pnpm dev
```

## Fonctionnalités implémentées

### 1. Authentification avec double vérification

Lors de l'inscription, un code de vérification à 6 chiffres est automatiquement envoyé par email à l'utilisateur. L'utilisateur doit vérifier son compte en utilisant ce code.

**Endpoints** :
- `POST /api/africa_logistic/auth/register/` - Inscription
- `PATCH /api/africa_logistic/auth/verify-account/` - Vérification du compte
- `POST /api/africa_logistic/auth/resend-verification/` - Renvoyer le code

### 2. Gestion des véhicules (Transporteurs)

Les transporteurs peuvent maintenant :
- Ajouter un véhicule
- Modifier un véhicule
- Supprimer un véhicule
- Ajouter des documents à un véhicule
- Modifier des documents de véhicule
- Supprimer des documents de véhicule

**Endpoints** :
- `GET /api/africa_logistic/vehicles/` - Liste des véhicules
- `POST /api/africa_logistic/vehicles/create/` - Créer un véhicule
- `GET /api/africa_logistic/vehicles/<slug>/` - Détails d'un véhicule
- `PATCH /api/africa_logistic/vehicles/<slug>/update/` - Modifier un véhicule
- `DELETE /api/africa_logistic/vehicles/<slug>/delete/` - Supprimer un véhicule

**Documents véhicules** :
- `GET /api/africa_logistic/vehicles/<slug>/documents/` - Liste des documents
- `POST /api/africa_logistic/vehicles/<slug>/documents/add/` - Ajouter un document
- `PATCH /api/africa_logistic/vehicles/documents/<doc_slug>/update/` - Modifier un document
- `DELETE /api/africa_logistic/vehicles/documents/<doc_slug>/delete/` - Supprimer un document

### 3. Gestion des documents légaux (Transporteurs)

Les transporteurs peuvent gérer leurs documents légaux :
- `GET /api/africa_logistic/legal-document/me/` - Mes documents
- `POST /api/africa_logistic/legal-document/add/` - Ajouter un document
- `PATCH /api/africa_logistic/legal-document/<slug>/alter/` - Modifier un document
- `DELETE /api/africa_logistic/legal-document/<slug>/delete/` - Supprimer un document

## Utilisation dans le frontend

### Service API

Le service API Django est disponible dans `lib/api/django.ts` :

```typescript
import { djangoApi } from '@/lib/api/django'

// Exemple : Récupérer les véhicules
const response = await djangoApi.getVehicles()
const vehicles = response.vehicles

// Exemple : Créer un véhicule
await djangoApi.createVehicle({
  type: 'TRUCK',
  brand: 'Mercedes',
  model: 'Actros',
  plate_number: 'ABC-123',
  capacity_kg: 5000,
})
```

### Hooks

Les hooks existants ont été adaptés pour utiliser l'API Django :

```typescript
import { useVehicles, createVehicle, updateVehicle, deleteVehicle } from '@/lib/hooks/use-vehicles'

// Dans un composant
const { data: vehicles, isLoading, mutate } = useVehicles(user?.id)

// Créer un véhicule
await createVehicle({ ... })
```

## Structure des données

### Véhicule

```typescript
{
  slug: string
  type: 'TRUCK' | 'VAN' | 'MOTORBIKE' | 'CAR' | 'OTHER'
  brand: string
  model: string
  plate_number: string
  capacity_kg: number
  insurance_expiry?: string (date ISO)
  inspection_expiry?: string (date ISO)
  photo?: string (URL)
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  description?: string
  documents: VehicleDocument[]
}
```

### Document véhicule

```typescript
{
  slug: string
  document_type: 'INSURANCE' | 'INSPECTION' | 'REGISTRATION' | 'LICENSE' | 'OTHER'
  file: string (URL)
  name: string
  description?: string
  expiry_date?: string (date ISO)
}
```

## Notes importantes

1. **CORS** : Le backend Django est configuré pour accepter les requêtes depuis `http://localhost:3000`

2. **Authentification** : Le token d'authentification est stocké dans le localStorage et envoyé dans le header `Authorization: Bearer <token>`

3. **Fichiers** : Les fichiers (photos, documents) sont envoyés en base64 dans le body JSON ou via FormData

4. **Slugs** : Tous les modèles utilisent des slugs au lieu d'IDs pour les URLs

5. **Soft Delete** : Les suppressions sont des "soft deletes" (is_active=False), les données ne sont pas réellement supprimées

## Prochaines étapes

- [ ] Adapter l'inscription frontend pour utiliser l'API Django
- [ ] Adapter la connexion frontend pour utiliser l'API Django
- [ ] Ajouter la gestion des documents légaux dans le frontend
- [ ] Tester toutes les fonctionnalités
- [ ] Ajouter la gestion d'erreurs et les messages appropriés
