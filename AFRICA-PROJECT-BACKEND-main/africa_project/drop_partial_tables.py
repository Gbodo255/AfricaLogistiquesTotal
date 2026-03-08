import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'africa_project.settings')
django.setup()

tables_to_drop = [
    'africa_logistic_notification',
    'africa_logistic_notificationpreference',
    'africa_logistic_rating',
    'africa_logistic_vehicle',
    'africa_logistic_vehicledocument',
    'africa_logistic_wallet',
    'africa_logistic_wallettransaction'
]

with connection.cursor() as cursor:
    for table in tables_to_drop:
        print(f"Dropping table {table} if exists...")
        cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")

print("Done.")
