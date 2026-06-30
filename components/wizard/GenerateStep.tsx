'use client'

import { useState } from 'react'
import { Substance, AssessmentFormData } from '@/lib/types'

interface Props {
  substance: Substance
  formData: Partial<AssessmentFormData>
  onBack: () => void
}

export default function GenerateStep({ substance, formData, onBack }: Props) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  async function handleGenerate() {
    setGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          substance,
          formData,
          assessmentDate: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF. Please try again.')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong'
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Ready to generate your assessment
      </h2>
      <p className="text-gray-600 mb-6">
        Review the summary below, then generate your COSHH assessment PDF.
      </p>

      <div className="bg-gray-50 rounded-lg p-5 space-y-3 mb-6 text-sm">
        <SummaryRow label="Substance" value={substance.substance_name} />
        <SummaryRow label="Company" value={formData.companyName || '—'} />
        <SummaryRow label="Assessor" value={formData.assessorName || '—'} />
        <SummaryRow label="Risk Rating" value={formData.riskRating || '—'} />
        <SummaryRow
          label="Review Date"
          value={new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ).toLocaleDateString('en-GB')}
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber-900">
          <strong>Before you rely on this document:</strong> This assessment
          is a tool to assist with COSHH compliance. It does not constitute
          professional health and safety advice. The employer remains legally
          responsible for ensuring all assessments are suitable and sufficient
          for their specific workplace.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-800">
          {error}
        </div>
      )}

      {!pdfUrl ? (
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full px-6 py-3 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-900 transition-colors disabled:bg-gray-300"
        >
          {generating ? 'Generating your PDF...' : 'Generate Assessment PDF'}
        </button>
      ) : (
        <a
          href={pdfUrl}
          download={`COSHH-Assessment-${substance.substance_name.replace(/\s+/g, '-')}.pdf`}
          className="block w-full text-center px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors"
        >
          Download Your PDF
        </a>
      )}

      <button
        onClick={onBack}
        className="mt-6 text-gray-600 hover:text-gray-900 font-medium"
      >
        ← Back to edit
      </button>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  )
}
