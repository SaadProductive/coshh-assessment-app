import { NextRequest, NextResponse } from 'next/server'
import { buildAssessmentHtml } from '@/lib/pdf/template'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { substance, formData, assessmentDate } = body

    if (!substance || !formData) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      )
    }

    // TODO: Check user's subscription status here.
    // If free tier (no account or no active bundle credit), watermarked = true.
    // For now, defaulting to watermarked until auth/billing wiring is connected.
    const watermarked = true

    const html = buildAssessmentHtml({
      substance,
      formData,
      assessmentDate: assessmentDate || new Date().toISOString(),
      watermarked,
    })

    const pdfBuffer = await renderPdf(html)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="coshh-assessment.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

/**
 * Renders HTML to PDF using Puppeteer.
 *
 * IMPORTANT — deployment note: standard puppeteer (with bundled Chromium)
 * does not work on Vercel's serverless functions due to size limits.
 * This uses puppeteer-core + @sparticuz/chromium, which is the standard
 * approach for running headless Chrome on Vercel.
 *
 * Locally during development, you may need puppeteer (full package) instead —
 * see README for the dev vs prod setup.
 */
async function renderPdf(html: string): Promise<Buffer> {
  const chromium = (await import('@sparticuz/chromium')).default
  const puppeteer = await import('puppeteer-core')

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'load' })

    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
    })

    return Buffer.from(pdfUint8Array)
  } finally {
    await browser.close()
  }
}
