-- Row Level Security (RLS) Policies for A-Logistics

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user is admin or moderator
CREATE OR REPLACE FUNCTION is_admin_or_moderator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- =====================
-- PROFILES POLICIES
-- =====================
-- Users can view all profiles (needed for displaying names, etc.)
CREATE POLICY "profiles_select_all" ON profiles
    FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "profiles_update_admin" ON profiles
    FOR UPDATE USING (is_admin());

-- Profiles are created via trigger, but allow insert for auth
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================
-- WALLETS POLICIES
-- =====================
-- Users can view their own wallet
CREATE POLICY "wallets_select_own" ON wallets
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all wallets
CREATE POLICY "wallets_select_admin" ON wallets
    FOR SELECT USING (is_admin());

-- Wallets are created via trigger
CREATE POLICY "wallets_insert_system" ON wallets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only system/admin can update wallets
CREATE POLICY "wallets_update_admin" ON wallets
    FOR UPDATE USING (is_admin());

-- =====================
-- WALLET TRANSACTIONS POLICIES
-- =====================
-- Users can view their own transactions
CREATE POLICY "wallet_transactions_select_own" ON wallet_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM wallets 
            WHERE wallets.id = wallet_transactions.wallet_id 
            AND wallets.user_id = auth.uid()
        )
    );

-- Admins can view all transactions
CREATE POLICY "wallet_transactions_select_admin" ON wallet_transactions
    FOR SELECT USING (is_admin());

-- Only admins/system can insert transactions
CREATE POLICY "wallet_transactions_insert_admin" ON wallet_transactions
    FOR INSERT WITH CHECK (is_admin_or_moderator());

-- =====================
-- VEHICLES POLICIES
-- =====================
-- Anyone can view verified vehicles
CREATE POLICY "vehicles_select_public" ON vehicles
    FOR SELECT USING (is_verified = true OR owner_id = auth.uid() OR is_admin_or_moderator());

-- Transporters can insert their own vehicles
CREATE POLICY "vehicles_insert_own" ON vehicles
    FOR INSERT WITH CHECK (
        auth.uid() = owner_id 
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'transporter'
        )
    );

-- Transporters can update their own vehicles
CREATE POLICY "vehicles_update_own" ON vehicles
    FOR UPDATE USING (auth.uid() = owner_id);

-- Admins can update any vehicle
CREATE POLICY "vehicles_update_admin" ON vehicles
    FOR UPDATE USING (is_admin_or_moderator());

-- Transporters can delete their own vehicles
CREATE POLICY "vehicles_delete_own" ON vehicles
    FOR DELETE USING (auth.uid() = owner_id);

-- =====================
-- TRANSPORT REQUESTS POLICIES
-- =====================
-- Clients can view their own requests
CREATE POLICY "requests_select_client" ON transport_requests
    FOR SELECT USING (client_id = auth.uid());

-- Transporters can view assigned requests
CREATE POLICY "requests_select_transporter" ON transport_requests
    FOR SELECT USING (assigned_transporter_id = auth.uid());

-- Moderators and admins can view all requests
CREATE POLICY "requests_select_staff" ON transport_requests
    FOR SELECT USING (is_admin_or_moderator());

-- Clients can insert requests
CREATE POLICY "requests_insert_client" ON transport_requests
    FOR INSERT WITH CHECK (
        auth.uid() = client_id 
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'client'
        )
    );

-- Clients can update their pending requests
CREATE POLICY "requests_update_client" ON transport_requests
    FOR UPDATE USING (
        client_id = auth.uid() 
        AND status = 'pending'
    );

-- Transporters can update their assigned requests
CREATE POLICY "requests_update_transporter" ON transport_requests
    FOR UPDATE USING (
        assigned_transporter_id = auth.uid()
        AND status IN ('assigned', 'in_progress')
    );

-- Staff can update any request
CREATE POLICY "requests_update_staff" ON transport_requests
    FOR UPDATE USING (is_admin_or_moderator());

-- =====================
-- TRACKING UPDATES POLICIES
-- =====================
-- Request participants can view tracking
CREATE POLICY "tracking_select_participants" ON tracking_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM transport_requests 
            WHERE transport_requests.id = tracking_updates.request_id 
            AND (
                transport_requests.client_id = auth.uid() 
                OR transport_requests.assigned_transporter_id = auth.uid()
            )
        )
    );

-- Staff can view all tracking
CREATE POLICY "tracking_select_staff" ON tracking_updates
    FOR SELECT USING (is_admin_or_moderator());

