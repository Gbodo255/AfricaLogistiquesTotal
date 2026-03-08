-- Seed script pour créer des utilisateurs de test (modérateur et admin)
-- IMPORTANT: Vous devez d'abord créer ces utilisateurs via l'authentification Supabase
-- puis exécuter ce script pour mettre à jour leurs rôles

-- Pour créer un modérateur, mettez à jour le profil d'un utilisateur existant:
-- Remplacez 'EMAIL_DU_MODERATEUR' par l'email de l'utilisateur à promouvoir
UPDATE profiles 
SET role = 'moderateur', is_verified = true 
WHERE email = 'moderator@a-logistics.com';

-- Pour créer un administrateur:
-- Remplacez 'EMAIL_DE_ADMIN' par l'email de l'utilisateur à promouvoir
UPDATE profiles 
SET role = 'admin', is_verified = true 
WHERE email = 'admin@a-logistics.com';

-- Afficher les utilisateurs avec leurs rôles pour vérification
SELECT id, email, full_name, role, is_verified, is_active 
FROM profiles 
ORDER BY role, created_at;
