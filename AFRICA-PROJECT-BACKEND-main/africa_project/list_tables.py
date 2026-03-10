import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'africa_project.settings')
django.setup()

tables = connection.introspection.table_names()
for table in sorted(tables):
    print(table)
