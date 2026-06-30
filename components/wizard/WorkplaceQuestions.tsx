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

export default function WorkplaceQuestions({
  substance,
  formData,
  onUpdate,
  onNext,
  onBack,
}: Props) {
  const [local, setLocal] = useState({
    howUsed: formData.howUsed || '',
    frequency: formData.frequency || ('daily' as const),
    quantityUsed: formData.quantityUsed || '',
    whoIsExposed: formData.whoIsExposed || '',
    durationOfExposure: formData.durationOfExposure || '',
    existingControls: formData.existingControls || '',
    currentPpeAvailable: formData.currentPpeAvailable || '',
  })

  const isValid =
    local.howUsed.trim().length > 0 && local.whoIsExposed.trim().length > 0

  function handleSubmit() {
    onUpdate(local)
    onNext()
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Tell us about your workplace
      </h2>
      <p className="text-gray-600 mb-6">
        A few quick questions about how you specifically use{' '}
        <strong>{substance.substance_name}</strong>.
      </p>

      <div className="space-y-5">
        <Field label="How is this substance used in your workplace?" required>
          <textarea
            value={local.howUsed}
            onChange={(e) => setLocal({ ...local, howUsed: e.target.value })}
            placeholder="e.g. Used to disinfect surfaces and equipment after each client"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-800 focus:outline-none"
          />
        </Field>

        <Field label="How often is it used?" required>
          <div className="flex gap-3">
            {(['daily', 'weekly', 'occasional'] as const).map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setLocal({ ...local, frequency: freq })}
                className={`px-4 py-2 rounded-lg border-2 font-medium capitalize transition-colors
                  ${
                    local.frequency === freq
                      ? 'border-blue-800 bg-blue-50 text-blue-900'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Roughly how much is used per session/day?">
          <input
            type="text"
            value={local.quantityUsed}
            onChange={(e) =>
              setLocal({ ...local, quantityUsed: e.target.value })
            }
            placeholder="e.g. 50ml diluted in a spray bottle"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-800 focus:outline-none"
          />
        </Field>

        <Field label="Who is exposed to this substance?" required>
          <input
            type="text"
            value={local.whoIsExposed}
            onChange={(e) =>
              setLocal({ ...local, whoIsExposed: e.target.value })
            }
            placeholder="e.g. Cleaning staff, stylists, occasionally clients"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-800 focus:outline-none"
          />
        </Field>

        <Field label="How long is each exposure typically?">
          <input
            type="text"
            value={local.durationOfExposure}
            onChange={(e) =>
              setLocal({ ...local, durationOfExposure: e.target.value })
            }
            placeholder="e.g. 5-10 minutes per application"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-800 focus:outline-none"
          />
        </Field>

        <Field label="What controls do you already have in place?">
          <textarea
            value={local.existingControls}
            onChange={(e) =>
              setLocal({ ...local, existingControls: e.target.value })
            }
            placeholder="e.g. We always wear gloves and work near an open window"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-800 focus:outline-none"
          />
        </Field>

        <Field label="What PPE is currently available to staff?">
          <input
            type="text"
            value={local.currentPpeAvailable}
            onChange={(e) =>
              setLocal({ ...local, currentPpeAvailable: e.target.value })
            }
            placeholder="e.g. Nitrile gloves provided, no eye protection currently"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-800 focus:outline-none"
          />
        </Field>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="ml-auto px-6 py-2.5 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  )
}
