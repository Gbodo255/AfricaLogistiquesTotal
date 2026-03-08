-- Fix registration issues for A-Logistics
-- This script adds missing RLS policies for user registration

-- 1. Add policy to allow users to insert their own profile during registration
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Add policy to allow users to insert their own wallet during registration
DROP POLICY IF EXISTS "Users can insert their own wallet" ON wallets;
CREATE POLICY "Users can insert their own wallet" ON wallets
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- 3. Add policy to allow users to update their own wallet
DROP POLICY IF EXISTS "Users can update their own wallet" ON wallets;
CREATE POLICY "Users can update their own wallet" ON wallets
    FOR UPDATE USING (user_id = auth.uid());

-- 4. Add policy for admins to manage wallets
DROP POLICY IF EXISTS "Admins can manage all wallets" ON wallets;
CREATE POLICY "Admins can manage all wallets" ON wallets
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. Add policy for inserting wallet transactions
DROP POLICY IF EXISTS "Users can insert wallet transactions" ON wallet_transactions;
CREATE POLICY "Users can insert wallet transactions" ON wallet_transactions
    FOR INSERT WITH CHECK (
        wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid())
    );

-- 6. Add policy for admins to manage wallet transactions
DROP POLICY IF EXISTS "Admins can manage all wallet transactions" ON wallet_transactions;
CREATE POLICY "Admins can manage all wallet transactions" ON wallet_transactions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 7. Add policy for inserting notifications
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (TRUE);

-- 8. Add policy for deleting notifications
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;
CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (user_id = auth.uid());
