from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from datetime import date, datetime
from django.core.validators import MinValueValidator
from decimal import Decimal
from africa_logistic.configs import *
# Create your models here.


class SoftQuerySet(models.QuerySet):
    def delete(self):
        # Au lieu de supprimer physiquement → update is_active=False
        return super().update(is_active=False, deleted_at=timezone.now())

    def hard_delete(self):
        # Suppression réelle en base si vraiment nécessaire
        return super().delete()

    def active(self):
        return self.filter(is_active=True)

    def inactive(self):
        return self.filter(is_active=False)
    def all_with_deleted(self):
        return self.all()
    def deleted(self):
        return self.filter(is_active=False)
    
class SoftManager(models.Manager):
    def get_queryset(self):
        return SoftQuerySet(self.model, using=self._db).filter(is_active=True)

    def all_with_deleted(self):
        return SoftQuerySet(self.model, using=self._db)

    def deleted(self):
        return SoftQuerySet(self.model, using=self._db).filter(is_active=False)
    
    def active(self):
        return self.get_queryset().filter(is_active=True)
    def inactive(self):
        return self.get_queryset().filter(is_active=False)

class BaseModel(models.Model):
    # id = models.BigAutoField(primary_key=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftManager()

    class Meta:
        abstract = True
        
    def save(self, *args, **kwargs):
        if not self.slug:
            # Generate random unique string for slug
            import uuid
            self.slug = str(uuid.uuid4())[:16]  # Use first 8 characters of UUID as slug
            # Ensure slug is unique
            while self.__class__.objects.filter(slug='obj-'+self.slug).exists():
                self.slug = str(uuid.uuid4())[:16]
            self.slug = 'obj-' + self.slug  # Prefix slug with 'obj-'
        super().save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        # Soft delete individuel
        self.is_active = False
        self.deleted_at = timezone.now()
        self.save(update_fields=["is_active", "deleted_at"])

    def hard_delete(self, using=None, keep_parents=False):
        # Hard delete optionnel
        super().delete(using=using, keep_parents=keep_parents)
    
    def as_dict(self, include_related=False, exclude=None):
        """
        Retourne un dict de l'objet.
        - include_related=True : inclut les FK (id par défaut sinon dict si possible)
        - exclude=["champ1", "champ2"] : permet d'exclure certains champs
        """
        data = {}
        exclude = exclude or []

        for field in self._meta.get_fields():
            field_name = field.name

            if field_name in exclude:
                continue

            if hasattr(field, "attname"):
                value = getattr(self, field_name, None)

                # Dates
                if isinstance(value, (datetime, date)):
                    data[field_name] = value.isoformat() if value else None
                # ForeignKey
                elif field.is_relation and not field.many_to_many and not field.one_to_many:
                    if include_related and hasattr(value, "as_dict"):
                        data[field_name] = value.as_dict()
                    else:
                        data[field_name] = value.pk if value else None
                # Fichiers (ImageField, FileField, etc.)
                elif isinstance(field, (models.FileField, models.ImageField)):
                    if value and hasattr(value, "url"):
                        # Précède l'URL du serveur de façon dynamique
                        request = getattr(self, '_request', None)
                        if request:
                            data[field_name] = request.build_absolute_uri(value.url)
                        else:
                            # Construire l'URL complète avec le domaine
                            media_url = value.url if value.url.startswith('http') else f"http://localhost:8000/{settings.MEDIA_URL}{value.name}"
                            data[field_name] = media_url if value and value.name else None
                    else:
                        data[field_name] = None
                    
                elif isinstance(value, (str, int, float, bool, Decimal)):
                    data[field_name] = float(value) if isinstance(value, Decimal) else value
                else:
                    data[field_name] = None

        return data

