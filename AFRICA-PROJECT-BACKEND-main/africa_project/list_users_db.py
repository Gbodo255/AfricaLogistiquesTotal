import os
import django
import sys

# Ajouter le chemin du projet au sys.path
sys.path.append('c:/Users/stacy/Downloads/Transport-main/Transport-main/AFRICA-PROJECT-BACKEND-main/africa_project')

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'africa_project.settings')
django.setup()

from africa_logistic.models import User

users = User.objects.all()
print(f"{'Email':<40} | {'Role':<15} | {'Nom':<30}")
print("-" * 90)
for user in users:
    print(f"{str(user.email):<40} | {str(user.role):<15} | {user.presentation():<30}")
