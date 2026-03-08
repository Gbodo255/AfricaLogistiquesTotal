
// Mock Supabase client for local development
// It uses localStorage (client) or in-memory storage (server) to persist data

const STORAGE_KEY_USERS = "mock_supabase_users"
const STORAGE_KEY_PROFILES = "mock_supabase_profiles"
const STORAGE_KEY_WALLETS = "mock_supabase_wallets"
const STORAGE_KEY_TRANSACTIONS = "mock_supabase_transactions"
const STORAGE_KEY_REQUESTS = "mock_supabase_requests"
const STORAGE_KEY_DISPUTES = "mock_supabase_disputes"
const STORAGE_KEY_VEHICLES = "mock_supabase_vehicles"
const STORAGE_KEY_DISPUTE_MESSAGES = "mock_supabase_dispute_messages"
const STORAGE_KEY_SESSION = "mock_supabase_session"

// In-memory storage for server-side
const serverStorage: Record<string, any[]> = {
  [STORAGE_KEY_USERS]: [],
  [STORAGE_KEY_PROFILES]: [],
  [STORAGE_KEY_WALLETS]: [],
  [STORAGE_KEY_TRANSACTIONS]: [],
  [STORAGE_KEY_REQUESTS]: [],
  [STORAGE_KEY_DISPUTES]: [],
  [STORAGE_KEY_VEHICLES]: [],
  [STORAGE_KEY_DISPUTE_MESSAGES]: [],
}

// Initialize default data for server-side
if (typeof window === "undefined") {
  const now = new Date().toISOString()
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  
  serverStorage[STORAGE_KEY_USERS] = [
    { id: "admin-id", email: "admin@example.com", password: "admin123", user_metadata: { role: "admin", first_name: "Admin", last_name: "System" } },
    { id: "mod-id", email: "mod@example.com", password: "mod123", user_metadata: { role: "moderator", first_name: "Mod", last_name: "User" } },
    { id: "client-id", email: "client@example.com", password: "client123", user_metadata: { role: "client", first_name: "Client", last_name: "Test" } },
    { id: "transporter-id", email: "transporter@example.com", password: "transporter123", user_metadata: { role: "transporter", first_name: "Transporteur", last_name: "Test" } }
  ]
  serverStorage[STORAGE_KEY_PROFILES] = [
    { id: "admin-id", email: "admin@example.com", role: "admin", first_name: "Admin", last_name: "System", is_active: true, is_verified: true, created_at: lastWeek },
    { id: "mod-id", email: "mod@example.com", role: "moderator", first_name: "Mod", last_name: "User", is_active: true, is_verified: true, created_at: lastWeek },
    { id: "client-id", email: "client@example.com", role: "client", first_name: "Client", last_name: "Test", is_active: true, is_verified: true, created_at: lastWeek },
    { id: "transporter-id", email: "transporter@example.com", role: "transporter", first_name: "Transporteur", last_name: "Test", company_name: "Transport Express", is_active: true, is_verified: true, created_at: lastWeek }
  ]
  serverStorage[STORAGE_KEY_WALLETS] = [
    { id: "w1", user_id: "admin-id", balance: 0, currency: "XOF" },
    { id: "w2", user_id: "mod-id", balance: 0, currency: "XOF" },
    { id: "w3", user_id: "client-id", balance: 50000, currency: "XOF" },
    { id: "w4", user_id: "transporter-id", balance: 25000, currency: "XOF" }
  ]
  serverStorage[STORAGE_KEY_VEHICLES] = [
    { id: "v1", owner_id: "transporter-id", brand: "Mercedes", model: "Actros", plate_number: "AB-1234-CI", type: "truck", is_available: true, capacity_kg: 20000 }
  ]
  serverStorage[STORAGE_KEY_REQUESTS] = [
    { 
      id: "req-1", 
      client_id: "client-id", 
      assigned_transporter_id: "transporter-id", 
      transporter_id: "transporter-id",
      status: "completed", 
      pickup_city: "Dakar", 
      delivery_city: "Saint-Louis", 
      pickup_address: "Port de Dakar",
      delivery_address: "Centre ville Saint-Louis",
      estimated_price: 15000, 
      final_price: 15000, 
      estimated_cost: 15000,
      final_cost: 15000,
      platform_commission: 2250, 
      created_at: lastWeek, 
      updated_at: lastWeek,
      transport_type: "standard", 
      validated_by: "mod-id", 
      validated_at: lastWeek 
    },
    { 
      id: "req-2", 
      client_id: "client-id", 
      assigned_transporter_id: "transporter-id", 
      transporter_id: "transporter-id",
      status: "in_progress", 
      pickup_city: "Dakar", 
      delivery_city: "Thies", 
      pickup_address: "Diamniadio",
      delivery_address: "Quartier Escale Thies",
      estimated_price: 8000, 
      estimated_cost: 8000,
      created_at: now, 
      updated_at: now,
      transport_type: "express", 
      validated_by: "mod-id", 
      validated_at: now 
    },
    { 
      id: "req-3", 
      client_id: "client-id", 
      status: "pending", 
      pickup_city: "Mbour", 
      delivery_city: "Dakar", 
      pickup_address: "Saly",
      delivery_address: "Plateau Dakar",
      estimated_price: 12000, 
      estimated_cost: 12000,
      created_at: now, 
      updated_at: now,
      transport_type: "standard" 
    }
  ]
  serverStorage[STORAGE_KEY_DISPUTES] = [
    { id: "disp-1", transport_request_id: "req-1", opened_by: "client-id", assigned_moderator_id: "mod-id", assigned_moderator: "mod-id", title: "Retard de livraison", description: "Le colis est arrivé avec 2 jours de retard.", status: "open", priority: "medium", created_at: now, category: "delay" }
  ]
  serverStorage[STORAGE_KEY_TRANSACTIONS] = [
    { id: "tx-1", wallet_id: "w3", type: "credit", amount: 50000, description: "Dépôt initial", created_at: lastWeek },
    { id: "tx-2", wallet_id: "w4", type: "credit", amount: 25000, description: "Paiement course req-1", created_at: now }
  ]
}

