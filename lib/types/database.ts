// Database types for A-Logistics

export type UserRole = "client" | "transporter" | "moderator" | "admin"
export type RequestStatus =
  | "pending"
  | "validated"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed"
export type VehicleType = "moto" | "car" | "van" | "truck" | "trailer"
export type TransportType = "standard" | "express" | "fragile" | "refrigerated" | "hazardous"
export type TransactionType = "credit" | "debit" | "penalty" | "commission" | "refund" | "withdrawal"
export type DisputeStatus = "open" | "investigating" | "resolved" | "escalated"
export type NotificationType = "request" | "payment" | "assignment" | "tracking" | "dispute" | "system"

export interface Profile {
  id: string
  email: string | null
  phone: string | null
  first_name: string
  last_name: string
  role: UserRole
  avatar_url: string | null
  address: string | null
  city: string | null
  country: string
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WalletTransaction {
  id: string
  wallet_id: string
  type: TransactionType
  amount: number
  balance_before: number
  balance_after: number
  reference: string | null
  description: string | null
  related_request_id: string | null
  created_by: string | null
  created_at: string
}

export interface Vehicle {
  id: string
  owner_id: string
  type: VehicleType
  brand: string
  model: string
  plate_number: string
  year: number | null
  capacity_kg: number | null
  capacity_m3: number | null
  is_available: boolean
  is_verified: boolean
  insurance_expiry: string | null
  inspection_expiry: string | null
  photo_url: string | null
  documents: any[]
  created_at: string
  updated_at: string
}

export interface TransportRequest {
  id: string
  client_id: string
  transport_type: TransportType
  cargo_description: string
  cargo_weight_kg: number | null
  cargo_volume_m3: number | null
  cargo_value: number | null
  special_instructions: string | null
  pickup_address: string
  pickup_city: string
  pickup_lat: number | null
  pickup_lng: number | null
  pickup_contact_name: string | null
  pickup_contact_phone: string | null
  pickup_date: string
  delivery_address: string
  delivery_city: string
  delivery_lat: number | null
  delivery_lng: number | null
  delivery_contact_name: string | null
  delivery_contact_phone: string | null
  delivery_date: string | null
  estimated_price: number | null
  final_price: number | null
  platform_commission: number | null
  transporter_earnings: number | null
  status: RequestStatus
  assigned_transporter_id: string | null
  assigned_vehicle_id: string | null
  assigned_by: string | null
  assigned_at: string | null
  started_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  cancelled_by: string | null
  validated_by: string | null
  validated_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
  // Relations
  client?: Profile
  transporter?: Profile
  vehicle?: Vehicle
}

export interface TrackingUpdate {
  id: string
  request_id: string
  lat: number
  lng: number
  speed: number | null
  heading: number | null
  status: string | null
  notes: string | null
  created_at: string
}

export interface Rating {
  id: string
  request_id: string
  rater_id: string
  rated_id: string
  score: number
  comment: string | null
  is_visible: boolean
  created_at: string
  rater?: Profile
  rated?: Profile
}

export interface Dispute {
  id: string
  request_id: string
  opened_by: string
  assigned_moderator: string | null
  status: DisputeStatus
  category: string
  description: string
  resolution: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
  opener?: Profile
  moderator?: Profile
  request?: TransportRequest
}

export interface DisputeMessage {
  id: string
  dispute_id: string
  sender_id: string
  message: string
  attachments: any[]
  created_at: string
  sender?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data: any
  is_read: boolean
  created_at: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string | null
  old_data: any
  new_data: any
  ip_address: string | null
  user_agent: string | null
  created_at: string
  user?: Profile
}

export interface PlatformSetting {
  id: string
  key: string
  value: any
  description: string | null
  updated_by: string | null
  updated_at: string
}

// Stats types
export interface ClientStats {
  total_requests: number
  completed_requests: number
  pending_requests: number
  cancelled_requests: number
  total_spent: number
  average_rating: number
}

export interface TransporterStats {
  total_missions: number
  completed_missions: number
  in_progress_missions: number
  total_earnings: number
  average_rating: number
  vehicles_count: number
}

export interface ModeratorStats {
  requests_validated: number
  requests_assigned: number
  disputes_handled: number
  disputes_resolved: number
}

export interface AdminStats {
  total_users: number
  total_clients: number
  total_transporters: number
  total_requests: number
  completed_requests: number
  total_revenue: number
  active_disputes: number
}

export interface PlatformKPIs {
  period: string
  users: {
    total: number
    new: number
    by_role: Record<UserRole, number>
  }
  requests: {
    total: number
    completed: number
    pending: number
    by_status: Record<RequestStatus, number>
  }
  revenue: {
    total_volume: number
    platform_commission: number
    transporter_earnings: number
  }
  disputes: {
    total: number
    open: number
    resolved: number
  }
  wallets: {
    total_balance_clients: number
    total_balance_transporters: number
  }
}
