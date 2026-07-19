import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// ============================================================
// Contextual data for prompt grounding (West Java poverty data)
// ============================================================
const CONTEXT_DATA: Record<string, Record<string, { stats: string; districts: string }>> = {
  '2026': {
    disparity: {
      stats: 'Within-district Theil index contribution: 89.4%. Provincial Gini: 0.405. P0 (headcount): 7.62%. P1 (depth): 1.24. P2 (severity): 0.31.',
      districts: 'Highest internal Gini: Kota Bandung (0.42), Kabupaten Bogor (0.39), Kabupaten Bekasi (0.38). Lowest: Kota Banjar (0.28).',
    },
    spatial: {
      stats: 'Southern belt P0 avg: 12.8%. Northern industrial corridor P0 avg: 5.1%. Coastal zone unemployment: 8.7%.',
      districts: 'Hotspot clusters: Kabupaten Kuningan (P0: 13.1%), Indramayu (12.9%), Tasikmalaya (14.2%), Garut (11.8%). Cold spots: Kota Depok (2.1%), Kota Bekasi (3.4%).',
    },
    targeting: {
      stats: 'PMT inclusion accuracy: 91.3%. Exclusion error: 8.7%. Inclusion error: 14.2%. DTKS coverage: 87.6%. Gradient Boosting model accuracy: 92%.',
      districts: 'High exclusion error: Sukabumi (11.8%), Cianjur (10.2%). High inclusion error: Kota Bandung (16.4%), Kota Bekasi (15.1%).',
    },
  },
  '2025': {
    disparity: {
      stats: 'Within-district Theil index contribution: 88.2%. Provincial Gini: 0.411. P0: 7.89%. P1: 1.31. P2: 0.34.',
      districts: 'Industrial-agricultural border zones showing highest disparity gaps. Bekasi-Karawang corridor Gini: 0.41.',
    },
    spatial: {
      stats: 'Cirebon Raya cluster P0 avg: 11.9%. Coastal fishing asset depreciation: -7.2% YoY.',
      districts: 'Severe clusters: Indramayu (P0: 12.4%), Cirebon (11.2%). Seasonal agricultural deficit zones in Subang, Majalengka.',
    },
    targeting: {
      stats: 'PMT inclusion accuracy: 90.8%. D4+ blocking rate: 94.2%. DTKS sync rate: 84.1%.',
      districts: 'Model successfully blocking Decile 4+ access. Remaining leakage in urban informal sectors.',
    },
  },
  '2024': {
    disparity: {
      stats: 'Within-district Theil index contribution: 87.1%. Provincial Gini: 0.418. P0: 8.14%. P1: 1.38. P2: 0.37.',
      districts: 'Post-macroeconomic transition amplified disparities in Bekasi and Depok industrial cities.',
    },
    spatial: {
      stats: 'Prolonged dry season impact on harvest incomes. Agricultural GDP drop: -3.8% in southern districts.',
      districts: 'Highest severity: Kabupaten Tasikmalaya (P0: 15.1%), Garut (13.4%). Dry season water stress index: 0.78.',
    },
    targeting: {
      stats: 'PMT accuracy: 89.4%. Inclusion errors from manual paper registries. Digital migration: 62% complete.',
      districts: 'Legacy paper roster districts: Ciamis, Pangandaran, Sumedang. Full digital: Kota Bandung, Kota Cimahi.',
    },
  },
};

