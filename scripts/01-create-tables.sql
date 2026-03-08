-- A-Logistics Database Schema
-- This script creates all tables needed for the logistics platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('client', 'transporter', 'moderator', 'admin');
CREATE TYPE request_status AS ENUM ('pending', 'validated', 'assigned', 'in_progress', 'completed', 'cancelled', 'disputed');
CREATE TYPE vehicle_type AS ENUM ('moto', 'car', 'van', 'truck', 'trailer');
CREATE TYPE transport_type AS ENUM ('standard', 'express', 'fragile', 'refrigerated', 'hazardous');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit', 'penalty', 'commission', 'refund', 'withdrawal');
CREATE TYPE dispute_status AS ENUM ('open', 'investigating', 'resolved', 'escalated');
CREATE TYPE notification_type AS ENUM ('request', 'payment', 'assignment', 'tracking', 'dispute', 'system');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    avatar_url TEXT,
    address TEXT,
    city TEXT,
    country TEXT NOT NULL DEFAULT 'Sénégal',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'XOF',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Wallet transactions table
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vehicles table
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
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    insurance_expiry DATE,
    inspection_expiry DATE,
    photo_url TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transport requests table
CREATE TABLE transport_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES profiles(id),
    transport_type transport_type NOT NULL DEFAULT 'standard',
    cargo_description TEXT NOT NULL,
    cargo_weight_kg DECIMAL(10, 2),
    cargo_volume_m3 DECIMAL(10, 2),
    cargo_value DECIMAL(15, 2),
    special_instructions TEXT,
    pickup_address TEXT NOT NULL,
    pickup_city TEXT NOT NULL,
    pickup_lat DECIMAL(10, 8),
    pickup_lng DECIMAL(11, 8),
    pickup_contact_name TEXT,
    pickup_contact_phone TEXT,
    pickup_date TIMESTAMPTZ NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_lat DECIMAL(10, 8),
    delivery_lng DECIMAL(11, 8),
    delivery_contact_name TEXT,
    delivery_contact_phone TEXT,
    delivery_date TIMESTAMPTZ,
    estimated_price DECIMAL(15, 2),
    final_price DECIMAL(15, 2),
    platform_commission DECIMAL(15, 2),
    transporter_earnings DECIMAL(15, 2),
    status request_status NOT NULL DEFAULT 'pending',
    assigned_transporter_id UUID REFERENCES profiles(id),
    assigned_vehicle_id UUID REFERENCES vehicles(id),
    assigned_by UUID REFERENCES profiles(id),
    assigned_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES profiles(id),
    validated_by UUID REFERENCES profiles(id),
    validated_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tracking updates table
CREATE TABLE tracking_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES transport_requests(id) ON DELETE CASCADE,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(6, 2),
    heading DECIMAL(5, 2),
    status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES transport_requests(id) ON DELETE CASCADE,
    rater_id UUID NOT NULL REFERENCES profiles(id),
    rated_id UUID NOT NULL REFERENCES profiles(id),
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(request_id, rater_id)
);

-- Disputes table
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES transport_requests(id) ON DELETE CASCADE,
    opened_by UUID NOT NULL REFERENCES profiles(id),
    assigned_moderator UUID REFERENCES profiles(id),
    status dispute_status NOT NULL DEFAULT 'open',
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dispute messages table
CREATE TABLE dispute_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Platform settings table
CREATE TABLE platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at);
CREATE INDEX idx_vehicles_owner_id ON vehicles(owner_id);
CREATE INDEX idx_vehicles_type ON vehicles(type);
CREATE INDEX idx_vehicles_is_available ON vehicles(is_available);
CREATE INDEX idx_transport_requests_client_id ON transport_requests(client_id);
CREATE INDEX idx_transport_requests_status ON transport_requests(status);
CREATE INDEX idx_transport_requests_assigned_transporter_id ON transport_requests(assigned_transporter_id);
CREATE INDEX idx_transport_requests_created_at ON transport_requests(created_at);
CREATE INDEX idx_tracking_updates_request_id ON tracking_updates(request_id);
CREATE INDEX idx_ratings_rated_id ON ratings(rated_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_assigned_moderator ON disputes(assigned_moderator);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
