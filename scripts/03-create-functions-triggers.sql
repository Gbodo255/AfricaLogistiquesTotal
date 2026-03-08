-- Functions and Triggers for A-Logistics

-- =====================
-- PROFILE & WALLET CREATION
-- =====================
-- Function to create profile and wallet on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO profiles (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
    );
    
    -- Create wallet
    INSERT INTO wallets (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================
-- UPDATED_AT TRIGGERS
-- =====================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transport_requests_updated_at
    BEFORE UPDATE ON transport_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_disputes_updated_at
    BEFORE UPDATE ON disputes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- WALLET BALANCE UPDATE
-- =====================
-- Function to update wallet balance after transaction
CREATE OR REPLACE FUNCTION process_wallet_transaction()
RETURNS TRIGGER AS $$
DECLARE
    current_balance DECIMAL(15, 2);
    new_balance DECIMAL(15, 2);
BEGIN
    -- Get current wallet balance
    SELECT balance INTO current_balance
    FROM wallets
    WHERE id = NEW.wallet_id
    FOR UPDATE;
    
    -- Calculate new balance
    IF NEW.type IN ('credit', 'refund') THEN
        new_balance := current_balance + NEW.amount;
    ELSE
        new_balance := current_balance - NEW.amount;
    END IF;
    
    -- Prevent negative balance
    IF new_balance < 0 THEN
        RAISE EXCEPTION 'Solde insuffisant';
    END IF;
    
    -- Set balance values on transaction
    NEW.balance_before := current_balance;
    NEW.balance_after := new_balance;
    
    -- Update wallet balance
    UPDATE wallets
    SET balance = new_balance
    WHERE id = NEW.wallet_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER process_wallet_transaction_trigger
    BEFORE INSERT ON wallet_transactions
    FOR EACH ROW EXECUTE FUNCTION process_wallet_transaction();

-- =====================
-- REQUEST STATUS NOTIFICATIONS
-- =====================
-- Function to create notifications on request status change
CREATE OR REPLACE FUNCTION notify_request_status_change()
RETURNS TRIGGER AS $$
DECLARE
    client_name TEXT;
    transporter_name TEXT;
BEGIN
    -- Only proceed if status changed
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;
    
    -- Get names
    SELECT first_name || ' ' || last_name INTO client_name
    FROM profiles WHERE id = NEW.client_id;
    
    IF NEW.assigned_transporter_id IS NOT NULL THEN
        SELECT first_name || ' ' || last_name INTO transporter_name
        FROM profiles WHERE id = NEW.assigned_transporter_id;
    END IF;
    
    -- Notify based on new status
    CASE NEW.status
        WHEN 'validated' THEN
            INSERT INTO notifications (user_id, type, title, message, data)
            VALUES (
                NEW.client_id,
                'request',
                'Demande validée',
                'Votre demande de transport a été validée et est en attente d''assignation.',
                jsonb_build_object('request_id', NEW.id)
            );
            
        WHEN 'assigned' THEN
            -- Notify client
            INSERT INTO notifications (user_id, type, title, message, data)
            VALUES (
                NEW.client_id,
                'assignment',
                'Transporteur assigné',
                'Un transporteur a été assigné à votre demande.',
                jsonb_build_object('request_id', NEW.id, 'transporter_name', transporter_name)
            );
            -- Notify transporter
            INSERT INTO notifications (user_id, type, title, message, data)
            VALUES (
                NEW.assigned_transporter_id,
                'assignment',
                'Nouvelle mission',
                'Une nouvelle mission vous a été assignée.',
                jsonb_build_object('request_id', NEW.id)
            );
            
        WHEN 'in_progress' THEN
            INSERT INTO notifications (user_id, type, title, message, data)
            VALUES (
                NEW.client_id,
                'tracking',
                'Transport en cours',
                'Votre marchandise est en cours de livraison.',
                jsonb_build_object('request_id', NEW.id)
            );
            
        WHEN 'completed' THEN
            -- Notify client
            INSERT INTO notifications (user_id, type, title, message, data)
            VALUES (
                NEW.client_id,
                'request',
                'Livraison effectuée',
                'Votre marchandise a été livrée avec succès.',
                jsonb_build_object('request_id', NEW.id)
            );
            -- Notify transporter
            IF NEW.assigned_transporter_id IS NOT NULL THEN
                INSERT INTO notifications (user_id, type, title, message, data)
                VALUES (
                    NEW.assigned_transporter_id,
                    'payment',
                    'Mission terminée',
                    'Votre mission a été complétée. Le paiement sera crédité.',
                    jsonb_build_object('request_id', NEW.id, 'earnings', NEW.transporter_earnings)
                );
            END IF;
            
        WHEN 'cancelled' THEN
            -- Notify client
            INSERT INTO notifications (user_id, type, title, message, data)
            VALUES (
                NEW.client_id,
                'request',
                'Demande annulée',
                COALESCE(NEW.cancellation_reason, 'Votre demande a été annulée.'),
                jsonb_build_object('request_id', NEW.id)
            );
            -- Notify transporter if assigned
            IF NEW.assigned_transporter_id IS NOT NULL THEN
                INSERT INTO notifications (user_id, type, title, message, data)
                VALUES (
                    NEW.assigned_transporter_id,
                    'request',
                    'Mission annulée',
                    'La mission qui vous était assignée a été annulée.',
                    jsonb_build_object('request_id', NEW.id)
                );
            END IF;
            
        WHEN 'disputed' THEN
            -- Create notification for both parties
            INSERT INTO notifications (user_id, type, title, message, data)
            VALUES (
                NEW.client_id,
                'dispute',
                'Litige ouvert',
                'Un litige a été ouvert concernant cette demande.',
                jsonb_build_object('request_id', NEW.id)
            );
            IF NEW.assigned_transporter_id IS NOT NULL THEN
                INSERT INTO notifications (user_id, type, title, message, data)
                VALUES (
                    NEW.assigned_transporter_id,
                    'dispute',
                    'Litige ouvert',
                    'Un litige a été ouvert concernant cette mission.',
                    jsonb_build_object('request_id', NEW.id)
                );
            END IF;
    END CASE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER notify_request_status_change_trigger
    AFTER UPDATE ON transport_requests
    FOR EACH ROW EXECUTE FUNCTION notify_request_status_change();

-- =====================
-- AUDIT LOGGING
-- =====================
-- Function to log changes
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_data)
        VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_data, new_data)
        VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_data)
        VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit logging to important tables
