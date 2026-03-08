/**
 * A-TRACKER (IOPGPS) Integration Service
 * 
 * Documentation: https://docs.iopgps.com/doc/view?api=iop
 * AppID: A-TRACKER
 * API Key: h8wba7xcscvai1zbzkfq4k1lp8thh8ef
 */

// Configuration
const IOPGPS_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_IOPGPS_BASE_URL || "https://api.iopgps.com",
  appId: process.env.NEXT_PUBLIC_IOPGPS_APP_ID || "A-TRACKER",
  apiKey: process.env.IOPGPS_API_KEY || "h8wba7xcscvai1zbzkfq4k1lp8thh8ef",
  useSimulation: false, // Intégration réelle activée
}

// Types pour l'API IOPGPS
export interface IOPGPSDevice {
  id: string
  imei: string
  name: string
  status: "online" | "offline" | "inactive"
  lastUpdate: string
  position?: IOPGPSPosition
}

export interface IOPGPSPosition {
  lat: number
  lng: number
  speed: number // km/h
  course: number // direction en degrés (0-360)
  altitude: number
  accuracy: number
  address?: string
  timestamp: string
}

export interface IOPGPSTrackPoint {
  lat: number
  lng: number
  speed: number
  course: number
  timestamp: string
}

export interface IOPGPSGeofence {
  id: string
  name: string
  type: "circle" | "polygon"
  coordinates: { lat: number; lng: number }[]
  radius?: number // pour les cercles, en mètres
}

export interface IOPGPSAlert {
  id: string
  deviceId: string
  type: "geofence_enter" | "geofence_exit" | "overspeed" | "low_battery" | "sos" | "vibration"
  message: string
  timestamp: string
  position?: IOPGPSPosition
}

// Classe principale du service A-TRACKER
class ATrackerService {
  private baseUrl: string
  private appId: string
  private apiKey: string
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor() {
    this.baseUrl = IOPGPS_CONFIG.baseUrl
    this.appId = IOPGPS_CONFIG.appId
    this.apiKey = IOPGPS_CONFIG.apiKey
  }

  /**
   * Authentification et obtention du token d'accès
   */
  async authenticate(): Promise<boolean> {
    if (IOPGPS_CONFIG.useSimulation) {
      this.accessToken = "simulated-token"
      this.tokenExpiry = Date.now() + 3600 * 1000
      return true
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appId: this.appId,
          appKey: this.apiKey,
        }),
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token || data.token
      this.tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000

