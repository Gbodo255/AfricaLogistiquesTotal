from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator


HEX_COLOR_RE = r'^#(?:[0-9a-fA-F]{3}){1,2}$'
hex_color_validator = RegexValidator(regex=HEX_COLOR_RE, message='Entrez une couleur HEX valide, ex : #RRGGBB')

ROLES = (
    "DATA ADMIN",
    "ADMIN",
    "MODERATOR",
    "PME",
    "AGRICULTEUR",
    "PARTICULIER",
    "TRANSPORTEUR",
)
ROLE_CHOICES = [(role, role) for role in ROLES]

PRIVATE_ROLES = (
    "DATA ADMIN",
    "ADMIN",
    "MODERATOR",
)

PRIVATE_ROLES_CHOICES = [(role, role) for role in PRIVATE_ROLES]

PUBLIC_ROLES = (
    "PME",
    "AGRICULTEUR",
    "PARTICULIER",
    "TRANSPORTEUR",
)

PUBLIC_ROLES_CHOICES = [(role, role) for role in PUBLIC_ROLES]

PASSWORD_REGEX = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
password_validator = RegexValidator(regex=PASSWORD_REGEX, message="Le mot de passe doit contenir au moins 8 caractères, une lettre, un chiffre et un caractère spécial.")

CODE_VALIDITY_MINUTES = 10  # Code de vérification valable pendant 10 minutes
PHONE_REGEX = r'^\+?1?\d{9,15}$'
phone_validator = RegexValidator(regex=PHONE_REGEX, message="Le numéro de téléphone doit être au format : '+999999999'. Jusqu'à 15 chiffres autorisés.")
