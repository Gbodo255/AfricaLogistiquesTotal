# APIs Gratuites pour la Traduction

Voici une liste d'APIs gratuites que vous pouvez utiliser pour gérer facilement la traduction de votre plateforme :

## 1. **Google Cloud Translation API (Gratuit jusqu'à 500k caractères/mois)**
- **URL**: https://cloud.google.com/translate/docs/reference/rest
- **Avantages**: 
  - Très précise
  - Supporte 100+ langues
  - Gratuit jusqu'à 500,000 caractères par mois
- **Inconvénients**: Nécessite un compte Google Cloud
- **Documentation**: https://cloud.google.com/translate/docs

## 2. **LibreTranslate (100% Gratuit et Open Source)**
- **URL**: https://libretranslate.com/
- **API Endpoint**: https://libretranslate.de/translate
- **Avantages**: 
  - 100% gratuit et open source
  - Pas besoin de clé API pour l'usage basique
  - Auto-hébergement possible
- **Inconvénients**: 
  - Qualité légèrement inférieure à Google
  - Limite de taux (rate limiting)
- **Exemple d'utilisation**:
```javascript
fetch('https://libretranslate.de/translate', {
  method: 'POST',
  body: JSON.stringify({
    q: 'Bonjour',
    source: 'fr',
    target: 'en',
    format: 'text'
  }),
  headers: { 'Content-Type': 'application/json' }
})
```

## 3. **MyMemory Translation API (Gratuit jusqu'à 10,000 mots/jour)**
- **URL**: https://mymemory.translated.net/
- **Avantages**: 
  - Gratuit jusqu'à 10,000 mots par jour
  - Pas besoin d'inscription pour l'usage basique
  - API simple
- **Inconvénients**: Limite quotidienne
- **Exemple d'utilisation**:
```javascript
fetch('https://api.mymemory.translated.net/get?q=Bonjour&langpair=fr|en')
```

## 4. **DeepL API (Gratuit jusqu'à 500k caractères/mois)**
- **URL**: https://www.deepl.com/docs-api
- **Avantages**: 
  - Qualité de traduction excellente
  - Gratuit jusqu'à 500,000 caractères par mois
  - Supporte le français et l'anglais
- **Inconvénients**: Nécessite une clé API
- **Documentation**: https://www.deepl.com/docs-api

## 5. **Microsoft Azure Translator (Gratuit jusqu'à 2M caractères/mois)**
- **URL**: https://azure.microsoft.com/services/cognitive-services/translator/
- **Avantages**: 
  - Très généreux (2M caractères/mois gratuit)
  - Qualité professionnelle
  - Supporte 100+ langues
- **Inconvénients**: Nécessite un compte Azure
- **Documentation**: https://docs.microsoft.com/azure/cognitive-services/translator/

## 6. **Yandex Translate API (Gratuit jusqu'à 10M caractères/mois)**
- **URL**: https://translate.yandex.com/developers
- **Avantages**: 
  - Très généreux (10M caractères/mois)
  - Gratuit avec clé API
- **Inconvénients**: Nécessite une clé API
- **Documentation**: https://yandex.com/dev/translate/

## Recommandation pour votre projet

Pour votre plateforme Africa Logistics, je recommande :

1. **Pour commencer rapidement**: **LibreTranslate** - Pas besoin de clé API, 100% gratuit
2. **Pour la production**: **Google Cloud Translation** ou **Azure Translator** - Meilleure qualité et limites généreuses

## Exemple d'intégration avec Next.js

```typescript
// lib/translation.ts
export async function translateText(text: string, targetLang: 'fr' | 'en'): Promise<string> {
  // Option 1: LibreTranslate (gratuit, pas de clé API)
  const response = await fetch('https://libretranslate.de/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: targetLang === 'en' ? 'fr' : 'en',
      target: targetLang,
      format: 'text'
    })
  })
  
  const data = await response.json()
  return data.translatedText
}

// Utilisation dans un composant
const translatedText = await translateText('Bonjour', 'en') // Returns 'Hello'
```

## Alternative: Service de traduction côté serveur

Vous pouvez aussi créer un endpoint API dans Next.js qui cache les traductions :

```typescript
// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { text, targetLang } = await request.json()
  
  // Utiliser votre API de traduction préférée
  const translated = await translateText(text, targetLang)
  
  return NextResponse.json({ translated })
}
```
