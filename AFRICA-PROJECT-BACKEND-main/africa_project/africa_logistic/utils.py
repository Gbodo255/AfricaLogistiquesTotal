from django.http import JsonResponse
from africa_logistic.models import User, UserConnect
from africa_logistic.configs import CODE_VALIDITY_MINUTES, PRIVATE_ROLES
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def is_logged_in(view_func):
    def wrapper(request, *args, **kwargs):
        token = request.headers.get('Authorization', None)
        token = token.split(' ')[1] if token and ' ' in token else token
        if token:
            try:
                user_connect = UserConnect.objects.get(slug=token)
                request.user = user_connect.user
                return view_func(request, *args, **kwargs)
            except UserConnect.DoesNotExist:
                return JsonResponse({'error': 'Invalid token'}, status=401)
        else:
            return JsonResponse({'error': 'Authorization header missing'}, status=401)
    return wrapper

def is_admin(view_func):
    def wrapper(request, *args, **kwargs):
        if hasattr(request, 'user') and request.user.role.upper() in ['ADMIN', 'DATA ADMIN']:
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'Admin access required'}, status=403)
    return wrapper

def is_data_admin(view_func):
    def wrapper(request, *args, **kwargs):
        if hasattr(request, 'user') and request.user.role.upper() == 'DATA ADMIN':
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'Data Admin access required'}, status=403)
    return wrapper

def is_pme(view_func):
    def wrapper(request, *args, **kwargs):
        if hasattr(request, 'user') and request.user.role == 'PME':
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'PME access required'}, status=403)
    return wrapper

def is_agriculteur(view_func):
    def wrapper(request, *args, **kwargs):
        if hasattr(request, 'user') and request.user.role == 'AGRICULTEUR':
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'Agriculteur access required'}, status=403)
    return wrapper

def is_particulier(view_func):
    def wrapper(request, *args, **kwargs):
        if hasattr(request, 'user') and request.user.role == 'PARTICULIER':
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'Particulier access required'}, status=403)
    return wrapper

def is_transporteur(view_func):
    def wrapper(request, *args, **kwargs):
        if hasattr(request, 'user') and request.user.role == 'TRANSPORTEUR':
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'Transporteur access required'}, status=403)
    return wrapper

def is_client(view_func):
    """
    Décorateur pour vérifier si l'utilisateur est un client (PME, PARTICULIER, AGRICULTEUR)
    """
    def wrapper(request, *args, **kwargs):
        if hasattr(request, 'user') and request.user.role in ['PME', 'PARTICULIER', 'AGRICULTEUR', 'CLIENT']:
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'Client access required'}, status=403)
    return wrapper

def is_transporteur_or_admin(view_func):
    """
    Décorateur pour vérifier si l'utilisateur est transporteur ou admin
    """
    def wrapper(request, *args, **kwargs):
        if hasattr(request, 'user') and request.user.role in ['TRANSPORTEUR', 'ADMIN', 'DATA ADMIN']:
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'Transporteur or Admin access required'}, status=403)
    return wrapper

def is_private_role(view_func):
    def wrapper(request, *args, **kwargs):
        if hasattr(request, 'user') and request.user.role in list(PRIVATE_ROLES):
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'Private role access required'}, status=403)
    return wrapper

def is_moderator(view_func):
    def wrapper(request, *args, **kwargs):
        if hasattr(request, 'user') and request.user.role.upper() == 'MODERATOR':
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({'error': 'Moderator access required'}, status=403)
    return wrapper

def send_verify_account_mail(user, code):
    subject = "Vérification de compte"
    from_email = settings.EMAIL_HOST_USER
    to = [user.email]
    
    text_content = f"Votre code de vérification est : {code}. Ne le partagez pas."
    
    html_content  = render_to_string('emails/verify_account.html', {'user': user, 'code': code, 'validity_minutes': CODE_VALIDITY_MINUTES, 'email_host': settings.EMAIL_HOST_USER})
    
    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def send_2FA_mail_with_template(user, code):
    subject = "Votre code de vérification 2FA"
    from_email = settings.EMAIL_HOST_USER
    to = [user.email]
    
    text_content = f"Votre code de vérification est : {code}. Ne le partagez pas."
    
    html_content  = render_to_string('emails/2fa_code.html', {'user': user, 'code': code, 'validity_minutes': CODE_VALIDITY_MINUTES, 'email_host': settings.EMAIL_HOST_USER})
    
    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
    

def send_reset_password_mail_with_template(user, token):
    subject = "Réinitialisation de votre mot de passe"
    from_email = settings.EMAIL_HOST_USER
    to = [user.email]
    reset_link = f"{settings.FRONTEND_URL}/auth/reset-password/?token={token}"
    
    text_content = f"Pour réinitialiser votre mot de passe, cliquez sur le lien suivant : {reset_link}. Ce lien est valable pendant {CODE_VALIDITY_MINUTES} minutes."
    
    html_content = render_to_string('emails/reset_password.html', {'user': user, 'reset_link': reset_link, 'validity_minutes': CODE_VALIDITY_MINUTES, 'email_host': settings.EMAIL_HOST_USER})
    
    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()


def send_transporter_approval_mail(user):
    """
    Envoyer un email au transporteur pour l'informer que sa demande a été approuvée
    """
    subject = "Votre demande de transporteur a été approuvée"
    from_email = settings.EMAIL_HOST_USER
    to = [user.email]
    
    login_link = f"{settings.FRONTEND_URL}/auth/login"
    
    text_content = f"Félicitations {user.presentation()} ! Votre demande de transporteur a été approuvée. Vous pouvez maintenant accéder à votre dashboard en vous connectant : {login_link}"
    
    html_content = render_to_string('emails/transporter_approved.html', {
        'user': user, 
        'login_link': login_link,
        'email_host': settings.EMAIL_HOST_USER
    })
    
    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()


def send_transporter_rejection_mail(user, reason=None):
    """
    Envoyer un email au transporteur pour l'informer que sa demande a été rejetée
    """
    subject = "Demande de transporteur - Information importante"
    from_email = settings.EMAIL_HOST_USER
    to = [user.email]
    
    text_content = f"Bonjour {user.presentation()}, votre demande de transporteur nécessite des informations complémentaires ou des corrections."
    if reason:
        text_content += f"\n\nRaison : {reason}"
    
    html_content = render_to_string('emails/transporter_rejected.html', {
        'user': user,
        'reason': reason,
        'email_host': settings.EMAIL_HOST_USER
    })
    
    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
    