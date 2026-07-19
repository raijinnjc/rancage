# RANCAGE Dashboard: Analytics & Decision Support System (DSS) Specification
**Document Version:** 1.0.0  
**Target Audience:** UI/UX Designers, Frontend Developers, Backend Engineers, Data Scientists, and Bappeda/BPS Policy Architects  
**Purpose:** Implementation-ready mathematical, statistical, and logical blueprint for the West Java Poverty Alleviation Decision Support System.

---

## 1. Global System Constants & Analytical Definitions

To ensure consistency across all modules, we define the core statistical and mathematical formulas utilized within the RANCAGE system.

### 1.1 Foster-Greer-Thorbecke (FGT) Poverty Measures
Poverty indicators must be computed at the province, district (*Kabupaten/Kota*), sub-district (*Kecamatan*), and village (*Desa*) levels.

Let $N$ be the total population, $q$ be the number of poor individuals living below the official poverty line $z$, and $y_i$ be the welfare metric (per capita expenditure or PMT score) of individual/household $i$. The FGT index $P_\alpha$ is defined as:

$$P_\alpha = \frac{1}{N} \sum_{i=1}^{q} \left( \frac{z - y_i}{z} \right)^\alpha$$

*   **P0 (Poverty Headcount Ratio, $\alpha = 0$):** Measures the proportion of the population living below the poverty line.
    $$P_0 = \frac{q}{N}$$
    *   *Usage:* Tells policymakers **how many** are poor.
*   **P1 (Poverty Gap Index, $\alpha = 1$):** Measures the mean depth of poverty, showing how far below the poverty line the poor are on average.
    $$P_1 = \frac{1}{N} \sum_{i=1}^{q} \left( \frac{z - y_i}{z} \right)$$
    *   *Usage:* Determines the **budget scale** required to lift all poor households out of poverty under perfect targeting.
*   **P2 (Poverty Severity Index, $\alpha = 2$):** Measures inequality among the poor by placing greater weight on households furthest below the poverty line.
    $$P_2 = \frac{1}{N} \sum_{i=1}^{q} \left( \frac{z - y_i}{z} \right)^2$$
    *   *Usage:* Pinpoints the **most vulnerable** pockets requiring urgent, heavy-subsidy interventions.

### 1.2 Gini Ratio
The Gini Coefficient measures overall consumption/income inequality:

$$G = 1 - \sum_{k=1}^{n} (X_k - X_{k-1})(Y_k + Y_{k-1})$$

Where $X_k$ is the cumulative proportion of the population up to class $k$, and $Y_k$ is the cumulative proportion of welfare metrics up to class $k$.

### 1.3 Theil Index Decomposition ($T$)
To dissect inequality within and between West Java's 27 districts (*Kabupaten/Kota*), we decompose the overall Theil Index ($T$) into Intra-regional (Within-district) and Inter-regional (Between-district) inequalities.

Let $N$ be the total provincial population, $Y$ be the aggregate provincial welfare score, $N_g$ be the population of district $g$, and $Y_g$ be the aggregate welfare score of district $g$. Let $s_g = Y_g / Y$ be the welfare share, and $p_g = N_g / N$ be the population share. The total Theil Index $T$ is:

$$T = T_{\text{Within}} + T_{\text{Between}}$$

$$T_{\text{Between}} = \sum_{g=1}^{G} s_g \ln \left( \frac{s_g}{p_g} \right)$$

$$T_{\text{Within}} = \sum_{g=1}^{G} s_g T_g$$

Where $T_g$ is the internal Theil Index of district $g$.
*   *Policy Rule:* If $T_{\text{Within}} > T_{\text{Between}}$, poverty is driven by internal disparities within districts (requiring household-specific targeting like PMT). If $T_{\text{Between}} > T_{\text{Within}}$, disparities are driven by structural regional imbalances (requiring infrastructure and regional developmental funds).

### 1.4 Klassen Regional Typology Matrix
Each district is categorized into one of four quadrants based on two metrics:
1.  **District GDP Growth Rate ($g_i$)** relative to Provincial Average GDP Growth ($G$).
2.  **District Per Capita Income ($y_i$)** relative to Provincial Average Per Capita Income ($Y$).

