"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

/**
 * Africa Logistics — Service de génération de PDF professionnels
 * Design inspiré du rapport "Social Media Monthly Report" fourni par l'utilisateur.
 */

/* ── Palette / brand ──────────────────────────────────── */
const BRAND = {
    primary: [29, 78, 216] as [number, number, number], // #1D4ED8
    accent: [5, 150, 105] as [number, number, number], // #059669
    dark: [15, 23, 42] as [number, number, number], // #0F172A
    muted: [100, 116, 139] as [number, number, number], // #64748B
    light: [248, 250, 252] as [number, number, number], // #F8FAFC
    white: [255, 255, 255] as [number, number, number],
    border: [226, 232, 240] as [number, number, number], // #E2E8F0
}

/* ── Helpers ──────────────────────────────────────────── */
function hexToRgb(c: [number, number, number]): [number, number, number] { return c }

function drawHeader(doc: jsPDF, title: string, subtitle: string, period: string) {
    const W = doc.internal.pageSize.getWidth()

    // ── Logos & Contact Info ──
    // Note: On utilise les chemins publics. jsPDF addImage accepte les URL si le serveur les sert.
    try {
        // Logo principal (gauche)
        doc.addImage("/logo/AFRICA LOGISTICS.png", "PNG", 14, 10, 45, 15)
    } catch (e) {
        // Fallback texte si l'image ne charge pas
        doc.setFont("helvetica", "bold")
        doc.setFontSize(14)
        doc.setTextColor(34, 197, 94)
        doc.text("AFRICA LOGISTICS", 14, 20)
    }

    // Infos de contact (droite)
    doc.setTextColor(...BRAND.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    const contactX = W - 14
    doc.text("Adresse : Abomey-Calavi, Bénin", contactX, 12, { align: "right" })
    doc.text("Email : contact@africa-logistics.bj", contactX, 16, { align: "right" })
    doc.text("Tél : +229 21 XX XX XX", contactX, 20, { align: "right" })

    // ── Ligne de séparation ──
    doc.setDrawColor(...BRAND.border)
    doc.setLineWidth(0.5)
    doc.line(14, 28, W - 14, 28)

    // ── Main title section ──
    doc.setTextColor(...BRAND.dark)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.text(title, 14, 45)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.setTextColor(...BRAND.muted)
    doc.text(subtitle, 14, 53)

    doc.setFontSize(9)
    doc.text(`Période : ${period}`, W - 14, 45, { align: "right" })

    // Decorative line
    doc.setDrawColor(34, 197, 94)
    doc.setLineWidth(1)
    doc.line(14, 57, 40, 57)
}

function drawKpiBar(
    doc: jsPDF,
    kpis: { label: string; value: string; change?: string }[],
    y: number
) {
    const W = doc.internal.pageSize.getWidth()
    const colW = (W - 28) / kpis.length
    kpis.forEach((kpi, i) => {
        const x = 14 + i * colW
        doc.setFont("helvetica", "bold")
        doc.setFontSize(18)
        doc.setTextColor(...BRAND.dark)
        doc.text(kpi.value, x, y)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.setTextColor(...BRAND.muted)
        doc.text(kpi.label, x, y + 6)
        if (kpi.change) {
            const positive = kpi.change.startsWith("+")
            doc.setTextColor(...(positive ? BRAND.accent : ([220, 38, 38] as [number, number, number])))
            doc.setFontSize(8)
            doc.text(kpi.change, x, y + 12)
        }
        // séparateur vertical
        if (i < kpis.length - 1) {
            doc.setDrawColor(...BRAND.border)
            doc.setLineWidth(0.3)
            doc.line(x + colW - 5, y - 8, x + colW - 5, y + 16)
        }
    })
}

function drawSectionTitle(doc: jsPDF, text: string, y: number) {
    const W = doc.internal.pageSize.getWidth()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.setTextColor(...BRAND.dark)
    doc.text(text, 14, y)
    doc.setDrawColor(...BRAND.primary)
    doc.setLineWidth(1.5)
    doc.line(14, y + 2, 14 + doc.getTextWidth(text), y + 2)
    // reset
    doc.setDrawColor(...BRAND.border)
    doc.setLineWidth(0.4)
}

function drawFooter(doc: jsPDF, page: number, total: number) {
    const W = doc.internal.pageSize.getWidth()
    const H = doc.internal.pageSize.getHeight()

    // Ligne de séparation
    doc.setDrawColor(...BRAND.border)
    doc.setLineWidth(0.5)
    doc.line(14, H - 20, W - 14, H - 20)

    doc.setTextColor(...BRAND.muted)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)

    // Gauche : Copyright & Info
    doc.text("© 2025 Africa Logistics. Tous droits réservés.", 14, H - 12)
    doc.text("Document généré automatiquement par la plateforme A-TRACKER.", 14, H - 8)

    // Droite : Confidentialité & Page
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...BRAND.dark)
    doc.text("CONFIDENTIEL", W - 14, H - 12, { align: "right" })

    doc.setFont("helvetica", "normal")
    doc.setTextColor(...BRAND.muted)
    doc.text(`Page ${page} / ${total}`, W - 14, H - 8, { align: "right" })

    const dateStr = `Généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    doc.text(dateStr, W / 2, H - 8, { align: "center" })
}

/* ═══════════════════════════════════════════════════════
   Export : historique client
═══════════════════════════════════════════════════════ */
export function generateClientHistoryPDF(params: {
    requests: any[]
    userName: string
    userEmail: string
    period?: string
}): Blob {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const { requests, userName, userEmail, period = "Toutes périodes" } = params

    drawHeader(doc, "Historique des transports", `Compte : ${userName}  •  ${userEmail}`, period)

    // ── KPIs ──
    const total = requests.length
    const totalFCFA = requests.reduce((s: number, r: any) => s + (parseFloat(r.estimated_price) || 0), 0)
    drawKpiBar(doc, [
        { label: "Livraisons totales", value: String(total) },
        { label: "Montant transporté", value: `${totalFCFA.toLocaleString()} FCFA` },
        { label: "Taux de réussite", value: total > 0 ? "100%" : "—" },
        { label: "Rapport généré par", value: userName.split(" ")[0] },
    ], 60)

    doc.line(14, 78, doc.internal.pageSize.getWidth() - 14, 78)

    // ── Tableau ──
    drawSectionTitle(doc, "Détail des livraisons", 86)

    autoTable(doc, {
        startY: 92,
        head: [["Référence", "Départ → Arrivée", "Date", "Transporteur", "Montant (FCFA)", "Statut"]],
        body: requests.map((r: any) => [
            r.slug || r.id,
            `${r.pickup_city || r.pickup_address || "—"} → ${r.delivery_city || r.delivery_address || "—"}`,
            r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR") : "—",
            r.assigned_transporter_name || "—",
            Number(r.estimated_price || 0).toLocaleString("fr-FR"),
            r.status || "—",
        ]),
        styles: { fontSize: 8, cellPadding: 3, textColor: BRAND.dark },
        headStyles: { fillColor: BRAND.primary, textColor: BRAND.white, fontStyle: "bold", fontSize: 8 },
        alternateRowStyles: { fillColor: BRAND.light },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 55 },
            2: { cellWidth: 22 },
            3: { cellWidth: 35 },
            4: { cellWidth: 25, halign: "right" },
            5: { cellWidth: 20 },
        },
        margin: { left: 14, right: 14 },
    })

    drawFooter(doc, 1, 1)
    return doc.output("blob")
}

/* ═══════════════════════════════════════════════════════
   Export : rapport admin
═══════════════════════════════════════════════════════ */
export function generateAdminReportPDF(params: {
    reportType: string
    reportTitle: string
    data: any[]
    columns: { header: string; key: string }[]
    kpis?: { label: string; value: string; change?: string }[]
    userName: string
    userEmail: string
    period?: string
}): Blob {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
    const { reportTitle, data, columns, kpis, userName, userEmail, period = "Toutes périodes" } = params

    drawHeader(doc, reportTitle, `Administrateur : ${userName}  •  ${userEmail}`, period)

    let y = 52
    if (kpis && kpis.length > 0) {
        drawKpiBar(doc, kpis, y + 8)
        y += 28
        doc.setDrawColor(...BRAND.border)
        doc.setLineWidth(0.4)
        doc.line(14, y, doc.internal.pageSize.getWidth() - 14, y)
        y += 8
    }

    drawSectionTitle(doc, `Données — ${reportTitle}`, y)

    autoTable(doc, {
        startY: y + 6,
        head: [columns.map(c => c.header)],
        body: data.map(row => columns.map(c => {
            const val = row[c.key]
            if (val === undefined || val === null) return "—"
            if (typeof val === "number") return val.toLocaleString("fr-FR")
            return String(val)
        })),
        styles: { fontSize: 8, cellPadding: 3, textColor: BRAND.dark },
        headStyles: { fillColor: BRAND.primary, textColor: BRAND.white, fontStyle: "bold", fontSize: 8 },
        alternateRowStyles: { fillColor: BRAND.light },
        margin: { left: 14, right: 14 },
    })

    drawFooter(doc, 1, 1)
    return doc.output("blob")
}

/* ═══════════════════════════════════════════════════════
   Utilitaire : télécharger + envoyer par email
═══════════════════════════════════════════════════════ */
export async function downloadAndEmailPDF(params: {
    blob: Blob
    filename: string
    userEmail: string
    reportTitle: string
}) {
    const { blob, filename, userEmail, reportTitle } = params

    // 1. Téléchargement direct
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)

    // 2. Envoi par email (via API Django)
    try {
        const token = localStorage.getItem("django_token")
        const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000/api/africa_logistic"

        const formData = new FormData()
        formData.append("pdf", blob, filename)
        formData.append("email", userEmail)
        formData.append("report_title", reportTitle)

        const response = await fetch(`${DJANGO_API_URL}/reports/send-email/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        return { success: response.ok }
    } catch (error) {
        console.warn("Envoi email échoué (non bloquant) :", error)
        return { success: false, error }
    }
}
