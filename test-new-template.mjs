import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import fs from 'fs';

// Simulate what the template produces
const RISK_COLORS = { Low: '#1E8449', Medium: '#E67E22', High: '#C0392B' }
const RISK_BG = { Low: '#D5F5E3', Medium: '#FDEBD0', High: '#FADBD8' }

const substance = {
  substance_name: 'Hydrogen Peroxide',
  common_names: ['Peroxide', 'Developer', '20 Vol Developer', '30 Vol Developer'],
  cas_number: '7722-84-1',
  physical_form: 'Liquid / powder-cream developer',
  ghs_classification: 'Oxidising Liquid Cat 1 (H271), Acute Toxicity Cat 4 (H302, H332), Skin Corrosive 1A (H314), Eye Damage 1 (H318) at concentrated strength.',
  health_effects: 'Irritation of nose, throat, airway on inhalation. Skin redness/irritation to burns at higher concentrations. Hairdressers using peroxide-based products are at elevated risk of occupational contact dermatitis.',
  exposure_routes: ['Skin contact (mixing splashes)', 'Eye contact', 'Inhalation of vapour during mixing'],
  emergency_procedure: {
    skin: 'Wash immediately with water. Seek medical advice if irritation persists.',
    eyes: 'Rinse immediately with plenty of water. Seek medical advice if irritation persists.',
    inhalation: 'Move to fresh air. Seek medical attention if symptoms develop.',
    ingestion: 'Rinse mouth thoroughly. Seek medical attention.'
  },
  default_controls: ['Mix in a well-ventilated area, away from direct skin contact', 'Use non-metallic mixing utensils', 'Avoid contact with combustible materials', 'Store in original container, cool dry place', 'Avoid prolonged or repeated skin contact'],
  recommended_ppe: ['Nitrile gloves (single-use, powder-free, non-latex)', 'Eye protection during mixing/pouring of concentrated product']
}
const formData = {
  companyName: 'Beauté Hair Salon Ltd',
  assessorName: 'Sarah Ahmed',
  howUsed: 'Mixed with hair colour for colouring and bleaching services',
  frequency: 'daily',
  quantityUsed: '50-100ml per application',
  whoIsExposed: 'Stylists and trainee hairdressers',
  durationOfExposure: '30-45 minutes per service',
  existingControls: 'Staff wear gloves during all colour applications. Salon has adequate ventilation.',
  currentPpeAvailable: 'Nitrile gloves provided. No eye protection currently supplied.',
  riskRating: 'Medium',
  controlMeasures: 'Mix in a well-ventilated area, away from direct skin contact\nUse non-metallic mixing utensils\nAvoid contact with combustible materials\nStore in original container, cool dry place\nAvoid prolonged or repeated skin contact',
  ppeRequired: 'Nitrile gloves (single-use, powder-free, non-latex)\nEye protection during mixing/pouring of concentrated product'
}

const riskColor = RISK_COLORS[formData.riskRating]
const riskBg = RISK_BG[formData.riskRating]

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

const expRoutes = substance.exposure_routes.map(r => `<span style="display:inline-block;background:#EBF5FB;border:1px solid #AED6F1;border-radius:4px;padding:3px 10px;font-size:11px;margin:3px 4px 3px 0;color:#1A5276;">${escapeHtml(r)}</span>`).join('')
const controlsList = formData.controlMeasures.split('\n').filter(Boolean).map((c,i) => `<tr style="background:${i%2===0?'#fff':'#F8F9FA'}"><td style="padding:8px 12px;font-size:12px;border-bottom:1px solid #EAECEE;">${escapeHtml(c)}</td></tr>`).join('')
const ppeList = formData.ppeRequired.split('\n').filter(Boolean).map(p => `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #EAECEE;font-size:12px;"><span style="color:#1A5276;font-size:16px;">✓</span> ${escapeHtml(p)}</div>`).join('')

