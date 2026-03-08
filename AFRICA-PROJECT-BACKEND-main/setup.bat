@echo off
REM Script de configuration pour le backend Django (Windows)

echo 🚀 Configuration du backend Django...

REM Vérifier si Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installé. Veuillez l'installer d'abord.
    pause
    exit /b 1
)

REM Installer les dépendances
echo 📦 Installation des dépendances...
pip install -r requirements.txt

REM Aller dans le dossier du projet
cd africa_project

REM Créer les migrations
echo 📝 Création des migrations...
python manage.py makemigrations

REM Appliquer les migrations
echo 🗄️ Application des migrations...
python manage.py migrate

echo ✅ Configuration terminée !
echo.
echo Pour démarrer le serveur Django :
echo   cd africa_project
echo   python manage.py runserver
pause