CREATE TRIGGER audit_transport_requests
    AFTER INSERT OR UPDATE OR DELETE ON transport_requests
    FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_disputes
    AFTER INSERT OR UPDATE OR DELETE ON disputes
    FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_wallet_transactions
    AFTER INSERT ON wallet_transactions
    FOR EACH ROW EXECUTE FUNCTION log_audit();

-- =====================
-- STATISTICS FUNCTIONS
-- =====================
-- Function to get platform KPIs
CREATE OR REPLACE FUNCTION get_platform_kpis(period_start TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days')
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'users', json_build_object(
            'total', (SELECT COUNT(*) FROM profiles WHERE is_active = true),
            'new', (SELECT COUNT(*) FROM profiles WHERE created_at >= period_start),
            'clients', (SELECT COUNT(*) FROM profiles WHERE role = 'client' AND is_active = true),
            'transporters', (SELECT COUNT(*) FROM profiles WHERE role = 'transporter' AND is_active = true),
            'moderators', (SELECT COUNT(*) FROM profiles WHERE role = 'moderator' AND is_active = true)
        ),
        'requests', json_build_object(
            'total', (SELECT COUNT(*) FROM transport_requests WHERE created_at >= period_start),
            'pending', (SELECT COUNT(*) FROM transport_requests WHERE status = 'pending'),
            'in_progress', (SELECT COUNT(*) FROM transport_requests WHERE status = 'in_progress'),
            'completed', (SELECT COUNT(*) FROM transport_requests WHERE status = 'completed' AND completed_at >= period_start),
            'cancelled', (SELECT COUNT(*) FROM transport_requests WHERE status = 'cancelled' AND cancelled_at >= period_start)
        ),
        'revenue', json_build_object(
            'total_volume', COALESCE((SELECT SUM(final_price) FROM transport_requests WHERE status = 'completed' AND completed_at >= period_start), 0),
            'platform_commission', COALESCE((SELECT SUM(platform_commission) FROM transport_requests WHERE status = 'completed' AND completed_at >= period_start), 0),
            'transporter_earnings', COALESCE((SELECT SUM(transporter_earnings) FROM transport_requests WHERE status = 'completed' AND completed_at >= period_start), 0)
        ),
        'disputes', json_build_object(
            'total', (SELECT COUNT(*) FROM disputes WHERE created_at >= period_start),
            'open', (SELECT COUNT(*) FROM disputes WHERE status IN ('open', 'investigating')),
            'resolved', (SELECT COUNT(*) FROM disputes WHERE status = 'resolved' AND resolved_at >= period_start)
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    user_role_val user_role;
    result JSON;
BEGIN
    SELECT role INTO user_role_val FROM profiles WHERE id = user_uuid;
    
    IF user_role_val = 'client' THEN
        SELECT json_build_object(
            'total_requests', (SELECT COUNT(*) FROM transport_requests WHERE client_id = user_uuid),
            'completed_requests', (SELECT COUNT(*) FROM transport_requests WHERE client_id = user_uuid AND status = 'completed'),
            'pending_requests', (SELECT COUNT(*) FROM transport_requests WHERE client_id = user_uuid AND status = 'pending'),
            'cancelled_requests', (SELECT COUNT(*) FROM transport_requests WHERE client_id = user_uuid AND status = 'cancelled'),
            'total_spent', COALESCE((SELECT SUM(final_price) FROM transport_requests WHERE client_id = user_uuid AND status = 'completed'), 0),
            'average_rating', COALESCE((SELECT AVG(score) FROM ratings WHERE rated_id = user_uuid), 0)
        ) INTO result;
    ELSIF user_role_val = 'transporter' THEN
        SELECT json_build_object(
            'total_missions', (SELECT COUNT(*) FROM transport_requests WHERE assigned_transporter_id = user_uuid),
            'completed_missions', (SELECT COUNT(*) FROM transport_requests WHERE assigned_transporter_id = user_uuid AND status = 'completed'),
            'in_progress_missions', (SELECT COUNT(*) FROM transport_requests WHERE assigned_transporter_id = user_uuid AND status = 'in_progress'),
            'total_earnings', COALESCE((SELECT SUM(transporter_earnings) FROM transport_requests WHERE assigned_transporter_id = user_uuid AND status = 'completed'), 0),
            'average_rating', COALESCE((SELECT AVG(score) FROM ratings WHERE rated_id = user_uuid), 0),
            'vehicles_count', (SELECT COUNT(*) FROM vehicles WHERE owner_id = user_uuid)
        ) INTO result;
    ELSIF user_role_val = 'moderator' THEN
        SELECT json_build_object(
            'requests_validated', (SELECT COUNT(*) FROM transport_requests WHERE validated_by = user_uuid),
            'requests_assigned', (SELECT COUNT(*) FROM transport_requests WHERE assigned_by = user_uuid),
            'disputes_handled', (SELECT COUNT(*) FROM disputes WHERE assigned_moderator = user_uuid),
            'disputes_resolved', (SELECT COUNT(*) FROM disputes WHERE assigned_moderator = user_uuid AND status = 'resolved')
        ) INTO result;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
