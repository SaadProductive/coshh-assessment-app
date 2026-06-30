-- COSHH Substance Library — Seed Data
-- 9 substances researched from UK HSE guidance, manufacturer SDS, and occupational health literature
-- Run this AFTER schema.sql in Supabase SQL Editor

insert into substances (
  substance_name, common_names, industry_tags, cas_number,
  ghs_classification, exposure_routes, physical_form, health_effects,
  default_controls, recommended_ppe, emergency_procedure, risk_baseline, sources
) values

-- 1. Sodium Hypochlorite (Bleach)
(
  'Sodium Hypochlorite',
  ARRAY['Bleach', 'Domestos', 'Thick Bleach', 'Household Bleach', 'Industrial Bleach'],
  ARRAY['cleaning', 'salon', 'kitchen', 'general'],
  '7681-52-9',
  'Corrosive (Skin Corr. 1B/1C, Eye Dam. 1), Corrosive to metals (Met. Corr. 1), Oxidising at higher concentrations. H314 (causes severe skin burns and eye damage), H318 (causes serious eye damage), H290 (may be corrosive to metals).',
  ARRAY['Skin contact', 'Eye contact', 'Inhalation (if mixed with acids/ammonia)', 'Ingestion'],
  'Liquid',
  'Burning sensation in mouth/throat if ingested. Skin and eye irritation to severe burns depending on concentration. Not typically a respiratory hazard with normal dilute use, but mixing with acid-based products releases toxic chlorine gas; mixing with ammonia releases toxic chloramines.',
  ARRAY['Use ready-diluted product where possible; measure accurately if diluting', 'Ensure adequate ventilation when in use', 'NEVER mix with other chemicals, especially acids or ammonia-based products', 'Store in original container, cool well-ventilated area, away from incompatible substances', 'Label and lock storage area'],
  ARRAY['Nitrile gloves', 'Eye protection (splash goggles)', 'Apron for concentrated/bulk handling'],
  '{"skin": "Remove contaminated clothing, rinse thoroughly with water. Seek medical attention if irritation persists.", "eyes": "Rinse immediately with plenty of water for at least 15 minutes, remove contact lenses if present. Get medical attention immediately.", "inhalation": "Move to fresh air, keep warm and at rest. Seek medical attention if breathing difficulties occur.", "ingestion": "Do not induce vomiting. Rinse mouth, give water to drink. Get medical attention immediately."}',
  'Medium',
  'UKHSA Compendium of Chemical Hazards; Evans Vanodine SDS; Sevron COSHH guidance'
),

-- 2. Hydrogen Peroxide
(
  'Hydrogen Peroxide',
  ARRAY['Peroxide', 'Developer', 'Hair Bleach Developer', '20 Vol Developer', '30 Vol Developer', '40 Vol Developer'],
  ARRAY['salon', 'cleaning', 'general'],
  '7722-84-1',
  'Oxidising Liquid Cat 1 (H271), Acute Toxicity Cat 4 oral/inhalation (H302, H332), Skin Corrosive 1A (H314), Eye Damage 1 (H318) at concentrated strength. Salon-strength dilutions are lower hazard but still classified.',
  ARRAY['Skin contact (mixing splashes)', 'Eye contact', 'Inhalation of vapour during mixing'],
  'Liquid / powder-cream developer',
  'Irritation of nose, throat, airway on inhalation. Skin redness/irritation to burns at higher concentrations. Hairdressers using peroxide-based products are at elevated risk of occupational contact dermatitis.',
  ARRAY['Mix in a well-ventilated area, away from direct skin contact', 'Use non-metallic mixing utensils', 'Avoid contact with combustible materials', 'Store in original container, cool dry place away from sunlight/heat', 'Avoid prolonged or repeated skin contact'],
  ARRAY['Nitrile gloves (single-use, powder-free, non-latex)', 'Eye protection during mixing/pouring of concentrated product'],
  '{"skin": "Wash immediately with water. Seek medical advice if irritation persists.", "eyes": "Rinse immediately with plenty of water. Seek medical advice if irritation persists.", "inhalation": "Move to fresh air. Seek medical attention if symptoms develop.", "ingestion": "Rinse mouth thoroughly. Seek medical attention."}',
  'Medium',
  'Aveda Salon Hair Products Guide; HighSpeedTraining COSHH for Hairdressers; Fisher Scientific SDS'
),