| Quadrant | Name (Indonesian) | Status | Strategic Policy Pivot |
| :--- | :--- | :--- | :--- |
| **Quadrant I** | *Maju Cepat* | High Growth, High Income | **Sustainable growth, market integration, and urban social safety nets.** |
| **Quadrant II** | *Potensial* | High Growth, Low Income | **Structural transformation, industrial investment, and job creation.** |
| **Quadrant III** | *Tertekan* | Low Growth, High Income | **Economic revitalization, infrastructure rehabilitation, and inequality reduction.** |
| **Quadrant IV** | *Tertinggal* | Low Growth, Low Income | **Direct basic needs assistance, intensive capital grants, and structural infrastructure injections.** |

---

## 2. Global Filter & Interaction Matrix

Filters are state-driven and must interact reactively across all modules.

### 2.1 State Filter Definitions
1.  **Geographical Level (`geo_level`):** `Provincial` | `Kabupaten/Kota` | `Kecamatan` | `Desa`.
2.  **Selected Geography ID (`geo_id`):** Standard national administrative codes (e.g., `32` for West Java).
3.  **Welfare Decile (`welfare_decile`):** `Decile 1` (poorest 10%) to `Decile 10` (wealthiest 10%).
4.  **Temporal Frame (`time_frame`):** Yearly (`2020` - `2026`) and Quarterly.
5.  **Urban/Rural Classification (`urban_rural`):** `Urban` | `Rural`.
6.  **Demographic Filters:** Head of Household Gender (`Male` | `Female`), Head of Household Education Level (`No School` | `Primary` | `Secondary` | `Tertiary`), Household Size (`1-2` | `3-4` | `5+`).

### 2.2 Cross-Page Interaction Mapping

| Source Page | Interaction Trigger | Affected Page | Behavioral Response |
| :--- | :--- | :--- | :--- |
| **Executive Dashboard** | Click Regional Heatmap District | **Regional Diagnosis** | Navigates to page, sets `geo_id` to clicked district, updates P0, P1, P2 metrics. |
| **Regional Diagnosis** | Select "Within-District" Theil Segment | **Regional Profile** | Isolates the selected district's profile to display inner sub-district distribution. |
| **Typology Matrix** | Hover / Click scatter point | **Regional Profile** | Draws comparison sidebar showing regional profile of clicked point vs quadrant average. |
| **Household Targeting** | Toggle Decile Slider (D1-D4) | **ML Page** | Updates Confusion Matrix, modifying threshold lines to visualize inclusion/exclusion shifts. |
| **ML Page** | Drag PMT threshold slider | **Policy Engine** | Recalculates expected budget impacts and estimated beneficiary size across West Java. |

---

## 3. Page-by-Page Analytical & Data Specification

---

### Module 1: Executive Dashboard (Public / Government Role-based Views)

*   **Purpose:** Provide a rapid, high-level structural overview of poverty and inequality in West Java, acting as the entry point for all policymakers.
*   **Primary User:** Governor of West Java, Head of Bappeda, General Public.
*   **Key Questions Answered:**
    1.  What is the current poverty rate (P0), and is it meeting the annual regional development target (RPJMD)?
    2.  Are the poverty gap (P1) and severity (P2) shrinking or widening?
    3.  How is public welfare funding distributed compared to local targeting efficiency?

#### Required Datasets & Variables
*   `susenas_aggregate.csv`: Poverty rates (P0, P1, P2), Gini ratio aggregated by year (`year`), district (`kabupaten_id`).
*   `dtks_pmt_summary.csv`: Inclusion error rate (`inclusion_rate`), exclusion error rate (`exclusion_rate`), total registered households (`total_hh`), total active aid recipients (`total_active_recipients`).

#### KPI Cards (Total: 4)
1.  **Poverty Headcount (P0):**
    *   *Value:* `7.62%` (State value for West Java, 2026).
    *   *Sub-label:* `-0.34% vs last year` (Green positive indicator), target is `7.20%` (RPJMD 2026).
2.  **Poverty Gap (P1):**
    *   *Value:* `1.24` (Mean distance from poverty line).
    *   *Sub-label:* `-0.08 vs last year` (Green indicator, showing reduction in depth).
3.  **Inclusion Error Rate (Leakage):**
    *   *Value:* `14.2%` (Proportion of non-poor receiving aid).
    *   *Sub-label:* `+1.2% increase vs last year` (Red alert indicator, showing targeting decay).
