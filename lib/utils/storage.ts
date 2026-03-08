/**
 * Mock file storage utility for demo mode
 * Stores files as base64 in localStorage
 */

const STORAGE_KEY_FILES = "mock_supabase_files"

interface StoredFile {
  id: string
  url: string
  name: string
  type: string
  size: number
  uploadedAt: string
  data: string // base64
}

// Get all stored files
export function getStoredFiles(): StoredFile[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY_FILES)
  return data ? JSON.parse(data) : []
}

// Store a file
export function storeFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const storedFile: StoredFile = {
        id: fileId,
        url: base64, // In demo mode, we use base64 as URL
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        data: base64,
      }

      const files = getStoredFiles()
      files.push(storedFile)
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files))

      resolve(base64) // Return base64 URL for immediate use
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Delete a stored file
export function deleteStoredFile(url: string): void {
  const files = getStoredFiles()
  const filtered = files.filter((f) => f.url !== url)
  localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(filtered))
}

// Get file URL (returns base64 in demo mode)
export function getFileUrl(url: string | null): string | null {
  if (!url) return null
  // If it's already a base64 data URL, return as is
  if (url.startsWith("data:")) return url
  // Otherwise, try to find it in storage
  const files = getStoredFiles()
  const file = files.find((f) => f.url === url || f.id === url)
  return file ? file.url : url
}