-- 3. Ammonia Solution
(
  'Ammonia Solution',
  ARRAY['Ammonia', 'Cloudy Ammonia', 'Household Ammonia'],
  ARRAY['salon', 'cleaning'],
  '1336-21-6',
  'Corrosive (Skin Corr. 1B, H314), Serious Eye Damage (H318), Acute Toxicity by inhalation, Sensitiser at certain concentrations.',
  ARRAY['Inhalation (strong odour)', 'Skin contact', 'Eye contact'],
  'Liquid solution, pungent odour',
  'Strong respiratory irritant, released during hair bleaching, oxidative dyeing, and perming. Can cause irritation of skin, eyes, and respiratory system, with sensitisation possible after repeated contact. Airborne concentrations in some salons have been found to exceed exposure limit guidance.',
  ARRAY['Ensure good ventilation, especially during mixing/application', 'Avoid mixing with bleach-based or chlorine-based products', 'Limit duration of close-proximity exposure during application', 'Use local exhaust ventilation or open windows in mixing/application areas', 'Consider lower-ammonia or ammonia-free alternatives where suitable'],
  ARRAY['Nitrile gloves', 'Adequate ventilation as primary control', 'FFP-rated mask for high-frequency/high-volume mixing'],
  '{"skin": "Remove contaminated clothing, rinse skin thoroughly with water.", "eyes": "Rinse immediately with plenty of water for at least 15 minutes. Get medical attention.", "inhalation": "Move to fresh air immediately. Keep warm and at rest. Seek medical attention if symptoms persist.", "ingestion": "Do not induce vomiting. Rinse mouth, give water. Seek medical attention immediately."}',
  'Medium-High',
  'Fisher Scientific Ammonia SDS; HighSpeedTraining COSHH for Hairdressing; PMC Scoping Review on Hairdresser Exposure'
),

-- 4. Isopropyl Alcohol (IPA)
(
  'Isopropyl Alcohol',
  ARRAY['IPA', 'Rubbing Alcohol', 'Surgical Spirit', 'Surface Sanitiser'],
  ARRAY['cleaning', 'salon', 'garage', 'general'],
  '67-63-0',
  'Highly Flammable Liquid and Vapour (Flam. Liq. 2, H225), Serious Eye Irritation (H319), May cause drowsiness/dizziness (H336).',
  ARRAY['Inhalation (vapour)', 'Skin contact', 'Eye contact'],
  'Liquid, volatile',
  'Eye irritation at relatively low airborne concentration. CNS depression symptoms (headache, dizziness, drowsiness) at higher vapour concentrations. Skin irritation/degreasing with frequent contact.',
  ARRAY['Use in well-ventilated areas only', 'Keep away from heat, sparks, open flames', 'Use explosion-proof electrical equipment in enclosed spaces at volume', 'Keep container tightly closed when not in use', 'No smoking or naked flames in areas of use/storage'],
  ARRAY['Nitrile gloves', 'Eye protection where splash risk exists', 'Respiratory protection for prolonged/bulk use in enclosed space'],
  '{"skin": "Wash with plenty of water/soap.", "eyes": "Rinse cautiously with water for several minutes; remove contact lenses if present.", "inhalation": "Remove to fresh air; seek medical attention if breathing difficulty.", "ingestion": "Do not induce vomiting. Rinse mouth. Seek medical attention if large amount ingested."}',
  'Medium',
  'NHS Supply Chain SDS; UKHSA Isopropanol Incident Management; Redox/Univar SDS'
),

-- 5. Hydrochloric Acid (Descaler)
(
  'Hydrochloric Acid (Descaler)',
  ARRAY['Limescale Remover', 'Toilet Descaler', 'Acid Descaler', 'Drain Cleaner (acid)'],
  ARRAY['cleaning', 'kitchen', 'general'],
  '7647-01-0',
  'Corrosive (Skin Corr. 1B, Eye Dam. 1). H314 (severe skin burns/eye damage), respiratory irritant via released hydrogen chloride vapour.',
  ARRAY['Skin contact', 'Eye contact', 'Inhalation of fumes'],
  'Liquid, diluted in commercial descaler products (10-30% typical)',
  'Long-term occupational exposure to vapour linked to gastritis, chronic bronchitis, dermatitis, photosensitising effects. Repeated inhalation may cause irritation/lesions of nasal cavity, larynx, trachea. Direct contact causes chemical burns.',
  ARRAY['Use in well-ventilated areas — never in confined/enclosed spaces without ventilation', 'Never mix with bleach or other chemicals', 'Consider substitution with citric acid or sulphamic acid-based descalers for routine tasks', 'Test on surface before full application', 'Store separately from incompatible substances, especially oxidisers/bleach'],
  ARRAY['Acid-resistant gloves', 'Eye protection (goggles, not just safety glasses)', 'Apron for concentrated product handling'],
  '{"skin": "Remove contaminated clothing, rinse with plenty of water.", "eyes": "Rinse immediately with plenty of water for at least 15 minutes. Get medical attention immediately.", "inhalation": "Move to fresh air immediately. Seek medical attention if breathing difficulty.", "ingestion": "Do not induce vomiting. Rinse mouth. Seek medical attention immediately."}',
  'Medium-High',
  'Envirofluid Dangerous Acids in Workplace; Feedwater Descaler SF SDS'
),