4.  **Exclusion Error Rate (Undercoverage):**
    *   *Value:* `9.8%` (Proportion of poor excluded from aid).
    *   *Sub-label:* `-2.1% drop vs last year` (Green positive indicator, showing better coverage).

#### Visualizations
1.  **Poverty Progress Timeline (RPJMD vs Actual P0):**
    *   *Chart Type:* Dual-axis line and area chart (Line = target, Area = actual).
    *   *Why Chosen:* Clearly illustrates long-term policy performance against statutory commitments, highlighting periods of structural divergence (e.g., inflation shocks).
    *   *Policy Trigger:* If actual line drifts above target for 2 consecutive quarters, trigger emergency social safety net evaluation.
2.  **West Java Regional Poverty Map (Kabupaten-level choropleth):**
    *   *Chart Type:* Interactive Geographic Choropleth.
    *   *Visual Bindings:* Fill color mapped to P0 rate (Sequential scale: Light Yellow to Deep Red). Tooltip exhibits P0, P1, P2, and major typology quadrant.
    *   *Why Chosen:* Immediate spatial diagnostics. It localizes geographic clusters of deprivation instantly (e.g., Southern West Java corridor vs Northern industrial hubs).

#### Alert & Summary Panels
*   **Dynamic Executive AI Summary (Generated using Gemini with Grounding):**
    "West Java’s poverty headcount has dropped to **7.62%**, but structural depth (P1: 1.24) remains concentrated in rural pockets of Southern Tasikmalaya. While exclusion errors have decreased by 2.1%, rising inclusion errors (14.2%) in urban centers suggest aid leakage to Decile 5. Corrective PMT calibration is required."
*   **System Alert Panel:**
    *   `High Priority Alert`: Kabupaten Sukabumi exclusion error exceeds 12% due to informal sector employment swings.
    *   `Warning`: Sub-district Karawang Timur exhibits a 5% spike in P2 despite high industrial growth (Typology Quadrant III divergence).

---

### Module 2: Regional Diagnosis

*   **Purpose:** Dissect the structural mechanics of regional poverty and inequality using advanced economic decomposition.
*   **Primary User:** Bappeda Analysts, BPS Statisticians, Economic Policy Advisory Council.
*   **Key Questions Answered:**
    1.  Is inequality in West Java driven by internal district income gaps or structural disparities between districts?
    2.  Which districts contribute most to provincial poverty gap severity?

#### Required Datasets & Variables
*   `theil_decomposition.json`: Historical annual values of $T$, $T_{\text{Within}}$, $T_{\text{Between}}$, and individual contribution shares of all 27 districts.
*   `fgt_district_comparison.csv`: Poverty indices (P0, P1, P2) for all 27 districts.

#### Visualizations
1.  **Inequality Decomposition (Theil Index Within vs Between):**
    *   *Chart Type:* Stacked Area Chart over time.
    *   *Why Chosen:* Visualizes structural economic shifts. Showing that $T_{\text{Within}}$ represents ~78% of inequality proves to policymakers that redistributive policies must focus on household-level targeting rather than pure inter-regional fiscal transfers.
2.  **District Contribution to Poverty Severity (P2):**
    *   *Chart Type:* Horizontal Stacked Diverging Bar Chart.
    *   *X-Axis:* Percentage contribution to West Java's total poverty severity volume.
    *   *Y-Axis:* District (*Kabupaten/Kota*) sorted descending by contribution.
    *   *Why Chosen:* Prevents statistical bias. A large district with a low poverty rate (e.g., Kabupaten Bogor) might contribute more to the aggregate number of poor individuals than a small district with a high poverty rate (e.g., Pangandaran). This chart forces structural scale awareness.

#### Tables
*   **The Regional Inequality Matrix Table:**
    Columns: District Name | P0 (%) | P1 (Gap) | P2 (Severity) | Gini Ratio | Theil Contribution Share (%) | Urban/Rural Ratio.  
    Interactive feature: Sortable by any column; clicking a row isolates that district's timeline.

#### Policy Action Triggered
*   *Action:* If a district's Theil Contribution Share exceeds 8% AND P2 is increasing, automatically flag this district for priority allocation of the provincial Special Allocation Fund (*Dana Alokasi Khusus - DAK*).

---

### Module 3: Klassen Typology Matrix

