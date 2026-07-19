# RANCAGE UI Design Blueprint & Screen Specification
**Document Version:** 1.0.0  
**Phase:** Complete UI/UX Specification for Figma Translation  
**Aesthetic Theme:** High Density, Government-Grade, Minimal, Data-Focused  

This document serves as the absolute blueprint for translating the RANCAGE Decision Support System (DSS) into pixel-perfect Figma designs. It defines layouts, spacing, component positioning, typography bindings, interactions, responsive behavior, and states for all 12 core screens without ambiguity.

---

## Part 1: Global Grid, Spacing, and Screen States

### 1.1 Responsive Layout Grid Definitions

#### Desktop Layout (1440px)
*   **Total Content Width:** 1440px (full-bleed responsive application frame).
*   **Navigation Column (Sidebar):** 256px wide, fixed (`w-64`), extending from `y = 0` to `y = 100vh`.
*   **Header Height:** 64px, fixed (`h-16`), pinned to top (`x = 256px` to `x = 1440px`).
*   **Main Workspace:** 1184px wide, fluid, with nested `gap-6` (24px) Grid columns.
*   **Grid:** 12-column grid, `margin = 24px`, `gutter = 24px`.

#### Laptop Layout (1280px)
*   **Navigation Column (Sidebar):** Collapsed to 64px wide (icon-only with hover tooltips).
*   **Header Height:** 64px, fixed (`x = 64px` to `x = 1280px`).
*   **Main Workspace:** 1216px wide, fluid, `gap-6` (24px) columns.
*   **Grid:** 12-column grid, `margin = 24px`, `gutter = 24px`.

#### Tablet Layout (1024px)
*   **Navigation Column (Sidebar):** Collapsed to 64px wide.
*   **Header Height:** 64px.
*   **Main Workspace:** 960px wide, fluid. Grid columns consolidate: 4-column structures become 2-column structures, and 12-column spans fall back to vertical blocks.
*   **Grid:** 8-column grid, `margin = 16px`, `gutter = 16px`.

#### Mobile Layout (375px)
*   **Navigation Column (Sidebar):** Hidden entirely. Handled via a slide-out hamburger drawer (`width: 280px`).
*   **Header Height:** 56px (`h-14`) featuring Hamburger Icon, Title, and Secure Access Indicator Dot.
*   **Main Workspace:** 375px wide, single column, stacked.
*   **Grid:** 4-column grid, `margin = 16px`, `gutter = 12px`.

---

### 1.2 System Transitions and Loading States

#### Screen-to-Screen Transitions
*   **Behavior:** Page route changes use a fluid, staggered fade-in layout.
*   **Animation Tokens (Motion):**
    *   *Wrapper Page Container:* `initial={{ opacity: 0, y: 4 }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.2, ease: "easeOut" }}`.
    *   *Staggered Children (Cards/Lists):* Stagger delay of `0.05s` per list item or grid card to establish visual order.

#### Skeleton Loading Framework
*   **Visual Standard:** Do not use spinning wheels. Use static geometric skeleton blocks styled with an animated pulse loop (`pulse`, `animation-duration: 1.5s`).
*   **Color Bindings:** `#E2E8F0` (light mode shimmer) / `#334155` (dark mode shimmer).
*   **Element Mapping:**
    *   *KPI Card Skeletons:* Block of `height: 96px`, with two lines mimicking labels and big values.
    *   *Chart Skeletons:* Clean, empty card with light dashed gridlines and a soft gray bar or area mock outline.
    *   *Table Skeletons:* Pinned headers with 5 repeating rows of skeleton bars (`height: 16px`).

