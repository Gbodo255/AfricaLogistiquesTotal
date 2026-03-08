-- Script pour créer des comptes Admin et Modérateur
-- IMPORTANT: Exécutez ce script dans l'éditeur SQL de Supabase
-- OU créez d'abord les utilisateurs via l'interface Supabase Auth, puis exécutez ce script

-- ============================================
-- ÉTAPE 1: Créer les utilisateurs dans Auth
-- ============================================
-- Vous devez d'abord créer les utilisateurs via:
-- 1. L'interface Supabase Dashboard > Authentication > Users > Add User
-- 2. Ou via l'API Supabase Admin
-- 3. Ou via l'interface d'inscription de l'application

-- ============================================
-- ÉTAPE 2: Mettre à jour les rôles dans profiles
-- ============================================

-- Option 1: Si vous connaissez l'email exact
-- Pour créer un MODÉRATEUR
UPDATE profiles 
SET 
    role = 'moderator',
    is_verified = true,
    is_active = true,
    updated_at = NOW()
WHERE email = 'moderator@a-logistics.com';

-- Pour créer un ADMINISTRATEUR
UPDATE profiles 
SET 
    role = 'admin',
    is_verified = true,
    is_active = true,
    updated_at = NOW()
WHERE email = 'admin@a-logistics.com';

-- ============================================
-- ÉTAPE 3: Vérification
-- ============================================

-- Afficher tous les utilisateurs avec leurs rôles
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    is_verified,
    is_active,
    created_at
FROM profiles 
ORDER BY 
    CASE role
        WHEN 'admin' THEN 1
        WHEN 'moderator' THEN 2
        WHEN 'transporter' THEN 3
        WHEN 'client' THEN 4
    END,
    created_at DESC;

-- ============================================
-- ÉTAPE 4: Créer des portefeuilles si manquants
-- ============================================

-- Créer des portefeuilles pour les admins/moderateurs (optionnel)
INSERT INTO wallets (user_id, balance, currency, is_active)
SELECT 
    id,
    0,
    'XOF',
    true
FROM profiles
WHERE role IN ('admin', 'moderator')
AND id NOT IN (SELECT user_id FROM wallets)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- BONUS: Fonction pour promouvoir un utilisateur
-- ============================================

CREATE OR REPLACE FUNCTION promote_user_to_role(
    user_email TEXT,
    new_role user_role
) RETURNS BOOLEAN AS $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    -- Vérifier que l'utilisateur existe
    SELECT EXISTS(SELECT 1 FROM profiles WHERE email = user_email) INTO user_exists;
    
    IF NOT user_exists THEN
        RAISE EXCEPTION 'Utilisateur avec email % non trouvé', user_email;
    END IF;
    
    -- Vérifier que le rôle est valide
    IF new_role NOT IN ('admin', 'moderator', 'transporter', 'client') THEN
        RAISE EXCEPTION 'Rôle invalide: %', new_role;
    END IF;
    
    -- Mettre à jour le rôle
    UPDATE profiles
    SET 
        role = new_role,
        is_verified = true,
        is_active = true,
        updated_at = NOW()
    WHERE email = user_email;
    
    -- Logger l'action
    INSERT INTO audit_logs (user_id, action, entity_type, new_data)
    SELECT 
        id,
        'role_promotion',
        'profile',
        jsonb_build_object('new_role', new_role, 'email', user_email)
    FROM profiles
    WHERE email = user_email;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Utilisation de la fonction:
-- SELECT promote_user_to_role('admin@a-logistics.com', 'admin');
-- SELECT promote_user_to_role('moderator@a-logistics.com', 'moderator');

-- ============================================
-- BONUS: Fonction pour créer un compte complet
-- ============================================

CREATE OR REPLACE FUNCTION create_admin_or_moderator_account(
    user_email TEXT,
    user_password TEXT,
    first_name TEXT,
    last_name TEXT,
    user_role user_role,
    phone TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Note: Cette fonction nécessite les privilèges admin Supabase
    -- La création d'utilisateur Auth doit être faite via l'API Admin
    
    -- Vérifier que le rôle est admin ou moderator
    IF user_role NOT IN ('admin', 'moderator') THEN
        RAISE EXCEPTION 'Cette fonction ne peut créer que des admins ou modérateurs';
    END IF;
    
    -- Générer un UUID (sera remplacé par l'ID réel de Supabase Auth)
    new_user_id := gen_random_uuid();
    
    -- Créer le profil (l'ID sera mis à jour quand l'utilisateur Auth sera créé)
    INSERT INTO profiles (
        id,
        email,
        first_name,
        last_name,
        role,
        phone,
        is_verified,
        is_active
    ) VALUES (
        new_user_id,
        user_email,
        first_name,
        last_name,
        user_role,
        phone,
        true,
        true
    );
    
    -- Créer le portefeuille
    INSERT INTO wallets (user_id, balance, currency, is_active)
    VALUES (new_user_id, 0, 'XOF', true);
    
    -- Logger l'action
    INSERT INTO audit_logs (action, entity_type, entity_id, new_data)
    VALUES (
        'account_creation',
        'profile',
        new_user_id,
        jsonb_build_object('email', user_email, 'role', user_role)
    );
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- NOTES IMPORTANTES
-- ============================================
-- 1. Les utilisateurs doivent être créés dans Supabase Auth AVANT d'exécuter ce script
-- 2. L'ID dans profiles doit correspondre à l'ID dans auth.users
-- 3. Utilisez l'interface Supabase Dashboard pour créer les utilisateurs Auth
-- 4. Ensuite, exécutez les UPDATE pour définir les rôles
-- 5. Pour la production, utilisez des mots de passe forts
-- 6. Activez l'authentification à deux facteurs pour les comptes admin