*   **Purpose:** Classify districts into spatial-economic planning zones to pair developmental growth policies with targeted social safety nets.
*   **Primary User:** Regional Planning Officers, Ministry of Home Affairs Representatives.
*   **Key Questions Answered:**
    1.  Which districts are economically lagging but have high growth potential?
    2.  How should social safety net budgets be balanced against capital infrastructure investments?

#### Required Datasets & Variables
*   `klassen_typology_data.csv`: District Name, GDP Growth Rate ($g_i$), Per Capita Income ($y_i$), Population below Poverty Line ($P0_v$), total welfare budget allocation.

#### Visualizations
1.  **The Klassen Typology Scatter Plot:**
    *   *Chart Type:* 4-Quadrant Quadrant Chart (Scatter Plot).
    *   *Y-Axis:* District Per Capita Income (Logarithmic Scale, centered at Provincial Median Per Capita Income).
    *   *X-Axis:* District GDP Growth Rate (Centered at Provincial Average Growth Rate).
    *   *Scatter Node Size:* Mapped to Total Number of Poor Individuals in the district.
    *   *Color Coding:*
        *   **Quadrant I (Maju Cepat):** Deep Slate Blue.
        *   **Quadrant II (Potensial):** Warm Forest Green.
        *   **Quadrant III (Tertekan):** Amber Orange.
        *   **Quadrant IV (Tertinggal):** Crimson Red.
    *   *Why Chosen:* It is the absolute gold standard for macroeconomic regional planning. Policymakers can immediately distinguish structural poverty (Quadrant IV) from transitional poverty (Quadrant II/III).
    *   *Interactivity:* Drag-to-select multiple nodes, which instantly updates the aggregated baseline statistics below the chart.

#### Priority Scoring Logic
A dynamic priority index is calculated for each district to rank intervention urgency:

$$\text{Priority Score}_i = w_1 \left( \frac{P0_i}{\max(P0)} \right) + w_2 \left( \frac{\text{Poor Pop}_i}{\max(\text{Poor Pop})} \right) - w_3 \left( \frac{\text{Growth}_i}{\max(\text{Growth})} \right)$$

Where weights $w_1 = 0.4$, $w_2 = 0.4$, and $w_3 = 0.2$. The top 5 highest-scoring districts are displayed in the "Urgent Intervention Panel."

---

### Module 4: Regional Profile

*   **Purpose:** Provide a deep-dive, multi-dimensional diagnostic dashboard of a single selected district, comparing it directly to provincial benchmarks.
*   **Primary User:** District Regents (*Bupati/Walikota*), local Bappeda teams.
*   **Key Questions Answered:**
    1.  What are the primary structural drivers of poverty in my district (education gaps, lack of electricity, agricultural labor concentration)?
    2.  How does my district perform on basic services index compared to the rest of West Java?

#### Required Datasets & Variables
*   `district_multidimensional_profile.csv`: Infrastructure accessibility indicators (electricity access, clean water, sanitization), average schooling years (`school_years`), unemployment rate (`unemployment`), agricultural employment share (`agri_share`).

#### Analytical Flow
1.  **Selector Node:** User selects a district from a responsive global dropdown or clicks on the Klassen scatter plot.
2.  **Structural Breakdown:** The system renders the district's structural profile.
3.  **Benchmark Line:** Every single widget shows the selected district's actual performance against the West Java state average.

#### Visualizations
1.  **Multi-Dimensional Deprivation Radar Chart:**
    *   *Axes:* % households lacking: [1] Clean Water, [2] Decent Sanitation, [3] High School Education, [4] Formal Contracts, [5] Internet Access, [6] Health Insurance (BPJS).
    *   *Why Chosen:* Instantly reveals structural deficits. For example, if a district has low income but high health/education metrics, the policy should focus on job creation. If the reverse is true, infrastructure investment must lead.
2.  **Socioeconomic Historical Area Chart:**
    *   *Visuals:* Stacked area showing employment distribution across Agriculture, Manufacturing, and Services sectors over a 10-year period, paired with a secondary line representing the district P0 rate.

---

### Module 5: Household Targeting (Government Authorized Role Only)