// Fallback data when API is unavailable
const FALLBACK_DATA: Record<string, Record<string, { narrative: string; focus: string; actionableStep: string }>> = {
  '2026': {
    disparity: {
      narrative: 'Within-district inequality stands at 89.4% of total provincial disparity. This indicates that inequality is increasingly driven by disparities within districts rather than between districts. Broader administrative zoning is no longer sufficient.',
      focus: 'Household-level targeting & basic micro-assets (sanitation, water grids).',
      actionableStep: 'Reallocate 14.5% of region-wide general municipal support funds directly into household-level clean water injections for deciles D1-D2 in Priangan Timur.',
    },
    spatial: {
      narrative: 'GIS coordinate clusters show severe poverty rates concentrated heavily in the southern agricultural belt. Kabupaten Kuningan and Indramayu show persistent pockets with headcount rates exceeding 12.5%.',
      focus: 'Priority infrastructure & agricultural logistics hubs.',
      actionableStep: 'Launch rural sanitation pipeline projects in extreme southern Sukabumi and Tasikmalaya with designated budget line items in the Q3 fiscal revision.',
    },
    targeting: {
      narrative: 'Inclusion accuracy has advanced to 91.3% utilizing Gradient Boosting calibrations. However, the exclusion rate remains at 8.7% for isolated rural settlements due to stale civil registry indexes.',
      focus: 'Active civil registry synchronization & mobile PMT squads.',
      actionableStep: 'Deploy Bappeda civil registry vehicles to physically update DTKS lists in Category IV districts, targeting 24,000 households.',
    },
  },
  '2025': {
    disparity: {
      narrative: 'Within-district inequality stood at 88.2% in 2025. Disparity is concentrated heavily in industrial-agricultural border zones. Growth benefits are pooling locally, creating wide gaps within single administrative zones.',
      focus: 'Asset transfers and municipal skill training alignments.',
      actionableStep: 'Expand local Padat Karya vocational training subsidies across high Gini districts to absorb local agricultural laborers.',
    },
    spatial: {
      narrative: '2025 GIS historical benchmarks verify a heavy cluster in Cirebon Raya, driven by coastal fishing asset depreciation and seasonal agricultural job deficits.',
      focus: 'Coastal micro-credit & cold chain infrastructure.',
      actionableStep: 'Approve special emergency fishery equipment grants to fishermen cooperatives in Indramayu and Cirebon.',
    },
    targeting: {
      narrative: 'Targeting accuracies averaged 90.8% in 2025. Machine Learning PMT cutoffs successfully blocked access to households in welfare decile D4 and above.',
      focus: 'Strict enforcement of PMT cut-off boundaries.',
      actionableStep: 'Publish audited targeting metrics to the provincial oversight board to secure continuing funding pipelines.',
    },
  },
  '2024': {
    disparity: {
      narrative: 'Within-district inequality contribution measured at 87.1% during the 2024 survey. Post-macroeconomic transition cycles have amplified micro-economic disparities inside industrial cities like Bekasi and Depok.',
      focus: 'Urban safety net integration & cost of living adjustments.',
      actionableStep: 'Implement basic commodity price subsidies in high-density urban wards showing high internal Gini coefficients.',
    },
    spatial: {
      narrative: '2024 survey coordinates indicate the highest severity clusters were in Kabupaten Tasikmalaya and Garut due to prolonged dry seasons disrupting harvest incomes.',
      focus: 'Climate-resilient irrigation and social insurance.',
      actionableStep: 'Establish a dry-season water transport contingency fund to prevent sudden household consumption declines in Priangan Timur.',
    },
    targeting: {
      narrative: 'Targeting accuracy was recorded at 89.4%. Inclusion errors were predominantly driven by manual paper registries before the transition to fully automated digital pipelines.',
      focus: 'Legacy data digitization and cleansing.',
      actionableStep: 'Execute complete digital migration of BPS rural rosters to the new secure centralized SQL database.',
    },
  },
};

const AXIS_LABELS: Record<string, string> = {
  disparity: 'Theil Disparity Decomposition',
  spatial: 'Spatial Hotspot Mapping',
  targeting: 'Welfare Targeting Performance',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { axis, year } = req.body || {};

  // Validate inputs
  if (!axis || !['disparity', 'spatial', 'targeting'].includes(axis)) {
    return res.status(400).json({ error: 'Invalid axis. Must be: disparity, spatial, or targeting.' });
  }
  const validYear = year && ['2024', '2025', '2026'].includes(year) ? year : '2026';

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return fallback data if no API key configured
    const fallback = FALLBACK_DATA[validYear]?.[axis] || FALLBACK_DATA['2026'][axis];
    return res.status(200).json({
      ...fallback,
      source: 'fallback',
      message: 'GEMINI_API_KEY not configured. Returning cached data.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const contextData = CONTEXT_DATA[validYear]?.[axis] || CONTEXT_DATA['2026'][axis];
    const axisLabel = AXIS_LABELS[axis];

    const prompt = `You are RANCAGE AI, a government Decision Support System policy analyst for West Java Province (Jawa Barat), Indonesia. You specialize in poverty alleviation and evidence-based policy analysis.

ANALYSIS CONTEXT:
- Analysis Type: ${axisLabel}
- Evaluation Year: ${validYear}
- Key Statistics: ${contextData.stats}
- District Data: ${contextData.districts}

TASK:
Generate a policy analysis response in English with exactly 3 fields. Be specific, data-driven, and actionable. Reference actual district names and statistics.

Respond ONLY with a valid JSON object (no markdown, no code fences) with these exact keys:
{
  "narrative": "A 2-3 sentence analytical narrative summarizing the key findings. Include specific percentages and district names. Be concise but insightful.",
  "focus": "A single sentence identifying the strategic focus area for policy intervention.",
  "actionableStep": "A single specific, concrete policy directive that a provincial governor could immediately authorize. Include target numbers, district names, and fiscal implications."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text?.trim() || '';

    // Parse JSON from Gemini response (handle potential markdown wrapping)
    let cleaned = text;
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(cleaned);

    // Validate required fields exist
    if (!parsed.narrative || !parsed.focus || !parsed.actionableStep) {
      throw new Error('Incomplete response from Gemini');
    }

    return res.status(200).json({
      narrative: parsed.narrative,
      focus: parsed.focus,
      actionableStep: parsed.actionableStep,
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('[RANCAGE AI] Gemini API error:', error?.message || error);

    // Fallback to hardcoded data on any error
    const fallback = FALLBACK_DATA[validYear]?.[axis] || FALLBACK_DATA['2026'][axis];
    return res.status(200).json({
      ...fallback,
      source: 'fallback',
      message: `AI generation failed: ${error?.message || 'Unknown error'}. Returning cached data.`,
    });
  }
}
