from django.core.management.base import BaseCommand
from africa_logistic.models import User, Wallet
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Seed the database with default users for testing'

    def handle(self, *args, **kwargs):
        users_data = [
            {
                "email": "admin@africa-logistics.com",
                "firstname": "System",
                "lastname": "Admin",
                "role": "ADMIN",
                "password": "Africa123!"
            },
            {
                "email": "moderator@africa-logistics.com",
                "firstname": "Marc",
                "lastname": "Modo",
                "role": "MODERATOR",
                "password": "Africa123!"
            },
            {
                "email": "client@africa-logistics.com",
                "firstname": "Jean",
                "lastname": "Client",
                "role": "PARTICULIER",
                "password": "Africa123!"
            },
            {
                "email": "pme@africa-logistics.com",
                "firstname": "Entreprise",
                "lastname": "Benin",
                "role": "PME",
                "password": "Africa123!"
            },
            {
                "email": "transporter@africa-logistics.com",
                "firstname": "Paul",
                "lastname": "Transport",
                "role": "TRANSPORTEUR",
                "password": "Africa123!"
            },
        ]

        for data in users_data:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults={
                    'firstname': data['firstname'],
                    'lastname': data['lastname'],
                    'role': data['role'],
                    'password': make_password(data['password']),
                    'is_verified': True,
                    'is_approved': True if data['role'] == 'TRANSPORTEUR' else False
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"User {data['email']} created successfully."))
                # Create Wallet
                Wallet.objects.get_or_create(user=user, defaults={'balance': 100000 if data['role'] == 'ADMIN' else 0})
            else:
                # Update password just in case
                user.password = make_password(data['password'])
                user.save()
                self.stdout.write(self.style.WARNING(f"User {data['email']} already exists. Password updated."))

        self.stdout.write(self.style.SUCCESS("Seeding completed!"))