*   **Purpose:** Provide authenticated social workers and regional planners with an evidence-based micro-targeting tool to select, verify, and export eligible beneficiaries while auditing potential errors.
*   **Primary User:** Social Affairs Office (*Dinas Sosial*), Sub-district/Village Administrators.
*   **Key Questions Answered:**
    1.  Which specific households fall in Decile 1 and Decile 2 within a selected village?
    2.  What is the probability of a specific household being misclassified?
    3.  What are the observable living conditions of a selected family?

#### Data Protection & Privacy Framework
*   **Strict Security Protocol:** This page is completely blocked for Public users. Access requires signing in with Gov-ID.
*   **Data Masking:** For security and compliance, names and national ID numbers (*NIK*) are masked in the public interface (e.g., `3204**********0002` and `Ahmad S*****`). Unmasked data can only be decrypted by authorized *Dinas Sosial* administrators with audited logging of every export action.

#### Required Datasets & Variables
*   `dtks_household_microdata.csv` (Simulated representative set): Household ID, Head of Household Name, Masked NIK, Sub-district, Village, PMT Welfare Score, Welfare Decile, PMT Prediction Probability, Predicted Aid Category, Dependency Ratio, House Floor Material, Toilet Access, Electricity Source.

#### Household Directory & Interactive Search
*   **Filtering Controls:**
    *   District $\rightarrow$ Sub-district $\rightarrow$ Village multi-stage nested dropdown.
    *   Welfare Decile Slider (D1-D4).
    *   Aid Status Toggle: `Active Recipient` | `Non-Recipient`.
    *   PMT Score range slider (0.00 to 1.00).

#### List Interface & Tables
The core table lists records matching the active filters:

| Household ID | Head of Household | Decile | PMT Prob | Primary Vulnerability | Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `HH-320412-0081` | Ahmad S***** | D1 | `94.2%` | Unemployed, Dirt Floor, No Water | `Inspect Profile` |
| `HH-320412-1102` | Ibu Cucum **** | D1 | `89.1%` | Female Headed, Elder Dependent | `Inspect Profile` |

#### Detailed Household Inspector Drawer
When clicking `Inspect Profile`, an elegant sidebar panel slides out displaying:
1.  **Welfare Score Gauge:** Visual speedometer indicating the PMT score with probability boundaries.
2.  **Asset Score Cards:**
    *   *Housing:* Wood walls, dirt floor, 450VA electricity.
    *   *Demographics:* 3 children under 5, single mother.
    *   *Education:* Head of household did not complete elementary school.
3.  **Audit Log Checklist:** System logs detailing when the household was last visited by local field agents (*Pendamping PKH*).

---

### Module 6: Machine Learning Evaluation

*   **Purpose:** Evaluate the performance and fairness of the Proxy Means Testing (PMT) model, allowing technical advisors to adjust eligibility thresholds and analyze model mechanics.
*   **Primary User:** Data Scientists, Policy Evaluation Specialists.
*   **Key Questions Answered:**
    1.  What is the predictive accuracy of the Gradient Boosting Machine (GBM) model on different sub-populations?
    2.  What features (variables) are the primary drivers of household welfare scoring?
    3.  How does shifting the eligibility threshold impact public budget expenditure and targeting errors?

#### Machine Learning Concepts & Formulas
The system utilizes a Gradient Boosting Machine (GBM) to estimate log consumption per capita.
*   **Inclusion Error (False Positive Rate):**
    $$\text{Inclusion Error} = \frac{\text{False Positives (FP)}}{\text{True Positives (TP)} + \text{False Positives (FP)}}$$
*   **Exclusion Error (False Negative Rate):**
    $$\text{Exclusion Error} = \frac{\text{False Negatives (FN)}}{\text{True Positives (TP)} + \text{False Negatives (FN)}}$$

#### Visualizations
1.  **Interactive Confusion Matrix (with Threshold Slider):**
    *   *Interface:* A $2 \times 2$ matrix alongside a slider representing the target welfare percentile cutoff.
    *   *Interaction:* Moving the slider to the right (expanding eligibility) reduces Exclusion Error (False Negatives) but increases Inclusion Error (False Positives) and inflates budget demands.
    *   *Why Chosen:* Empowers policymakers to visually experience the trade-off of fiscal targeting decisions before finalizing policy decrees (*Surat Keputusan*).
2.  **Global Feature Importance Chart (SHAP Values):**
    *   *Chart Type:* Horizontal bar chart of absolute SHAP values.
    *   *Variables:* [1] Asset Ownership, [2] Floor Material, [3] Head of HH Education, [4] Dependency Ratio, [5] Cooking Fuel.
    *   *Why Chosen:* Decodes the "black box" model, building trust among government officials who must justify why certain households were selected or omitted.

