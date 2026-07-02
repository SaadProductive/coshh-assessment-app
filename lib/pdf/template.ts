import { Substance, AssessmentFormData } from '@/lib/types'

interface PdfData {
  substance: Substance
  formData: Partial<AssessmentFormData>
  assessmentDate: string
  watermarked: boolean
}

const RISK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Low:    { bg: '#D5F5E3', text: '#1E8449', border: '#1E8449' },
  Medium: { bg: '#FDEBD0', text: '#935116', border: '#D35400' },
  High:   { bg: '#FADBD8', text: '#922B21', border: '#C0392B' },
}

// WEL data from HSE EH40/2005 (2020 edition). TWA = 8-hr average. STEL = 15-min limit.
const WEL_DATA: Record<string, { twaPpm?: string; twaMg?: string; stelPpm?: string; stelMg?: string; notes?: string }> = {
  'Sodium Hypochlorite':              { twaPpm: 'Not established', twaMg: 'Not established', notes: 'No formal WEL. Chlorine released if mixed with acid: TWA 0.5ppm/1.5mg/m3, STEL 1ppm/2.9mg/m3.' },
  'Hydrogen Peroxide':                { twaPpm: '1', twaMg: '1.4', stelPpm: '2', stelMg: '2.8', notes: 'EH40 Table 1. Skin absorption possible.' },
  'Ammonia Solution':                 { twaPpm: '25', twaMg: '18', stelPpm: '35', stelMg: '25', notes: 'EH40 Table 1.' },
  'Isopropyl Alcohol':                { twaPpm: '400', twaMg: '999', stelPpm: '500', stelMg: '1250', notes: 'EH40 Table 1. Skin notation.' },
  'Hydrochloric Acid (Descaler)':     { twaPpm: '1', twaMg: '2', stelPpm: '5', stelMg: '8', notes: 'EH40 Table 1 (Hydrogen chloride). Ceiling limit applies.' },
  'Sodium Hydroxide (Caustic Cleaner)': { twaPpm: 'Not established', twaMg: '2', stelPpm: 'Not established', stelMg: '2', notes: 'EH40 Table 1. Ceiling value — not to be exceeded at any time.' },
  'Methyl/Ethyl Methacrylate (Acrylic Nail Liquid)': { twaPpm: '50', twaMg: '210', stelPpm: '100', stelMg: '420', notes: 'EH40 Table 1. Skin sensitiser — Sen notation.' },
  'p-Phenylenediamine (PPD) — Permanent Hair Colour': { twaMg: '0.1', notes: 'EH40 Table 1. Skin and respiratory sensitiser. ALARP principle applies.' },
  'Acetone (Nail Polish Remover)':    { twaPpm: '500', twaMg: '1210', stelPpm: '1500', stelMg: '3620', notes: 'EH40 Table 1.' },
}

