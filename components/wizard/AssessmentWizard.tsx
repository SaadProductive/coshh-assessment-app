'use client'

import { useState } from 'react'
import { Substance, AssessmentFormData, TradeType } from '@/lib/types'
import { calculateRiskRating, calculateReviewDate } from '@/lib/riskEngine'
import TradeSelector from './TradeSelector'
import SubstanceSearch from './SubstanceSearch'
import SubstanceConfirm from './SubstanceConfirm'
import WorkplaceQuestions from './WorkplaceQuestions'
import ReviewAndAdjust from './ReviewAndAdjust'
import CompanyDetails from './CompanyDetails'
import GenerateStep from './GenerateStep'

export type WizardStep =
  | 'trade'
  | 'search'
  | 'confirm'
  | 'questions'
  | 'review'
  | 'company'
  | 'generate'

const STEP_ORDER: WizardStep[] = [
  'trade',
  'search',
  'confirm',
  'questions',
  'review',
  'company',
  'generate',
]

export interface WizardState {
  tradeType: TradeType | null
  selectedSubstance: Substance | null
  formData: Partial<AssessmentFormData>
}

export default function AssessmentWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('trade')
  const [state, setState] = useState<WizardState>({
    tradeType: null,
    selectedSubstance: null,
    formData: {},
  })

  const currentIndex = STEP_ORDER.indexOf(currentStep)

  function goToStep(step: WizardStep) {
    setCurrentStep(step)
  }

  function goNext() {
    const nextIndex = currentIndex + 1
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex])
    }
  }

  function goBack() {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(STEP_ORDER[prevIndex])
    }
  }

  function updateState(partial: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...partial }))
  }

  function updateFormData(partial: Partial<AssessmentFormData>) {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...partial },
    }))
  }

  // When moving from workplace questions to review, auto-calculate the
  // suggested risk rating and pre-fill controls/PPE from the substance data.
  function proceedToReview() {
    if (!state.selectedSubstance) return

    const riskRating = calculateRiskRating(state.selectedSubstance, {
      frequency: state.formData.frequency || 'occasional',
      existingControls: state.formData.existingControls || '',
    })

    updateFormData({
      riskRating,
      controlMeasures: state.selectedSubstance.default_controls.join('\n'),
      ppeRequired: state.selectedSubstance.recommended_ppe.join('\n'),
    })

    goNext()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Step {currentIndex + 1} of {STEP_ORDER.length}</span>
          <span>{Math.round(((currentIndex + 1) / STEP_ORDER.length) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-800 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / STEP_ORDER.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      {currentStep === 'trade' && (
        <TradeSelector
          selected={state.tradeType}
          onSelect={(trade) => {
            updateState({ tradeType: trade })
            goNext()
          }}
        />
      )}

      {currentStep === 'search' && (
        <SubstanceSearch
          tradeType={state.tradeType}
          onSelect={(substance) => {
            updateState({ selectedSubstance: substance })
            goNext()
          }}
          onBack={goBack}
        />
      )}

      {currentStep === 'confirm' && state.selectedSubstance && (
        <SubstanceConfirm
          substance={state.selectedSubstance}
          onConfirm={goNext}
          onBack={goBack}
        />
      )}

      {currentStep === 'questions' && state.selectedSubstance && (
        <WorkplaceQuestions
          substance={state.selectedSubstance}
          formData={state.formData}
          onUpdate={updateFormData}
          onNext={proceedToReview}
          onBack={goBack}
        />
      )}

      {currentStep === 'review' && state.selectedSubstance && (
        <ReviewAndAdjust
          substance={state.selectedSubstance}
          formData={state.formData}
          onUpdate={updateFormData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {currentStep === 'company' && (
        <CompanyDetails
          formData={state.formData}
          onUpdate={updateFormData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {currentStep === 'generate' && state.selectedSubstance && (
        <GenerateStep
          substance={state.selectedSubstance}
          formData={state.formData}
          onBack={goBack}
        />
      )}
    </div>
  )
}