---

### Module 7: Policy Recommendation Engine

*   **Purpose:** Synthesize complex spatial, economic, and machine learning outputs into explicit, actionable, and cost-evaluated policy intervention plans.
*   **Primary User:** Head of Bappeda, Governor, Regional Budget Committees (*TAPD*).
*   **Key Questions Answered:**
    1.  Given current analytical evidence, what concrete policy actions should be prioritized?
    2.  How much budget is required, and which government agency is accountable?
    3.  What is the projected outcome on the regional poverty headcount?

#### Structured Policy Engine Schema
Each policy recommendation is generated dynamically based on specific analytical thresholds. Below is the operational matrix for the recommendation engine:

```
[Analytical Diagnostic Engine]
  │
  ├──► IF P0 > Provincial Avg AND Typology == Quadrant IV (Lagging)
  │      └──► Trigger: "STRUCTURAL POVERTY INTERVENTION" (Basic Infrastructure + Capital Grants)
  │
  ├──► IF Exclusion Error > 10% AND T_Within > T_Between
  │      └──► Trigger: "TARGETING CALIBRATION RE-SURVEY" (Dinas Sosial targeted census)
  │
  └──► IF P2 (Severity) Spike AND Agri Sector Employment > 50%
         └──► Trigger: "AGRICULTURAL RISK MITIGATION & BPJS TRANSFERS" (Direct cash + seed subsidies)
```

#### Detailed Policy Blueprint Definition

##### Recommendation 1: Regional Re-Survey & Targeting Calibration
*   **Trigger Condition:** Inclusion/Exclusion error exceeds 10% in a district where within-district inequality ($T_{\text{Within}}$) contributes over 70% of total variance.
*   **Evidence & Analytics:** In Kabupaten Sukabumi, the exclusion error has reached `11.8%`, while $T_{\text{Within}}$ is `0.181` (82% of total local disparity).
*   **Strategic Action Plan:** Deploy local verification agents (*Pendamping PKH*) using mobile surveys to re-evaluate 15,400 households currently classified in Decile 3/4 but predicted to be Decile 1 by the RANCAGE GBM model.
*   **Estimated Cost:** IDR 1.2 Billion (Provincial Emergency Allocation).
*   **Accountable Agency:** Provincial Social Affairs Office (*Dinas Sosial Jawa Barat*).
*   **Projected Impact:** Reduction of regional Exclusion Error by 4.2%, lifting an estimated 6,200 households into active social safety net coverage.
*   **Confidence Level:** High (91% model matching rate).

##### Recommendation 2: Basic Services Infrastructure Injection
*   **Trigger Condition:** Klassen Typology is Quadrant IV (Tertinggal) AND multidimensional deprivation shows clean water and sanitation gaps exceed 40%.
*   **Evidence & Analytics:** Kabupaten Tasikmalaya (Quadrant IV) exhibits a 42% clean water deficit and 48% sanitation gap. Poverty Headcount (P0) is stuck at 10.4%.
*   **Strategic Action Plan:** Reallocate regional infrastructure funds to construct 12 communal sanitation facilities and install clean water distribution networks across 8 prioritized villages (*Desa Tertinggal*).
*   **Estimated Cost:** IDR 8.5 Billion.
*   **Accountable Agency:** Public Works and Spatial Planning Office (*Dinas PUPR Jawa Barat*).
*   **Projected Impact:** P0 headcount reduction of 0.8% over 18 months by lowering household non-food medical expenditures.
*   **Confidence Level:** Medium (correlation between sanitation gaps and poverty persistence in Tasikmalaya is $r = 0.74$).

---

### Module 8: Monitoring & Early Warning System (EWS)

*   **Purpose:** Track active policy implementations, monitor poverty dynamics in real time, and trigger alerts when regional poverty targets drift from the planned RPJMD trajectory.
*   **Primary User:** Program Monitoring Units, Development Evaluation Officers.
*   **Key Questions Answered:**
    1.  Are program funds being disbursed on schedule, and is the targeting efficiency improving?
    2.  Are there emerging economic shocks (e.g., food price spikes) putting vulnerable households at risk of falling back into poverty?