class User(BaseModel):
    firstname = models.CharField(max_length=30, blank=True, null=True)
    lastname = models.CharField(max_length=30, blank=True, null=True)
    telephone = models.CharField(max_length=15, blank=True, null=True, validators=[phone_validator])
    email = models.EmailField(unique=True, blank=True, null=True)
    password = models.CharField(max_length=128, validators=[password_validator])
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    address = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to="users_photo/", blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False, help_text="Pour les transporteurs: approuvé par l'admin")
    approved_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_transporters', limit_choices_to={'role__in': ['ADMIN', 'DATA ADMIN']})
    approved_at = models.DateTimeField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        # Si le password n'est pas déjà hashé
        if self.password and not self.password.startswith('pbkdf2_'):
            from django.contrib.auth.hashers import make_password
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.presentation()} - {self.role}"
    
    def presentation(self):
        if self.firstname and self.lastname:
            return f"{self.firstname} {self.lastname}"
        elif self.firstname:
            return self.firstname
        elif self.lastname:
            return self.lastname
        elif self.email:
            return self.email.split('@')[0]
        elif self.telephone:
            return self.telephone
        else:
            return "Utilisateur"
    
    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)
    
    def set_password(self, raw_password):
        from django.contrib.auth.hashers import make_password
        self.password = make_password(raw_password)
        self.save()
    
    def as_dict(self, include_related=False, exclude=['password']):
        return super().as_dict(include_related, exclude)

class Wallet(BaseModel):
    """
    Portefeuille utilisateur (FCFA)
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    currency = models.CharField(max_length=10, default="XOF")
    
    class Meta:
        verbose_name = "Portefeuille"
        verbose_name_plural = "Portefeuilles"
    
    def __str__(self):
        return f"Wallet({self.user.presentation()}): {self.balance} {self.currency}"


class WalletTransaction(BaseModel):
    """
    Historique des mouvements du portefeuille
    """
    TX_TYPES = [
        ("CREDIT", "Crédit"),
        ("DEBIT", "Débit"),
    ]
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    tx_type = models.CharField(max_length=10, choices=TX_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    description = models.CharField(max_length=255, blank=True, null=True)
    reference = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Transaction portefeuille"
        verbose_name_plural = "Transactions portefeuille"
    
    def __str__(self):
        return f"{self.tx_type} {self.amount} on {self.wallet.user.presentation()}"


class Notification(BaseModel):
    """
    Notifications simples (texte) pour les utilisateurs
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    type = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return f"Notification({self.user.presentation()}): {self.title}"