const STORAGE_DISPOSAL: Record<string, { storage: string; disposal: string; spillage: string }> = {
  'Sodium Hypochlorite': {
    storage: 'Store in a cool, well-ventilated area away from direct sunlight. Keep in original container tightly closed. Store separately from acids, ammonia products, and flammable materials. Lock away if accessible to public.',
    disposal: 'Do not pour concentrated product down the drain. Dilute heavily with water for small quantities. Contact local council for guidance on larger quantities. Never dispose of in septic tank systems.',
    spillage: 'Ventilate the area immediately. Wear full PPE before approaching. Absorb with inert material (sand or vermiculite) — do NOT use sawdust or combustible material. Collect in a sealed container. Wash area with water. Do not allow entry to drains or watercourses.',
  },
  'Hydrogen Peroxide': {
    storage: 'Store in a cool, dark, well-ventilated area. Keep away from heat and direct sunlight. Store in original container — do not use metal containers. Keep away from combustible materials and reducing agents.',
    disposal: 'Dilute heavily with water before disposing to drain. Do not pour concentrated product into drains. Contact local authority for quantities above 1 litre.',
    spillage: 'Ventilate the area. Wear PPE. Dilute spill with large quantities of water. Absorb with inert material. Do not use paper, sawdust, or organic materials (fire risk with concentrated peroxide). Wash area thoroughly.',
  },
  'Ammonia Solution': {
    storage: 'Store in a cool, well-ventilated area. Keep tightly closed. Store away from chlorine-containing products (toxic gas risk). Keep away from heat and open flames.',
    disposal: 'Dilute heavily with water and dispose to drain in small quantities. Larger quantities require disposal via licensed waste contractor.',
    spillage: 'Evacuate and ventilate immediately. Wear full PPE including respiratory protection. Absorb with dry inert material. Do not wash to drain without heavy dilution. Report significant spills to local authority.',
  },
  'Isopropyl Alcohol': {
    storage: 'Store in a cool, well-ventilated area away from ignition sources. Keep in tightly closed original container. Store away from oxidising agents. Flammable.',
    disposal: 'Do not pour down the drain in large quantities. Small quantities: dilute with large amounts of water. Contact licensed waste contractor for larger volumes.',
    spillage: 'Eliminate all ignition sources immediately. Ventilate. Wear PPE. Absorb with inert material. Do not allow to enter drains — explosion hazard. Dispose of via licensed contractor.',
  },
  'Hydrochloric Acid (Descaler)': {
    storage: 'Store in a cool, well-ventilated area. Keep in original container. Store separately from alkalis, oxidising agents, metals. Do not store near bleach or ammonia. Keep locked.',
    disposal: 'Neutralise with sodium bicarbonate before disposal to drain in small quantities. Contact local authority for larger quantities.',
    spillage: 'Ventilate. Wear full PPE including respiratory protection. Neutralise carefully with sodium bicarbonate. Absorb with inert material after neutralising. Do not allow to enter drains.',
  },
  'Sodium Hydroxide (Caustic Cleaner)': {
    storage: 'Store in a cool, dry, well-ventilated area. Keep tightly closed. Store away from acids, metals (aluminium, zinc, tin). Absorbs moisture — keep dry. Keep locked.',
    disposal: 'Neutralise with dilute acid or large quantities of water before disposing to drain. Contact licensed waste contractor for larger quantities.',
    spillage: 'Wear full PPE before approaching — burns can occur without immediate pain. Do NOT add water directly to solid spill (violent heat generation). Contain liquid spill with inert absorbent. Neutralise carefully. Wash area with large quantities of water.',
  },
  'Methyl/Ethyl Methacrylate (Acrylic Nail Liquid)': {
    storage: 'Store in a cool, well-ventilated area away from ignition sources. Keep in tightly sealed original container. Flammable.',
    disposal: 'Do not pour down drains. Dispose via licensed waste contractor.',
    spillage: 'Eliminate all ignition sources immediately. Ventilate. Wear PPE. Absorb with inert material. Seal in container. Dispose via licensed contractor.',
  },
  'p-Phenylenediamine (PPD) — Permanent Hair Colour': {
    storage: 'Store in original packaging in a cool, dry place. Keep tightly closed between uses. Keep away from children.',
    disposal: 'Mixed product: use immediately or dispose of. Unmixed: dispose via normal waste in original sealed packaging.',
    spillage: 'Wear nitrile gloves. Absorb with paper towels or inert material. Clean with soap and water. Avoid direct skin contact during cleanup.',
  },
  'Acetone (Nail Polish Remover)': {
    storage: 'Store in a cool, well-ventilated area away from all ignition sources. Keep in tightly sealed container. Highly flammable.',
    disposal: 'Small quantities: dilute with large amounts of water. Dispose via licensed waste contractor for larger volumes.',
    spillage: 'Eliminate all ignition sources immediately. Ventilate. Wear PPE. Absorb with inert material. Do not allow to enter drains. Dispose via licensed contractor.',
  },
}

