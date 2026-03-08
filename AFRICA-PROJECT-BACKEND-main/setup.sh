#!/bin/bash

# Script de configuration pour le backend Django

echo "🚀 Configuration du backend Django..."

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si pip est installé
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
pip3 install -r requirements.txt

# Aller dans le dossier du projet
cd africa_project

# Créer les migrations
echo "📝 Création des migrations..."
python3 manage.py makemigrations

# Appliquer les migrations
echo "🗄️ Application des migrations..."
python3 manage.py migrate

echo "✅ Configuration terminée !"
echo ""
echo "Pour démarrer le serveur Django :"
echo "  cd africa_project"
echo "  python3 manage.py runserver"
