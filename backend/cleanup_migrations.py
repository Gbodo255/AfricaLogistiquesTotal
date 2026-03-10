import os
import shutil

migrations_dir = r"C:\Users\landr\Pictures\adminandmoderatordashboard1\AFRICA-PROJECT-BACKEND-main\africa_project\africa_logistic\migrations"
for f in os.listdir(migrations_dir):
    if (f.startswith("0002") or f.startswith("0003")) and f.endswith(".py"):
        path = os.path.join(migrations_dir, f)
        print(f"Deleting {path}")
        os.remove(path)

pycache_dir = os.path.join(migrations_dir, "__pycache__")
if os.path.exists(pycache_dir):
    for f in os.listdir(pycache_dir):
        if f.startswith("0002") or f.startswith("0003"):
            path = os.path.join(pycache_dir, f)
            print(f"Deleting {path}")
            os.remove(path)