const PICTOGRAM_KEYS: Record<string, string[]> = {
  'Sodium Hypochlorite':              ['corrosive', 'oxidising'],
  'Hydrogen Peroxide':                ['oxidising', 'corrosive'],
  'Ammonia Solution':                 ['corrosive', 'toxic'],
  'Isopropyl Alcohol':                ['flammable', 'irritant'],
  'Hydrochloric Acid (Descaler)':     ['corrosive'],
  'Sodium Hydroxide (Caustic Cleaner)': ['corrosive'],
  'Methyl/Ethyl Methacrylate (Acrylic Nail Liquid)': ['flammable', 'sensitiser'],
  'p-Phenylenediamine (PPD) — Permanent Hair Colour': ['sensitiser', 'health_hazard'],
  'Acetone (Nail Polish Remover)':    ['flammable', 'irritant'],
}

const PICTOGRAM_LABELS: Record<string, { emoji: string; label: string; color: string }> = {
  corrosive:     { emoji: '🧪', label: 'Corrosive',     color: '#C0392B' },
  oxidising:     { emoji: '🔥', label: 'Oxidising',     color: '#D35400' },
  flammable:     { emoji: '🔥', label: 'Flammable',     color: '#D35400' },
  toxic:         { emoji: '☠️', label: 'Toxic',          color: '#922B21' },
  irritant:      { emoji: '⚠️', label: 'Irritant',       color: '#D35400' },
  sensitiser:    { emoji: '⚠️', label: 'Sensitiser',     color: '#D35400' },
  health_hazard: { emoji: '⚕️', label: 'Health Hazard',  color: '#2471A3' },
}

function esc(str: string): string {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')
}

function pictogramsHtml(name: string): string {
  const keys = PICTOGRAM_KEYS[name] || []
  if (!keys.length) return '<p style="font-size:12px;color:#5D6D7E;font-style:italic;">No specific GHS pictograms assigned. Consult product SDS.</p>'
  return '<div style="display:flex;gap:16px;flex-wrap:wrap;">' + keys.map(k => {
    const p = PICTOGRAM_LABELS[k]
    return `<div style="text-align:center;width:72px;border:2px solid ${p.color};border-radius:6px;padding:6px 4px;background:white;">
      <div style="font-size:28px;line-height:1.2;">${p.emoji}</div>
      <div style="font-size:9px;font-weight:bold;color:${p.color};margin-top:4px;">${p.label}</div>
    </div>`
  }).join('') + '</div>'
}

function welHtml(name: string): string {
  const w = WEL_DATA[name]
  if (!w) return '<p style="font-size:12px;color:#5D6D7E;">No WEL data available. Consult HSE EH40/2005.</p>'
  return `<table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:6px;">
    <tr style="background:#1A5276;color:white;"><th style="padding:6px 10px;text-align:left;">Limit Type</th><th style="padding:6px 10px;text-align:left;">ppm</th><th style="padding:6px 10px;text-align:left;">mg/m³</th></tr>
    <tr style="background:#F2F3F4;"><td style="padding:6px 10px;">Long-term (8-hr TWA)</td><td style="padding:6px 10px;">${esc(w.twaPpm||'—')}</td><td style="padding:6px 10px;">${esc(w.twaMg||'—')}</td></tr>
    <tr style="background:white;"><td style="padding:6px 10px;">Short-term (15-min STEL)</td><td style="padding:6px 10px;">${esc(w.stelPpm||'—')}</td><td style="padding:6px 10px;">${esc(w.stelMg||'—')}</td></tr>
  </table>${w.notes ? `<p style="font-size:11px;color:#5D6D7E;margin-top:5px;font-style:italic;">Note: ${esc(w.notes)}</p>` : ''}`
}

