'use client'

import { useState } from 'react'
import { Substance, AssessmentFormData } from '@/lib/types'

interface Props {
  substance: Substance
  formData: Partial<AssessmentFormData>
  onUpdate: (data: Partial<AssessmentFormData>) => void
  onNext: () => void
  onBack: () => void
}

const RISK_COLORS = {
  Low: 'bg-green-100 text-green-800 border-green-300',
  Medium: 'bg-amber-100 text-amber-800 border-amber-300',
  High: 'bg-red-100 text-red-800 border-red-300',
}

export default function ReviewAndAdjust({
  substance,
  formData,
  onUpdate,
  onNext,
  onBack,
}: Props) {
  const [riskRating, setRiskRating] = useState<'Low' | 'Medium' | 'High'>(
    formData.riskRating || 'Medium'
  )
  const [controlMeasures, setControlMeasures] = useState(
    formData.controlMeasures || ''
  )
  const [ppeRequired, setPpeRequired] = useState(formData.ppeRequired || '')

  function handleContinue() {
    onUpdate({ riskRating, controlMeasures, ppeRequired })
    onNext()
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Review your assessment
      </h2>
      <p className="text-gray-600 mb-6">
        Based on your answers, here&apos;s the suggested risk rating and
        controls. Edit anything that doesn&apos;t match your workplace.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Risk Rating
        </label>
        <div className="flex gap-3">
          {(['Low', 'Medium', 'High'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setRiskRating(level)}
              className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-colors
                ${
                  riskRating === level
                    ? RISK_COLORS[level]
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          This is a suggested rating based on the substance and your answers.
          A competent person should confirm this is appropriate for your
          specific workplace before relying on it.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Control Measures
        </label>
        <textarea
          value={controlMeasures}
          onChange={(e) => setControlMeasures(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-800 focus:outline-none font-mono text-sm text-gray-900 bg-white"
        />
        <p className="text-xs text-gray-500 mt-1.5">
          Pre-filled from our substance library. Edit to match your actual
          workplace controls.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          PPE Required
        </label>
        <textarea
          value={ppeRequired}
          onChange={(e) => setPpeRequired(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-800 focus:outline-none font-mono text-sm text-gray-900 bg-white"
        />
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          className="ml-auto px-6 py-2.5 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-900 transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