const dateObj = new Date()
const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
const reviewDate = new Date(dateObj); reviewDate.setFullYear(reviewDate.getFullYear() + 1)
const formattedReviewDate = reviewDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@page { margin: 0; size: A4; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #2C3E50; background: #fff; }
.cover { width: 210mm; min-height: 297mm; background: #1A5276; display: flex; flex-direction: column; page-break-after: always; }
.cover-top { background: #1A5276; padding: 50px 60px 40px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.cover-label { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 16px; }
.cover-title { font-size: 42px; font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 12px; }
.cover-subtitle { font-size: 20px; color: rgba(255,255,255,0.75); font-weight: 300; margin-bottom: 50px; }
.cover-card { background: rgba(255,255,255,0.12); border-radius: 8px; padding: 28px 32px; display: inline-block; }
.cover-card-row { display: flex; gap: 40px; flex-wrap: wrap; }
.cover-card-item label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.5); display: block; margin-bottom: 4px; }
.cover-card-item span { font-size: 14px; font-weight: 600; color: #fff; }
.cover-bottom { background: #154360; padding: 16px 60px; display: flex; justify-content: space-between; align-items: center; }
.cover-bottom span { font-size: 11px; color: rgba(255,255,255,0.5); }
.cover-bottom a { color: rgba(255,255,255,0.7); text-decoration: none; }
.page { width: 210mm; min-height: 297mm; page-break-after: always; display: flex; flex-direction: column; }
.page:last-child { page-break-after: avoid; }
.page-header { background: #1A5276; padding: 18px 50px; display: flex; justify-content: space-between; align-items: center; }
.page-header h1 { font-size: 16px; font-weight: 700; color: #fff; }
.page-header-right { text-align: right; }
.substance-ref { font-size: 10px; color: rgba(255,255,255,0.65); }
.company-ref { font-size: 10px; color: rgba(255,255,255,0.5); }
.page-body { padding: 28px 50px; flex: 1; }
.page-footer { background: #F8F9FA; border-top: 1px solid #EAECEE; padding: 8px 50px; display: flex; justify-content: space-between; align-items: center; }
.page-footer span { font-size: 9px; color: #95A5A6; }
.page-footer .brand-link { font-size: 9px; color: #2471A3; }
.section-heading { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #1A5276; border-bottom: 2px solid #1A5276; padding-bottom: 6px; margin: 22px 0 12px; }
.field-row { display: flex; margin-bottom: 9px; font-size: 12px; border-bottom: 1px solid #F2F3F4; padding-bottom: 9px; }
.field-label { width: 200px; font-weight: 600; color: #5D6D7E; flex-shrink: 0; }
.field-value { color: #2C3E50; flex: 1; line-height: 1.5; }
.risk-block { display: flex; align-items: center; gap: 20px; background: ${riskBg}; border-left: 5px solid ${riskColor}; border-radius: 6px; padding: 16px 20px; margin: 16px 0; }
.risk-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: ${riskColor}; }
.risk-value { font-size: 28px; font-weight: 900; color: ${riskColor}; }
.risk-meaning { font-size: 11px; color: #5D6D7E; margin-top: 2px; }
.info-text { font-size: 12px; line-height: 1.7; color: #2C3E50; }
.controls-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
.controls-table th { background: #1A5276; color: #fff; font-size: 11px; padding: 8px 12px; text-align: left; }
.emergency-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; }
.emergency-card { border: 1px solid #EAECEE; border-radius: 6px; overflow: hidden; }
.emergency-card-header { background: #C0392B; color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 6px 12px; }
.emergency-card-body { padding: 10px 12px; font-size: 11px; line-height: 1.6; color: #2C3E50; }
.spillage-box { background: #FEF9E7; border: 1px solid #F9E79F; border-radius: 6px; padding: 12px 16px; margin-top: 12px; font-size: 11px; line-height: 1.6; }
.disclaimer-box { background: #F2F3F4; border-radius: 6px; padding: 12px 16px; margin-top: 16px; font-size: 9px; line-height: 1.6; color: #7F8C8D; }
.storage-row { background: #EBF5FB; border-radius: 4px; padding: 10px 14px; margin-bottom: 8px; font-size: 12px; }
.sign-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; }
.sign-item label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #95A5A6; display: block; margin-bottom: 30px; }
.sign-line { border-top: 1px solid #2C3E50; padding-top: 6px; font-size: 11px; color: #5D6D7E; }
</style>
</head>
<body>

<div class="cover">
  <div class="cover-top">
    <div class="cover-label">Control of Substances Hazardous to Health — COSHH Regulations 2002</div>
    <div class="cover-title">COSHH<br>Assessment</div>
    <div class="cover-subtitle">${escapeHtml(substance.substance_name)}</div>
    <div class="cover-card">
      <div class="cover-card-row">
        <div class="cover-card-item"><label>Company</label><span>${escapeHtml(formData.companyName)}</span></div>
        <div class="cover-card-item"><label>Assessor</label><span>${escapeHtml(formData.assessorName)}</span></div>
        <div class="cover-card-item"><label>Date Prepared</label><span>${formattedDate}</span></div>
        <div class="cover-card-item"><label>Review Due</label><span>${formattedReviewDate}</span></div>
        <div class="cover-card-item"><label>Document Ref</label><span>COSHH-HYD-001</span></div>
        <div class="cover-card-item"><label>Risk Rating</label><span style="color:${riskColor};">${formData.riskRating}</span></div>
      </div>
    </div>
  </div>
  <div class="cover-bottom">
    <span>Generated by <a href="https://coshhassessments.uk">coshhassessments.uk</a></span>
    <span>Prepared in accordance with COSHH Regulations 2002 &amp; HSE EH40 WEL guidance</span>
  </div>
</div>

<div class="page">
  <div class="page-header"><h1>Substance Identification</h1><div class="page-header-right"><div class="substance-ref">${escapeHtml(substance.substance_name)}</div><div class="company-ref">${escapeHtml(formData.companyName)}</div></div></div>
  <div class="page-body">
    <div class="section-heading">Chemical Identity</div>
    <div class="field-row"><div class="field-label">Substance Name</div><div class="field-value">${escapeHtml(substance.substance_name)}</div></div>
    <div class="field-row"><div class="field-label">Common Trade Names</div><div class="field-value">${escapeHtml(substance.common_names.join(', '))}</div></div>
    <div class="field-row"><div class="field-label">CAS Number</div><div class="field-value">${escapeHtml(substance.cas_number)}</div></div>
    <div class="field-row"><div class="field-label">Physical Form</div><div class="field-value">${escapeHtml(substance.physical_form)}</div></div>
    <div class="field-row"><div class="field-label">Supplier / Manufacturer</div><div class="field-value" style="color:#888;">As per product label / SDS — confirm with supplier</div></div>
    <div class="field-row"><div class="field-label">WEL (8-hr TWA)</div><div class="field-value" style="color:#888;">No specific EH40 WEL assigned — control at ALARP</div></div>
    <div class="section-heading">GHS Hazard Classification</div>
    <p class="info-text" style="background:#FEF9E7;border-left:4px solid #F9E79F;padding:10px 14px;border-radius:4px;margin-top:8px;">${escapeHtml(substance.ghs_classification)}</p>
    <div class="section-heading">Health Effects</div>
    <p class="info-text">${escapeHtml(substance.health_effects)}</p>
  </div>
  <div class="page-footer"><span>${escapeHtml(formData.companyName)} | ${formattedDate}</span><span class="brand-link">coshhassessments.uk</span><span>Page 2 of 7</span></div>
</div>

<div class="page">
  <div class="page-header"><h1>Exposure Assessment</h1><div class="page-header-right"><div class="substance-ref">${escapeHtml(substance.substance_name)}</div><div class="company-ref">${escapeHtml(formData.companyName)}</div></div></div>
  <div class="page-body">
    <div class="section-heading">Workplace Use Details</div>
    <div class="field-row"><div class="field-label">How Used</div><div class="field-value">${escapeHtml(formData.howUsed)}</div></div>
    <div class="field-row"><div class="field-label">Frequency</div><div class="field-value" style="text-transform:capitalize;">${escapeHtml(formData.frequency)}</div></div>
    <div class="field-row"><div class="field-label">Quantity Per Session</div><div class="field-value">${escapeHtml(formData.quantityUsed)}</div></div>
    <div class="field-row"><div class="field-label">Persons Exposed</div><div class="field-value">${escapeHtml(formData.whoIsExposed)}</div></div>
    <div class="field-row"><div class="field-label">Duration of Exposure</div><div class="field-value">${escapeHtml(formData.durationOfExposure)}</div></div>
    <div class="section-heading">Routes of Exposure</div>
    <div style="margin-top:6px;">${expRoutes}</div>
    <div class="section-heading">Storage &amp; Handling</div>
    <div class="storage-row"><strong>Storage:</strong> Store in original container, cool, dry, well-ventilated area away from incompatible substances. Keep locked and clearly labelled.</div>
    <div class="storage-row"><strong>Disposal:</strong> Dispose in accordance with local authority regulations. Check product SDS for specific guidance.</div>
    <div class="storage-row"><strong>Incompatibilities:</strong> Refer to product Safety Data Sheet for specific incompatible materials.</div>
  </div>
  <div class="page-footer"><span>${escapeHtml(formData.companyName)} | ${formattedDate}</span><span class="brand-link">coshhassessments.uk</span><span>Page 3 of 7</span></div>
</div>

<div class="page">
  <div class="page-header"><h1>Risk Evaluation</h1><div class="page-header-right"><div class="substance-ref">${escapeHtml(substance.substance_name)}</div><div class="company-ref">${escapeHtml(formData.companyName)}</div></div></div>
  <div class="page-body">
    <div class="section-heading">Overall Risk Rating</div>
    <div class="risk-block"><div><div class="risk-label">Risk Rating</div><div class="risk-value">${formData.riskRating}</div><div class="risk-meaning">Acceptable with adequate controls — monitor and review annually</div></div></div>
    <div class="section-heading">Existing Controls in Place</div>
    <p class="info-text">${escapeHtml(formData.existingControls)}</p>
    <div class="section-heading">Current PPE Available</div>
    <p class="info-text">${escapeHtml(formData.currentPpeAvailable)}</p>
    <div class="section-heading">HSE Hierarchy of Control</div>
    <p class="info-text" style="color:#5D6D7E;font-size:11px;">Controls assessed against: (1) Elimination, (2) Substitution, (3) Engineering controls, (4) Administrative controls, (5) PPE. PPE is the last resort.</p>
  </div>
  <div class="page-footer"><span>${escapeHtml(formData.companyName)} | ${formattedDate}</span><span class="brand-link">coshhassessments.uk</span><span>Page 4 of 7</span></div>
</div>

<div class="page">
  <div class="page-header"><h1>Control Measures &amp; PPE</h1><div class="page-header-right"><div class="substance-ref">${escapeHtml(substance.substance_name)}</div><div class="company-ref">${escapeHtml(formData.companyName)}</div></div></div>
  <div class="page-body">
    <div class="section-heading">Required Control Measures</div>
    <table class="controls-table"><thead><tr><th>Control Measure</th></tr></thead><tbody>${controlsList}</tbody></table>
    <div class="section-heading">Required PPE</div>
    <div style="margin-top:6px;">${ppeList}</div>
    <div class="section-heading">Health Surveillance</div>
    <p class="info-text" style="font-size:11px;">Where exposure to this substance could affect health, consider whether health surveillance is required under Regulation 11 of COSHH. This includes regular skin checks for dermatitis risk and respiratory checks where sensitisation is a known hazard.</p>
  </div>
  <div class="page-footer"><span>${escapeHtml(formData.companyName)} | ${formattedDate}</span><span class="brand-link">coshhassessments.uk</span><span>Page 5 of 7</span></div>
</div>

<div class="page">
  <div class="page-header"><h1>Emergency Procedures</h1><div class="page-header-right"><div class="substance-ref">${escapeHtml(substance.substance_name)}</div><div class="company-ref">${escapeHtml(formData.companyName)}</div></div></div>
  <div class="page-body">
    <div class="section-heading">First Aid Measures</div>
    <div class="emergency-grid">
      <div class="emergency-card"><div class="emergency-card-header">SKIN CONTACT</div><div class="emergency-card-body">${escapeHtml(substance.emergency_procedure.skin)}</div></div>
      <div class="emergency-card"><div class="emergency-card-header">EYE CONTACT</div><div class="emergency-card-body">${escapeHtml(substance.emergency_procedure.eyes)}</div></div>
      <div class="emergency-card"><div class="emergency-card-header">INHALATION</div><div class="emergency-card-body">${escapeHtml(substance.emergency_procedure.inhalation)}</div></div>
      <div class="emergency-card"><div class="emergency-card-header">INGESTION</div><div class="emergency-card-body">${escapeHtml(substance.emergency_procedure.ingestion)}</div></div>
    </div>
    <div class="section-heading">Spillage Procedure</div>
    <div class="spillage-box"><strong>In the event of a spillage:</strong> Evacuate the immediate area. Wear appropriate PPE before approaching. Contain using absorbent material. Avoid contamination of drains. Ventilate thoroughly. Refer to product SDS Section 6 for substance-specific guidance.</div>
    <div class="disclaimer-box"><strong>Legal notice:</strong> This assessment has been prepared using coshhassessments.uk in accordance with COSHH Regulations 2002. The employer remains solely legally responsible for ensuring all assessments are suitable and sufficient for their specific workplace. This document does not constitute professional H&amp;S consultancy advice.</div>
  </div>
  <div class="page-footer"><span>${escapeHtml(formData.companyName)} | ${formattedDate}</span><span class="brand-link">coshhassessments.uk</span><span>Page 6 of 7</span></div>
</div>

<div class="page">
  <div class="page-header"><h1>Assessment Sign-Off &amp; Review Record</h1><div class="page-header-right"><div class="substance-ref">${escapeHtml(substance.substance_name)}</div><div class="company-ref">${escapeHtml(formData.companyName)}</div></div></div>
  <div class="page-body">
    <div class="section-heading">Assessment Details</div>
    <div class="field-row"><div class="field-label">Substance Assessed</div><div class="field-value">${escapeHtml(substance.substance_name)}</div></div>
    <div class="field-row"><div class="field-label">Document Reference</div><div class="field-value">COSHH-HYD-001</div></div>
    <div class="field-row"><div class="field-label">Assessment Date</div><div class="field-value">${formattedDate}</div></div>
    <div class="field-row"><div class="field-label">Next Review Due</div><div class="field-value" style="font-weight:600;color:#C0392B;">${formattedReviewDate}</div></div>
    <div class="field-row"><div class="field-label">Regulation Reference</div><div class="field-value">COSHH Regulations 2002, Regulation 6 — HSE EH40/2005</div></div>
    <div class="section-heading">Assessor Sign-Off</div>
    <div class="sign-grid">
      <div class="sign-item"><label>Assessor Name</label><div class="sign-line">${escapeHtml(formData.assessorName)}</div></div>
      <div class="sign-item"><label>Assessor Signature</label><div class="sign-line"></div></div>
      <div class="sign-item"><label>Position / Job Title</label><div class="sign-line"></div></div>
      <div class="sign-item"><label>Date Signed</label><div class="sign-line"></div></div>
    </div>
    <div class="section-heading" style="margin-top:28px;">Review History</div>
    <table class="controls-table"><thead><tr><th style="width:30%">Review Date</th><th style="width:35%">Reviewed By</th><th style="width:35%">Changes Made</th></tr></thead>
    <tbody>
      <tr style="background:#fff;"><td style="padding:8px 12px;font-size:12px;border-bottom:1px solid #EAECEE;">${formattedDate} (Initial)</td><td style="padding:8px 12px;font-size:12px;border-bottom:1px solid #EAECEE;">${escapeHtml(formData.assessorName)}</td><td style="padding:8px 12px;font-size:12px;border-bottom:1px solid #EAECEE;">Initial assessment created</td></tr>
      <tr style="background:#F8F9FA;"><td style="padding:8px 12px;font-size:12px;border-bottom:1px solid #EAECEE;color:#ccc;">&nbsp;</td><td style="padding:8px 12px;font-size:12px;border-bottom:1px solid #EAECEE;"></td><td style="padding:8px 12px;font-size:12px;border-bottom:1px solid #EAECEE;"></td></tr>
    </tbody></table>
  </div>
  <div class="page-footer"><span>${escapeHtml(formData.companyName)} | ${formattedDate}</span><span class="brand-link">coshhassessments.uk</span><span>Page 7 of 7</span></div>
</div>

</body></html>`

const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true })
const page = await browser.newPage()
await page.setContent(html, { waitUntil: 'load' })
const pdf = await page.pdf({ format: 'A4', printBackground: true })
await browser.close()
fs.writeFileSync('/tmp/new-template-test.pdf', pdf)
console.log('PDF generated:', pdf.length, 'bytes')