function storageHtml(name: string): string {
  const s = STORAGE_DISPOSAL[name]
  if (!s) return '<p style="font-size:12px;color:#5D6D7E;font-style:italic;">Consult the product Safety Data Sheet for storage and disposal information.</p>'
  return `<div style="margin-bottom:14px;"><div style="font-weight:bold;font-size:12px;color:#1A5276;margin-bottom:4px;">Storage Requirements</div><p style="font-size:12px;line-height:1.6;">${esc(s.storage)}</p></div>
  <div><div style="font-weight:bold;font-size:12px;color:#1A5276;margin-bottom:4px;">Disposal</div><p style="font-size:12px;line-height:1.6;">${esc(s.disposal)}</p></div>`
}

function spillageHtml(name: string): string {
  const s = STORAGE_DISPOSAL[name]
  return s ? `<p style="font-size:12px;line-height:1.6;">${esc(s.spillage)}</p>` : '<p style="font-size:12px;color:#5D6D7E;font-style:italic;">Consult the product Safety Data Sheet.</p>'
}

const FOOTER_HTML = (company: string, page: number) =>
  `<div style="position:absolute;bottom:24px;left:56px;right:56px;font-size:10px;color:#95A5A6;border-top:1px solid #EAECEE;padding-top:8px;display:flex;justify-content:space-between;align-items:center;">
    <span>${esc(company)}</span>
    <span>Generated by coshhassessments.uk</span>
    <span>Page ${page}</span>
  </div>`

