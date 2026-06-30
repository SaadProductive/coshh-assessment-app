'use client'

import { Substance } from '@/lib/types'

interface Props {
  substance: Substance
  onConfirm: () => void
  onBack: () => void
}

export default function SubstanceConfirm({ substance, onConfirm, onBack }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Confirm: {substance.substance_name}
      </h2>
      <p className="text-gray-600 mb-6">
        Here&apos;s what we know about this substance. Check this matches the product you use.
      </p>

      <div className="bg-gray-50 rounded-lg p-5 space-y-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Hazard Classification
          </h3>
          <p className="text-gray-900">{substance.ghs_classification}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
            How Exposure Happens
          </h3>
          <ul className="list-disc list-inside text-gray-900">
            {substance.exposure_routes.map((route, i) => (
              <li key={i}>{route}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Health Effects
          </h3>
          <p className="text-gray-900 text-sm">{substance.health_effects}</p>
        </div>

        {substance.cas_number && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              CAS Number
            </h3>
            <p className="text-gray-900 text-sm">{substance.cas_number}</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          This data is sourced from UK manufacturer safety data sheets and HSE
          guidance. Next, we&apos;ll ask a few questions about how <em>your</em>{' '}
          business specifically uses this substance.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Back, wrong substance
        </button>
        <button
          onClick={onConfirm}
          className="ml-auto px-6 py-2.5 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-900 transition-colors"
        >
          Yes, this is correct →
        </button>
      </div>
    </div>
  )
}