#### Multi-State Definitions (Global Fallbacks)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  EMPTY STATE: No Data Matches Selected Filters                           │
│  - Illustration: Simple, 48px light gray dashed circle with an info icon │
│  - Typography: 14px Semibold Title, 12px Regular descriptive body        │
│  - Action: "Reset Filters to Baseline" primary button                    │
├──────────────────────────────────────────────────────────────────────────┤
│  ERROR STATE: System/API Disruption                                      │
│  - Accent Color: Left-border 3px Crimson Red (#EF4444)                   │
│  - Copy: "Computation timeout on server. Error Code: 504_GATEWAY."        │
│  - Action: "Retry Process" button (blue outline, flat, 12px)              │
├──────────────────────────────────────────────────────────────────────────┤
│  OFFLINE STATE: No Internet Connection Detected                          │
│  - Banner: Floating, 32px top-bar banner, Dark Amber background (#F59E0B)│
│  - Copy: "Working offline. Changes will sync when network is restored."  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Part 2: Screen-by-Screen UI Specifications

---

### Screen 1: Landing Page

*   **Page Purpose:** Establish public credibility and authority, defining why RANCAGE exists. It presents West Java's macro socioeconomic indicators to the public and serves as the secure entry point for government officials.

#### 1. Screen Layout & Component Placement

```
========================================================================================================
[RANCAGE] (Logo)         About    Macro-Indicators    Documentation           [SECURE GOV-ID SIGN IN]
========================================================================================================
  
                              WEST JAVA SOCIAL INTELLIGENCE
                      Evidence-Based Decision Support System for
                             Poverty Alleviation (DSS)
  
                    [Explore Public Indicators]     [Gov-ID Secure Access]
  
  ------------------------------------------------------------------------------------------------------
  [ MACRO INDICATORS BASKET ]
  [ Poverty Headcount P0 ]    [ Poverty Gap P1 ]    [ Inequality Gini ]    [ Active Budget Aligned ]
  [ 7.62%                ]    [ 1.24           ]    [ 0.412           ]    [ IDR 4.2 Trillion      ]
  
========================================================================================================
```

*   **Desktop Grid:**
    *   *Hero Section:* 12-column container centering the titles, 120px top padding, 80px bottom padding.
    *   *Actions Panel:* Centered horizontally, containing two high-contrast button blocks.
    *   *Public Stats Grid:* 4-column cards displaying West Java's macro vitals.

#### 2. Component Details

##### Hero Section
*   **Heading:** `display-lg` Outfit font, dark slate (`#0F172A`). "Decision Intelligence for Poverty Alleviation."
*   **Sub-heading:** `body-md` Inter font, slate gray (`#475569`). "RANCAGE coordinates spatial analytics, predictive Machine Learning, and macroeconomic indices to guide policymakers in West Java."

##### Primary Call-To-Action (Buttons)
*   **Button A (Public Access):** `bg-slate-900`, white text, `rounded-sm`, 12px vertical/24px horizontal padding. Hover transforms background to `#1E293B`. Leads directly to the Public view of the Executive Dashboard.
*   **Button B (Secure Access):** Outlined button, `border-slate-300`, dark text. Includes a lock icon next to the label: "Gov-ID Secure Access". Opens the secure login modal.

##### Public Stats Cards (Total: 4)
*   **Visuals:** White flat background, standard gray hairline border, 16px padding.
*   **Data Content:** Poverty rate, Gini coefficient, target progress percentage, and date of last official survey.

#### 3. Responsive Adaptations
*   **Mobile:** Text scales down dynamically (`display-lg` becomes 24px). Buttons stack vertically (`w-full` with 12px spacing). Public stats grid collapses into a single-column, swipeable cards carousel.

---

### Screen 2: Authentication (Gov-ID Secure Login Portal)

*   **Page Purpose:** Authenticate government users (Bappeda, Dinas Sosial, BPS) before granting access to sensitive household-level information and policy planning tools.

#### 1. Screen Layout & Component Placement
*   **Structure:** Minimalist dual-panel layout.
    *   *Left Panel (40% width):* Deep Slate Blue solid background (`#0F172A`). Features white typography summarizing West Java's security and data protection act (UU No. 27/2022 on PDP compliance).
    *   *Right Panel (60% width):* Pure white background containing the secure login input form, centered vertically and horizontally.

```
┌───────────────────────────────┬────────────────────────────────────────────────────────┐
│                               │                                                        │
│  [R] RANCAGE SYSTEM           │                 GOVERNMENT AUDITED SIGN IN             │
│                               │                 Log in using your official Gov-ID      │
│  Audit Notice:                │                                                        │
│  All data access sessions     │                 Official Email address                 │
│  are logged, monitored,       │                 [ bappeda_admin@jabarprov.go.id      ] │
│  and subject to state         │                                                        │
│  confidentiality acts.        │                 Password                               │
│                               │                 [ ******************                 ] │
│  PDP Compliance UU 27/2022.   │                                                        │
│                               │                 [      SIGN IN WITH AUDITED GOV-ID   ] │
│                               │                                                        │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

#### 2. Component Details

##### Authentication Card Forms
*   **Input Fields:** Fixed width 320px, height 40px, `rounded-sm`. Font: `body-md` Inter. Active state displays blue focus ring (`#3B82F6`).
*   **Sign-In Button:** Large, primary blue block (`#2563EB`), high-contrast white text, `rounded-sm`. Features progress loader element in active state.

##### OTP Verification Modal Layer
*   **Behavior:** Triggered immediately after entering valid email/password credentials.
*   **Visuals:** Overlay modal, centered, `width: 400px`, `rounded-sm`, pure white surface.
*   **Grid:** 6 distinct inline code blocks, font `display-md` JetBrains Mono, aligned horizontally for the 6-digit pin entry. Includes an automatic 60-second countdown timer.

##### Security Alert Panel
*   **Style:** Positioned beneath the OTP input field, styled with a soft yellow warning background (`#FEF3C7`), amber text (`#92400E`), and an alert icon.
*   **Microcopy:** "AUDIT ALERT: This workstation session is logged. Accessing household information without official duty clearance is strictly prohibited."

#### 3. Responsive Adaptations
*   **Tablet/Mobile:** Left informational panel is hidden. Right login panel fills the entire width. Margin is set to 24px on boundaries.

---

### Screen 3: Executive Dashboard

*   **Page Purpose:** Provide a high-level overview of poverty indicators, trends, and alerts. This page acts as the primary cockpit for West Java's leadership to track progress.

#### 1. Screen Layout & Component Placement

```
========================================================================================================
[RANCAGE] (DSS)     | Overview    Diagnosis    Typology    Targeting    Evaluation    Recommendations
========================================================================================================
  Jawa Barat / Executive DSS Overview / 2026 Baseline                       [ PUBLIC DISCLOSURE ACCESS ]
--------------------------------------------------------------------------------------------------------
  [ KPI: P0 Headcount ]   [ KPI: Poverty Gap P1 ]   [ KPI: Severity P2 ]   [ KPI: Targeting Accuracy ]
  [ 7.62%  ▼ -0.34%   ]   [ 1.24  ▼ -0.08       ]   [ 0.38  ▲ +0.02    ]   [ 91.3%  ▲ +0.5%          ]
--------------------------------------------------------------------------------------------------------
  [ PRIMARY MAP AREA: CHOROPLETH ]                       | [ THEIL DECOMPOSITION SUMMARY ]
  [                                                      | [ Total Inequality (T): 0.231 ]
  [                                                      | [ Intra-regional (Within) : 78% ]
  [                    [Map Canvas]                      | [ Inter-regional (Between): 22% ]
  [                                                      |----------------------------------------------
  [                                                      | [ POLICY REC ENGINE ALERT PANEL ]
  [                                                      | [ ! ] Priority Action 01: Sukabumi PKH
  [                                                      | [ ! ] Priority Action 02: Tasikmalaya PUPR
========================================================================================================
```

*   **Desktop Grid:**
    *   *Top Header Area:* Full-bleed row spanning 12-columns, containing Page Title, Temporal Selector, and Secure Access badge.
    *   *KPI Block:* 4 cards spanning 3 grid-columns each.
    *   *Main Body split:* Left side spans 8-columns (Map Chart); Right side spans 4-columns (Theil decomposition and priority list container).

#### 2. Component Details

##### Core KPI Row (Total: 4)
*   **P0 Card:** displays `7.62%` (`display-lg` Outfit), subtitle "Poverty Headcount", footer shows trend indicator `-0.34% vs Q3` (Green caret).
*   **P1 Card:** displays `1.24`, subtitle "Poverty Gap Index", footer `-0.08` (Green).
*   **P2 Card:** displays `0.38`, subtitle "Poverty Severity Index", footer `+0.02` (Red caret alert).
*   **Targeting Card:** displays `91.3%`, subtitle "Inclusion Accuracy (GBM)", footer `+0.5%` (Green).

##### Interactive Choropleth Map Layer
*   **Visuals:** Mapped vector container, absolute sizing of `height: 480px` inside the card wrapper. Left-bottom displays map keys ranging from Light Yellow (low poverty) to Deep Red (severe poverty).

##### Alert & Summary Panel
*   **Position:** Right-bottom section. Flat slate card with solid dark background (`#0F172A`) for government users (or muted gray for public).
*   **Microcopy:** Lists two active policy alerts with high-contrast indicator flags (`critical` red and `warning` amber).

#### 3. Responsive Adaptations
*   **Tablet/Mobile:** KPI blocks stack to a 2x2 grid (tablet) or single column (mobile). Map and right-hand panels stack vertically. The map's height scales down to `280px` to save vertical space.

---

### Screen 4: Regional Diagnosis

*   **Page Purpose:** Analyze income disparities and geographic inequality drivers using advanced decomposition techniques.

#### 1. Screen Layout & Component Placement
*   **Desktop Grid:**
    *   *Top Row:* 12-column span containing diagnosis filters (Demographic, Temporal, Geographic).
    *   *Middle Row:* Spans 8-columns containing the primary historical poverty trend chart (P0, P1, P2 timeline); Spans 4-columns containing the horizontal Theil contribution chart.
    *   *Bottom Row:* Spans 12-columns containing the complete Regional Inequality comparative data table.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Diagnosis Filters: [ Year: 2026 ▼ ] [ Level: Kabupaten ▼ ] [ Category: Food/Non-food ▼ ]│
├───────────────────────────────────────────────┬────────────────────────────────────────┤
│  HISTORICAL POVERTY TRENDS (P0, P1, P2)       │  THEIL REGIONAL DECOMPOSITION          │
│  [ [Line Chart Canvas: 10-year timeline] ]    │  [ Within-District ] 78% [========   ] │
│                                               │  [ Between-District] 22% [==         ] │
├───────────────────────────────────────────────┴────────────────────────────────────────┤
│  REGIONAL INEQUALITY BENCHMARK TABLE                                                    │
│  | District Name   | P0 Headcount | P1 (Gap) | P2 (Severity) | Gini Ratio | Theil Share │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 2. Component Details

##### Diagnosis Filtering Bar
*   **Controls:** Flat dropdown lists with light hairline borders. Font: `body-md` Inter. Spaced 12px apart.

##### Poverty Trends Line Chart
*   **Visualization Spec:** Dual-Y axes line chart. Left Y-axis scales to percentage values (P0); Right Y-axis scales to absolute index values (P1, P2). X-axis shows the years (`2016 - 2026`). Lines use distinct solid and dashed styles to differentiate indicators clearly.

##### Inequality Benchmark Table
*   **Layout:** Dense rows, sticky headers styled in a muted gray background (`#F8FAFC`). Includes interactive column sort indicators (up/down carets) next to column names.

#### 3. Responsive Adaptations
*   **Laptop/Tablet:** Left and right middle panels collapse to stack vertically. Table columns hide non-critical metrics (e.g., hiding Gini and only displaying P0 and Theil Share on tablet/mobile screens).

---

### Screen 5: Klassen Regional Typology Matrix

*   **Page Purpose:** Map West Java's 27 districts into spatial planning zones based on GDP growth and per capita income.

#### 1. Screen Layout & Component Placement
*   **Desktop Grid:**
    *   *Left Workspace (Spans 8-columns):* The large Klassen Typology Quadrant Scatter Plot.
    *   *Right Workspace (Spans 4-columns):* Contains the Urgent Priority Intervention Rankings and economic action details.

```
┌──────────────────────────────────────────────────────────────┬─────────────────────────┐
│  KLASSEN TYPOLOGY SCATTER PLOT                               │  URGENT INTERVENTIONS   │
│                 District GDP Growth Rate (X)                 │                         │
│                              ▲                               │  Top Lagging Districts  │
│                   Q_I (Maju) │ Q_II (Potensial)              │  1. Tasikmalaya (Q_IV)   │
│                 -------------+-------------                  │  2. Pangandaran (Q_IV)  │
│                   Q_III      │ Q_IV (Lagging)                │  3. Cianjur (Q_IV)      │
│                 (Tertekan)   │                               │                         │
│                              ▼                               │  Recommended Strategy:   │
│                   District Per Capita Income (Y)             │  Infrastructure Injection│
└──────────────────────────────────────────────────────────────┴─────────────────────────┘
```

#### 2. Component Details

##### Klassen Typology Scatter Plot
*   **Structure:** 4 quadrants with coordinates centered on provincial averages.
*   **Plot Nodes:** Each dot represents a district, colored by quadrant and sized by poverty volume. Hovering over a dot reveals a high-contrast tooltip containing its name and economic coordinates.
*   **Medians:** Clear median lines with text labels indicating provincial averages.

##### Priority Intervention Card Stack
*   **Visuals:** Positioned in the right-hand panel. Lists lagging districts calculated by the Priority Score. Includes a secondary blue action button: "Inspect Regional Profile".

#### 3. Responsive Adaptations
*   **Mobile/Tablet:** The scatter plot collapses, and the matrix layout transforms into an interactive tabbed list (with tabs for `Quadrant I`, `II`, `III`, `IV`). Users can tap a tab to view the corresponding district rankings.

---

### Screen 6: Regional Profile

*   **Page Purpose:** Provide a comprehensive diagnostic view of a selected district, comparing it directly to provincial benchmarks.

#### 1. Screen Layout & Component Placement
*   **Desktop Grid:**
    *   *Top Header (12-columns):* Large district name (e.g., "Kabupaten Sukabumi"), macro metrics (P0, Population, Budget), and the primary "Compare with benchmark" dropdown list.
    *   *Middle Row:* Spans 6-columns containing the Multi-dimensional Deprivation Radar Chart; Spans 6-columns containing the Socioeconomic Sector Distribution Area Chart.
    *   *Bottom Row:* Spans 8-columns displaying the local Sub-district Poverty Directory table; Spans 4-columns displaying the dynamic local Policy Recommendation drawer.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  KABUPATEN SUKABUMI PROFILE                         [ Benchmark: West Java Average  ▼ ]│
│  P0: 9.42% (High) | Poor Pop: 242K | Typology: Quadrant IV (Lagging)                    │
├───────────────────────────────────────────────┬────────────────────────────────────────┤
│  DEPRIVATION RADAR CHART                      │  SECTOR EMPLOYMENT OVER TIME           │
│           [Radar Chart Canvas:                │  [Area Chart: Agriculture, Industry,   │
│            6 structural access dimensions]    │   Services trends vs poverty rate]     │
├───────────────────────────────────────────────┴────────────────────────────────────────┤
│  SUB-DISTRICT DIRECTORY                       │  LOCAL POLICY OPTIONS                  │
│  | Kecamatan   | P0 Rate | P1 Depth | D1 Pop  │  1. Reallocate BLT targeting to D1    │
│  |-------------|---------|----------|---------│  2. Fund rural irrigation (Cisolok)  │
└───────────────────────────────────────────────┴────────────────────────────────────────┘
```

#### 2. Component Details

##### Multi-Dimensional Deprivation Radar Chart
*   **Visuals:** Central circular axes showing deprivation levels across 6 categories. Features a solid blue area representing the district and a dashed gray area representing the provincial average.

##### Sub-District Data Table
*   **Layout:** Flat, clean tabular layout, Py-2 px-3 compact cell structure. Clicking on any row highlights the corresponding sub-district on the interactive profile map.

#### 3. Responsive Adaptations
*   **Tablet/Mobile:** Double-column sections collapse into single-column cards. The radar chart is placed in a swipeable container alongside the sector area chart.

---

### Screen 7: Household Targeting (Government Authorized View Only)

*   **Page Purpose:** Provide authenticated social workers and regional planners with an audited micro-targeting tool to search, filter, and export eligible beneficiary lists.

#### 1. Screen Layout & Component Placement
*   **Desktop Grid:**
    *   *Top Filter Row (12-columns):* Hierarchical geographic selectors (Kabupaten ➔ Kecamatan ➔ Desa), Welfare Decile slider (D1-D4), and masked data search field.
    *   *Main Body split:* Left side spans 8-columns displaying the central Household Microdata Directory; Right side spans 4-columns displaying the secure Household Inspector Drawer.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Filters: [ Sukabumi ▼ ] [ Cisolok ▼ ] [ Decile: D1-D2 ◄───► ] [ Search name/NIK...  ] │
├───────────────────────────────────────────────┬────────────────────────────────────────┤
│  HOUSEHOLD MICRODATA DIRECTORY  [Export CSV]  │  SELECTED HOUSEHOLD INSPECTOR          │
│  | HH-ID   | Head Name | Decile | PMT Score   │  ID: HH-320412-0081 (Ahmad S.)         │
│  |---------|-----------|--------|-------------│  Welfare Gauge: [ Poorest Decile 1 ]   │
│  | HH-0081 | Ahmad S.* | D1     | 12.11       │  Housing: Wood walls, Dirt floor       │
│  | HH-1102 | Cucum C.* | D1     | 14.88       │  Demographics: Single parent, 3 child  │
│  | HH-1422 | Dadang K* | D2     | 19.34       │  ------------------------------------  │
│  | HH-2911 | Emin M.** | D2     | 21.05       │  Action: [ DISPATCH RE-SURVEY AGENT ]  │
└───────────────────────────────────────────────┴────────────────────────────────────────┘
```

#### 2. Component Details

##### Advanced Filtering Suite
*   **Controls:** Clean selectors with standard hairline borders.
*   **Welfare Decile Slider:** A slider that allows selecting specific deciles. Hovering over a step shows its estimated household count.

##### Household Microdata Directory (Table)
*   **Layout:** Dense table rows (`height: 36px`). Names and national IDs (*NIK*) are masked using dot markers (e.g., "Ahmad S*****"). Hovering over masked data displays a tooltip explaining PDP compliance security constraints.

##### Household Inspector Drawer (Details Panel)
*   **Visuals:** Flat sidebar card with an elegant gauge visualization at the top indicating the PMT score relative to the eligibility threshold.
*   **Data Layout:** Asset summaries, housing details, and household demographics are grouped using simple, clean borders and sub-headings.
*   **Action Button:** Primary action button: "Dispatch Re-survey Agent" to verify eligibility on the ground.

#### 3. Responsive Adaptations
*   **Tablet/Mobile:** The right-hand Household Inspector Drawer is converted into a full-screen slide-up drawer that is triggered only when the user taps on a household row in the directory.

---

### Screen 8: Machine Learning Dashboard

*   **Page Purpose:** Evaluate the performance, fairness, and accuracy of the Proxy Means Testing (PMT) model.

#### 1. Screen Layout & Component Placement
*   **Desktop Grid:**
    *   *Top KPI Block:* 4 performance cards (Accuracy, Precision, Recall, F1 Score) spanning 3 columns each.
    *   *Middle Row:* Spans 6-columns containing the interactive Confusion Matrix with Threshold Slider; Spans 6-columns containing the ROC-AUC evaluation line chart.
    *   *Bottom Row:* Spans 8-columns displaying the global SHAP Feature Importance chart; Spans 4-columns displaying Model Notes and calibration logs.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Accuracy: 88.4%   |   Precision: 85.1%   |   Recall: 89.2%   |   F1-Score: 87.1%      │
├───────────────────────────────────────────────┬────────────────────────────────────────┤
│  CONFUSION MATRIX WITH THRESHOLD SLIDER       │  ROC - AUC CURVE                       │
│             Predicted Poor  Predicted Non-Poor│  [Line Chart: ROC Curve, AUC: 0.91]    │
│  Actual Poor   [  TP: 78%  ] [  FN (Excl): 9%]│                                        │
│  Actual Non-P  [  FP (Incl):13%] [  TN: 82%  ]│                                        │
│  PMT Threshold Slider: ◄─────────●────────►    │                                        │
├───────────────────────────────────────────────┴────────────────────────────────────────┤
│  GLOBAL SHAP FEATURE IMPORTANCE               │  MODEL CALIBRATION LOGS                │
│  [Horizontal Bar Chart: asset variables]      │  Model: GBM v2.1 (Calibrated: Q4 2023)  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 2. Component Details

##### Interactive Confusion Matrix
*   **Structure:** A clean $2 \times 2$ grid.
*   **Welfare Percentile Cutoff Slider:** Positioned beneath the matrix grid.
*   **Behavior:** Dragging the slider dynamically updates the TP, FN, FP, and TN percentages inside the matrix blocks, illustrating the trade-off of targeting decisions in real-time.

##### Global SHAP Feature Importance Chart
*   **Visualization Spec:** Horizontal bar chart. Bars represent features (e.g., Asset Ownership, House Floor Material) colored in a single Cobalt Blue shade to indicate significance.

#### 3. Responsive Adaptations
*   **Tablet/Mobile:** The interactive Confusion Matrix and the ROC curve stack vertically. Tooltips on the SHAP chart are optimized for touch targets.

---

### Screen 9: Policy Recommendation Engine

*   **Page Purpose:** Synthesize spatial, economic, and machine learning outputs into actionable, cost-evaluated policy intervention plans.

#### 1. Screen Layout & Component Placement
*   **Desktop Grid:**
    *   *Top Header (12-columns):* Page Title, Regional Scope dropdown, and total budget projection indicators.
    *   *Main Body split:* Left side spans 8-columns displaying the central Policy Recommendations list; Right side spans 4-columns displaying the interactive Budget & Impact Simulation tool.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Policy Recommendations Engine                      [ Target Region: West Java  ▼ ]    │
├───────────────────────────────────────────────┬────────────────────────────────────────┤
│  PRIORITY RECOMMENDATIONS LIST                │  BUDGET & IMPACT SIMULATION            │
│  [Card 1: High Priority - PKH Reallocation]   │  Total Available Budget                │
│  - Evidence: Sukabumi Exclusion Error is 11.8%│  [ IDR 450,000,000,000               ] │
│  - Cost: IDR 1.2 Billion | Impact: -1.2% P0   │                                        │
│  - Accountable Agency: Dinas Sosial           │  Projected Poverty Reduction:          │
│                                               │  P0 drops from 7.62% to 7.11%          │
│  [Card 2: Medium Priority - PUPR Sanitation]  │                                        │
│  - Cost: IDR 8.5 Billion | Impact: -0.8% P0   │  [ RUN FISCAL IMPACT FORECAST ]        │
└───────────────────────────────────────────────┴────────────────────────────────────────┘
```

#### 2. Component Details

##### Policy Recommendations Card Stack
*   **Card Design:** Spaced using a vertical `gap-4` layout. Includes a clear priority badge (`critical` red border or `warning` amber border) in the top-right corner.
*   **Data Content:** Lists explicit evidence, estimated cost, expected impact, accountable agency, and implementation timeline.

##### Budget & Impact Simulation Tool
*   **Controls:** Number input field for available budget and a primary run button: "Run Fiscal Impact Forecast".
*   **Simulation Gauge:** A vertical scale showing the projected reduction in the poverty headcount based on the entered budget.

#### 3. Responsive Adaptations
*   **Tablet/Mobile:** The Budget Simulation tool is collapsed into an expandable accordion panel placed at the top of the screen. Recommendations display in a vertical, full-width scrollable list.

---

### Screen 10: Monitoring Dashboard

*   **Page Purpose:** Track active policy implementations, monitor poverty dynamics in real time, and trigger alerts when regional poverty targets drift from the planned RPJMD trajectory.

#### 1. Screen Layout & Component Placement
*   **Desktop Grid:**
    *   *Top KPI Block:* Spans 4 equal columns containing performance metrics (Target Accomplishment Rate, Budget Efficiency, and EWS Alerts).
    *   *Middle Row:* Spans 8-columns containing the RPJMD Target Trajectory Fan Chart; Spans 4-columns containing the rolling Early Warning System Alert Timeline.
    *   *Bottom Row:* Spans 12-columns containing the comparative District Program Progress evaluation table.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Target Achieved: 84%   |   Disbursed: 76.4%   |   EWS Alerts: 3 Active  |  EWS Index: Low│
├───────────────────────────────────────────────┬────────────────────────────────────────┤
│  RPJMD TARGET TRAJECTORY MONITOR              │  EWS ALERT TIMELINE                    │
│  [Fan Chart Canvas: Solid actual line,        │  [!] Sukabumi: Food price spike (+12%)  │
│   dashed target line, shaded confidence bands]│  [!] Indramayu: Crop failure risk      │
├───────────────────────────────────────────────┴────────────────────────────────────────┤
│  DISTRICT PROGRAM PROGRESS EVALUATION TABLE                                            │
│  | District Name   | Program Name | Budget Disbursed | Target Met % | Status Indicator │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 2. Component Details

##### RPJMD Target Trajectory Fan Chart
*   **Visualization Spec:** A line chart displaying a solid line (actual poverty rate), a dashed central line (RPJMD target), and shaded confidence bands (predicted trajectory).

##### EWS Alert Timeline
*   **Visuals:** Positioned in the right-hand panel. Lists active alerts with a vertical timeline axis. Clicking on an alert highlights the corresponding district in the main view.

#### 3. Responsive Adaptations
*   **Tablet/Mobile:** The Fan Chart and Alert Timeline stack vertically. On mobile, table columns collapse to show only the Program Name, Budget Disbursed, and Status indicator.

---

### Screen 11: Administration (Government Authorized View Only)

*   **Page Purpose:** Manage system configurations, database updates, data models, user roles, and access logs.

#### 1. Screen Layout & Component Placement
*   **Desktop Grid:**
    *   *Left Workspace (Spans 3-columns):* Admin sidebar navigation containing sub-categories (`User Management`, `Audit Logs`, `Data Sync`, `System Health`).
    *   *Right Workspace (Spans 9-columns):* The active management workspace panel based on the selected sub-category.

```
┌───────────────────────────┬────────────────────────────────────────────────────────────┐
│  ADMIN CATEGORIES         │  AUDIT LOG HISTORY                                         │
│                           │  Export Log  |  User Sessions  |  Access Errors            │
│  [ User Management    ]   ├────────────────────────────────────────────────────────────┤
│  [ Audit Log History  ]   │  | Timestamp | User ID   | Action Event   | Status Code    |│
│  [ Data Sync Center   ]   │  |-----------|-----------|----------------|----------------|│
│  [ System Health Status]   │  | 10:14:02  | d_sos_01  | Export MicroD  | 200_SUCCESS    |│
│                           │  | 09:41:11  | bapp_02   | Login Gov Portal| 200_SUCCESS   |│
└───────────────────────────┴────────────────────────────────────────────────────────────┘
```

#### 2. Component Details

##### Administration Sidebar
*   **Visuals:** Flat navigation items with clean borders (`rounded-sm`), styled with cobalt-blue accents in their active state.

##### Audit Log History Table
*   **Layout:** Dense, un-paged scrollable data table. Highlights successful events in green and failed access attempts in red, ensuring clear system tracking.

#### 3. Responsive Adaptations
*   **Mobile/Tablet:** The administrative categories are collapsed into a horizontal button group at the top of the screen, and the active workspace panel is centered below.

---

### Screen 12: Settings

*   **Page Purpose:** Manage user preferences, language settings, notification settings, and accessibility controls.

#### 1. Screen Layout & Component Placement
*   **Desktop Grid:**
    *   *Workspace Panel:* Spans a centered 8-column card workspace, styled with a light hairline border and generous negative space to focus the user's attention.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   SYSTEM SETTINGS                                      │
│                                                                                        │
│  Visual Theme Preferences                                                              │
│  [ Light Theme (Default)  ]   [ Slate Dark Theme  ]                                    │
│                                                                                        │
│  Interface Language                                                                    │
│  [ Bahasa Indonesia (ID)  ▼ ]                                                          │
│                                                                                        │
│  Accessibility Options                                                                 │
│  [x] Enable WCAG High-Contrast Mode                                                    │
│  [ ] Enable Screen Reader Text-to-Speech Compatibility                                 │
│                                                                                        │
│  [        SAVE SYSTEM PREFERENCES        ]                                             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 2. Component Details

##### Theme Selectors
*   **Controls:** Balanced button blocks. The selected theme features a solid blue border (`#3B82F6`) and a blue checkmark indicator.

##### Save Preferences Button
*   **Style:** Positioned at the bottom of the card, centered horizontally. Styled with a solid slate-gray background, white text, and a blue accent border in its active state.

#### 3. Responsive Adaptations
*   **Mobile/Tablet:** Card margins are set to 16px, and input controls expand to fit the full width of the screen (`w-full`), ensuring clear touch targets.

---

## Part 3: Complete Navigation & Data Flow Matrix

To ensure clear coordination, the diagram below outlines the system's complete user journey and authentication checks.

```
                    [ 1. LANDING PAGE (Public Entry) ]
                                    │
                      Is user Gov-ID authenticated?
                       /                         \
                     No                           Yes
                     /                             \
    [ 2. PUBLIC VIEW ACCESS ]              [ 3. SECURE AUTHENTICATION ]
    ├─► Executive Dashboard                ├─► Enter Gov-ID credentials
    ├─► Regional Diagnosis                 ├─► Validate 6-Digit OTP SMS
    ├─► Klassen Typology Matrix            └─► Grant Access Level 1 Credentials
    └─► Regional Profile Explorer                          │
                                                           ▼
                                               [ 4. GOVERNMENT WORKSPACE ]
                                               ├─► Secure Household targeting
                                               ├─► PMT Calibration Dashboard
                                               ├─► Algorithmic Policy Engine
                                               └─► System Admin Settings
```

This complete specification document provides a precise blueprint detailing the layout, interactions, responsive behavior, and states for all 12 RANCAGE screens, enabling direct translation into pixel-perfect Figma mockups.
