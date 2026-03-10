import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'africa_project.settings')
django.setup()

with connection.cursor() as cursor:
    print("Dropping columns from User...")
    try:
        cursor.execute("ALTER TABLE africa_logistic_user DROP COLUMN IF EXISTS approved_at CASCADE;")
        cursor.execute("ALTER TABLE africa_logistic_user DROP COLUMN IF EXISTS approved_by_id CASCADE;")
        cursor.execute("ALTER TABLE africa_logistic_user DROP COLUMN IF EXISTS is_approved CASCADE;")
    except Exception as e:
        print(f"Error dropping columns from User: {e}")

    print("Dropping column from TransportRequest...")
    try:
        cursor.execute("ALTER TABLE africa_logistic_transportrequest DROP COLUMN IF EXISTS tracker_imei CASCADE;")
    except Exception as e:
        print(f"Error dropping column from TransportRequest: {e}")

    print("Dropping column from PasswordResetToken and adding back token...")
    try:
        cursor.execute("ALTER TABLE africa_logistic_passwordresettoken DROP COLUMN IF EXISTS code CASCADE;")
        # Check if 'token' already exists
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'africa_logistic_passwordresettoken' AND column_name = 'token';")
        if not cursor.fetchone():
            cursor.execute("ALTER TABLE africa_logistic_passwordresettoken ADD COLUMN token varchar(64);")
    except Exception as e:
        print(f"Error modifying PasswordResetToken: {e}")

print("Done.")
