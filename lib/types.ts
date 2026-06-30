export interface Substance {
  id: string
  substance_name: string
  common_names: string[]
  industry_tags: string[]
  cas_number: string | null
  ghs_classification: string
  exposure_routes: string[]
  physical_form: string | null
  health_effects: string
  default_controls: string[]
  recommended_ppe: string[]
  emergency_procedure: {
    skin: string
    eyes: string
    inhalation: string
    ingestion: string
  }
  risk_baseline: 'Low' | 'Low-Medium' | 'Medium' | 'Medium-High' | 'High'
  sources: string | null
}

export interface AssessmentFormData {
  substanceId: string
  substanceName: string
  howUsed: string
  frequency: 'daily' | 'weekly' | 'occasional'
  quantityUsed: string
  whoIsExposed: string
  durationOfExposure: string
  existingControls: string
  currentPpeAvailable: string
  riskRating: 'Low' | 'Medium' | 'High'
  controlMeasures: string
  ppeRequired: string
  assessorName: string
  companyName: string
}

export type TradeType = 'salon' | 'cleaning' | 'garage' | 'catering' | 'construction' | 'other'
