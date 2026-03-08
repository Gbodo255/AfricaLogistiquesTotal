/**
 * Africa Logistics — Templates d'emails premium
 * Design basé sur les standards de marque A-TRACKER.
 */

export const BRAND_COLORS = {
    primary: "#22C55E", // Vert Africa Logistics
    secondary: "#1E40AF", // Bleu
    dark: "#0F172A",
    light: "#F8FAFC",
    muted: "#64748B",
}

export function generateEmailTemplate(params: {
    title: string
    userName: string
    content: string
    ctaText?: string
    ctaLink?: string
}) {
    const { title, userName, content, ctaText, ctaLink } = params

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: ${BRAND_COLORS.light};
      margin: 0;
      padding: 0;
      color: ${BRAND_COLORS.dark};
    }
    .wrapper {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      margin-top: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #ffffff;
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid #edf2f7;
    }
    .content {
      padding: 40px 30px;
      line-height: 1.6;
    }
    .footer {
      background-color: ${BRAND_COLORS.dark};
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: ${BRAND_COLORS.primary};
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
    }
    .signature {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #edf2f7;
      font-size: 14px;
      color: ${BRAND_COLORS.muted};
    }
    .logo-footer {
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <img src="https://africa-logistics.bj/logo/AFRICA-LOGISTICS.png" alt="Africa Logistics" width="180">
    </div>
    
    <div class="content">
      <h1 style="font-size: 20px; margin-bottom: 20px;">Bonjour ${userName},</h1>
      <p>${content}</p>
      
      ${ctaText && ctaLink ? `<a href="${ctaLink}" class="button">${ctaText}</a>` : ""}
      
      <div class="signature">
        <p>L'équipe Africa Logistics</p>
        <p style="font-size: 12px;">Pionnier de la logistique digitale en Afrique.</p>
      </div>
    </div>
    
    <div class="footer">
      <div class="logo-footer">
        <img src="https://africa-logistics.bj/logo/AFRICA-LOGISTICS-NEGATIF.png" alt="Africa Logistics" width="120">
      </div>
      <p style="font-size: 12px; margin-bottom: 10px;">
        Abomey-Calavi, Bénin • contact@africa-logistics.bj • +229 21 XX XX XX
      </p>
      <p style="font-size: 11px; color: ${BRAND_COLORS.muted};">
        © 2025 Africa Logistics. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
  `
}
