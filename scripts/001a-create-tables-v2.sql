-- A-Logistics Database Schema
-- Version 1.0 - Following Cahier des Charges

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing types if they exist to recreate them
DO $$ BEGIN
    DROP TYPE IF EXISTS user_role CASCADE;
    DROP TYPE IF EXISTS request_status CASCADE;
    DROP TYPE IF EXISTS vehicle_type CASCADE;
    DROP TYPE IF EXISTS transport_type CASCADE;
    DROP TYPE IF EXISTS transaction_type CASCADE;
    DROP TYPE IF EXISTS dispute_status CASCADE;
    DROP TYPE IF EXISTS notification_type CASCADE;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Enum types
CREATE TYPE user_role AS ENUM ('client', 'transporter', 'moderator', 'admin');
CREATE TYPE request_status AS ENUM ('pending', 'validated', 'assigned', 'in_progress', 'completed', 'cancelled', 'disputed');
CREATE TYPE vehicle_type AS ENUM ('moto', 'car', 'van', 'truck', 'trailer');
CREATE TYPE transport_type AS ENUM ('standard', 'express', 'fragile', 'refrigerated', 'hazardous');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit', 'penalty', 'commission', 'refund', 'withdrawal');
CREATE TYPE dispute_status AS ENUM ('open', 'investigating', 'resolved', 'escalated');
CREATE TYPE notification_type AS ENUM ('request', 'payment', 'assignment', 'tracking', 'dispute', 'system');

-- Drop existing tables if they exist
DROP TABLE IF EXISTS platform_settings CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS dispute_messages CASCADE;
DROP TABLE IF EXISTS disputes CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS tracking_updates CASCADE;
DROP TABLE IF EXISTS transport_requests CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    avatar_url TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Benin',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets table (for clients and transporters)
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency TEXT DEFAULT 'XOF',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Wallet transactions history
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    balance_before DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    reference TEXT,
    description TEXT,
    related_request_id UUID,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles table (for transporters)
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type vehicle_type NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    plate_number TEXT NOT NULL UNIQUE,
    year INTEGER,
    capacity_kg DECIMAL(10, 2),
    capacity_m3 DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    insurance_expiry DATE,
    inspection_expiry DATE,
    photo_url TEXT,
    documents JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transport requests table
CREATE TABLE transport_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Request details
    transport_type transport_type NOT NULL DEFAULT 'standard',
    cargo_description TEXT NOT NULL,
    cargo_weight_kg DECIMAL(10, 2),
    cargo_volume_m3 DECIMAL(10, 2),
    cargo_value DECIMAL(15, 2),
    special_instructions TEXT,
    
    -- Pickup location
    pickup_address TEXT NOT NULL,
    pickup_city TEXT NOT NULL,
    pickup_lat DECIMAL(10, 8),
    pickup_lng DECIMAL(11, 8),
    pickup_contact_name TEXT,
    pickup_contact_phone TEXT,
    pickup_date TIMESTAMPTZ NOT NULL,
    
    -- Delivery location
    delivery_address TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_lat DECIMAL(10, 8),
    delivery_lng DECIMAL(11, 8),
    delivery_contact_name TEXT,
    delivery_contact_phone TEXT,
    delivery_date TIMESTAMPTZ,
    
    -- Pricing
    estimated_price DECIMAL(15, 2),
    final_price DECIMAL(15, 2),
    platform_commission DECIMAL(15, 2),
    transporter_earnings DECIMAL(15, 2),
    
    -- Status
    status request_status DEFAULT 'pending',
    
    -- Assignment
    assigned_transporter_id UUID REFERENCES profiles(id),
    assigned_vehicle_id UUID REFERENCES vehicles(id),
    assigned_by UUID REFERENCES profiles(id),
    assigned_at TIMESTAMPTZ,
    
    -- Execution
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES profiles(id),
    
    -- Moderator
    validated_by UUID REFERENCES profiles(id),
    validated_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time tracking for transport requests (A-Tracking)
CREATE TABLE tracking_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES transport_requests(id) ON DELETE CASCADE,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(6, 2),
    heading DECIMAL(5, 2),
    status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ratings and reviews
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES transport_requests(id) ON DELETE CASCADE,
    rater_id UUID NOT NULL REFERENCES profiles(id),
    rated_id UUID NOT NULL REFERENCES profiles(id),
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(request_id, rater_id)
);

-- Disputes
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES transport_requests(id),
    opened_by UUID NOT NULL REFERENCES profiles(id),
    assigned_moderator UUID REFERENCES profiles(id),
    status dispute_status DEFAULT 'open',
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispute messages
CREATE TABLE dispute_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs (for moderator/admin actions)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform settings/configuration
CREATE TABLE platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default platform settings
INSERT INTO platform_settings (key, value, description) VALUES
    ('commission_rate', '{"standard": 0.15, "express": 0.18, "fragile": 0.17, "refrigerated": 0.20, "hazardous": 0.22}', 'Commission rates by transport type'),
    ('cancellation_penalty', '{"after_assignment": 0.10}', 'Cancellation penalty rates'),
    ('minimum_wallet_balance', '{"client": 5000, "transporter": 0}', 'Minimum wallet balance requirements');

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_wallets_user ON wallets(user_id);
CREATE INDEX idx_wallet_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX idx_transport_requests_client ON transport_requests(client_id);
CREATE INDEX idx_transport_requests_transporter ON transport_requests(assigned_transporter_id);
CREATE INDEX idx_transport_requests_status ON transport_requests(status);
CREATE INDEX idx_tracking_request ON tracking_updates(request_id);
CREATE INDEX idx_ratings_rated ON ratings(rated_id);
CREATE INDEX idx_disputes_request ON disputes(request_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
