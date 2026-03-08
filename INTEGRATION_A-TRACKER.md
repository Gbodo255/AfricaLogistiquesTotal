# Intégration A-TRACKER (IOPGPS)

## Configuration

### Informations de connexion
- **AppID**: `A-TRACKER`
- **Clé API**: `h8wba7xcscvai1zbzkfq4k1lp8thh8ef`
- **Documentation API**: https://docs.iopgps.com/doc/view?api=iop

### Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# A-TRACKER (IOPGPS) Configuration
NEXT_PUBLIC_IOPGPS_BASE_URL=https://api.iopgps.com
NEXT_PUBLIC_IOPGPS_APP_ID=A-TRACKER
IOPGPS_API_KEY=h8wba7xcscvai1zbzkfq4k1lp8thh8ef
```

## Structure des fichiers

```
lib/
├── services/
│   └── a-tracker.ts      # Service principal A-TRACKER
└── hooks/
    └── use-tracker.ts    # Hooks React pour le tracking

components/
└── tracking/
    ├── index.ts
    ├── tracking-map.tsx         # Carte de suivi
    └── tracker-devices-list.tsx # Liste des dispositifs
```

## Utilisation

### 1. Service A-TRACKER

Le service `aTrackerService` fournit toutes les méthodes pour interagir avec l'API IOPGPS :

```typescript
import aTrackerService from "@/lib/services/a-tracker"

// Authentification (automatique)
await aTrackerService.authenticate()

// Récupérer tous les dispositifs
const devices = await aTrackerService.getDevices()

// Récupérer la position d'un dispositif
const position = await aTrackerService.getLastPosition("IMEI_NUMBER")

// Récupérer l'historique des trajets
const track = await aTrackerService.getTrackHistory(
  "IMEI_NUMBER",
  new Date("2024-01-01"),
  new Date("2024-01-02")
)

// Envoyer une commande au dispositif
await aTrackerService.sendCommand("IMEI_NUMBER", "locate")
```

### 2. Hooks React

#### `useTrackerDevices()`
Récupère la liste de tous les dispositifs GPS.

```typescript
const { data: devices, error, isLoading, mutate } = useTrackerDevices()
```

#### `useTrackerPosition(imei, refreshInterval)`
Suivi en temps réel d'une position.

```typescript
const { position, error, isLoading, refresh } = useTrackerPosition("IMEI", 5000)
```

#### `useDeliveryTracking(imei, destLat, destLng)`
Suivi complet d'une livraison avec ETA.

```typescript
const { 
  position, 
  eta,           // { distance: km, estimatedMinutes: number }
  isMoving, 
  speed, 
  heading 
} = useDeliveryTracking("IMEI", 6.3654, 2.4183)
```

#### `useTrackerHistory(imei, startDate, endDate)`
Historique des trajets.

```typescript
const { data: track } = useTrackerHistory("IMEI", startDate, endDate)
```

#### `useTrackerAlerts(imei?, limit)`
Alertes du système.

```typescript
const { data: alerts } = useTrackerAlerts("IMEI", 50)
```

#### `useTrackerCommands(imei)`
Envoyer des commandes au tracker.

```typescript
const { engineOff, engineOn, lock, unlock, locate } = useTrackerCommands("IMEI")

// Couper le moteur
await engineOff()

// Localiser le véhicule
await locate()
```

### 3. Composants React

#### `<TrackingMap />`
Carte de suivi en temps réel.

```tsx
<TrackingMap
  imei="123456789012345"
  pickupLat={6.1319}
  pickupLng={1.2228}
  deliveryLat={6.3654}
  deliveryLng={2.4183}
  showControls={true}
/>
```

#### `<TrackerDevicesList />`
Liste des dispositifs avec sélection.

```tsx
<TrackerDevicesList
  onSelectDevice={(device) => console.log(device)}
  selectedDeviceId="device-id"
/>
```

## Types TypeScript

```typescript
interface IOPGPSDevice {
  id: string
  imei: string
  name: string
  status: "online" | "offline" | "inactive"
  lastUpdate: string
  position?: IOPGPSPosition
}

interface IOPGPSPosition {
  lat: number
  lng: number
  speed: number        // km/h
  course: number       // direction (0-360°)
  altitude: number
  accuracy: number
  address?: string
  timestamp: string
}

interface IOPGPSTrackPoint {
  lat: number
  lng: number
  speed: number
  course: number
  timestamp: string
}

interface IOPGPSAlert {
  id: string
  deviceId: string
  type: "geofence_enter" | "geofence_exit" | "overspeed" | "low_battery" | "sos" | "vibration"
  message: string
  timestamp: string
  position?: IOPGPSPosition
}

interface IOPGPSGeofence {
  id: string
  name: string
  type: "circle" | "polygon"
  coordinates: { lat: number; lng: number }[]
  radius?: number  // pour les cercles, en mètres
}
```

## Fonctionnalités disponibles

### 1. Suivi en temps réel
- Position GPS en temps réel (rafraîchissement toutes les 5 secondes)
- Vitesse et direction
- Calcul de l'ETA (Estimated Time of Arrival)
- Distance restante

### 2. Gestion des dispositifs
- Liste des trackers avec statut (en ligne/hors ligne)
- Recherche par nom ou IMEI
- Statistiques (total, en ligne, hors ligne)

### 3. Historique des trajets
- Récupération des trajets par période
- Statistiques (distance totale, vitesse max/moyenne, durée)
- Nombre de points GPS

### 4. Alertes
- Entrée/sortie de zone (geofence)
- Excès de vitesse
- Batterie faible
- Bouton SOS
- Vibration/choc

### 5. Commandes à distance
- Couper/démarrer le moteur
- Verrouiller/déverrouiller
- Localisation forcée

### 6. Geofencing
- Création de zones circulaires ou polygonales
- Alertes d'entrée/sortie

## Pages utilisant A-TRACKER

- `/moderator/tracking` - Page de suivi pour les modérateurs
- `/admin/tracking` - Page de suivi pour les administrateurs
- `/client/tracking` - Suivi client de leurs livraisons
- `/transporter/navigation` - Navigation pour les transporteurs

## Notes importantes

1. **Authentification** : Le service gère automatiquement l'authentification et le renouvellement des tokens.

2. **Rafraîchissement** : Les données sont rafraîchies automatiquement selon les intervalles définis dans chaque hook.

3. **Gestion d'erreurs** : Toutes les méthodes gèrent les erreurs et retournent `null` ou un tableau vide en cas d'échec.

4. **Mode hors ligne** : En cas de perte de connexion, le dernier état connu est conservé.

5. **Performance** : Utilisez les hooks SWR qui incluent le cache et la déduplication des requêtes.

## Prochaines étapes

1. **Intégrer une vraie carte** : Remplacer le placeholder par Leaflet, Google Maps, ou Mapbox
2. **WebSocket** : Implémenter les mises à jour en temps réel via WebSocket si l'API le supporte
3. **Notifications push** : Alertes push pour les événements importants
4. **Rapports** : Génération de rapports de trajets PDF/Excel