const getStorage = (key: string) => {
  if (typeof window === "undefined") {
    // Server-side: use in-memory storage
    return serverStorage[key] || []
  }
  // Client-side: use localStorage
  const data = localStorage.getItem(key)
  if (!data) {
    const now = new Date().toISOString()
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    
    // Seed default data if empty
    if (key === STORAGE_KEY_USERS) {
      const defaults = [
        { id: "admin-id", email: "admin@example.com", password: "admin123", user_metadata: { role: "admin", first_name: "Admin", last_name: "System" } },
        { id: "mod-id", email: "mod@example.com", password: "mod123", user_metadata: { role: "moderator", first_name: "Mod", last_name: "User" } },
        { id: "client-id", email: "client@example.com", password: "client123", user_metadata: { role: "client", first_name: "Client", last_name: "Test" } },
        { id: "transporter-id", email: "transporter@example.com", password: "transporter123", user_metadata: { role: "transporter", first_name: "Transporteur", last_name: "Test" } }
      ]
      localStorage.setItem(key, JSON.stringify(defaults))
      return defaults
    }
    if (key === STORAGE_KEY_PROFILES) {
      const defaults = [
        { id: "admin-id", email: "admin@example.com", role: "admin", first_name: "Admin", last_name: "System", is_active: true, is_verified: true, created_at: lastWeek },
        { id: "mod-id", email: "mod@example.com", role: "moderator", first_name: "Mod", last_name: "User", is_active: true, is_verified: true, created_at: lastWeek },
        { id: "client-id", email: "client@example.com", role: "client", first_name: "Client", last_name: "Test", is_active: true, is_verified: true, created_at: lastWeek },
        { id: "transporter-id", email: "transporter@example.com", role: "transporter", first_name: "Transporteur", last_name: "Test", company_name: "Transport Express", is_active: true, is_verified: true, created_at: lastWeek }
      ]
      localStorage.setItem(key, JSON.stringify(defaults))
      return defaults
    }
    if (key === STORAGE_KEY_WALLETS) {
      const defaults = [
        { id: "w1", user_id: "admin-id", balance: 0, currency: "XOF" },
        { id: "w2", user_id: "mod-id", balance: 0, currency: "XOF" },
        { id: "w3", user_id: "client-id", balance: 50000, currency: "XOF" },
        { id: "w4", user_id: "transporter-id", balance: 25000, currency: "XOF" }
      ]
      localStorage.setItem(key, JSON.stringify(defaults))
      return defaults
    }
    if (key === STORAGE_KEY_VEHICLES) {
      const defaults = [
        { id: "v1", owner_id: "transporter-id", brand: "Mercedes", model: "Actros", plate_number: "AB-1234-CI", type: "truck", is_available: true, capacity_kg: 20000 }
      ]
      localStorage.setItem(key, JSON.stringify(defaults))
      return defaults
    }
    if (key === STORAGE_KEY_REQUESTS) {
      const defaults = [
        { 
          id: "req-1", 
          client_id: "client-id", 
          assigned_transporter_id: "transporter-id", 
          transporter_id: "transporter-id",
          status: "completed", 
          pickup_city: "Dakar", 
          delivery_city: "Saint-Louis", 
          pickup_address: "Port de Dakar",
          delivery_address: "Centre ville Saint-Louis",
          estimated_price: 15000, 
          final_price: 15000, 
          estimated_cost: 15000,
          final_cost: 15000,
          platform_commission: 2250, 
          created_at: lastWeek, 
          updated_at: lastWeek,
          transport_type: "standard", 
          validated_by: "mod-id", 
          validated_at: lastWeek 
        },
        { 
          id: "req-2", 
          client_id: "client-id", 
          assigned_transporter_id: "transporter-id", 
          transporter_id: "transporter-id",
          status: "in_progress", 
          pickup_city: "Dakar", 
          delivery_city: "Thies", 
          pickup_address: "Diamniadio",
          delivery_address: "Quartier Escale Thies",
          estimated_price: 8000, 
          estimated_cost: 8000,
          created_at: now, 
          updated_at: now,
          transport_type: "express", 
          validated_by: "mod-id", 
          validated_at: now 
        },
        { 
          id: "req-3", 
          client_id: "client-id", 
          status: "pending", 
          pickup_city: "Mbour", 
          delivery_city: "Dakar", 
          pickup_address: "Saly",
          delivery_address: "Plateau Dakar",
          estimated_price: 12000, 
          estimated_cost: 12000,
          created_at: now, 
          updated_at: now,
          transport_type: "standard" 
        }
      ]
      localStorage.setItem(key, JSON.stringify(defaults))
      return defaults
    }
    if (key === STORAGE_KEY_DISPUTES) {
      const defaults = [
        { id: "disp-1", transport_request_id: "req-1", opened_by: "client-id", assigned_moderator_id: "mod-id", assigned_moderator: "mod-id", title: "Retard de livraison", description: "Le colis est arrivé avec 2 jours de retard.", status: "open", priority: "medium", created_at: now, category: "delay" }
      ]
      localStorage.setItem(key, JSON.stringify(defaults))
      return defaults
    }
    if (key === STORAGE_KEY_TRANSACTIONS) {
      const defaults = [
        { id: "tx-1", wallet_id: "w3", type: "credit", amount: 50000, description: "Dépôt initial", created_at: lastWeek },
        { id: "tx-2", wallet_id: "w4", type: "credit", amount: 25000, description: "Paiement course req-1", created_at: now }
      ]
      localStorage.setItem(key, JSON.stringify(defaults))
      return defaults
    }
    return []
  }
  return JSON.parse(data)
}