-- Transporters can insert tracking for their requests
CREATE POLICY "tracking_insert_transporter" ON tracking_updates
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM transport_requests 
            WHERE transport_requests.id = tracking_updates.request_id 
            AND transport_requests.assigned_transporter_id = auth.uid()
            AND transport_requests.status = 'in_progress'
        )
    );

-- =====================
-- RATINGS POLICIES
-- =====================
-- Anyone can view visible ratings
CREATE POLICY "ratings_select_public" ON ratings
    FOR SELECT USING (is_visible = true OR rater_id = auth.uid() OR is_admin_or_moderator());

-- Request participants can rate each other
CREATE POLICY "ratings_insert_participant" ON ratings
    FOR INSERT WITH CHECK (
        auth.uid() = rater_id
        AND EXISTS (
            SELECT 1 FROM transport_requests 
            WHERE transport_requests.id = ratings.request_id 
            AND transport_requests.status = 'completed'
            AND (
                transport_requests.client_id = auth.uid() 
                OR transport_requests.assigned_transporter_id = auth.uid()
            )
        )
    );

-- =====================
-- DISPUTES POLICIES
-- =====================
-- Participants can view their disputes
CREATE POLICY "disputes_select_participant" ON disputes
    FOR SELECT USING (
        opened_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM transport_requests 
            WHERE transport_requests.id = disputes.request_id 
            AND (
                transport_requests.client_id = auth.uid() 
                OR transport_requests.assigned_transporter_id = auth.uid()
            )
        )
    );

-- Moderators can view assigned disputes, admins can view all
CREATE POLICY "disputes_select_staff" ON disputes
    FOR SELECT USING (
        assigned_moderator = auth.uid() 
        OR is_admin()
    );

-- Request participants can open disputes
CREATE POLICY "disputes_insert_participant" ON disputes
    FOR INSERT WITH CHECK (
        auth.uid() = opened_by
        AND EXISTS (
            SELECT 1 FROM transport_requests 
            WHERE transport_requests.id = disputes.request_id 
            AND (
                transport_requests.client_id = auth.uid() 
                OR transport_requests.assigned_transporter_id = auth.uid()
            )
        )
    );

-- Staff can update disputes
CREATE POLICY "disputes_update_staff" ON disputes
    FOR UPDATE USING (
        assigned_moderator = auth.uid() 
        OR is_admin()
    );

-- =====================
-- DISPUTE MESSAGES POLICIES
-- =====================
-- Dispute participants can view messages
CREATE POLICY "dispute_messages_select" ON dispute_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM disputes 
            WHERE disputes.id = dispute_messages.dispute_id 
            AND (
                disputes.opened_by = auth.uid()
                OR disputes.assigned_moderator = auth.uid()
                OR is_admin()
            )
        )
    );

-- Dispute participants can send messages
CREATE POLICY "dispute_messages_insert" ON dispute_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
            SELECT 1 FROM disputes 
            WHERE disputes.id = dispute_messages.dispute_id 
            AND (
                disputes.opened_by = auth.uid()
                OR disputes.assigned_moderator = auth.uid()
                OR is_admin()
            )
        )
    );

-- =====================
-- NOTIFICATIONS POLICIES
-- =====================
-- Users can view their own notifications
CREATE POLICY "notifications_select_own" ON notifications
    FOR SELECT USING (user_id = auth.uid());

-- System/admins can insert notifications
CREATE POLICY "notifications_insert" ON notifications
    FOR INSERT WITH CHECK (is_admin_or_moderator() OR user_id = auth.uid());

-- Users can update (mark as read) their own notifications
CREATE POLICY "notifications_update_own" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "notifications_delete_own" ON notifications
    FOR DELETE USING (user_id = auth.uid());

-- =====================
-- AUDIT LOGS POLICIES
-- =====================
-- Only admins can view audit logs
CREATE POLICY "audit_logs_select_admin" ON audit_logs
    FOR SELECT USING (is_admin());

-- System can insert audit logs (via triggers)
CREATE POLICY "audit_logs_insert" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- =====================
-- PLATFORM SETTINGS POLICIES
-- =====================
-- Anyone can read settings
CREATE POLICY "settings_select_all" ON platform_settings
    FOR SELECT USING (true);

-- Only admins can modify settings
CREATE POLICY "settings_update_admin" ON platform_settings
    FOR UPDATE USING (is_admin());

CREATE POLICY "settings_insert_admin" ON platform_settings
    FOR INSERT WITH CHECK (is_admin());