export function buildAssessmentHtml({ substance, formData, assessmentDate, watermarked }: PdfData): string {
  const d = new Date(assessmentDate)
  const rev = new Date(d); rev.setFullYear(rev.getFullYear() + 1)
  const fmt = (x: Date) => x.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const risk = formData.riskRating || 'Medium'
  const rc = RISK_COLORS[risk] || RISK_COLORS.Medium
  const co = formData.companyName || '—'
  const controls = (formData.controlMeasures||'').split('\n').filter(Boolean).map(c=>`<li style="margin-bottom:5px;">${esc(c)}</li>`).join('')
  const ppe = (formData.ppeRequired||'').split('\n').filter(Boolean).map(p=>`<li style="margin-bottom:5px;">${esc(p)}</li>`).join('')

  const wmHtml = watermarked
    ? `<div style="position:fixed;top:42%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:46px;color:rgba(180,30,30,0.10);font-weight:900;font-family:Arial;z-index:9999;pointer-events:none;white-space:nowrap;letter-spacing:3px;">FREE — UPGRADE AT COSHHASSESSMENTS.UK</div>`
    : ''

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @page{margin:0;size:A4;}*{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:Arial,Helvetica,sans-serif;color:#2C3E50;background:white;}
  .pg{padding:44px 56px 70px 56px;page-break-after:always;position:relative;min-height:297mm;}
  .pg:last-child{page-break-after:avoid;}
  .hdr{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #1A5276;padding-bottom:12px;margin-bottom:20px;}
  .hdr h1{font-size:20px;color:#1A5276;font-weight:bold;}
  .hdr h2{font-size:12px;color:#2471A3;font-weight:normal;margin-top:3px;}
  .hdr-r{font-size:10px;color:#95A5A6;text-align:right;}
  .st{font-size:13px;color:#1A5276;font-weight:bold;margin-top:20px;margin-bottom:8px;border-bottom:1px solid #D6EAF8;padding-bottom:5px;}
  .mt{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;}
  .mt td{padding:7px 10px;border:1px solid #E5E8E8;}
  .mt .lb{background:#F2F3F4;font-weight:bold;color:#5D6D7E;width:38%;}
  .rb{display:inline-block;padding:5px 22px;border-radius:20px;font-weight:bold;font-size:14px;background:${rc.bg};color:${rc.text};border:2px solid ${rc.border};}
  .em{background:#FDEDEC;border-left:4px solid #C0392B;padding:14px 16px;border-radius:4px;font-size:12px;line-height:1.7;}
  .sp{background:#FEF9E7;border-left:4px solid #D4AC0D;padding:14px 16px;border-radius:4px;}
  .ds{background:#F2F3F4;padding:12px 16px;border-radius:6px;font-size:10px;color:#5D6D7E;line-height:1.5;margin-top:16px;}
  .ib{background:#EBF5FB;border:1px solid #AED6F1;border-radius:6px;padding:12px 16px;font-size:12px;line-height:1.6;margin-top:10px;}
  ul{padding-left:18px;margin:6px 0;}li{font-size:12px;line-height:1.6;}
</style></head><body>
${wmHtml}

<div class="pg" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding-top:70px;">
  <div style="background:#1A5276;color:white;padding:12px 36px;border-radius:6px;font-size:12px;font-weight:bold;margin-bottom:28px;letter-spacing:1px;">COSHH ASSESSMENT — CONTROL OF SUBSTANCES HAZARDOUS TO HEALTH REGULATIONS 2002</div>
  <h1 style="font-size:30px;color:#1A5276;margin-bottom:8px;">${esc(substance.substance_name)}</h1>
  <p style="font-size:14px;color:#2471A3;margin-bottom:40px;">Prepared in accordance with the COSHH Regulations 2002</p>
  <div style="border:2px solid #1A5276;border-radius:8px;padding:24px 44px;min-width:360px;text-align:left;">
    <table style="width:100%;border-collapse:collapse;font-size:13px;line-height:2.2;">
      <tr><td style="color:#5D6D7E;font-weight:bold;width:140px;">Company</td><td>${esc(co)}</td></tr>
      <tr><td style="color:#5D6D7E;font-weight:bold;">Assessor</td><td>${esc(formData.assessorName||'—')}</td></tr>
      <tr><td style="color:#5D6D7E;font-weight:bold;">Date Prepared</td><td>${fmt(d)}</td></tr>
      <tr><td style="color:#5D6D7E;font-weight:bold;">Review Due</td><td style="font-weight:bold;">${fmt(rev)}</td></tr>
      <tr><td style="color:#5D6D7E;font-weight:bold;">Risk Rating</td><td><span class="rb">${esc(risk)}</span></td></tr>
    </table>
  </div>
  ${FOOTER_HTML(co, 1)}
</div>

<div class="pg">
  <div class="hdr"><div><h1>Substance Details &amp; Hazard Classification</h1><h2>${esc(substance.substance_name)}</h2></div><div class="hdr-r">${esc(co)}<br>${fmt(d)}</div></div>
  <table class="mt">
    <tr><td class="lb">Substance Name</td><td>${esc(substance.substance_name)}</td><td class="lb">CAS Number</td><td>${esc(substance.cas_number||'Not specified')}</td></tr>
    <tr><td class="lb">Common / Trade Names</td><td colspan="3">${esc(substance.common_names.join(', '))}</td></tr>
    <tr><td class="lb">Physical Form</td><td>${esc(substance.physical_form||'—')}</td><td class="lb">Supplier / Manufacturer</td><td>As per product SDS</td></tr>
  </table>
  <div class="st">GHS Hazard Pictograms</div>
  ${pictogramsHtml(substance.substance_name)}
  <div class="st">GHS Hazard Classification</div>
  <p style="font-size:12px;line-height:1.7;">${esc(substance.ghs_classification)}</p>
  <div class="st">Workplace Exposure Limits (WELs) — HSE EH40/2005</div>
  ${welHtml(substance.substance_name)}
  <div class="st">Health Effects</div>
  <p style="font-size:12px;line-height:1.7;">${esc(substance.health_effects)}</p>
  ${FOOTER_HTML(co, 2)}
</div>

<div class="pg">
  <div class="hdr"><div><h1>Exposure Assessment</h1><h2>${esc(substance.substance_name)}</h2></div><div class="hdr-r">${esc(co)}<br>${fmt(d)}</div></div>
  <table class="mt">
    <tr><td class="lb">How Used</td><td colspan="3">${esc(formData.howUsed||'—')}</td></tr>
    <tr><td class="lb">Frequency</td><td style="text-transform:capitalize;">${esc(formData.frequency||'—')}</td><td class="lb">Quantity Per Session</td><td>${esc(formData.quantityUsed||'—')}</td></tr>
    <tr><td class="lb">Who is Exposed</td><td>${esc(formData.whoIsExposed||'—')}</td><td class="lb">Duration of Exposure</td><td>${esc(formData.durationOfExposure||'—')}</td></tr>
    <tr><td class="lb">Existing Controls</td><td colspan="3">${esc(formData.existingControls||'None reported at time of assessment.')}</td></tr>
    <tr><td class="lb">PPE Currently Available</td><td colspan="3">${esc(formData.currentPpeAvailable||'None reported at time of assessment.')}</td></tr>
  </table>
  <div class="st">Routes of Exposure</div>
  <ul>${substance.exposure_routes.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>
  <div class="ib"><strong>Note on Exposure Monitoring:</strong> Where WELs have been established for this substance (see Page 2), consider whether air monitoring is required to verify workplace concentrations remain within legal limits for daily or frequent use. Consult HSE guidance or an occupational hygienist if in doubt.</div>
  ${FOOTER_HTML(co, 3)}
</div>

<div class="pg">
  <div class="hdr"><div><h1>Risk Evaluation &amp; Control Measures</h1><h2>${esc(substance.substance_name)}</h2></div><div class="hdr-r">${esc(co)}<br>${fmt(d)}</div></div>
  <div style="text-align:center;margin:20px 0 16px;">
    <div style="font-size:11px;color:#5D6D7E;font-weight:bold;letter-spacing:1px;margin-bottom:8px;">OVERALL RISK RATING</div>
    <span class="rb" style="font-size:17px;padding:7px 36px;">${esc(risk)}</span>
    <p style="font-size:11px;color:#5D6D7E;margin-top:8px;font-style:italic;">Suggested rating based on substance hazard class and reported workplace exposure. Must be confirmed by a competent person.</p>
  </div>
  <div class="st">Required Control Measures</div>
  <ul>${controls}</ul>
  <div class="st">Required PPE</div>
  <ul>${ppe}</ul>
  ${FOOTER_HTML(co, 4)}
</div>

<div class="pg">
  <div class="hdr"><div><h1>Storage, Disposal &amp; Spillage</h1><h2>${esc(substance.substance_name)}</h2></div><div class="hdr-r">${esc(co)}<br>${fmt(d)}</div></div>
  <div class="st">Storage &amp; Disposal</div>
  ${storageHtml(substance.substance_name)}
  <div class="st">Spillage Procedure</div>
  <div class="sp">
    <div style="font-weight:bold;font-size:12px;color:#7D6608;margin-bottom:8px;">In the event of a spillage:</div>
    ${spillageHtml(substance.substance_name)}
  </div>
  ${FOOTER_HTML(co, 5)}
</div>

<div class="pg">
  <div class="hdr"><div><h1>Emergency Procedures</h1><h2>${esc(substance.substance_name)}</h2></div><div class="hdr-r">${esc(co)}<br>${fmt(d)}</div></div>
  <div class="em">
    <div style="font-weight:bold;font-size:13px;color:#922B21;margin-bottom:12px;">In case of exposure or accident:</div>
    <div style="margin-bottom:8px;"><strong style="color:#922B21;">Skin Contact: </strong>${esc(substance.emergency_procedure.skin)}</div>
    <div style="margin-bottom:8px;"><strong style="color:#922B21;">Eye Contact: </strong>${esc(substance.emergency_procedure.eyes)}</div>
    <div style="margin-bottom:8px;"><strong style="color:#922B21;">Inhalation: </strong>${esc(substance.emergency_procedure.inhalation)}</div>
    <div><strong style="color:#922B21;">Ingestion: </strong>${esc(substance.emergency_procedure.ingestion)}</div>
  </div>
  <div style="background:#FDEDEC;border:1px solid #F1948A;border-radius:6px;padding:12px 16px;margin-top:14px;font-size:12px;">
    <strong>Emergency Services:</strong> UK emergency: call <strong>999</strong>. Medical advice: <strong>NHS 111</strong>. Poisons information (healthcare professionals): TOXBASE at toxbase.org.
  </div>
  <div class="ds"><strong>Legal disclaimer:</strong> This assessment is produced by coshhassessments.uk to assist employers under the COSHH Regulations 2002. The employer remains legally responsible for the suitability and sufficiency of all assessments for their specific workplace. Hazard data, WELs, and emergency procedures are drawn from HSE EH40/2005, manufacturer SDS sheets, and UKHSA guidance current at time of preparation. Cross-check against the product's own SDS before relying on this assessment. This is not professional health and safety consultancy advice.</div>
  ${FOOTER_HTML(co, 6)}
</div>

<div class="pg">
  <div class="hdr"><div><h1>Assessment Sign-Off &amp; Review Record</h1><h2>${esc(substance.substance_name)}</h2></div><div class="hdr-r">${esc(co)}<br>${fmt(d)}</div></div>
  <table class="mt" style="margin-bottom:20px;">
    <tr><td class="lb">Assessment Date</td><td>${fmt(d)}</td><td class="lb">Document Version</td><td>1.0</td></tr>
    <tr><td class="lb">Next Review Due</td><td style="font-weight:bold;color:#922B21;">${fmt(rev)}</td><td class="lb">Assessor</td><td>${esc(formData.assessorName||'—')}</td></tr>
    <tr><td class="lb">Company</td><td>${esc(co)}</td><td class="lb">Regulation Reference</td><td>Regulation 6, COSHH 2002</td></tr>
  </table>
  <div class="ib" style="margin-bottom:22px;"><strong>Review Requirements:</strong> This assessment must be reviewed at least annually, and immediately if: the substance or process changes; the assessment is no longer valid; monitoring results require it; or an incident occurs.</div>
  <div style="display:flex;justify-content:space-between;margin-top:32px;">
    <div style="border-top:1px solid #2C3E50;padding-top:6px;font-size:11px;color:#5D6D7E;width:44%;">Assessor Signature<br><br><br><span style="font-size:12px;">${esc(formData.assessorName||'—')}</span></div>
    <div style="border-top:1px solid #2C3E50;padding-top:6px;font-size:11px;color:#5D6D7E;width:44%;">Date Signed<br><br><br><span style="font-size:12px;">${fmt(d)}</span></div>
  </div>
  <div style="margin-top:28px;padding:12px 16px;border:1px dashed #AED6F1;border-radius:6px;font-size:11px;color:#5D6D7E;">
    <strong>Review History</strong>
    <table style="width:100%;border-collapse:collapse;font-size:11px;margin-top:8px;">
      <tr style="background:#F2F3F4;"><th style="padding:5px 8px;text-align:left;border:1px solid #E5E8E8;">Review Date</th><th style="padding:5px 8px;text-align:left;border:1px solid #E5E8E8;">Reviewed By</th><th style="padding:5px 8px;text-align:left;border:1px solid #E5E8E8;">Changes Made</th><th style="padding:5px 8px;text-align:left;border:1px solid #E5E8E8;">Signature</th></tr>
      <tr><td style="padding:10px 8px;border:1px solid #E5E8E8;">&nbsp;</td><td style="padding:10px 8px;border:1px solid #E5E8E8;">&nbsp;</td><td style="padding:10px 8px;border:1px solid #E5E8E8;">&nbsp;</td><td style="padding:10px 8px;border:1px solid #E5E8E8;">&nbsp;</td></tr>
      <tr><td style="padding:10px 8px;border:1px solid #E5E8E8;">&nbsp;</td><td style="padding:10px 8px;border:1px solid #E5E8E8;">&nbsp;</td><td style="padding:10px 8px;border:1px solid #E5E8E8;">&nbsp;</td><td style="padding:10px 8px;border:1px solid #E5E8E8;">&nbsp;</td></tr>
    </table>
  </div>
  ${FOOTER_HTML(co, 7)}
</div>

</body></html>`
}
