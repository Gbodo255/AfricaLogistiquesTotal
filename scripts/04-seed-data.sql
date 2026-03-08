-- Seed data for A-Logistics platform

-- Insert platform settings
INSERT INTO platform_settings (key, value, description) VALUES
    ('commission_rate', '0.15', 'Taux de commission de la plateforme (15%)'),
    ('min_withdrawal', '5000', 'Montant minimum de retrait en XOF'),
    ('max_request_value', '50000000', 'Valeur maximale d''une demande en XOF'),
    ('default_currency', '"XOF"', 'Devise par défaut'),
    ('supported_countries', '["Sénégal", "Mali", "Côte d''Ivoire", "Burkina Faso", "Guinée", "Bénin", "Togo", "Niger"]', 'Pays supportés'),
    ('transport_types', '{"standard": {"name": "Standard", "multiplier": 1}, "express": {"name": "Express", "multiplier": 1.5}, "fragile": {"name": "Fragile", "multiplier": 1.3}, "refrigerated": {"name": "Réfrigéré", "multiplier": 1.8}, "hazardous": {"name": "Dangereux", "multiplier": 2}}', 'Types de transport et multiplicateurs de prix'),
    ('price_per_km', '{"moto": 150, "car": 250, "van": 400, "truck": 600, "trailer": 800}', 'Prix de base par km par type de véhicule en XOF')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Note: Users will be created via Supabase Auth signup
-- Sample users can be created manually or through the app's registration flow

-- The following is example data that would be created after users sign up:

/*
-- Example: After admin creates users via Supabase dashboard or they sign up:

-- Update a user to be admin
UPDATE profiles 
SET role = 'admin', is_verified = true 
WHERE email = 'admin@a-logistics.com';

-- Update a user to be moderator
UPDATE profiles 
SET role = 'moderator', is_verified = true 
WHERE email = 'moderator@a-logistics.com';

-- Update a user to be transporter
UPDATE profiles 
SET role = 'transporter', is_verified = true 
WHERE email = 'transporter@example.com';

-- Add sample vehicle for transporter
INSERT INTO vehicles (owner_id, type, brand, model, plate_number, capacity_kg, capacity_m3, is_verified)
SELECT id, 'truck', 'Mercedes', 'Actros', 'DK-1234-AB', 10000, 45, true
FROM profiles WHERE email = 'transporter@example.com';

-- Add credits to wallets for testing
UPDATE wallets SET balance = 500000 
WHERE user_id = (SELECT id FROM profiles WHERE email = 'client@example.com');
*/