      return true
    } catch (error) {
      console.error("A-TRACKER authentication error:", error)
      return false
    }
  }

  /**
   * Vérifie si le token est valide, sinon réauthentifie
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken || Date.now() >= this.tokenExpiry - 60000) {
      await this.authenticate()
    }
  }

  /**
   * Headers pour les requêtes authentifiées
   */
  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.accessToken}`,
      "X-App-Id": this.appId,
    }
  }

  /**
   * Récupère tous les dispositifs GPS
   */
  async getDevices(): Promise<IOPGPSDevice[]> {
    if (IOPGPS_CONFIG.useSimulation) {
      return [
        { id: "1", imei: "868202403160001", name: "Camion Benne 01", status: "online", lastUpdate: new Date().toISOString() },
        { id: "2", imei: "868202403160002", name: "Van Livraison 02", status: "online", lastUpdate: new Date().toISOString() },
        { id: "3", imei: "868202403160003", name: "Moto Course 03", status: "offline", lastUpdate: new Date(Date.now() - 3600000).toISOString() },
      ]
    }

    await this.ensureAuthenticated()

    try {
      const response = await fetch(`${this.baseUrl}/api/devices`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch devices: ${response.status}`)
      }

      const data = await response.json()
      return data.devices || data.data || []
    } catch (error) {
      console.error("A-TRACKER getDevices error:", error)
      return []
    }
  }

  /**
   * Récupère un dispositif par son IMEI
   */
  async getDeviceByImei(imei: string): Promise<IOPGPSDevice | null> {
    await this.ensureAuthenticated()

    try {
      const response = await fetch(`${this.baseUrl}/api/devices/${imei}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.device || data.data || null
    } catch (error) {
      console.error("A-TRACKER getDeviceByImei error:", error)
      return null
    }
  }

  /**
   * Récupère la dernière position d'un dispositif
   */
  async getLastPosition(imei: string): Promise<IOPGPSPosition | null> {
    if (IOPGPS_CONFIG.useSimulation) {
      return {
        lat: 5.3484 + (Math.random() - 0.5) * 0.01,
        lng: -4.0305 + (Math.random() - 0.5) * 0.01,
        speed: 45 + Math.random() * 20,
        course: Math.random() * 360,
        altitude: 20,
        accuracy: 5,
        address: "Abidjan, Côte d'Ivoire",
        timestamp: new Date().toISOString(),
      }
    }

    await this.ensureAuthenticated()

    try {
      const response = await fetch(`${this.baseUrl}/api/devices/${imei}/position`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.position || data.data || null
    } catch (error) {
      console.error("A-TRACKER getLastPosition error:", error)
      return null
    }
  }

  /**
   * Récupère les positions de tous les dispositifs
   */
  async getAllPositions(): Promise<{ imei: string; position: IOPGPSPosition }[]> {
    if (IOPGPS_CONFIG.useSimulation) {
      const devices = await this.getDevices()
      return devices.map(d => ({
        imei: d.imei,
        position: {
          lat: 5.3484 + (Math.random() - 0.5) * 0.02,
          lng: -4.0305 + (Math.random() - 0.5) * 0.02,
          speed: d.status === "online" ? 30 + Math.random() * 40 : 0,
          course: Math.random() * 360,
          altitude: 25,
          accuracy: 10,
          timestamp: new Date().toISOString(),
        }
      }))
    }

    await this.ensureAuthenticated()

    try {
      const response = await fetch(`${this.baseUrl}/api/positions`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch positions: ${response.status}`)
      }

      const data = await response.json()
      return data.positions || data.data || []
    } catch (error) {
      console.error("A-TRACKER getAllPositions error:", error)
      return []
    }
  }

  /**
   * Récupère l'historique des positions (track)
   */
  async getTrackHistory(
    imei: string,
    startDate: Date,
    endDate: Date
  ): Promise<IOPGPSTrackPoint[]> {
    if (IOPGPS_CONFIG.useSimulation) {
      return [] // Historique vide en simulation pour l'instant
    }

    await this.ensureAuthenticated()

    try {
      const params = new URLSearchParams({
        from: startDate.toISOString(),
        to: endDate.toISOString(),
      })

      const response = await fetch(
        `${this.baseUrl}/api/devices/${imei}/track?${params}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch track history: ${response.status}`)
      }

      const data = await response.json()
      return data.track || data.data || []
    } catch (error) {
      console.error("A-TRACKER getTrackHistory error:", error)
      return []
    }
  }

  /**
   * Récupère les alertes d'un dispositif
   */
  async getAlerts(imei?: string, limit: number = 50): Promise<IOPGPSAlert[]> {
    if (IOPGPS_CONFIG.useSimulation) {
      return [
        { id: "a1", deviceId: "1", type: "overspeed", message: "Excès de vitesse détecté (85 km/h)", timestamp: new Date(Date.now() - 1800000).toISOString() },
        { id: "a2", deviceId: "2", type: "geofence_exit", message: "Sortie de zone : Port d'Abidjan", timestamp: new Date(Date.now() - 3600000).toISOString() },
      ]
    }

    await this.ensureAuthenticated()

    try {
      const params = new URLSearchParams({ limit: limit.toString() })
      if (imei) {
        params.append("imei", imei)
      }

      const response = await fetch(`${this.baseUrl}/api/alerts?${params}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.status}`)
      }

      const data = await response.json()
      return data.alerts || data.data || []
    } catch (error) {
      console.error("A-TRACKER getAlerts error:", error)
      return []
    }
  }

  /**
   * Crée une geofence
   */
  async createGeofence(geofence: Omit<IOPGPSGeofence, "id">): Promise<IOPGPSGeofence | null> {
    await this.ensureAuthenticated()

    try {
      const response = await fetch(`${this.baseUrl}/api/geofences`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(geofence),
      })

      if (!response.ok) {
        throw new Error(`Failed to create geofence: ${response.status}`)
      }

      const data = await response.json()
      return data.geofence || data.data || null
    } catch (error) {
      console.error("A-TRACKER createGeofence error:", error)
      return null
    }
  }

  /**
   * Assigne un dispositif à un véhicule/transporteur
   */
  async assignDeviceToVehicle(
    imei: string,
    vehicleId: string,
    transporterId: string
  ): Promise<boolean> {
    await this.ensureAuthenticated()

    try {
      const response = await fetch(`${this.baseUrl}/api/devices/${imei}/assign`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          vehicleId,
          transporterId,
          assignedAt: new Date().toISOString(),
        }),
      })

      return response.ok
    } catch (error) {
      console.error("A-TRACKER assignDeviceToVehicle error:", error)
      return false
    }
  }

  /**
   * Envoie une commande au dispositif (ex: couper le moteur)
   */
  async sendCommand(
    imei: string,
    command: "engine_off" | "engine_on" | "lock" | "unlock" | "locate"
  ): Promise<boolean> {
    await this.ensureAuthenticated()

    try {
      const response = await fetch(`${this.baseUrl}/api/devices/${imei}/command`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ command }),
      })

      return response.ok
    } catch (error) {
      console.error("A-TRACKER sendCommand error:", error)
      return false
    }
  }

  /**
   * Calcule la distance entre deux points GPS
   */
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371 // Rayon de la Terre en km
    const dLat = this.toRad(lat2 - lat1)
    const dLng = this.toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance en km
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  /**
   * Estime le temps d'arrivée basé sur la position et la vitesse
   */
  estimateArrivalTime(
    currentPosition: IOPGPSPosition,
    destinationLat: number,
    destinationLng: number
  ): { distance: number; estimatedMinutes: number } {
    const distance = this.calculateDistance(
      currentPosition.lat,
      currentPosition.lng,
      destinationLat,
      destinationLng
    )

    // Utilise la vitesse actuelle ou une vitesse moyenne de 40 km/h
    const speed = currentPosition.speed > 0 ? currentPosition.speed : 40
    const estimatedMinutes = Math.round((distance / speed) * 60)

    return { distance, estimatedMinutes }
  }
}

// Instance singleton
export const aTrackerService = new ATrackerService()

// Export par défaut
export default aTrackerService
