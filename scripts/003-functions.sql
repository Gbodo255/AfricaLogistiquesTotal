-- Database functions for A-Logistics

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
    
    -- Create wallet for clients and transporters
    IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client') IN ('client', 'transporter') THEN
        INSERT INTO wallets (user_id) VALUES (NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to credit wallet
CREATE OR REPLACE FUNCTION credit_wallet(
    p_user_id UUID,
    p_amount DECIMAL,
    p_reference TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_created_by UUID DEFAULT NULL
)
RETURNS wallet_transactions AS $$
DECLARE
    v_wallet wallets;
    v_transaction wallet_transactions;
BEGIN
    -- Lock the wallet row
    SELECT * INTO v_wallet FROM wallets WHERE user_id = p_user_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
    END IF;
    
    -- Update wallet balance
    UPDATE wallets
    SET balance = balance + p_amount, updated_at = NOW()
    WHERE id = v_wallet.id;
    
    -- Create transaction record
    INSERT INTO wallet_transactions (wallet_id, type, amount, balance_before, balance_after, reference, description, created_by)
    VALUES (v_wallet.id, 'credit', p_amount, v_wallet.balance, v_wallet.balance + p_amount, p_reference, p_description, p_created_by)
    RETURNING * INTO v_transaction;
    
    RETURN v_transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to debit wallet
CREATE OR REPLACE FUNCTION debit_wallet(
    p_user_id UUID,
    p_amount DECIMAL,
    p_reference TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_request_id UUID DEFAULT NULL,
    p_created_by UUID DEFAULT NULL
)
RETURNS wallet_transactions AS $$
DECLARE
    v_wallet wallets;
    v_transaction wallet_transactions;
BEGIN
    -- Lock the wallet row
    SELECT * INTO v_wallet FROM wallets WHERE user_id = p_user_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
    END IF;
    
    IF v_wallet.balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance. Available: %, Required: %', v_wallet.balance, p_amount;
    END IF;
    
    -- Update wallet balance
    UPDATE wallets
    SET balance = balance - p_amount, updated_at = NOW()
    WHERE id = v_wallet.id;
    
    -- Create transaction record
    INSERT INTO wallet_transactions (wallet_id, type, amount, balance_before, balance_after, reference, description, related_request_id, created_by)
    VALUES (v_wallet.id, 'debit', p_amount, v_wallet.balance, v_wallet.balance - p_amount, p_reference, p_description, p_request_id, p_created_by)
    RETURNING * INTO v_transaction;
    
    RETURN v_transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to apply cancellation penalty (10%)
CREATE OR REPLACE FUNCTION apply_cancellation_penalty(
    p_request_id UUID,
    p_cancelled_by UUID
)
RETURNS wallet_transactions AS $$
DECLARE
    v_request transport_requests;
    v_penalty DECIMAL;
    v_transaction wallet_transactions;
BEGIN
    -- Get request details
    SELECT * INTO v_request FROM transport_requests WHERE id = p_request_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found';
    END IF;
    
    -- Only apply penalty if request was assigned and transporter started moving
    IF v_request.status NOT IN ('assigned', 'in_progress') THEN
        RAISE EXCEPTION 'Penalty only applies to assigned or in-progress requests';
    END IF;
    
    -- Calculate 10% penalty
    v_penalty := COALESCE(v_request.final_price, v_request.estimated_price, 0) * 0.10;
    
    IF v_penalty > 0 THEN
        -- Debit penalty from client wallet
        SELECT * INTO v_transaction FROM debit_wallet(
            v_request.client_id,
            v_penalty,
            'PENALTY-' || p_request_id::TEXT,
            'Pénalité d''annulation - 10% du montant de la commande',
            p_request_id,
            p_cancelled_by
        );
        
        -- Update transaction type to penalty
        UPDATE wallet_transactions SET type = 'penalty' WHERE id = v_transaction.id;
    END IF;
    
    RETURN v_transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete transport and pay transporter
CREATE OR REPLACE FUNCTION complete_transport(
    p_request_id UUID,
    p_completed_by UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_request transport_requests;
    v_commission_rate DECIMAL;
    v_commission DECIMAL;
    v_transporter_earnings DECIMAL;
BEGIN
    -- Get request
    SELECT * INTO v_request FROM transport_requests WHERE id = p_request_id FOR UPDATE;
    
    IF NOT FOUND OR v_request.status != 'in_progress' THEN
        RAISE EXCEPTION 'Invalid request state';
    END IF;
    
    -- Get commission rate
    SELECT (value->>v_request.transport_type::TEXT)::DECIMAL INTO v_commission_rate
    FROM platform_settings WHERE key = 'commission_rate';
    
    v_commission_rate := COALESCE(v_commission_rate, 0.15);
    
    -- Calculate amounts
    v_commission := COALESCE(v_request.final_price, v_request.estimated_price, 0) * v_commission_rate;
    v_transporter_earnings := COALESCE(v_request.final_price, v_request.estimated_price, 0) - v_commission;
    
    -- Credit transporter wallet
    PERFORM credit_wallet(
        v_request.assigned_transporter_id,
        v_transporter_earnings,
        'EARNING-' || p_request_id::TEXT,
        'Paiement prestation transport',
        p_completed_by
    );
    
    -- Update request
    UPDATE transport_requests
    SET 
        status = 'completed',
        completed_at = NOW(),
        platform_commission = v_commission,
        transporter_earnings = v_transporter_earnings,
        updated_at = NOW()
    WHERE id = p_request_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    v_profile profiles;
    v_stats JSON;
BEGIN
    SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
    
    IF v_profile.role = 'client' THEN
        SELECT json_build_object(
            'total_requests', COUNT(*),
            'completed_requests', COUNT(*) FILTER (WHERE status = 'completed'),
            'pending_requests', COUNT(*) FILTER (WHERE status = 'pending'),
            'cancelled_requests', COUNT(*) FILTER (WHERE status = 'cancelled'),
            'total_spent', COALESCE(SUM(final_price) FILTER (WHERE status = 'completed'), 0),
            'average_rating', (
                SELECT COALESCE(AVG(score), 0) FROM ratings WHERE rated_id = p_user_id
            )
        ) INTO v_stats
        FROM transport_requests WHERE client_id = p_user_id;
    ELSIF v_profile.role = 'transporter' THEN
        SELECT json_build_object(
            'total_missions', COUNT(*),
            'completed_missions', COUNT(*) FILTER (WHERE status = 'completed'),
            'in_progress_missions', COUNT(*) FILTER (WHERE status = 'in_progress'),
            'total_earnings', COALESCE(SUM(transporter_earnings) FILTER (WHERE status = 'completed'), 0),
            'average_rating', (
                SELECT COALESCE(AVG(score), 0) FROM ratings WHERE rated_id = p_user_id
            ),
            'vehicles_count', (
                SELECT COUNT(*) FROM vehicles WHERE owner_id = p_user_id
            )
        ) INTO v_stats
        FROM transport_requests WHERE assigned_transporter_id = p_user_id;
    ELSIF v_profile.role = 'moderator' THEN
        SELECT json_build_object(
            'requests_validated', COUNT(*) FILTER (WHERE validated_by = p_user_id),
            'requests_assigned', COUNT(*) FILTER (WHERE assigned_by = p_user_id),
            'disputes_handled', (
                SELECT COUNT(*) FROM disputes WHERE assigned_moderator = p_user_id
            ),
            'disputes_resolved', (
                SELECT COUNT(*) FROM disputes WHERE assigned_moderator = p_user_id AND status = 'resolved'
            )
        ) INTO v_stats
        FROM transport_requests;
    ELSE
        SELECT json_build_object(
            'total_users', (SELECT COUNT(*) FROM profiles),
            'total_clients', (SELECT COUNT(*) FROM profiles WHERE role = 'client'),
            'total_transporters', (SELECT COUNT(*) FROM profiles WHERE role = 'transporter'),
            'total_requests', (SELECT COUNT(*) FROM transport_requests),
            'completed_requests', (SELECT COUNT(*) FROM transport_requests WHERE status = 'completed'),
            'total_revenue', (SELECT COALESCE(SUM(platform_commission), 0) FROM transport_requests WHERE status = 'completed'),
            'active_disputes', (SELECT COUNT(*) FROM disputes WHERE status IN ('open', 'investigating'))
        ) INTO v_stats;
    END IF;
    
    RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get platform KPIs (for admin dashboard)
CREATE OR REPLACE FUNCTION get_platform_kpis(p_period TEXT DEFAULT 'month')
RETURNS JSON AS $$
DECLARE
    v_start_date TIMESTAMPTZ;
    v_kpis JSON;
BEGIN
    v_start_date := CASE p_period
        WHEN 'day' THEN NOW() - INTERVAL '1 day'
        WHEN 'week' THEN NOW() - INTERVAL '1 week'
        WHEN 'month' THEN NOW() - INTERVAL '1 month'
        WHEN 'year' THEN NOW() - INTERVAL '1 year'
        ELSE NOW() - INTERVAL '1 month'
    END;
    
    SELECT json_build_object(
        'period', p_period,
        'users', json_build_object(
            'total', (SELECT COUNT(*) FROM profiles),
            'new', (SELECT COUNT(*) FROM profiles WHERE created_at >= v_start_date),
            'by_role', (
                SELECT json_object_agg(role, cnt)
                FROM (SELECT role, COUNT(*) as cnt FROM profiles GROUP BY role) sub
            )
        ),
        'requests', json_build_object(
            'total', (SELECT COUNT(*) FROM transport_requests WHERE created_at >= v_start_date),
            'completed', (SELECT COUNT(*) FROM transport_requests WHERE status = 'completed' AND completed_at >= v_start_date),
            'pending', (SELECT COUNT(*) FROM transport_requests WHERE status = 'pending'),
            'by_status', (
                SELECT json_object_agg(status, cnt)
                FROM (SELECT status, COUNT(*) as cnt FROM transport_requests WHERE created_at >= v_start_date GROUP BY status) sub
            )
        ),
        'revenue', json_build_object(
            'total_volume', (SELECT COALESCE(SUM(final_price), 0) FROM transport_requests WHERE status = 'completed' AND completed_at >= v_start_date),
            'platform_commission', (SELECT COALESCE(SUM(platform_commission), 0) FROM transport_requests WHERE status = 'completed' AND completed_at >= v_start_date),
            'transporter_earnings', (SELECT COALESCE(SUM(transporter_earnings), 0) FROM transport_requests WHERE status = 'completed' AND completed_at >= v_start_date)
        ),
        'disputes', json_build_object(
            'total', (SELECT COUNT(*) FROM disputes WHERE created_at >= v_start_date),
            'open', (SELECT COUNT(*) FROM disputes WHERE status = 'open'),
            'resolved', (SELECT COUNT(*) FROM disputes WHERE status = 'resolved' AND resolved_at >= v_start_date)
        ),
        'wallets', json_build_object(
            'total_balance_clients', (
                SELECT COALESCE(SUM(w.balance), 0) FROM wallets w
                JOIN profiles p ON w.user_id = p.id WHERE p.role = 'client'
            ),
            'total_balance_transporters', (
                SELECT COALESCE(SUM(w.balance), 0) FROM wallets w
                JOIN profiles p ON w.user_id = p.id WHERE p.role = 'transporter'
            )
        )
    ) INTO v_kpis;
    
    RETURN v_kpis;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
