import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'africa_project.settings')
django.setup()

def get_columns(table_name):
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table_name}';")
        return [row[0] for row in cursor.fetchall()]

print("PasswordResetToken columns:", get_columns('africa_logistic_passwordresettoken'))