class VerificationCode(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_codes')
    code = models.CharField(max_length=6, blank=False, null=False)
    is_used = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.code:
            import random
            self.code = f"{random.randint(100000, 999999)}"
            while len(self.code) != 6:
                self.code = f"{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Code for {self.user.email} - {'Used' if self.is_used else 'Unused'}"
    
    def can_be_used(self):
        if self.is_used:
            return False
        from datetime import timedelta
        from django.utils import timezone
        # Code is valid for 10 minutes
        b = (timezone.now() - self.created_at) < timedelta(minutes=CODE_VALIDITY_MINUTES)
        if b:
            self.is_used = True
            self.save()
        return b

class User2FA(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='two_fa')
    is_enabled = models.BooleanField(default=False)
    secret_key = models.CharField(max_length=32, blank=True, null=True)

    def __str__(self):
        return f"2FA for {self.user.email} - {'Enabled' if self.is_enabled else 'Disabled'}"
    
    def save(self, *args, **kwargs):
        if self.is_enabled:
            import pyotp
            self.secret_key = pyotp.random_base32()
        super().save(*args, **kwargs)

class PasswordResetToken(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    code = models.CharField(max_length=6, unique=True, null=True)
    is_used = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.code:
            import random
            self.code = f"{random.randint(100000, 999999)}"
            while PasswordResetToken.objects.filter(code=self.code).exists():
                self.code = f"{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Password reset code for {self.user.email} - {'Used' if self.is_used else 'Unused'}"
    
    def can_be_used(self):
        if self.is_used:
            return False
        from datetime import timedelta
        from django.utils import timezone
        # Token is valid for 10 minutes
        b = (timezone.now() - self.created_at) < timedelta(minutes=CODE_VALIDITY_MINUTES)
        if b:
            self.is_used = True
            self.save()
        return b

class UserConnect(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections')

    def __str__(self):
        return f"Connection for {self.user.email} - Expires at {self.expires_at}"

    def is_valid(self):
        from django.utils import timezone
        return timezone.now() < self.expires_at

class TypeDocumentLegal(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    profil = models.CharField(max_length=20, choices=PUBLIC_ROLES_CHOICES, default=PUBLIC_ROLES_CHOICES[0])

    def __str__(self):
        return self.name

class DocumentLegal(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='legal_documents')
    type_doc = models.ForeignKey(TypeDocumentLegal, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='legal_documents/')
    description = models.TextField(blank=True, null=True)
    is_valid = models.BooleanField(default=False)
    validated_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='validated_legal_documents')
    validated_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Document {self.title} for {self.user.email}"

class TransportRequest(BaseModel):
    """
    Modèle pour les demandes de transport
    Utilisateurs concernés: PME, PARTICULIER, AGRICULTEUR
    """
    
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('OFFERS_RECEIVED', 'Offres reçues'),
        ('ASSIGNED', 'Assignée'),
        ('IN_PROGRESS', 'En cours'),
        ('DELIVERED', 'Livrée'),
        ('CANCELLED', 'Annulée'),
    ]
    
    MERCHANDISE_TYPES = [
        ('GENERAL', 'Marchandise générale'),
        ('FRAGILE', 'Fragile'),
        ('PERISHABLE', 'Périssable'),
        ('DANGEROUS', 'Matières dangereuses'),
        ('ELECTRONIC', 'Électronique'),
        ('FURNITURE', 'Mobilier'),
        ('FOOD', 'Alimentaire'),
        ('OTHER', 'Autre'),
    ]
    
    PRIORITY_LEVELS = [
        ('LOW', 'Basse'),
        ('NORMAL', 'Normale'),
        ('HIGH', 'Haute'),
        ('URGENT', 'Urgente'),
    ]
    
    # Relations
    client = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='transport_requests',
        limit_choices_to={'role__in': ['PME', 'PARTICULIER', 'AGRICULTEUR']}
    )
    assigned_transporter = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_transports',
        limit_choices_to={'role': 'TRANSPORTEUR'}
    )
    
    # Informations de base
    title = models.CharField(max_length=200, help_text="Titre/description courte de la demande")
    merchandise_type = models.CharField(
        max_length=20, 
        choices=MERCHANDISE_TYPES, 
        default='GENERAL'
    )
    merchandise_description = models.TextField(
        help_text="Description détaillée de la marchandise"
    )
    
    # Dimensions et poids
    weight = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Poids en kg"
    )
    volume = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Volume en m³"
    )
    
    # Lieux
    pickup_address = models.TextField(help_text="Adresse de collecte")
    pickup_city = models.CharField(max_length=100)
    pickup_coordinates = models.CharField(max_length=50, blank=True, null=True)
    
    delivery_address = models.TextField(help_text="Adresse de livraison")
    delivery_city = models.CharField(max_length=100)
    delivery_coordinates = models.CharField(max_length=50, blank=True, null=True)
    
    # Dates
    preferred_pickup_date = models.DateTimeField(help_text="Date souhaitée de collecte")
    preferred_delivery_date = models.DateTimeField(
        help_text="Date souhaitée de livraison", 
        null=True, 
        blank=True
    )
    
    # Statut et priorité
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='NORMAL')
    
    # Informations complémentaires
    special_instructions = models.TextField(blank=True, null=True)
    estimated_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Prix estimé par le client"
    )
    
    # Récurrence (pour PME/Agriculteurs)
    is_recurring = models.BooleanField(default=False)
    recurring_frequency = models.CharField(
        max_length=20,
        choices=[
            ('DAILY', 'Quotidien'),
            ('WEEKLY', 'Hebdomadaire'),
            ('MONTHLY', 'Mensuel'),
            ('SEASONAL', 'Saisonnier'),
        ],
        blank=True,
        null=True
    )
    
    # Contact destinataire
    recipient_name = models.CharField(max_length=100)
    recipient_phone = models.CharField(max_length=15)
    recipient_email = models.EmailField(blank=True, null=True)
    
    # Tracking
    tracker_imei = models.CharField(max_length=20, blank=True, null=True, help_text="IMEI du tracker A-Tracker associé")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Demande de transport"
        verbose_name_plural = "Demandes de transport"
    
    def __str__(self):
        return f"{self.title} - {self.client.presentation()} ({self.status})"
    
    @property
    def is_completed(self):
        return self.status in ['DELIVERED', 'CANCELLED']
    
    def get_status_display_text(self):
        return dict(self.STATUS_CHOICES).get(self.status, self.status)
    
    def get_merchandise_display_text(self):
        return dict(self.MERCHANDISE_TYPES).get(self.merchandise_type, self.merchandise_type)
    
    def get_priority_display_text(self):
        return dict(self.PRIORITY_LEVELS).get(self.priority, self.priority)


