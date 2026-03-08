import useSWR from "swr"
import { djangoApi } from "@/lib/api/django"

// Fetch vehicles for a transporter
export function useVehicles(transporterId?: string) {
  return useSWR(
    transporterId ? ["vehicles", transporterId] : null,
    async () => {
      const response = await djangoApi.getVehicles()
      // Filtrer par owner si nécessaire (le backend le fait déjà pour les transporteurs)
      return response.vehicles || []
    },
    {
      revalidateOnFocus: false,
    },
  )
}

// Create a new vehicle
export async function createVehicle(vehicle: {
  type: string
  brand: string
  model: string
  plate_number: string
  capacity_kg: number
  insurance_expiry?: string
  inspection_expiry?: string
  description?: string
  photo_url?: string
}) {
  // Convertir photo_url en base64 si nécessaire
  let photo: string | undefined
  let ext: string | undefined
  
  if (vehicle.photo_url) {
    try {
      // Si c'est déjà une URL data:image, on l'utilise directement
      if (vehicle.photo_url.startsWith('data:image')) {
        photo = vehicle.photo_url
        ext = vehicle.photo_url.split(';')[0].split('/')[1] || 'jpg'
      } else if (vehicle.photo_url.startsWith('http')) {
        // Si c'est une URL HTTP, on doit la convertir en base64
        // Pour l'instant, on laisse l'URL telle quelle et le backend gérera
        photo = vehicle.photo_url
        ext = vehicle.photo_url.split('.').pop()?.split('?')[0] || 'jpg'
      } else {
        // Sinon, on suppose que c'est déjà en base64
        photo = vehicle.photo_url
        ext = 'jpg'
      }
    } catch (e) {
      console.error('Error processing photo:', e)
    }
  }

  const response = await djangoApi.createVehicle({
    type: vehicle.type,
    brand: vehicle.brand,
    model: vehicle.model,
    plate_number: vehicle.plate_number,
    capacity_kg: vehicle.capacity_kg,
    insurance_expiry: vehicle.insurance_expiry,
    inspection_expiry: vehicle.inspection_expiry,
    description: vehicle.description,
    photo,
    ext,
  })

  return response.vehicle
}

// Update a vehicle
export async function updateVehicle(vehicleSlug: string, updates: Partial<{
  type: string
  brand: string
  model: string
  plate_number: string
  capacity_kg: number
  insurance_expiry?: string
  inspection_expiry?: string
  description?: string
  status?: string
  photo_url?: string
}>) {
  let photo: string | undefined
  let ext: string | undefined
  
  if (updates.photo_url) {
    photo = updates.photo_url
    ext = updates.photo_url.split('.').pop()?.split('?')[0] || 'jpg'
  }

  const response = await djangoApi.updateVehicle(vehicleSlug, {
    ...updates,
    photo,
    ext,
  })

  return response.vehicle
}

// Delete a vehicle
export async function deleteVehicle(vehicleSlug: string) {
  await djangoApi.deleteVehicle(vehicleSlug)
  return true
}

// Add document to vehicle
export async function addVehicleDocument(vehicleSlug: string, document: { type: string; name: string; url: string; uploadedAt: string }) {
  // Convertir l'URL en base64 si nécessaire
  // Pour l'instant, on suppose que l'URL est accessible
  let fileBase64: string | undefined
  
  try {
    // Si c'est une URL, on peut la récupérer et la convertir en base64
    if (document.url.startsWith('http')) {
      const response = await fetch(document.url)
      const blob = await response.blob()
      const reader = new FileReader()
      fileBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64String = reader.result as string
          resolve(base64String.split(',')[1] || base64String)
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } else if (document.url.startsWith('data:')) {
      fileBase64 = document.url.split(',')[1] || document.url
    } else {
      fileBase64 = document.url
    }
  } catch (e) {
    console.error('Error converting document to base64:', e)
    throw new Error('Impossible de convertir le document')
  }

  const ext = document.name.split('.').pop() || 'pdf'
  
  const response = await djangoApi.addVehicleDocument(vehicleSlug, {
    file: fileBase64!,
    document_type: document.type.toUpperCase(),
    name: document.name,
    ext,
  })

  return response.document
}

// Update document in vehicle
export async function updateVehicleDocument(vehicleSlug: string, docSlug: string, document: { type: string; name: string; url: string; uploadedAt: string }) {
  let fileBase64: string | undefined
  
  if (document.url) {
    try {
      if (document.url.startsWith('http')) {
        const response = await fetch(document.url)
        const blob = await response.blob()
        const reader = new FileReader()
        fileBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const base64String = reader.result as string
            resolve(base64String.split(',')[1] || base64String)
          }
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      } else if (document.url.startsWith('data:')) {
        fileBase64 = document.url.split(',')[1] || document.url
      } else {
        fileBase64 = document.url
      }
    } catch (e) {
      console.error('Error converting document to base64:', e)
    }
  }

  const ext = document.name.split('.').pop() || 'pdf'
  
  const response = await djangoApi.updateVehicleDocument(docSlug, {
    file: fileBase64,
    document_type: document.type.toUpperCase(),
    name: document.name,
    ext,
  })

  return response.document
}

// Remove document from vehicle
export async function removeVehicleDocument(vehicleSlug: string, docSlug: string) {
  await djangoApi.deleteVehicleDocument(docSlug)
  return true
}