-- 6. Sodium Hydroxide (Caustic Oven/Drain Cleaner)
(
  'Sodium Hydroxide (Caustic Cleaner)',
  ARRAY['Caustic Soda', 'Oven Cleaner', 'Drain Cleaner', 'Lye'],
  ARRAY['kitchen', 'cleaning', 'general'],
  '1310-73-2',
  'Corrosive — Skin Corrosion Cat 1A/1B (H314), Eye Damage Cat 1 (H318), corrosive to metals at higher concentration (H290).',
  ARRAY['Skin contact', 'Eye contact', 'Inhalation of mist/vapour', 'Ingestion'],
  'Liquid (spray/gel/foam) or solid pearls/flakes',
  'A UK National Poisons Information Service analysis of 796 oven cleaner enquiries (2009-2015) found 96% involved sodium and/or potassium hydroxide; the large majority of patients exposed by any route developed features of toxicity. Severe burns possible with delayed onset — eye damage may not be fully apparent for up to 72 hours.',
  ARRAY['Use only in well-ventilated areas', 'Wear full recommended PPE for every application', 'Never mix with acid-based products', 'Apply using applicator/spray to minimise direct hand contact', 'Store locked, clearly labelled, away from acids and reactive metals', 'Provide eyewash station/access to running water where used regularly'],
  ARRAY['Chemical-resistant gloves (neoprene, nitrile, or PVC)', 'Chemical splash goggles or full face shield', 'Protective apron/clothing'],
  '{"skin": "Remove contaminated clothing immediately. Rinse skin thoroughly with water/shower for an extended period. Get medical attention immediately — speed is essential.", "eyes": "Rinse immediately and continuously with plenty of water for at least 15 minutes. Get medical attention immediately even if no immediate pain, as damage may be delayed.", "inhalation": "Remove to fresh air immediately. Get medical attention immediately.", "ingestion": "Do NOT induce vomiting. Rinse mouth thoroughly, give water if conscious. Get medical attention immediately."}',
  'High',
  'PubMed UK NPIS Oven Cleaner Toxicity Study; Country Range Oven Cleaner SDS; Bartoline Caustic Soda SDS'
),

-- 7. Methyl/Ethyl Methacrylate (Acrylic Nail Products)
(
  'Methyl/Ethyl Methacrylate (Acrylic Nail Liquid)',
  ARRAY['Acrylic Liquid', 'Nail Acrylic Monomer', 'MMA', 'EMA'],
  ARRAY['salon', 'beauty', 'nail'],
  '80-62-6',
  'Flammable Liquid, Skin Sensitiser (significant), Respiratory irritant. Not acutely toxic at typical professional concentrations — sensitisation is the primary hazard driver.',
  ARRAY['Skin contact (gloves provide only partial protection)', 'Inhalation of vapour during application', 'Inhalation of dust during filing/removal'],
  'Liquid (monomer, mixed with powder polymer)',
  'Potent skin and respiratory sensitiser. Once sensitised, reactions can occur from minimal future exposure — described in occupational health literature as a career-ending injury for a nail technician. Can cause allergic contact dermatitis and has been associated with occupational asthma. Acrylic dust during filing is an additional inhalation hazard.',
  ARRAY['Local exhaust ventilation at the nail station', 'Avoid skin contact entirely where possible', 'Dust extraction or well-ventilated area for filing/shaping', 'Prefer EMA-based systems over MMA where possible (substitution)', 'Do not continue acrylic services on clients/staff with known sensitisation'],
  ARRAY['Nitrile gloves (note: only partial protection against methacrylate penetration — frequent changes essential)', 'Dust mask or respiratory protection during filing'],
  '{"skin": "Wash thoroughly with soap and water. If sensitisation symptoms occur (redness, swelling, itching), stop use and seek medical advice.", "eyes": "Rinse with plenty of water. Seek medical attention if irritation persists.", "inhalation": "Move to fresh air. Increase ventilation. Seek medical attention if respiratory symptoms develop.", "ingestion": "Not a typical exposure route in professional use. Seek medical advice if accidental ingestion occurs."}',
  'Medium-High',
  'OSHA Health Hazards in Nail Salons; PMC/Wiley Safety of Nail Products; HSE Research Report RR627'
),