class RequestDocument(BaseModel):
    """
    Documents attachés à une demande de transport
    """
    DOCUMENT_TYPES = [
        ('INVOICE', 'Facture'),
        ('CERTIFICATE', 'Certificat'),
        ('INSURANCE', 'Assurance'),
        ('PERMIT', 'Autorisation'),
        ('PHOTO', 'Photo'),
        ('OTHER', 'Autre'),
    ]
    
    transport_request = models.ForeignKey(
        TransportRequest, 
        on_delete=models.CASCADE, 
        related_name='documents'
    )
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='transport_documents/%Y/%m/')
    description = models.CharField(max_length=200, blank=True)
    
    class Meta:
        verbose_name = "Document de demande"
        verbose_name_plural = "Documents de demandes"
    
    def __str__(self):
        return f"{self.transport_request.title} - {dict(self.DOCUMENT_TYPES).get(self.document_type)}"


class RequestStatusHistory(BaseModel):
    """
    Historique des changements de statut d'une demande
    """
    transport_request = models.ForeignKey(
        TransportRequest, 
        on_delete=models.CASCADE, 
        related_name='status_history'
    )
    old_status = models.CharField(max_length=20, choices=TransportRequest.STATUS_CHOICES)
    new_status = models.CharField(max_length=20, choices=TransportRequest.STATUS_CHOICES)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Historique de statut"
        verbose_name_plural = "Historiques de statuts"
    
    def __str__(self):
        return f"{self.transport_request.title}: {self.old_status} → {self.new_status}"


class Vehicle(BaseModel):
    """
    Modèle pour les véhicules des transporteurs
    """
    VEHICLE_TYPES = [
        ('TRUCK', 'Camion'),
        ('VAN', 'Fourgon'),
        ('MOTORBIKE', 'Moto'),
        ('CAR', 'Voiture'),
        ('OTHER', 'Autre'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Actif'),
        ('INACTIVE', 'Inactif'),
        ('MAINTENANCE', 'En maintenance'),
    ]
    
    # Relations
    owner = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='vehicles',
        limit_choices_to={'role': 'TRANSPORTEUR'}
    )
    
    # Informations de base
    type = models.CharField(max_length=20, choices=VEHICLE_TYPES, default='TRUCK')
    brand = models.CharField(max_length=100, help_text="Marque du véhicule")
    model = models.CharField(max_length=100, help_text="Modèle du véhicule")
    plate_number = models.CharField(max_length=20, unique=True, help_text="Numéro de plaque d'immatriculation")
    capacity_kg = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Capacité en kg"
    )
    
    # Dates importantes
    insurance_expiry = models.DateField(help_text="Date d'expiration de l'assurance", null=True, blank=True)
    inspection_expiry = models.DateField(help_text="Date d'expiration de l'inspection", null=True, blank=True)
    
    # Photo du véhicule
    photo = models.ImageField(upload_to='vehicles/', blank=True, null=True)
    
    # Statut
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    # Informations complémentaires
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Véhicule"
        verbose_name_plural = "Véhicules"
    
    def __str__(self):
        return f"{self.brand} {self.model} - {self.plate_number} ({self.owner.presentation()})"
    
    @property
    def is_insurance_valid(self):
        if not self.insurance_expiry:
            return False
        from django.utils import timezone
        return self.insurance_expiry >= timezone.now().date()
    
    @property
    def is_inspection_valid(self):
        if not self.inspection_expiry:
            return False
        from django.utils import timezone
        return self.inspection_expiry >= timezone.now().date()


