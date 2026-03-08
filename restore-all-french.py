#!/usr/bin/env python3
"""
Script pour restaurer automatiquement le français hardcodé dans toutes les pages
Remplace tous les appels t() par les textes français correspondants
"""

import re
import os
import json
from pathlib import Path

# Lire le fichier de traductions pour extraire les textes français
def load_french_translations():
    """Charge les traductions françaises depuis lib/i18n/context.tsx"""
    translations = {}
    context_file = Path("lib/i18n/context.tsx")
    
    if not context_file.exists():
        print("⚠️  Fichier lib/i18n/context.tsx introuvable")
        return translations
    
    content = context_file.read_text(encoding='utf-8')
    
    # Extraire la section fr: { ... }
    fr_match = re.search(r'fr:\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}', content, re.DOTALL)
    if not fr_match:
        print("⚠️  Section française introuvable dans context.tsx")
        return translations
    
    fr_section = fr_match.group(1)
    
    # Extraire les paires clé: valeur
    pattern = r'"([^"]+)":\s*"([^"]*)"'
    matches = re.findall(pattern, fr_section)
    
    for key, value in matches:
        translations[key] = value.replace('\\"', '"').replace('\\n', '\n')
    
    print(f"✓ {len(translations)} traductions françaises chargées")
    return translations

def replace_translations_in_file(file_path, translations):
    """Remplace les appels t() par les textes français dans un fichier"""
    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        modified = False
        
        # Remplacer t("key") et t('key')
        for key, french_text in translations.items():
            # Échapper les caractères spéciaux pour le regex
            escaped_key = re.escape(key)
            
            # Pattern pour t("key") ou t('key')
            patterns = [
                (rf't\("({escaped_key})"\)', f'"{french_text}"'),
                (rf"t\('({escaped_key})'\)", f'"{french_text}"'),
            ]
            
            for pattern, replacement in patterns:
                if re.search(pattern, content):
                    content = re.sub(pattern, replacement, content)
                    modified = True
        
        # Supprimer les imports useLanguage si plus utilisés
        if modified and 't(' not in content:
            # Supprimer import { useLanguage } from "@/lib/i18n/context"
            content = re.sub(
                r'import\s+{\s*useLanguage\s*}\s+from\s+["\']@/lib/i18n/context["\'];?\n?',
                '',
                content
            )
            # Supprimer const { t } = useLanguage()
            content = re.sub(
                r'const\s+{\s*t\s*}\s*=\s*useLanguage\(\);?\n?\s*',
                '',
                content
            )
        
        if modified:
            file_path.write_text(content, encoding='utf-8')
            print(f"  ✓ {file_path}")
            return True
        
        return False
    except Exception as e:
        print(f"  ✗ Erreur sur {file_path}: {e}")
        return False

def process_directory(directory, translations):
    """Traite récursivement tous les fichiers .tsx et .ts dans un répertoire"""
    directory = Path(directory)
    if not directory.exists():
        return
    
    files_modified = 0
    
    for file_path in directory.rglob("*.tsx"):
        if "node_modules" in str(file_path) or ".next" in str(file_path):
            continue
        
        if replace_translations_in_file(file_path, translations):
            files_modified += 1
    
    for file_path in directory.rglob("*.ts"):
        if "node_modules" in str(file_path) or ".next" in str(file_path):
            continue
        
        if replace_translations_in_file(file_path, translations):
            files_modified += 1
    
    return files_modified

def main():
    print("🔄 Restauration du français hardcodé...\n")
    
    # Charger les traductions
    translations = load_french_translations()
    
    if not translations:
        print("❌ Aucune traduction chargée. Arrêt.")
        return
    
    # Traiter les répertoires
    directories = [
        "app/client",
        "app/transporter", 
        "app/moderator",
        "app/admin",
        "components"
    ]
    
    total_modified = 0
    for directory in directories:
        print(f"\n📁 Traitement de {directory}/...")
        modified = process_directory(directory, translations)
        if modified:
            total_modified += modified
    
    print(f"\n✅ Terminé! {total_modified} fichiers modifiés.")
    print("\n⚠️  Note: Vérifiez manuellement les fichiers modifiés pour:")
    print("   - Les imports useLanguage supprimés")
    print("   - Les textes complexes avec variables")
    print("   - Les textes qui n'étaient pas dans le fichier de traductions")

if __name__ == "__main__":
    main()
