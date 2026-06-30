import { Substance, AssessmentFormData } from '@/lib/types'

interface PdfData {
  substance: Substance
  formData: Partial<AssessmentFormData>
  assessmentDate: string
  watermarked: boolean
}

const RISK_COLORS: Record<string, string> = {
  Low: '#1E8449',
  Medium: '#D35400',
  High: '#C0392B',
}

export function buildAssessmentHtml({
  substance,
  formData,
  assessmentDate,
  watermarked,
}: PdfData): string {
  const dateObj = new Date(assessmentDate)
  const reviewDate = new Date(dateObj)
  reviewDate.setFullYear(reviewDate.getFullYear() + 1)

  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedReviewDate = reviewDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const riskColor = RISK_COLORS[formData.riskRating || 'Medium']

  const controlsList = (formData.controlMeasures || '')
    .split('\n')
    .filter(Boolean)
    .map((c) => `<li>${escapeHtml(c)}</li>`)
    .join('')

  const ppeList = (formData.ppeRequired || '')
    .split('\n')
    .filter(Boolean)
    .map((p) => `<li>${escapeHtml(p)}</li>`)
    .join('')

  const watermarkHtml = watermarked
    ? `<div class="watermark">FREE VERSION — UPGRADE TO REMOVE</div>`
    : ''

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { margin: 0; size: A4; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #2C3E50;
    margin: 0;
    padding: 0;
    position: relative;
  }
  .page {
    padding: 50px 60px;
    page-break-after: always;
    position: relative;
    min-height: 100vh;
  }
  .page:last-child { page-break-after: avoid; }
  .watermark {
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 48px;
    color: rgba(200, 50, 50, 0.15);
    font-weight: bold;
    z-index: 1000;
    pointer-events: none;
    white-space: nowrap;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #1A5276;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }
  .header h1 {
    color: #1A5276;
    font-size: 22px;
    margin: 0;
  }
  .header .meta {
    text-align: right;
    font-size: 11px;
    color: #5D6D7E;
  }
  .cover {
    text-align: center;
    padding-top: 120px;
  }
  .cover h1 {
    font-size: 36px;
    color: #1A5276;
    margin-bottom: 8px;
  }
  .cover h2 {
    font-size: 22px;
    color: #2471A3;
    font-weight: normal;
    margin-bottom: 60px;
  }
  .cover-meta {
    display: inline-block;
    text-align: left;
    background: #F2F3F4;
    border-radius: 8px;
    padding: 24px 40px;
    font-size: 14px;
    line-height: 2;
  }
  .cover-meta strong { color: #1A5276; }
  .section-title {
    font-size: 16px;
    color: #1A5276;
    font-weight: bold;
    margin-top: 28px;
    margin-bottom: 10px;
    border-bottom: 1px solid #D6EAF8;
    padding-bottom: 6px;
  }
  .field-row {
    display: flex;
    margin-bottom: 10px;
    font-size: 13px;
  }
  .field-label {
    width: 180px;
    font-weight: 600;
    color: #5D6D7E;
    flex-shrink: 0;
  }
  .field-value { color: #2C3E50; }
  .risk-badge {
    display: inline-block;
    padding: 4px 16px;
    border-radius: 20px;
    color: white;
    font-weight: bold;
    font-size: 13px;
    background-color: ${riskColor};
  }
  ul { margin: 8px 0; padding-left: 20px; font-size: 13px; line-height: 1.7; }
  .emergency-box {
    background: #FADBD8;
    border-left: 4px solid #C0392B;
    padding: 14px 18px;
    border-radius: 4px;
    margin-top: 10px;
    font-size: 12px;
  }
  .emergency-box .emergency-item { margin-bottom: 8px; }
  .emergency-box .emergency-item:last-child { margin-bottom: 0; }
  .emergency-box strong { color: #922B21; }
  .footer {
    position: absolute;
    bottom: 30px;
    left: 60px;
    right: 60px;
    font-size: 10px;
    color: #95A5A6;
    border-top: 1px solid #EAECEE;
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .disclaimer {
    background: #F2F3F4;
    padding: 14px 18px;
    border-radius: 6px;
    font-size: 10px;
    color: #5D6D7E;
    margin-top: 30px;
    line-height: 1.5;
  }
  .sign-off {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
  }
  .sign-line {
    width: 45%;
    border-top: 1px solid #2C3E50;
    padding-top: 6px;
    font-size: 11px;
    color: #5D6D7E;
  }
</style>
</head>
<body>

${watermarkHtml}

<!-- PAGE 1: COVER -->
<div class="page cover">
  <h1>COSHH Assessment</h1>
  <h2>${escapeHtml(substance.substance_name)}</h2>
  <div class="cover-meta">
    <div><strong>Company:</strong> ${escapeHtml(formData.companyName || '—')}</div>
    <div><strong>Assessor:</strong> ${escapeHtml(formData.assessorName || '—')}</div>
    <div><strong>Date Prepared:</strong> ${formattedDate}</div>
    <div><strong>Review Due:</strong> ${formattedReviewDate}</div>
  </div>
</div>

<!-- PAGE 2: SUBSTANCE DETAILS -->
<div class="page">
  <div class="header">
    <h1>Substance Details</h1>
    <div class="meta">${escapeHtml(substance.substance_name)}</div>
  </div>

  <div class="field-row">
    <div class="field-label">Substance Name</div>
    <div class="field-value">${escapeHtml(substance.substance_name)}</div>
  </div>
  <div class="field-row">
    <div class="field-label">Common Names</div>
    <div class="field-value">${escapeHtml(substance.common_names.join(', '))}</div>
  </div>
  ${substance.cas_number ? `
  <div class="field-row">
    <div class="field-label">CAS Number</div>
    <div class="field-value">${escapeHtml(substance.cas_number)}</div>
  </div>` : ''}
  <div class="field-row">
    <div class="field-label">Physical Form</div>
    <div class="field-value">${escapeHtml(substance.physical_form || '—')}</div>
  </div>

  <div class="section-title">Hazard Classification</div>
  <p style="font-size: 13px; line-height: 1.6;">${escapeHtml(substance.ghs_classification)}</p>

  <div class="section-title">Health Effects</div>
  <p style="font-size: 13px; line-height: 1.6;">${escapeHtml(substance.health_effects)}</p>

  <div class="footer">
    <span>${escapeHtml(formData.companyName || '')}</span>
    <span>Page 2</span>
  </div>
</div>

<!-- PAGE 3: EXPOSURE ASSESSMENT -->
<div class="page">
  <div class="header">
    <h1>Exposure Assessment</h1>
    <div class="meta">${escapeHtml(substance.substance_name)}</div>
  </div>

  <div class="field-row">
    <div class="field-label">How Used</div>
    <div class="field-value">${escapeHtml(formData.howUsed || '—')}</div>
  </div>
  <div class="field-row">
    <div class="field-label">Frequency</div>
    <div class="field-value" style="text-transform: capitalize;">${escapeHtml(formData.frequency || '—')}</div>
  </div>
  <div class="field-row">
    <div class="field-label">Quantity Used</div>
    <div class="field-value">${escapeHtml(formData.quantityUsed || '—')}</div>
  </div>
  <div class="field-row">
    <div class="field-label">Who Is Exposed</div>
    <div class="field-value">${escapeHtml(formData.whoIsExposed || '—')}</div>
  </div>
  <div class="field-row">
    <div class="field-label">Duration of Exposure</div>
    <div class="field-value">${escapeHtml(formData.durationOfExposure || '—')}</div>
  </div>

  <div class="section-title">Exposure Routes</div>
  <ul>
    ${substance.exposure_routes.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
  </ul>

  <div class="footer">
    <span>${escapeHtml(formData.companyName || '')}</span>
    <span>Page 3</span>
  </div>
</div>

<!-- PAGE 4: RISK EVALUATION -->
<div class="page">
  <div class="header">
    <h1>Risk Evaluation</h1>
    <div class="meta">${escapeHtml(substance.substance_name)}</div>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <div style="font-size: 13px; color: #5D6D7E; margin-bottom: 10px;">RISK RATING</div>
    <span class="risk-badge">${escapeHtml(formData.riskRating || 'Medium')}</span>
  </div>

  <div class="section-title">Existing Controls Reported</div>
  <p style="font-size: 13px; line-height: 1.6;">${escapeHtml(formData.existingControls || 'None reported at time of assessment.')}</p>

  <div class="section-title">Current PPE Available</div>
  <p style="font-size: 13px; line-height: 1.6;">${escapeHtml(formData.currentPpeAvailable || 'None reported at time of assessment.')}</p>

  <div class="footer">
    <span>${escapeHtml(formData.companyName || '')}</span>
    <span>Page 4</span>
  </div>
</div>

<!-- PAGE 5: CONTROL MEASURES & PPE -->
<div class="page">
  <div class="header">
    <h1>Control Measures &amp; PPE Required</h1>
    <div class="meta">${escapeHtml(substance.substance_name)}</div>
  </div>

  <div class="section-title">Required Control Measures</div>
  <ul>${controlsList}</ul>

  <div class="section-title">Required PPE</div>
  <ul>${ppeList}</ul>

  <div class="footer">
    <span>${escapeHtml(formData.companyName || '')}</span>
    <span>Page 5</span>
  </div>
</div>

<!-- PAGE 6: EMERGENCY PROCEDURES -->
<div class="page">
  <div class="header">
    <h1>Emergency Procedures</h1>
    <div class="meta">${escapeHtml(substance.substance_name)}</div>
  </div>

  <div class="emergency-box">
    <div class="emergency-item"><strong>Skin Contact:</strong> ${escapeHtml(substance.emergency_procedure.skin)}</div>
    <div class="emergency-item"><strong>Eye Contact:</strong> ${escapeHtml(substance.emergency_procedure.eyes)}</div>
    <div class="emergency-item"><strong>Inhalation:</strong> ${escapeHtml(substance.emergency_procedure.inhalation)}</div>
    <div class="emergency-item"><strong>Ingestion:</strong> ${escapeHtml(substance.emergency_procedure.ingestion)}</div>
  </div>

  <div class="disclaimer">
    <strong>Important:</strong> This assessment has been prepared using a COSHH assessment tool. It is provided to assist
    employers in meeting their obligations under the Control of Substances Hazardous to Health Regulations 2002. The
    employer remains legally responsible for ensuring all assessments are suitable and sufficient for their specific
    workplace. This document does not constitute professional health and safety consultancy advice. Hazard and
    emergency procedure information is drawn from publicly available manufacturer safety data sheets and HSE guidance
    current at time of preparation, and should be cross-checked against the specific product's own safety data sheet.
  </div>

  <div class="footer">
    <span>${escapeHtml(formData.companyName || '')}</span>
    <span>Page 6</span>
  </div>
</div>

<!-- PAGE 7: SIGN-OFF -->
<div class="page">
  <div class="header">
    <h1>Assessment Sign-Off</h1>
    <div class="meta">${escapeHtml(substance.substance_name)}</div>
  </div>

  <div class="field-row">
    <div class="field-label">Assessment Date</div>
    <div class="field-value">${formattedDate}</div>
  </div>
  <div class="field-row">
    <div class="field-label">Next Review Due</div>
    <div class="field-value">${formattedReviewDate}</div>
  </div>
  <div class="field-row">
    <div class="field-label">Document Version</div>
    <div class="field-value">1.0</div>
  </div>

  <div class="sign-off">
    <div class="sign-line">Assessor Signature: ${escapeHtml(formData.assessorName || '')}</div>
    <div class="sign-line">Date</div>
  </div>

  <div class="footer">
    <span>${escapeHtml(formData.companyName || '')}</span>
    <span>Page 7</span>
  </div>
</div>

</body>
</html>
  `
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
