# COSHH Assessment Generator

A web app that lets UK small businesses create compliant COSHH (Control of
Substances Hazardous to Health) assessments in minutes, with a substance
library pre-loaded with researched UK hazard data.

## What's Built So Far

- ✅ Full Next.js 16 app (TypeScript + Tailwind CSS)
- ✅ 7-step assessment wizard (trade selector → search → confirm →
  workplace questions → review/adjust → company details → generate PDF)
- ✅ Risk calculation engine (lib/riskEngine.ts) — combines substance
  baseline hazard with workplace exposure factors
- ✅ PDF generation engine using Puppeteer (server-side, renders a real
  7-page professional PDF) — **tested and confirmed working**
- ✅ Supabase database schema (substances, profiles, assessments) with
  Row Level Security policies
- ✅ Seed data: 9 fully-researched substances (sourced from UK HSE,
  manufacturer SDS sheets, and occupational health literature) covering
  salon and cleaning trades

## What's NOT Built Yet

- ❌ User authentication (Supabase Auth UI/flow) — schema is ready, UI isn't built
- ❌ Saved assessments dashboard / chemicals register view
- ❌ Stripe payment integration (bundles + annual add-on)
- ❌ Free vs paid gating logic (currently the PDF route defaults to
  watermarked — this needs to check real subscription/credit status)
- ❌ Email reminders (Resend integration)
- ❌ SEO content pages (the 8-page content plan from the marketing doc)
- ❌ Remaining substances (10 more identified as priorities — see
  coshh_substance_research.md)

## Setup Instructions

### 1. Create your Supabase project
Go to supabase.com, create a new project, then:
- Go to SQL Editor
- Run `supabase/schema.sql` first (creates tables + RLS policies)
- Run `supabase/seed.sql` second (loads the 9 researched substances)

### 2. Get your API keys
In Supabase: Project Settings > API
- Copy your Project URL
- Copy your `anon` `public` key

### 3. Set environment variables
Edit `.env.local` and replace the placeholder values:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 4. Run locally
```bash
npm install
npm run dev
```
Visit http://localhost:3000

### 5. Test the wizard
Go to /wizard, select "Cleaning Company", search "bleach", and complete
the flow. You should get a real downloadable PDF.

## Deploying to Vercel

1. Push this code to a GitHub repository
2. Go to vercel.com, import the repository
3. Add the same environment variables from `.env.local` in Vercel's
   project settings
4. Deploy — Vercel auto-detects Next.js and handles the build

**Note on PDF generation:** This uses `puppeteer-core` +
`@sparticuz/chromium`, which is specifically designed to work within
Vercel's serverless function size limits. This has been tested and
confirmed working in the development sandbox. If you hit deployment
issues with Chromium on Vercel, check the `@sparticuz/chromium` version
matches what Vercel's runtime supports (check their GitHub for current
compatibility notes).

## Project Structure

```
app/
  page.tsx              — homepage
  wizard/page.tsx        — wizard page
  api/generate-pdf/      — PDF generation API route
components/
  wizard/                — all 7 wizard step components
lib/
  types.ts                — TypeScript interfaces
  riskEngine.ts            — risk calculation logic
  supabase.ts              — Supabase client setup
  pdf/template.ts          — HTML template for the PDF
supabase/
  schema.sql                — database schema + RLS policies
  seed.sql                   — 9 researched substances
coshh_substance_research.md  — full research documentation with sources
```

## Important Safety Note

The substance hazard data, control measures, and emergency procedures in
this app were researched from UK HSE guidance, manufacturer SDS sheets,
and occupational health literature. This is a strong first draft for
development purposes — **a qualified health & safety professional should
review all substance data before this is relied upon by real businesses
for legal compliance.**