class VehicleDocument(BaseModel):
    """
    Documents attachés à un véhicule (assurance, inspection, etc.)
    """
    DOCUMENT_TYPES = [
        ('INSURANCE', 'Assurance'),
        ('INSPECTION', 'Inspection'),
        ('REGISTRATION', 'Carte grise'),
        ('LICENSE', 'Permis de conduire'),
        ('OTHER', 'Autre'),
    ]
    
    vehicle = models.ForeignKey(
        Vehicle, 
        on_delete=models.CASCADE, 
        related_name='documents'
    )
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='vehicle_documents/%Y/%m/')
    name = models.CharField(max_length=200, blank=True, help_text="Nom du document")
    description = models.TextField(blank=True, null=True)
    expiry_date = models.DateField(null=True, blank=True, help_text="Date d'expiration si applicable")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Document véhicule"
        verbose_name_plural = "Documents véhicules"
    
    def __str__(self):
        return f"{self.vehicle.plate_number} - {dict(self.DOCUMENT_TYPES).get(self.document_type)}"


class Rating(BaseModel):
    """
    Notes et avis sur une demande de transport
    """
    transport_request = models.OneToOneField(
        TransportRequest, 
        on_delete=models.CASCADE, 
        related_name='rating'
    )
    score = models.IntegerField(validators=[MinValueValidator(1)])
    comment = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Note"
        verbose_name_plural = "Notes"

    def __str__(self):
        return f"Rating for {self.transport_request.title}: {self.score}/5"


