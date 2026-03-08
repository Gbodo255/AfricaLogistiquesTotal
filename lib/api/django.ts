/**
 * Service API pour communiquer avec le backend Django
 */

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000/api/africa_logistic'

interface ApiResponse<T> {
  message?: string
  error?: string
  data?: T
  [key: string]: any
}

class DjangoApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Récupérer le token depuis le sessionStorage si disponible
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem('django_token') || null
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem('django_token', token)
      } else {
        sessionStorage.removeItem('django_token')
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    }

    // Ajouter le token d'authentification si disponible
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || `HTTP error! status: ${response.status}`,
          ...data
        }
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // ==================== AUTHENTIFICATION ====================

  async register(data: {
    firstname: string
    lastname: string
    telephone?: string
    email: string
    password: string
    role: string
    address?: string
    vehicles?: Array<{
      type: string
      brand: string
      model: string
      plate_number: string
      capacity_kg: number
      insurance_expiry?: string
      inspection_expiry?: string
      description?: string
      photo?: string
      ext?: string
    }>
    documents?: Array<{
      type_doc: string
      file: string
      description?: string
      ext?: string
    }>
  }) {
    const response = await this.request<{ user: any; is_approved?: boolean }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response
  }

  async login(data: { email?: string; telephone?: string; password: string }) {
    const response = await this.request<{ token: string; user: any }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (response.token) {
      this.setToken(response.token)
    }

    return response
  }

  async logout() {
    const response = await this.request('/auth/logout/', {
      method: 'DELETE',
    })

    this.setToken(null)
    return response
  }

  async verifyAccount(data: { user_slug: string; code: string }) {
    return this.request('/auth/verify-account/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async resendVerificationCode(data: { user_slug: string }) {
    return this.request('/auth/resend-verification/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCurrentUser() {
    const response = await this.request<{ user: any }>('/user/me/')
    // Vérifier si le transporteur est approuvé
    if (response.user && response.user.role === 'TRANSPORTEUR' && !response.user.is_approved) {
      // Le transporteur n'est pas approuvé
      response.user.pending_approval = true
    }
    return response
  }

  async updateProfile(data: {
    firstname?: string
    lastname?: string
    telephone?: string
    address?: string
    photo?: string
    ext?: string
  }) {
    return this.request<{ user: any }>('/user/me/update/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async changePassword(data: {
    old_password: string
    new_password: string
  }) {
    return this.request('/auth/change-password/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // ==================== WALLET ====================

  async getMyWallet() {
    return this.request<{ wallet: any }>('/wallet/me/')
  }

  async getMyWalletTransactions() {
    return this.request<{ transactions: any[] }>('/wallet/transactions/')
  }

  async topupWallet(data: { amount: number; description?: string; reference?: string }) {
    return this.request<{ wallet: any }>('/wallet/topup/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ==================== VÉHICULES ====================

  async getVehicles() {
    return this.request<{ vehicles: any[] }>('/vehicles/')
  }

  async getVehicle(vehicleSlug: string) {
    return this.request<{ vehicle: any }>(`/vehicles/${vehicleSlug}/`)
  }

  async createVehicle(data: {
    type: string
    brand: string
    model: string
    plate_number: string
    capacity_kg: number
    insurance_expiry?: string
    inspection_expiry?: string
    description?: string
    photo?: string
    ext?: string
  }) {
    return this.request<{ vehicle: any }>('/vehicles/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateVehicle(vehicleSlug: string, data: Partial<{
    type: string
    brand: string
    model: string
    plate_number: string
    capacity_kg: number
    insurance_expiry?: string
    inspection_expiry?: string
    description?: string
    status?: string
    photo?: string
    ext?: string
  }>) {
    return this.request<{ vehicle: any }>(`/vehicles/${vehicleSlug}/update/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteVehicle(vehicleSlug: string) {
    return this.request(`/vehicles/${vehicleSlug}/delete/`, {
      method: 'DELETE',
    })
  }

  // ==================== DOCUMENTS VÉHICULES ====================

  async getVehicleDocuments(vehicleSlug: string) {
    return this.request<{ documents: any[] }>(`/vehicles/${vehicleSlug}/documents/`)
  }

  async addVehicleDocument(
    vehicleSlug: string,
    data: {
      file: string // base64
      document_type: string
      name?: string
      description?: string
      expiry_date?: string
      ext?: string
    }
  ) {
    return this.request<{ document: any }>(`/vehicles/${vehicleSlug}/documents/add/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateVehicleDocument(
    docSlug: string,
    data: Partial<{
      file: string
      document_type: string
      name: string
      description: string
      expiry_date: string
      ext: string
    }>
  ) {
    return this.request<{ document: any }>(`/vehicles/documents/${docSlug}/update/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteVehicleDocument(docSlug: string) {
    return this.request(`/vehicles/documents/${docSlug}/delete/`, {
      method: 'DELETE',
    })
  }

  // ==================== VALIDATION TRANSPORTEURS (ADMIN) ====================

  async getPendingTransporters() {
    return this.request<{ transporters: any[]; count: number }>('/admin/transporters/pending/')
  }

  async approveTransporter(transporterSlug: string) {
    return this.request<{ transporter: any }>(`/admin/transporters/${transporterSlug}/approve/`, {
      method: 'PATCH',
    })
  }

  async rejectTransporter(transporterSlug: string, reason?: string) {
    return this.request(`/admin/transporters/${transporterSlug}/reject/`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    })
  }

  async getTransporterDetails(transporterSlug: string) {
    return this.request<{ transporter: any }>(`/admin/transporters/${transporterSlug}/`)
  }

  async getPublicDocumentTypes() {
    return this.request<{ types: any[] }>('/public/document-types/')
  }

  // ==================== DOCUMENTS LÉGAUX ====================

  async getMyLegalDocuments() {
    return this.request<{ documents: any[] }>('/legal-document/me/')
  }

  async addLegalDocument(data: FormData) {
    const url = `${this.baseUrl}/legal-document/add/`

    const headers: HeadersInit = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data,
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || `HTTP error! status: ${response.status}`, ...result }
    }

    return result
  }

  async updateLegalDocument(docSlug: string, data: Partial<{
    type_doc: string
    description: string
    file?: string
    ext?: string
  }>) {
    return this.request<{ document: any }>(`/legal-document/${docSlug}/alter/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteLegalDocument(docSlug: string) {
    return this.request(`/legal-document/${docSlug}/delete/`, {
      method: 'DELETE',
    })
  }

  // ==================== ADMIN / DATA ADMIN ====================

  async getAdminKPIs() {
    return this.request<{
      total_clients: number
      total_transporters: number
      total_moderators: number
      total_requests: number
      completed_requests: number
      pending_requests: number
      in_progress_requests: number
      total_revenue: number
      open_disputes: number
      total_client_balance: number
      total_transporter_balance: number
      today_transactions: number
      delivery_rate: string
    }>('/admin/kpis/')
  }

  async getAdminUsers(role?: string) {
    let endpoint = '/data-admin/users/'
    if (role && role !== 'all') {
      endpoint += `?role=${role}`
    }
    return this.request<{ users: any[]; nb: number }>(endpoint)
  }

  async getAdminTransactions(limit = 10) {
    return this.request<{ transactions: any[] }>(`/admin/finance/transactions/?limit=${limit}`)
  }

  async getAdminWallets() {
    return this.request<{ wallets: any[] }>('/admin/finance/wallets/')
  }

  async getAdminRequests(params?: { limit?: number; include_deleted?: boolean }) {
    let endpoint = '/admin/demandes/'
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.include_deleted) queryParams.append('include_deleted', 'true')

    const queryString = queryParams.toString()
    if (queryString) endpoint += `?${queryString}`

    return this.request<{ requests: any[]; count: number }>(endpoint)
  }

  async suspendUser(userSlug: string) {
    return this.request(`/data-admin/user/${userSlug}/desactivate/`, {
      method: 'PATCH',
    })
  }

  async activateUser(userSlug: string) {
    return this.request(`/data-admin/user/${userSlug}/activate/`, {
      method: 'PATCH',
    })
  }

  async deleteUser(userSlug: string) {
    return this.request(`/data-admin/user/${userSlug}/delete/`, {
      method: 'DELETE',
    })
  }

  async updateUserRole(userSlug: string, role: string) {
    return this.request(`/data-admin/user/${userSlug}/alter/`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
  }

  // ==================== DEMANDES CLIENT / TRANSPORTEUR ====================

  async getMyRequests() {
    return this.request<{ transport_requests: any[] }>('/demandes/mes-demandes/')
  }

  async getMyAssignedRequests() {
    return this.request<{ transport_requests: any[] }>('/demandes/mes-demandes-assignees/')
  }

  async createTransportRequest(data: any) {
    return this.request<{ transport_request: any }>('/demandes/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTransportRequests(params?: { status?: string }) {
    let endpoint = '/demandes/'
    if (params?.status) {
      const qs = new URLSearchParams()
      qs.append('status', params.status)
      endpoint += `?${qs.toString()}`
    }
    return this.request<{ transport_requests: any[] }>(endpoint)
  }

  // ==================== ADMIN DEMANDES ====================

  async adminAssignTransporter(requestSlug: string, transporterSlug: string) {
    return this.request<{ transport_request: any }>(`/admin/demandes/${requestSlug}/assign/`, {
      method: 'PATCH',
      body: JSON.stringify({ transporter_slug: transporterSlug }),
    })
  }

  async adminUpdateRequestStatus(requestSlug: string, status: string, comment?: string) {
    return this.request<{ transport_request: any }>(`/admin/demandes/${requestSlug}/statut/`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    })
  }

  async adminAssociateTracker(requestSlug: string, imei: string) {
    return this.request<{ transport_request: any }>(`/admin/demandes/${requestSlug}/associate-tracker/`, {
      method: 'PATCH',
      body: JSON.stringify({ tracker_imei: imei }),
    })
  }

  async getTransportRequestDetail(slug: string) {
    return this.request<{ transport_request: any }>(`/demandes/${slug}/`)
  }

  async cancelRequest(requestSlug: string) {
    return this.request<{ transport_request: any }>(`/demandes/${requestSlug}/annuler/`, {
      method: 'PATCH',
    })
  }

  async updateTransportRequest(requestSlug: string, data: Partial<{ status: string; comment?: string }>) {
    return this.request<{ transport_request: any }>(`/demandes/${requestSlug}/update/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // ==================== NOTIFICATIONS ====================



  // ==================== RATINGS ====================

  async getMyRatings() {
    return this.request<{ ratings: any[] }>('/ratings/me/')
  }

  async createRating(data: {
    transport_request_slug: string
    score: number
    comment?: string
  }) {
    return this.request<{ rating: any }>('/ratings/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ==================== PREFERENCES ====================

  async getNotificationPreferences() {
    return this.request<{ preferences: any }>('/user/notifications/preferences/')
  }

  async updateNotificationPreferences(preferences: any) {
    return this.request<{ preferences: any }>('/user/notifications/preferences/', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    })
  }

  // ==================== DISPUTES ====================

  async getDisputes(status?: string) {
    const params = status ? `?status=${status}` : ''
    return this.request<{ disputes: any[]; count: number }>(`/disputes/${params}`)
  }

  async createDispute(data: { request_slug: string; category?: string; description: string }) {
    return this.request<{ dispute: any }>('/disputes/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getDisputeDetail(disputeSlug: string) {
    return this.request<{ dispute: any }>(`/disputes/${disputeSlug}/`)
  }

  async updateDispute(disputeSlug: string, data: { status?: string; resolution?: string; assign_to_me?: boolean }) {
    return this.request<{ dispute: any }>(`/disputes/${disputeSlug}/update/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async takeDispute(disputeSlug: string) {
    return this.request<{ dispute: any }>(`/disputes/${disputeSlug}/take/`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    })
  }

  async addDisputeMessage(disputeSlug: string, content: string, isModeratorNote = false) {
    return this.request<{ message: any }>(`/disputes/${disputeSlug}/messages/`, {
      method: 'POST',
      body: JSON.stringify({ content, is_moderator_note: isModeratorNote }),
    })
  }

  // ==================== WITHDRAWALS ====================

  async createWithdrawalRequest(data: { amount: number; method: string; phone_number?: string; bank_details?: string }) {
    return this.request<{ withdrawal: any }>('/wallet/withdrawal/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getMyWithdrawals() {
    return this.request<{ withdrawals: any[]; count: number }>('/wallet/my-withdrawals/')
  }

  async getAdminWithdrawals(status?: string) {
    const params = status ? `?status=${status}` : ''
    return this.request<{ withdrawals: any[]; count: number }>(`/admin/withdrawals/${params}`)
  }

  async processWithdrawal(withdrawalSlug: string, action: 'approve' | 'reject', adminNote = '') {
    return this.request<{ withdrawal: any }>(`/admin/withdrawals/${withdrawalSlug}/process/`, {
      method: 'PATCH',
      body: JSON.stringify({ action, admin_note: adminNote }),
    })
  }

  // ==================== MODERATEUR ====================

  async getModeratorRequests(status?: string) {
    const params = status ? `?status=${status}` : ''
    return this.request<{ requests: any[]; count: number }>(`/moderator/requests/${params}`)
  }

  async moderatorValidateRequest(requestSlug: string, finalPrice?: number, comment?: string) {
    return this.request<{ transport_request: any }>(`/moderator/requests/${requestSlug}/validate/`, {
      method: 'PATCH',
      body: JSON.stringify({ final_price: finalPrice, comment }),
    })
  }

  async moderatorRejectRequest(requestSlug: string, reason: string) {
    return this.request<{ transport_request: any }>(`/moderator/requests/${requestSlug}/reject/`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    })
  }

  async moderatorAssignTransporter(requestSlug: string, transporterSlug: string) {
    return this.request<{ transport_request: any }>(`/moderator/requests/${requestSlug}/assign/`, {
      method: 'PATCH',
      body: JSON.stringify({ transporter_slug: transporterSlug }),
    })
  }

  async getAvailableTransporters() {
    return this.request<{ transporters: any[]; count: number }>('/moderator/transporters/available/')
  }

  async getModeratorStats() {
    return this.request<{
      pending_requests: number
      in_progress_requests: number
      open_disputes: number
      my_disputes: number
      pending_withdrawals: number
      total_transporters: number
    }>('/moderator/stats/')
  }

  async getModeratorUsers() {
    return this.request<{ nb: number, users: any[] }>('/moderator/users/')
  }

  // ==================== NOTIFICATIONS ====================

  async getNotifications() {
    return this.request<{ notifications: any[] }>('/notifications/')
  }

  async markNotificationRead(notifSlug: string) {
    return this.request<any>(`/notifications/${notifSlug}/read/`, {
      method: 'POST'
    })
  }

  async markAllNotificationsRead() {
    return this.request<any>('/notifications/read-all/', {
      method: 'POST'
    })
  }

  // ==================== PLATFORM SETTINGS ====================

  async getPlatformSettings() {
    return this.request<{ settings: any }>('/admin/settings/')
  }

  async updatePlatformSettings(settings: any) {
    return this.request<{ settings: any }>('/admin/settings/update/', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    })
  }
}

// Instance singleton
export const djangoApi = new DjangoApiClient(DJANGO_API_URL)
