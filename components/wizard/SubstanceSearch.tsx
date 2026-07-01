'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Substance, TradeType } from '@/lib/types'

interface Props {
  tradeType: TradeType | null
  onSelect: (substance: Substance) => void
  onBack: () => void
}

export default function SubstanceSearch({ tradeType, onSelect, onBack }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Substance[]>([])
  const [loading, setLoading] = useState(false)
  const [allSubstances, setAllSubstances] = useState<Substance[]>([])

  const supabase = createClient()

  // Load substances filtered by trade on mount (shows trade-relevant ones first)
  useEffect(() => {
    async function loadSubstances() {
      setLoading(true)
      let queryBuilder = supabase.from('substances').select('*')

      if (tradeType && tradeType !== 'other') {
        queryBuilder = queryBuilder.contains('industry_tags', [tradeType])
      }

      const { data, error } = await queryBuilder.order('substance_name')

      if (!error && data) {
        setAllSubstances(data as Substance[])
        setResults(data as Substance[])
      }
      setLoading(false)
    }

    loadSubstances()
  }, [tradeType])

  // Simple client-side fuzzy filter across name + common_names
  // (For production scale with 500+ substances, move this to a server-side
  // full-text search query using the gin index already in the schema.)
  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery)

      if (!searchQuery.trim()) {
        setResults(allSubstances)
        return
      }

      const lowerQuery = searchQuery.toLowerCase()
      const filtered = allSubstances.filter((s) => {
        const nameMatch = s.substance_name.toLowerCase().includes(lowerQuery)
        const commonNameMatch = s.common_names.some((name) =>
          name.toLowerCase().includes(lowerQuery)
        )
        return nameMatch || commonNameMatch
      })

      setResults(filtered)
    },
    [allSubstances]
  )

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Which chemical or product are you assessing?
      </h2>
      <p className="text-gray-600 mb-4">
        Search by product name, brand, or chemical name — e.g. &quot;bleach&quot;, &quot;peroxide&quot;, or &quot;Domestos&quot;.
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Start typing..."
        autoFocus
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-800 focus:outline-none mb-4 text-gray-900 bg-white"
      />

      {loading ? (
        <p className="text-gray-500">Loading substances...</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No matches found for &quot;{query}&quot;.</p>
              <p className="text-sm">
                Can&apos;t find your chemical? You can{' '}
                <button className="text-blue-800 underline">
                  add it manually
                </button>{' '}
                and we&apos;ll research it for our library too.
              </p>
            </div>
          ) : (
            results.map((substance) => (
              <button
                key={substance.id}
                onClick={() => onSelect(substance)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-800 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-gray-900">
                  {substance.substance_name}
                </div>
                {substance.common_names.length > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    Also known as: {substance.common_names.slice(0, 3).join(', ')}
                  </div>
                )}
                <RiskBadge level={substance.risk_baseline} />
              </button>
            ))
          )}
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-6 text-gray-600 hover:text-gray-900 font-medium"
      >
        ← Back
      </button>
    </div>
  )
}

function RiskBadge({ level }: { level: Substance['risk_baseline'] }) {
  const colors: Record<Substance['risk_baseline'], string> = {
    Low: 'bg-green-100 text-green-800',
    'Low-Medium': 'bg-lime-100 text-lime-800',
    Medium: 'bg-amber-100 text-amber-800',
    'Medium-High': 'bg-orange-100 text-orange-800',
    High: 'bg-red-100 text-red-800',
  }

  return (
    <span
      className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${colors[level]}`}
    >
      {level} baseline risk
    </span>
  )
}
