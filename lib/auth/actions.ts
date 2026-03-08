/**
 * lib/auth/actions.ts
 * ⚠️ DEAD CODE — Ce fichier utilisait Supabase (système d'auth abandonné).
 * Les fonctions login/register/logout sont désormais gérées via djangoApi dans lib/api/django.ts
 * Ce fichier est conservé uniquement pour le type AuthResult utilisé par certains composants hérités.
 */

export type AuthResult = {
  error?: string
  success?: boolean
  message?: string
}

// Toutes les actions Supabase (login, register, logout, etc.) ont été supprimées.
// Utiliser djangoApi depuis @/lib/api/django à la place.
