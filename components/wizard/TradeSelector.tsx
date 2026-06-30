'use client'

import { TradeType } from '@/lib/types'

const TRADES: { value: TradeType; label: string; icon: string }[] = [
  { value: 'salon', label: 'Hair & Beauty Salon', icon: '✂️' },
  { value: 'cleaning', label: 'Cleaning Company', icon: '🧹' },
  { value: 'garage', label: 'Garage / Auto Repair', icon: '🔧' },
  { value: 'catering', label: 'Catering / Restaurant', icon: '🍳' },
  { value: 'construction', label: 'Construction / Trade', icon: '🏗️' },
  { value: 'other', label: 'Other / Not Listed', icon: '📋' },
]

interface Props {
  selected: TradeType | null
  onSelect: (trade: TradeType) => void
}

export default function TradeSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        What type of business is this assessment for?
      </h2>
      <p className="text-gray-600 mb-6">
        This helps us show you the chemicals most relevant to your trade first.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TRADES.map((trade) => (
          <button
            key={trade.value}
            onClick={() => onSelect(trade.value)}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-colors
              ${
                selected === trade.value
                  ? 'border-blue-800 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
          >
            <span className="text-2xl">{trade.icon}</span>
            <span className="font-medium text-gray-900">{trade.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
