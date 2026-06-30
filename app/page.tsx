import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          Create a Compliant COSHH Assessment in 5 Minutes
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          No subscription required. Pay once per assessment, or save with a bundle.
        </p>
        <Link
          href="/wizard"
          className="inline-block px-8 py-4 bg-blue-800 text-white rounded-lg font-semibold text-lg hover:bg-blue-900 transition-colors"
        >
          Start Free Assessment
        </Link>
        <p className="text-sm text-gray-500 mt-3">
          HSE-compliant format. No credit card needed to try.
        </p>
      </div>
    </main>
  )
}