-- 8. p-Phenylenediamine (PPD) — Permanent Hair Colour
(
  'p-Phenylenediamine (PPD) — Permanent Hair Colour',
  ARRAY['Permanent Hair Colour', 'Permanent Hair Dye', 'Oxidative Hair Colour'],
  ARRAY['salon'],
  '106-50-3',
  'Skin Sensitiser (potent — one of the most significant occupational sensitisers in hairdressing), Acute toxicity by ingestion at high concentration, Eye irritant. Cross-reactive with related aromatic amine dyes.',
  ARRAY['Skin contact (primary route)', 'Inhalation of vapour during mixing'],
  'Liquid/cream, mixed with hydrogen peroxide developer before application',
  'Described in clinical literature as one of the most significant causes of occupational allergic contact dermatitis in hairdressing. Hairdressers and barbers show notably elevated rates of positive patch-test reactions. Once sensitised, even brief future contact can trigger a reaction — a career-limiting occupational injury.',
  ARRAY['Nitrile gloves for every single application, without exception', 'Change gloves between every client', 'Never mix or apply colour bare-handed, even briefly', 'Apply barrier cream to skin at hairline before application', 'Conduct and document monthly visual skin checks of stylists hands'],
  ARRAY['Nitrile gloves (mandatory for every application)', 'Face protection for high-volume mixing in poorly ventilated space'],
  '{"skin": "Wash thoroughly with water at end of application if any contact occurred outside gloves.", "eyes": "Rinse with plenty of water. Seek medical attention if irritation persists.", "inhalation": "Not typically required for normal salon use; ensure adequate ventilation.", "ingestion": "Recognised medical emergency in case reports if accidental ingestion occurs — seek immediate medical attention."}',
  'High',
  'COSHHmate COSHH for Hairdressers guide; DermNet NZ; PMC Para-phenylenediamine allergy review; EPA PPD Hazard Summary'
),

-- 9. Acetone — Nail Polish Remover
(
  'Acetone (Nail Polish Remover)',
  ARRAY['Nail Polish Remover', 'Acetone', 'Propan-2-one'],
  ARRAY['salon', 'beauty', 'nail', 'garage', 'general'],
  '67-64-1',
  'Highly Flammable Liquid and Vapour, Serious Eye Irritation Cat 2A, STOT (single exposure) Cat 3 — narcotic/CNS effects via inhalation. Not classified as hazardous for acute skin contact, inhalation toxicity, or ingestion at typical concentrations.',
  ARRAY['Inhalation (vapour)', 'Eye contact', 'Skin contact (drying effect)'],
  'Liquid, highly volatile',
  'OSHA guidance associates acetone exposure with headaches, dizziness, and irritation of eyes, skin, and throat, primarily from inhalation in poorly ventilated workspaces during repeated daily use. Generally reversible effects rather than high inherent toxicity. Highly flammable.',
  ARRAY['Use in well-ventilated area', 'Keep away from heat, open flames, ignition sources', 'Keep soak-off bowls covered between uses', 'Avoid prolonged continuous inhalation during high-volume removal days', 'Store away from oxidising agents'],
  ARRAY['Gloves for repeated/prolonged contact', 'Eye protection for bulk handling/decanting'],
  '{"skin": "Wash with water if irritation occurs.", "eyes": "Rinse cautiously with water for several minutes, remove contact lenses if present.", "inhalation": "Move to fresh air, increase ventilation. Seek medical attention if symptoms persist.", "ingestion": "Seek medical advice if significant amount ingested."}',
  'Low-Medium',
  'OSHA Health Hazards in Nail Salons; manufacturer nail product SDS sheets; Safe Cosmetics ingredient review'
);

-- Verify the insert
select substance_name, risk_baseline, industry_tags from substances order by substance_name;
