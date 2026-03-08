// Script pour restaurer le français hardcodé dans toutes les pages
// Ce script remplace les appels t() par les textes français correspondants

const fs = require('fs');
const path = require('path');

// Mapping des clés de traduction vers les textes français
const frenchTranslations = {
  // Navigation
  "nav.dashboard": "Tableau de bord",
  "nav.requests": "Mes demandes",
  "nav.wallet": "Portefeuille",
  "nav.tracking": "Suivi A-Tracking",
  "nav.history": "Historique",
  "nav.profile": "Mon profil",
  "nav.logout": "Déconnexion",
  "nav.settings": "Paramètres",
  "nav.users": "Utilisateurs",
  "nav.transporters": "Transporteurs",
  "nav.finance": "Finances",
  "nav.reports": "Rapports",
  "nav.roles": "Rôles & Permissions",
  "nav.assignments": "Affectations",
  "nav.disputes": "Litiges",
  "nav.notifications": "Notifications",
  "nav.missions": "Mes missions",
  "nav.fleet": "Ma flotte",
  "nav.navigation": "Navigation",
  "nav.ratings": "Évaluations",
  
  // Dashboard
  "dashboard.welcome": "Bienvenue",
  "dashboard.overview": "Voici un aperçu de vos opérations logistiques",
  "dashboard.active_requests": "Demandes en cours",
  "dashboard.successful_deliveries": "Livraisons réussies",
  "dashboard.pending": "En attente",
  "dashboard.picked_up": "Enlevé",
  "dashboard.cancelled": "Annulé",
  "dashboard.low_balance": "Solde faible",
  "dashboard.low_balance_desc": "Votre solde est faible. Rechargez votre portefeuille pour continuer à utiliser nos services.",
  "dashboard.recent_requests": "Demandes récentes",
  "dashboard.view_all": "Voir tout",
  "dashboard.no_requests": "Aucune demande",
  "dashboard.quick_actions": "Actions rapides",
  "dashboard.track_deliveries": "Suivre mes livraisons",
  "dashboard.view_map": "Voir sur la carte",
  
  // Wallet
  "wallet.balance": "Solde portefeuille",
  "wallet.recharge": "Recharger",
  "wallet.withdraw": "Retirer",
  
  // Requests
  "requests.new": "Nouvelle demande",
  "requests.create": "Créez une demande de transport",
  "requests.in_transit": "En transit",
  "requests.delivered": "Livré",
  "requests.assigned": "Assigné",
  "requests.in_progress": "En cours",
  "requests.status": "Statut",
  
  // Common
  "common.recharge": "Recharger",
  "common.new_request": "Nouvelle demande de transport",
  "common.recharge_wallet": "Recharger mon portefeuille",
  
  // Tracking
  "tracking.live": "Suivi en direct",
  "tracking.active_deliveries": "Livraisons actives",
};

function replaceTranslations(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remplacer les appels t("key") par les textes français
  for (const [key, frenchText] of Object.entries(frenchTranslations)) {
    const pattern = new RegExp(`t\\(["']${key.replace(/\./g, '\\.')}["']\\)`, 'g');
    if (content.match(pattern)) {
      content = content.replace(pattern, `"${frenchText}"`);
      modified = true;
    }
  }
  
  // Supprimer les imports useLanguage si plus utilisés
  if (modified && !content.match(/t\(/)) {
    content = content.replace(/import\s+{\s*useLanguage\s*}\s+from\s+["']@\/lib\/i18n\/context["'];?\n?/g, '');
    content = content.replace(/const\s+{\s*t\s*}\s*=\s*useLanguage\(\);?\n?/g, '');
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Modifié: ${filePath}`);
  }
}

// Fonction récursive pour parcourir les dossiers
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      replaceTranslations(filePath);
    }
  }
}

// Démarrer le traitement
console.log('Début de la restauration du français...');
processDirectory('./app');
console.log('Terminé!');
