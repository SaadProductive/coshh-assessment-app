'use client'

import { useState } from 'react'
import { AssessmentFormData } from '@/lib/types'

interface Props {
  formData: Partial<AssessmentFormData>
  onUpdate: (data: Partial<AssessmentFormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function CompanyDetails({
  formData,
  onUpdate,
  onNext,
  onBack,
}: Props) {
  const [companyName, setCompanyName] = useState(formData.companyName || '')
  const [assessorName, setAssessorName] = useState(
    formData.assessorName || ''
  )

  const isValid = companyName.trim().length > 0 && assessorName.trim().length > 0

  function handleContinue() {
    onUpdate({ companyName, assessorName })
    onNext()
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Almost done — a few final details
      </h2>
      <p className="text-gray-600 mb-6">
        These appear on your assessment document. If you create an account,
        we&apos;ll remember these for next time.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Company Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Bright & Beautiful Hair Salon Ltd"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Assessor Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={assessorName}
            onChange={(e) => setAssessorName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-800 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            This should be the person who carried out the assessment — ideally
            someone with knowledge of how the substance is actually used day
            to day.
          </p>
        </div>
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
          disabled={!isValid}
          className="ml-auto px-6 py-2.5 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