const setStorage = (key: string, data: any) => {
  if (typeof window === "undefined") {
    // Server-side: update in-memory storage
    serverStorage[key] = data
    return
  }
  // Client-side: use localStorage
  localStorage.setItem(key, JSON.stringify(data))
}

const listeners: any[] = []

const notifyListeners = (event: string, session: any) => {
  listeners.forEach(l => l(event, session))
}

export const createMockClient = () => {
  return {
    auth: {
      signUp: async ({ email, password, options }: any) => {
        const users = getStorage(STORAGE_KEY_USERS)
        if (users.find((u: any) => u.email === email)) {
          return { data: { user: null }, error: { message: "User already registered" } }
        }
        const userId = Math.random().toString(36).substring(2, 15)
        const role = options?.data?.role || "client"
        const newUser = {
          id: userId,
          email,
          user_metadata: options?.data || {},
        }
        users.push({ ...newUser, password })
        setStorage(STORAGE_KEY_USERS, users)
        
        // Create profile automatically
        const profiles = getStorage(STORAGE_KEY_PROFILES)
        const newProfile = {
          id: userId,
          email,
          first_name: options?.data?.first_name || "",
          last_name: options?.data?.last_name || "",
          phone: null,
          role: role,
          company_name: role === "transporter" ? options?.data?.company_name || null : null,
          // In demo mode, auto-verify all users including transporters
          is_verified: true,
          is_active: true,
        }
        profiles.push(newProfile)
        setStorage(STORAGE_KEY_PROFILES, profiles)
        
        // Create wallet automatically
        const wallets = getStorage(STORAGE_KEY_WALLETS)
        wallets.push({
          user_id: userId,
          balance: 0,
          currency: "XOF",
        })
        setStorage(STORAGE_KEY_WALLETS, wallets)
        
        const session = { user: newUser, session: { access_token: "mock-token" } }
        setStorage(STORAGE_KEY_SESSION, session)
        // Set cookie for server-side access
        if (typeof document !== "undefined") {
          document.cookie = `mock_user_id=${userId}; path=/; max-age=86400`
        }
        notifyListeners('SIGNED_IN', session)
        
        return { data: { user: newUser, session: session.session }, error: null }
      },
      signInWithPassword: async ({ email, password }: any) => {
        const users = getStorage(STORAGE_KEY_USERS)
        const user = users.find((u: any) => u.email === email && u.password === password)
        if (!user) {
          return { data: { user: null, session: null }, error: { message: "Invalid login credentials" } }
        }
        const { password: _, ...userWithoutPassword } = user
        const session = { user: userWithoutPassword, session: { access_token: "mock-token" } }
        setStorage(STORAGE_KEY_SESSION, session)
        // Set cookie for server-side access
        if (typeof document !== "undefined") {
          document.cookie = `mock_user_id=${userWithoutPassword.id}; path=/; max-age=86400`
        }
        notifyListeners('SIGNED_IN', session)
        return { data: { user: userWithoutPassword, session: session.session }, error: null }
      },
      getSession: async () => {
        if (typeof window === "undefined") return { data: { session: null }, error: null }
        const session = JSON.parse(localStorage.getItem(STORAGE_KEY_SESSION) || 'null')
        return { data: { session: session?.session || null }, error: null }
      },
      getUser: async () => {
        if (typeof window === "undefined") {
          // Server-side: we can't access localStorage, so return null
          // The middleware will use the cookie to get user ID
          return { data: { user: null }, error: null }
        }
        // Client-side: use localStorage
        const session = JSON.parse(localStorage.getItem(STORAGE_KEY_SESSION) || 'null')
        return { data: { user: session?.user || null }, error: null }
      },
      signOut: async () => {
        localStorage.removeItem(STORAGE_KEY_SESSION)
        // Remove cookie
        if (typeof document !== "undefined") {
          document.cookie = "mock_user_id=; path=/; max-age=0"
        }
        notifyListeners('SIGNED_OUT', null)
        return { error: null }
      },
      onAuthStateChange: (callback: any) => {
        listeners.push(callback)
        return { data: { subscription: { unsubscribe: () => {
          const index = listeners.indexOf(callback)
          if (index !== -1) listeners.splice(index, 1)
        } } } }
      }
    },
    from: (table: string) => {
      const storageKey = table === 'profiles' ? STORAGE_KEY_PROFILES : 
                         table === 'wallets' ? STORAGE_KEY_WALLETS :
                         table === 'transport_requests' ? STORAGE_KEY_REQUESTS :
                         table === 'disputes' ? STORAGE_KEY_DISPUTES :
                         table === 'wallet_transactions' ? STORAGE_KEY_TRANSACTIONS :
                         table === 'vehicles' ? STORAGE_KEY_VEHICLES :
                         table === 'dispute_messages' ? STORAGE_KEY_DISPUTE_MESSAGES :
                         `mock_${table}`
      
      let filters: any[] = []
      let orderField: string | null = null
      let orderAsc: boolean = false
      let limitCount: number | null = null

      const execute = () => {
        let data = [...getStorage(storageKey)]
        
        // Apply filters
        filters.forEach(f => {
          if (f.type === 'eq') data = data.filter(i => i[f.field] === f.value)
          if (f.type === 'in') data = data.filter(i => f.values.includes(i[f.field]))
          if (f.type === 'gte') data = data.filter(i => i[f.field] >= f.value)
        })

        // Apply order
        if (orderField) {
          data.sort((a, b) => {
            const valA = a[orderField!]
            const valB = b[orderField!]
            if (valA < valB) return orderAsc ? -1 : 1
            if (valA > valB) return orderAsc ? 1 : -1
            return 0
          })
        }

        // Apply limit
        if (limitCount) data = data.slice(0, limitCount)

        // Handle joins (very basic)
        data = data.map(item => {
           const newItem = { ...item }
           // Simple profiles join for requests
           if (table === 'transport_requests') {
              const profiles = getStorage(STORAGE_KEY_PROFILES)
              const vehicles = getStorage(STORAGE_KEY_VEHICLES)
              newItem.client = profiles.find((p: any) => p.id === item.client_id)
              newItem.transporter = profiles.find((p: any) => p.id === item.assigned_transporter_id)
              newItem.vehicle = vehicles.find((v: any) => v.id === item.assigned_vehicle_id)
           }
           // Simple vehicles join for profiles
           if (table === 'profiles' && newItem.role === 'transporter') {
              const vehicles = getStorage(STORAGE_KEY_VEHICLES)
              newItem.vehicles = vehicles.filter((v: any) => v.owner_id === item.id)
           }
           // Simple wallet join for transactions
           if (table === 'wallet_transactions') {
              const wallets = getStorage(STORAGE_KEY_WALLETS)
              const profiles = getStorage(STORAGE_KEY_PROFILES)
              const wallet = wallets.find((w: any) => w.id === item.wallet_id)
              if (wallet) {
                newItem.wallet = { ...wallet, user: profiles.find((p: any) => p.id === wallet.user_id) }
              }
           }
           // Simple profile join for wallets
           if (table === 'wallets' && !newItem.profiles) {
              const profiles = getStorage(STORAGE_KEY_PROFILES)
              newItem.profiles = profiles.find((p: any) => p.id === item.user_id)
           }
           // Simple joins for disputes
           if (table === 'disputes') {
              const profiles = getStorage(STORAGE_KEY_PROFILES)
              const requests = getStorage(STORAGE_KEY_REQUESTS)
              newItem.opener = profiles.find((p: any) => p.id === item.opened_by)
              newItem.moderator = profiles.find((p: any) => p.id === item.assigned_moderator_id)
              newItem.request = requests.find((r: any) => r.id === item.transport_request_id)
           }
           return newItem
        })

        return data
      }

      const chain: any = {
        select: (columns?: string) => chain,
        eq: (field: string, value: any) => {
          filters.push({ type: 'eq', field, value })
          return chain
        },
        in: (field: string, values: any[]) => {
          filters.push({ type: 'in', field, values })
          return chain
        },
        gte: (field: string, value: any) => {
          filters.push({ type: 'gte', field, value })
          return chain
        },
        order: (field: string, { ascending = false } = {}) => {
          orderField = field
          orderAsc = ascending
          return chain
        },
        limit: (count: number) => {
          limitCount = count
          return chain
        },
        single: async () => {
          const data = execute()
          return { data: data[0] || null, error: null }
        },
        insert: (item: any) => {
          const data = getStorage(storageKey)
          const itemsToInsert = Array.isArray(item) 
            ? item.map(i => ({ id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString(), ...i })) 
            : [{ id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString(), ...item }]
          
          data.push(...itemsToInsert)
          setStorage(storageKey, data)
          console.log(`Mock DB: Inserted into ${table}`, itemsToInsert)
          
          const insertChain: any = {
            select: () => insertChain,
            single: async () => ({ data: itemsToInsert[0], error: null }),
            then: (resolve: any) => Promise.resolve({ data: itemsToInsert, error: null }).then(resolve)
          }
          return insertChain
        },
        update: (updates: any) => {
          let updateFilters: any[] = []
          const updateChain: any = {
            eq: (field: string, value: any) => {
              updateFilters.push({ field, value })
              return updateChain
            },
            select: () => updateChain,
            single: async () => {
              const data = getStorage(storageKey)
              const index = data.findIndex((i: any) => updateFilters.every(f => i[f.field] === f.value))
              if (index !== -1) {
                data[index] = { ...data[index], ...updates, updated_at: new Date().toISOString() }
                setStorage(storageKey, data)
                console.log(`Mock DB: Updated ${table}`, data[index])
                return { data: data[index], error: null }
              }
              return { data: null, error: null }
            },
            then: (resolve: any) => {
              const data = getStorage(storageKey)
              const indices = data.map((i: any, idx: number) => 
                updateFilters.every(f => i[f.field] === f.value) ? idx : -1
              ).filter(idx => idx !== -1)
              
              const updatedItems: any[] = []
              indices.forEach(idx => {
                data[idx] = { ...data[idx], ...updates, updated_at: new Date().toISOString() }
                updatedItems.push(data[idx])
              })
              
              if (indices.length > 0) {
                setStorage(storageKey, data)
                console.log(`Mock DB: Updated ${indices.length} items in ${table}`)
              }
              return Promise.resolve({ data: updatedItems, error: null }).then(resolve)
            }
          }
          return updateChain
        },
        delete: () => {
          let deleteFilters: any[] = []
          const deleteChain: any = {
            eq: (field: string, value: any) => {
              deleteFilters.push({ field, value })
              return deleteChain
            },
            then: (resolve: any) => {
              const data = getStorage(storageKey)
              const initialCount = data.length
              const filtered = data.filter((i: any) => 
                !deleteFilters.every(f => i[f.field] === f.value)
              )
              setStorage(storageKey, filtered)
              console.log(`Mock DB: Deleted ${initialCount - filtered.length} items from ${table}`)
              return Promise.resolve({ error: null }).then(resolve)
            }
          }
          return deleteChain
        },
        then: (resolve: any) => Promise.resolve({ data: execute(), error: null }).then(resolve)
      }
      return chain
    }
  } as any
}
