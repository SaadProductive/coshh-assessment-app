import { Substance, AssessmentFormData } from './types'

/**
 * Risk calculation logic for COSHH assessments.
 *
 * IMPORTANT: This is a simplified control-banding approach inspired by
 * HSE's COSHH Essentials methodology, NOT a substitute for it. It combines
 * the substance's baseline hazard rating with workplace-specific exposure
 * factors (frequency, duration, existing controls) to suggest a risk rating.
 *
 * This MUST be reviewed by a competent person before being relied upon.
 * The tool flags this requirement to the user at the point of PDF generation.
 */

const BASELINE_SCORE: Record<Substance['risk_baseline'], number> = {
  'Low': 1,
  'Low-Medium': 2,
  'Medium': 3,
  'Medium-High': 4,
  'High': 5,
}

const FREQUENCY_MODIFIER: Record<AssessmentFormData['frequency'], number> = {
  occasional: 0,
  weekly: 1,
  daily: 2,
}

export function calculateRiskRating(
  substance: Substance,
  formData: Pick<AssessmentFormData, 'frequency' | 'existingControls'>
): 'Low' | 'Medium' | 'High' {
  let score = BASELINE_SCORE[substance.risk_baseline]

  // Frequency of use increases risk
  score += FREQUENCY_MODIFIER[formData.frequency]

  // Existing controls in place can reduce the effective score
  // (Simple heuristic: if the user has described meaningful existing controls,
  // reduce score by 1. This is intentionally conservative — we don't want to
  // let a vague answer like "we're careful" reduce a genuinely hazardous rating.)
  const hasSubstantiveControls =
    formData.existingControls &&
    formData.existingControls.trim().length > 15 // arbitrary threshold for "more than a one-word answer"

  if (hasSubstantiveControls) {
    score -= 1
  }

  // Clamp and map to final band
  if (score <= 2) return 'Low'
  if (score <= 5) return 'Medium'
  return 'High'
}

/**
 * Generates the default review date: 12 months from assessment date,
 * per standard COSHH annual review practice.
 */
export function calculateReviewDate(assessmentDate: Date = new Date()): Date {
  const reviewDate = new Date(assessmentDate)
  reviewDate.setFullYear(reviewDate.getFullYear() + 1)
  return reviewDate
}

/**
 * Determines register status (traffic light) based on review date proximity.
 */
export function getReviewStatus(reviewDate: Date): 'green' | 'amber' | 'red' {
  const today = new Date()
  const daysUntilReview = Math.floor(
    (reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysUntilReview < 0) return 'red' // overdue
  if (daysUntilReview <= 30) return 'amber' // due soon
  return 'green' // current
}