#### Required Datasets & Variables
*   `monitoring_poverty_trajectory.csv`: Timeline of target P0 vs actual estimated P0, budget disbursement rates (`budget_disbursed_pct`), basic food price index (`sembako_index`).

#### Core Monitoring Indicators
1.  **Target Accomplishment Rate:** Percentage of annual poverty reduction target achieved (`84%` for 2026).
2.  **Budget Efficiency Quotient:** Ratio of budget spent directly on D1-D2 households vs total program administrative overhead.
3.  **EWS Vulnerability Index:** Composite rolling score based on local food price inflation, weather anomalies (crop failures in Indramayu/Karawang), and mass layoff reports.

#### Visualizations
1.  **RPJMD Target Trajectory Monitor:**
    *   *Chart Type:* Fan Chart (similar to inflation forecasting charts).
    *   *Visuals:* Solid line represents past actual P0. A dashed central line represents the RPJMD target trajectory. Shaded bands (intervals) show the predicted path of poverty headcount based on current budget disbursement rates.
    *   *Why Chosen:* Provides a probabilistic view of target achievement, preventing overconfidence in point estimates.
2.  **Budget Disbursement vs Poverty Alleviation Velocity:**
    *   *Chart Type:* Dual-Y scatter-bubble chart.
    *   *X-Axis:* Program budget disbursement percentage.
    *   *Y-Axis:* Quarterly poverty reduction velocity ($\Delta P0$).
    *   *Bubble Size:* Active program caseload.
    *   *Why Chosen:* Immediately flags administrative inefficiencies (e.g., districts spending 90% of their budget but achieving zero poverty reduction).

---

## 4. Technical Architecture Requirements (For Engineers)

To guide the downstream development of the RANCAGE DSS application, we define the standard full-stack, server-side architecture.

### 4.1 System Technology Stack
*   **Frontend Framework:** React 19 (TypeScript) with Vite and Tailwind CSS.
*   **Visualization Engine:** Recharts and D3.js (custom SVG coordinate transforms for the Klassen Matrix and Choropleth maps).
*   **Animations:** Motion (`motion/react`) for fluid component transitions.
*   **Backend Server:** Node.js / Express (TypeScript) serving as the secure proxy layer.
*   **Data Science Pipeline:** Pre-trained Gradient Boosting Machine (GBM) model converted to a secure, server-side mathematical matrix or inferred via standard inference endpoints.
*   **Database:** Firebase Firestore (for saving policy annotations, bookmarking households, auditing user login logs, and local priority configurations).

### 4.2 Security & Authentication Policy
*   All household data MUST remain on the server. The client-side dashboard receives aggregate figures unless authenticated with Gov-ID credentials.
*   No client-side exposure of API keys (Gemini, Database, or Maps).
*   Automatic session timeout: 15 minutes of inactivity for government users to prevent unauthorized access at administrative desks.

---

## 5. Summary of Policy Action Path (User Journey)

The RANCAGE system is designed to facilitate a rapid, evidence-to-action transition for West Java officials. Below is the statutory user journey:

```
[1. EXECUTIVE MONITORING]
  ├─► Check Provincial P0, P1, P2 trends on the main page.
  └─► Identify Kabupaten Sukabumi is showing a spike in poverty severity (P2).
        │
[2. REGIONAL DIAGNOSIS]
  ├─► Inspect Sukabumi's inequality structure.
  └─► Find that "Within-District" inequality represents 82% of the issue.
        │
[3. KLASSEN TYPOLOGY & REGIONAL PROFILE]
  ├─► Locate Sukabumi in Klassen Typology (Quadrant III - High Income, Low Growth).
  └─► Inspect profile: Discover structural gaps in secondary education and clean water.
        │
[4. HOUSEHOLD MICRO-TARGETING]
  ├─► Dinas Sosial logs in securely with Gov-ID.
  └─► Filter Sukabumi ──► Decile 1 ──► Village level.
  └─► Generate and export the audited, masked targeted re-survey list.
        │
[5. MACHINE LEARNING & POLICY EVALUATION]
  ├─► Adjust PMT thresholds to accommodate budget limitations.
  └─► Adopt the structural policy recommendations generated by the policy engine.
```

This completes the comprehensive functional and analytical specification. The system is structurally primed to serve as an authoritative, scientific, and responsive DSS for West Java Province.