class NotificationPreference(BaseModel):
    """
    Préférences de notification par utilisateur
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='notification_preferences'
    )
    # Client prefs
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    delivery_updates = models.BooleanField(default=True)
    offers_promotions = models.BooleanField(default=False)
    
    # Transporter specific prefs
    new_missions = models.BooleanField(default=True)
    mission_updates = models.BooleanField(default=True)
    vehicle_reminders = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Préférence de notification"
        verbose_name_plural = "Préférences de notification"

    def __str__(self):
        return f"Prefs for {self.user.presentation()}"


class Dispute(BaseModel):
    """
    Litige entre un client et un transporteur sur une demande de transport.
    Géré par les modérateurs.
    """
    STATUS_CHOICES = [
        ('OPEN', 'Ouvert'),
        ('INVESTIGATING', 'En investigation'),
        ('ESCALATED', 'Escaladé'),
        ('RESOLVED', 'Résolu'),
        ('CLOSED', 'Fermé'),
    ]

    CATEGORY_CHOICES = [
        ('DELAY', 'Retard de livraison'),
        ('DAMAGE', 'Marchandise endommagée'),
        ('LOSS', 'Perte de marchandise'),
        ('PAYMENT', 'Problème de paiement'),
        ('BEHAVIOR', 'Comportement inapproprié'),
        ('OTHER', 'Autre'),
    ]

    transport_request = models.OneToOneField(
        TransportRequest,
        on_delete=models.CASCADE,
        related_name='dispute'
    )
    opened_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='opened_disputes'
    )
    assigned_moderator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_disputes',
        limit_choices_to={'role__in': ['MODERATOR', 'MODERATEUR']}
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='OTHER')
    description = models.TextField(help_text="Description du litige")
    resolution = models.TextField(blank=True, null=True, help_text="Résolution du litige")
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Litige"
        verbose_name_plural = "Litiges"

    def __str__(self):
        return f"Dispute #{self.slug} — {self.transport_request.title} ({self.status})"


class DisputeMessage(BaseModel):
    """
    Message dans le fil de discussion d'un litige.
    """
    dispute = models.ForeignKey(Dispute, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dispute_messages')
    content = models.TextField()
    is_moderator_note = models.BooleanField(default=False, help_text="Note interne modérateur")

    class Meta:
        ordering = ['created_at']
        verbose_name = "Message de litige"
        verbose_name_plural = "Messages de litiges"

    def __str__(self):
        return f"Message by {self.sender.presentation()} on Dispute #{self.dispute.slug}"


class WithdrawalRequest(BaseModel):
    """
    Demande de retrait de fonds par un transporteur.
    Doit être approuvée par un admin avant traitement.
    """
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('APPROVED', 'Approuvée'),
        ('REJECTED', 'Rejetée'),
        ('COMPLETED', 'Traitée'),
    ]

    METHOD_CHOICES = [
        ('MOBILE_MONEY', 'Mobile Money'),
        ('BANK_TRANSFER', 'Virement bancaire'),
    ]

    transporter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='withdrawal_requests',
        limit_choices_to={'role': 'TRANSPORTEUR'}
    )
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('1000.00'))],
        help_text="Montant minimum: 1000 FCFA"
    )
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default='MOBILE_MONEY')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    bank_details = models.TextField(blank=True, null=True)
    admin_note = models.TextField(blank=True, null=True)
    processed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_withdrawals'
    )
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Demande de retrait"
        verbose_name_plural = "Demandes de retrait"

    def __str__(self):
        return f"Withdrawal {self.amount} FCFA by {self.transporter.presentation()} ({self.status})"


class AuditLog(BaseModel):
    """
    Journal d'audit pour les actions administratives et critiques.
    """
    ACTION_TYPES = [
        ('CREATE', 'Création'),
        ('UPDATE', 'Modification'),
        ('DELETE', 'Suppression'),
        ('LOGIN', 'Connexion'),
        ('LOGOUT', 'Déconnexion'),
        ('VALIDATE', 'Validation'),
        ('REJECT', 'Rejet'),
        ('ASSIGN', 'Assignation'),
        ('DISPUTE_RESOLVE', 'Résolution de litige'),
        ('WALLET_TOPUP', 'Recharge portefeuille'),
        ('WITHDRAWAL_PROCESS', 'Traitement de retrait'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    resource_type = models.CharField(max_length=50, help_text="Ex: User, TransportRequest, WalletTransaction")
    resource_slug = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    payload = models.JSONField(null=True, blank=True, help_text="Données de la requête pour débogage")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Log d'audit"
        verbose_name_plural = "Logs d'audit"

    def __str__(self):
        user_str = self.user.presentation() if self.user else "System"
        return f"{self.created_at.strftime('%Y-%m-%d %H:%M:%S')} - {user_str}: {self.action_type} on {self.resource_type}"


def log_action(user, action_type, resource_type, resource_slug=None, description="", request=None, payload=None):
    """
    Utilitaire pour enregistrer une action dans le log d'audit.
    """
    ip = None
    ua = None
    if request:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        ua = request.META.get('HTTP_USER_AGENT')

    AuditLog.objects.create(
        user=user,
        action_type=action_type,
        resource_type=resource_type,
        resource_slug=resource_slug,
        description=description,
        ip_address=ip,
        user_agent=ua,
        payload=payload
    )
