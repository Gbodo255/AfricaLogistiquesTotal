-- Row Level Security Policies for A-Logistics

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
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (SELECT role FROM profiles WHERE id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Moderators and admins can view all profiles" ON profiles
    FOR SELECT USING (
        get_user_role(auth.uid()) IN ('moderator', 'admin')
    );

CREATE POLICY "Admins can update any profile" ON profiles
    FOR UPDATE USING (
        get_user_role(auth.uid()) = 'admin'
    );

CREATE POLICY "Public profiles for ratings/reviews" ON profiles
    FOR SELECT USING (
        -- Allow viewing basic info of users involved in same requests
        EXISTS (
            SELECT 1 FROM transport_requests tr
            WHERE (tr.client_id = profiles.id OR tr.assigned_transporter_id = profiles.id)
            AND (tr.client_id = auth.uid() OR tr.assigned_transporter_id = auth.uid())
        )
    );

-- Wallets policies
CREATE POLICY "Users can view their own wallet" ON wallets
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Moderators and admins can view all wallets" ON wallets
    FOR SELECT USING (
        get_user_role(auth.uid()) IN ('moderator', 'admin')
    );

-- Wallet transactions policies
CREATE POLICY "Users can view their own transactions" ON wallet_transactions
    FOR SELECT USING (
        wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid())
    );

CREATE POLICY "Moderators and admins can view all transactions" ON wallet_transactions
    FOR SELECT USING (
        get_user_role(auth.uid()) IN ('moderator', 'admin')
    );

-- Vehicles policies
CREATE POLICY "Transporters can manage their own vehicles" ON vehicles
    FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Public can view available vehicles" ON vehicles
    FOR SELECT USING (is_available = TRUE AND is_verified = TRUE);

CREATE POLICY "Moderators and admins can view all vehicles" ON vehicles
    FOR SELECT USING (
        get_user_role(auth.uid()) IN ('moderator', 'admin')
    );

CREATE POLICY "Moderators can verify vehicles" ON vehicles
    FOR UPDATE USING (
        get_user_role(auth.uid()) IN ('moderator', 'admin')
    );

-- Transport requests policies
CREATE POLICY "Clients can view their own requests" ON transport_requests
    FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Clients can create requests" ON transport_requests
    FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update pending requests" ON transport_requests
    FOR UPDATE USING (
        client_id = auth.uid() AND status = 'pending'
    );

CREATE POLICY "Transporters can view assigned requests" ON transport_requests
    FOR SELECT USING (assigned_transporter_id = auth.uid());

CREATE POLICY "Transporters can update in-progress requests" ON transport_requests
    FOR UPDATE USING (
        assigned_transporter_id = auth.uid() AND status IN ('assigned', 'in_progress')
    );

CREATE POLICY "Moderators can view all requests" ON transport_requests
    FOR SELECT USING (
        get_user_role(auth.uid()) IN ('moderator', 'admin')
    );

CREATE POLICY "Moderators can update requests" ON transport_requests
    FOR UPDATE USING (
        get_user_role(auth.uid()) IN ('moderator', 'admin')
    );

-- Tracking updates policies
CREATE POLICY "Request participants can view tracking" ON tracking_updates
    FOR SELECT USING (
        request_id IN (
            SELECT id FROM transport_requests
            WHERE client_id = auth.uid() OR assigned_transporter_id = auth.uid()
        )
    );

CREATE POLICY "Transporters can add tracking updates" ON tracking_updates
    FOR INSERT WITH CHECK (
        request_id IN (
            SELECT id FROM transport_requests
            WHERE assigned_transporter_id = auth.uid() AND status = 'in_progress'
        )
    );

CREATE POLICY "Moderators and admins can view all tracking" ON tracking_updates
    FOR SELECT USING (
        get_user_role(auth.uid()) IN ('moderator', 'admin')
    );

-- Ratings policies
CREATE POLICY "Users can view ratings" ON ratings
    FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Users can create ratings for completed requests" ON ratings
    FOR INSERT WITH CHECK (
        rater_id = auth.uid() AND
        request_id IN (
            SELECT id FROM transport_requests
            WHERE status = 'completed'
            AND (client_id = auth.uid() OR assigned_transporter_id = auth.uid())
        )
    );

-- Disputes policies
CREATE POLICY "Dispute participants can view disputes" ON disputes
    FOR SELECT USING (
        opened_by = auth.uid() OR
        assigned_moderator = auth.uid() OR
        request_id IN (
            SELECT id FROM transport_requests
            WHERE client_id = auth.uid() OR assigned_transporter_id = auth.uid()
        )
    );

CREATE POLICY "Users can create disputes" ON disputes
    FOR INSERT WITH CHECK (opened_by = auth.uid());

CREATE POLICY "Moderators can view all disputes" ON disputes
    FOR SELECT USING (
        get_user_role(auth.uid()) IN ('moderator', 'admin')
    );

CREATE POLICY "Moderators can update disputes" ON disputes
    FOR UPDATE USING (
        get_user_role(auth.uid()) IN ('moderator', 'admin')
    );

-- Dispute messages policies
CREATE POLICY "Dispute participants can view messages" ON dispute_messages
    FOR SELECT USING (
        dispute_id IN (
            SELECT id FROM disputes WHERE
            opened_by = auth.uid() OR
            assigned_moderator = auth.uid() OR
            request_id IN (
                SELECT id FROM transport_requests
                WHERE client_id = auth.uid() OR assigned_transporter_id = auth.uid()
            )
        )
    );

CREATE POLICY "Dispute participants can send messages" ON dispute_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        dispute_id IN (
            SELECT id FROM disputes WHERE
            opened_by = auth.uid() OR
            assigned_moderator = auth.uid() OR
            request_id IN (
                SELECT id FROM transport_requests
                WHERE client_id = auth.uid() OR assigned_transporter_id = auth.uid()
            )
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        get_user_role(auth.uid()) = 'admin'
    );

-- Platform settings policies
CREATE POLICY "Anyone can read settings" ON platform_settings
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can update settings" ON platform_settings
    FOR UPDATE USING (
        get_user_role(auth.uid()) = 'admin'
    );
