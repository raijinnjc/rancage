# RANCAGE Design System & UX/UI Specification
**System Version:** 1.0.0  
**Authors:** Principal UX Architect, Senior UI/UX Designer, Design System Lead  
**Target Audience:** Product Designers (Figma), Frontend Developers, QA Engineers, and Policy Advisors  
**Philosophy:** Analytical rigor, government-grade utility, minimalist execution, high-density data presentation.

---

## 1. Design Philosophy & Focal Order

RANCAGE is not a business intelligence dashboard for maximizing conversion rates; it is a **Decision Support System (DSS)**. Its visual design must convey structural authority, mathematical precision, and complete clarity. 

### 1.1 Core Principles
*   **Aesthetic Incorruptibility:** Zero decorative icons, zero colorful gradients, and zero gaming-style layouts. All colors must have functional meaning.
*   **High-Density Spatial Efficiency:** Maximize the ratio of data-to-ink. Policymakers must see complex spatial and relational data in one view without excessive scrolling.
*   **Visual Evidence First:** Layouts are organized to present macro conditions first, highlight structural anomalies second, and provide microscopic household audits third.

### 1.2 Focal Order (The Eye-Movement Path)
The layout structure of each dashboard view follows a strict **F-Pattern** designed for analytical scanning:

```
[1. Context Bar]  ➔ Breadcrumbs, Security Badge, Spatial Selector, Export Controls
       ▼
[2. Vital Sign cards] ➔ Core Poverty Indices (P0, P1, P2) & Targeting Errors
       ▼
[3. Primary Matrix/Map] ➔ Klassen Typology Grid or West Java Geographic Choropleth
       ▼
[4. Structural Breakdown] ➔ Theil Decomposition Charts or Socioeconomic Drivers
       ▼
[5. Algorithmic Recommendations] ➔ System Recommendations with financial impact projections
```

---

## 2. Color System

To support long hours of analytical investigation, the color system is designed for high visual comfort, WCAG AAA readability, and explicit cross-chart association.

### 2.1 Base Color Palettes (Light & Dark Modes)

| Element | Light Mode Hex | Dark Mode Hex | Strategic Visual Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Background** | `#F8FAFC` | `#0F172A` | Clean canvas that reduces eye strain over long periods of reading. |
| **Surface (Cards/Panels)** | `#FFFFFF` | `#1E293B` | Floating containers defining clean geometric boundaries. |
| **Border / Gridlines** | `#E2E8F0` | `#334155` | Hairline separators; replaces heavy drop shadows. |
| **Primary Text** | `#0F172A` | `#F8FAFC` | Maximum contrast for labels, titles, and body content. |
| **Secondary Text** | `#475569` | `#94A3B8` | Metadata, microcopy, and sub-headings. |
| **Tertiary Text (Muted)** | `#94A3B8` | `#475569` | Table headers, deactivated states, and grid labels. |
| **Brand / Accent (Action)** | `#2563EB` | `#3B82F6` | Primary action items, interactive nodes, and system selections. |

### 2.2 Analytical & Semantic Indicators (Color-Coding rules)

Colors are strictly bound to statistical variables. A color must never be used for anything other than its designated indicator.

*   **P0 / Deprivation Scale (Choropleth Maps):**
    *   *Light Mode:* Light Amber (`#FEF3C7`) to Deep Crimson (`#991B1B`).
    *   *Dark Mode:* Muted Yellow (`#451A03`) to Vibrant Coral-Red (`#EF4444`).
*   **Klassen Matrix Quadrants:**
    *   **Quadrant I (Maju Cepat):** Cobalt Blue (`#1D4ED8` | `#3B82F6`) ➔ Represents established, stable economic strength.
    *   **Quadrant II (Potensial):** Emerald Green (`#15803D` | `#10B981`) ➔ Represents growing, productive economic sectors.
    *   **Quadrant III (Tertekan):** Amber Orange (`#B45309` | `#F59E0B`) ➔ Signals vulnerability and high inequality.
    *   **Quadrant IV (Tertinggal):** Crimson Red (`#B91C1C` | `#EF4444`) ➔ Signals deep, severe systemic poverty.
*   **System Status & Alerts:**
    *   **Critical (Error, Exclusion Risk):** Crimson Red (`#DC2626`).
    *   **Warning (Alert, Inclusion Leak):** Amber Orange (`#D97706`).
    *   **Success (Policy Goal Met):** Forest Green (`#16A34A`).
    *   **Information (Neutral Notice):** Steel Blue (`#0284C7`).

---

## 3. Typography & Typescale

The typography system uses highly legible, professional typefaces to make scanning dense matrices easy.

### 3.1 Typeface Selection
*   **Primary Sans (UI & Body):** `Inter` ➔ Highly legible at small sizes, excellent geometric balance, and clean kerning.
*   **Display Sans (Headings & Large KPIs):** `Outfit` or `Space Grotesk` ➔ Tech-forward and modern, ideal for display numbers and titles.
*   **Monospace (Statistical Values & Identifiers):** `JetBrains Mono` or `Fira Code` ➔ Absolute tabular consistency. Crucial for aligning deciles, NIK IDs, percentages, and formula readouts.

### 3.2 Analytical Typography Scale

```
┌──────────────────────────────────────────────────────────────────────────┐
│  OUTFIT (Bold) - Page Title (24px / 1.5rem)                              │
├──────────────────────────────────────────────────────────────────────────┤
│  INTER (Medium) - Section Title / Card Header (14px / 0.875rem)          │
├──────────────────────────────────────────────────────────────────────────┤
│  JETBRAINS MONO (Bold) - Large Numeric KPI (32px / 2.0rem)               │
├──────────────────────────────────────────────────────────────────────────┤
│  INTER (Regular) - Standard Table Body & Labels (12px / 0.75rem)         │
└──────────────────────────────────────────────────────────────────────────┘
```

| Token | Family | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | Outfit | `36px (2.25rem)` | Bold (700) | `1.1` | Massive display metrics on Executive Dashboard. |
| `display-md` | Outfit | `24px (1.5rem)` | Bold (700) | `1.2` | Core Page Titles. |
| `header-sm` | Inter | `14px (0.875rem)` | Semibold (600) | `1.4` | Card Titles, table section titles. |
| `body-md` | Inter | `12px (0.75rem)` | Regular (400) | `1.5` | Default body copy, descriptions, dynamic text summaries. |
| `data-table` | Inter | `11px (0.688rem)`| Regular (400) | `1.4` | Cell text in high-density tables. |
| `mono-data` | JetBrains | `12px (0.75rem)` | Semibold (500) | `1.0` | Aligning percentages, scores, indices, and NIK codes. |
| `caption-xs` | Inter | `10px (0.625rem)`| Medium (500) | `1.3` | Chart axis labels, footnotes, sources, and timestamps. |

---

## 4. Layout, Grid, & Container Specifications

RANCAGE employs a strict fluid grid system optimized for standard government computing monitors (1920x1080 and 1440x900 screens).

### 4.1 Responsive Breakpoints

```
[Mobile (<768px)] ──► Multi-card scrolling column, hidden sidebar, modal navigation drawer
[Tablet (768-1024px)] ──► Collapsed 64px icon-only sidebar, grid columns consolidate to 6-span
[Desktop (1024-1440px)] ──► Full 256px sidebar, 12-column analytical layout, fixed header
[Ultra-Wide (>1440px)] ──► Max-width container capped at 1600px with structural outer margin
```

### 4.2 Grid Structure (Desktop Reference: 1440px)
*   **Sidebar Width:** `256px` fixed (`w-64`). Can collapse to `64px` icon-only state for smaller laptop screens.
*   **Header Height:** `64px` fixed (`h-16`) containing breadcrumbs and user control center.
*   **Content Padding:** Standardized `24px` (`p-6`) around page boundaries.
*   **Card Grid Spacing:** Grid uses a `24px` gap (`gap-6`) across main columns and `16px` (`gap-4`) for secondary nested panels.
*   **Visual Layout Blueprint:** 12-Column Responsive Layout system:
    *   *KPI Section:* 4 equal columns (each spans `3` grid-units).
    *   *Primary Visualization Area:* Spans `8` grid-units (left-aligned) for the main map or typology scatter plot.
    *   *Diagnostic / Control Area:* Spans `4` grid-units (right-aligned) for decomposition indices, data summaries, and filters.

---

## 5. Component System Specification

Every component must share a consistent visual signature: border radius is strictly set to `6px` (`rounded-sm`), border width to `1px`, and background drop shadows are light and subtle (`shadow-sm`) to support high contrast.

### 5.1 System Shell & Sidebar Navigation
*   **Visual Structure:** Dark slate background (`#0F172A`) to establish a clear boundary between navigation controls and analytical views.
*   **Navigation Links:**
    *   *Inactive:* Slate Gray text (`#64748B`), no left accent border, flat background.
    *   *Hover:* Light slate text (`#94A3B8`), subtle grey background (`rgba(255,255,255,0.04)`).
    *   *Active:* Direct brand-blue text (`#3B82F6`), clear 3px left vertical indicator bar, background (`rgba(59,130,246,0.08)`).
*   **Role Switcher Container:** Embedded in the sidebar header. Features a high-contrast toggle pill:
    *   `PUBLIC`: Gray background, flat text.
    *   `GOVERNMENT`: Animated, secure green dot indicator alongside custom secure key icon. Clicking triggers the secure verification interface.

### 5.2 Top Context & Control Bar
*   **Role-based Security Badge:**
    *   *Public View:* `PUBLIC DISCLOSURE ACCESS` ➔ Muted gray border with a slate icon.
    *   *Government View:* `AUDITED ACCESS LEVEL 1` ➔ Forest green border (`#86EFAC`), solid green pulse dot, and masked identifier (e.g., `User: Bappeda_Admin`).
*   **Global Export Center:** Standardized button container labeled `Export`. Clicking opens a dropdown with clean format selections: `Export CSV (Aggregated)`, `Export PDF (Report Summary)`, and `Audited Secure CSV (Microdata)`.

### 5.3 Vital Signs (KPI Cards)
*   **Layout:** Single-unit high-density cards containing three hierarchical data rows:
    ```
    ┌───────────────────────────────────────────────┐
    │ Poverty Headcount (P0)         [Target: 7.20%]│ ➔ 10px Label & Reference
    │ 7.62%                                         │ ➔ 32px Tabular Display
    │ ▼ -0.34% vs last period                       │ ➔ 10px Trend Line
    └───────────────────────────────────────────────┘
    ```
*   **Trend Styling:**
    *   *Positive Trend (Decreasing Poverty):* Deep green text (`#15803D`) alongside downward caret `▼`.
    *   *Adverse Trend (Rising Inequality/Error):* Dark red text (`#B91C1C`) alongside upward caret `▲`.

### 5.4 Unified Modal & Notification Drawer
*   **Drawer Structure:** Slides smoothly from the right side of the viewport (`width: 480px`). It overlays the content with a dark background shadow (`rgba(15,23,42,0.4)`).
*   **Content Header:** Large display name, closing cross icon, and the exact timestamp the data was last updated.
*   **Action Row:** Positioned at the bottom of the drawer. Features a clean, horizontal arrangement: a primary `Action` button on the right, a secondary `Dismiss` button in the center, and a `More Info` link on the left.

---

## 6. Analytical Chart & Data Visualization Rules

All charts must avoid decorative animations and colors. Recharts configurations should adhere to the following strict visual parameters:

### 6.1 Unified Chart Visual Standards
*   **Background Gridlines:** Gridlines are set to dashed (`stroke-dasharray="3 3"`), styled in light gray (`#E2E8F0` / `#334155`).
*   **Y-Axis & X-Axis Styles:** 10px Inter font (`#94A3B8`). Ticks must match the step values of the data precisely.
*   **Line Styling:** Main trend lines use a solid `2px` stroke. Historical or benchmark lines use a dashed `1.5px` stroke.

### 6.2 Klassen Typology Matrix Design Spec

```
                           District GDP Growth Rate (X)
                     Average Growth Benchmark (X-Axis Median)
                                      │
                                      ▼
               ┌──────────────────────┬──────────────────────┐
               │  QUADRANT I (Blue)   │  QUADRANT II (Green) │
               │  Maju Cepat          │  Potensial           │
  District     ├──────────────────────┼──────────────────────┤ ◄── Average Income Benchmark
  Per Capita   │  QUADRANT III (Amber)│  QUADRANT IV (Red)   │     (Y-Axis Median)
  Income (Y)   │  Tertekan            │  Tertinggal          │
               └──────────────────────┴──────────────────────┘
```

*   **Matrix Structure:** The matrix is divided into four equal quadrants centered around two median lines: West Java Average GDP Growth (X) and West Java Average Per Capita Income (Y).
*   **Plot Nodes (Scatter Dots):**
    *   Scatter points are colored based on their designated quadrant.
    *   Points use an opacity of `0.8` to show overlapping data points clearly.
    *   Hovering over a node increases its size from `radius=6px` to `radius=10px` and displays a high-contrast tooltip.
*   **Tooltip Content:** Displays the District name, Klassen categorization, GDP growth value, per capita income, and total poverty headcount.

### 6.3 Theil Decomposition Chart Spec
*   **Type:** 100% Horizontal Stacked Bar Chart.
*   **Segment Styling:**
    *   *Within-District Segment:* Cobalt Blue (`#3B82F6`), representing the share of inequality driven by internal district income gaps.
    *   *Between-District Segment:* Muted Slate-Blue (`#94A3B8`), representing the share of inequality driven by structural regional imbalances.
*   **Interaction:** Clicking a segment highlights the corresponding district contributions in the side panel.

---

## 7. Interactive Map Design Specification

The interactive map is a TopoJSON-based geographical choropleth of West Java's 27 districts (*Kabupaten/Kota*).

```
                             [West Java Spatial Explorer]
    
        ┌─────────────────────────────────────────────────────────────┐
        │   [Kab. Indramayu]                                          │
        │   P0: 12.11% (High)                                         │
        │   Typology: Quadrant IV (Lagging)                           │
        │   Interventions: Infrastructure, Cash Transfers             │
        ├─────────────────────────────────────────────────────────────┤
        │  [District Outline] ➔ Highlighted in Cobalt Blue on hover   │
        │  [Choropleth Fill]  ➔ Colors range from amber to crimson    │
        └─────────────────────────────────────────────────────────────┘
```

### 7.1 Visual Encoding & Layer Styling
*   **Base Map Layer:** Fills are mapped to District P0 rates using an amber-to-crimson color scale.
*   **District Borders:** Clean, sharp borders styled in off-white (`#F8FAFC`, `width: 1px`).
*   **Hover State:** Hovering over a district displays a bold, cobalt-blue border (`#3B82F6`, `width: 2px`) and brings the layer to the front.
*   **Selection State:** Active districts are highlighted with an inner outline and an explicit pin indicator.

### 7.2 Map Controls & Zoom Behavior
*   **Controls Container:** Positioned in the bottom-right corner. Features simple, flat gray buttons for `Zoom In (+)` and `Zoom Out (-)`.
*   **Selection Drill-Down:** Clicking a district zooms the viewport smoothly into the district's borders, updates the map view to show sub-districts (*Kecamatan*), and updates all page-level metrics to match.
*   **Reset Map Button:** Displays a floating "Reset Map Zoom" button in the top-left corner whenever the user is in a zoomed state.

---

## 8. High-Density Table Design Specification

Tables are optimized for displaying dense statistical and household microdata clearly and efficiently.

### 8.1 Structural Layout & Padding
*   **Grid Density:** Thin, compact rows (`height: 36px`, cell padding: `py-2 px-3`).
*   **Sticky Elements:** Table headers and first columns are sticky to preserve context while scrolling.
*   **Row Interactions:** Hovering over a row highlights the entire line in a light, neutral gray (`#F1F5F9` in light, `#334155` in dark).

### 8.2 Household Directory Features (Government Authorized View Only)
*   **Data Masking Indicator:** Masked values feature a subtle, dotted underline. Hovering over a cell shows a tooltip explaining that the value is encrypted for compliance with national privacy standards.
*   **Action Trigger:** Columns containing PMT scores display an interactive indicator badge next to the values:
    *   *Decile 1 (Poorest):* Crimson dot badge (`#EF4444`).
    *   *Decile 2:* Orange dot badge (`#F59E0B`).
    *   *Decile 3:* Yellow dot badge (`#FCD34D`).

---

## 9. Accessibility (WCAG 2.1 Compliance checklist)

The RANCAGE interface is designed to meet WCAG AA standards, ensuring it remains accessible to all public and government users.

### 9.1 Visual Contrast & Text Ratios
*   **Standard Text:** All text elements maintain a minimum contrast ratio of `4.5:1` against their backgrounds.
*   **Large Text & Numerical Data:** All headers and display numbers maintain a minimum contrast ratio of `3.0:1`.
*   **Interactive Controls:** Active states, buttons, and form inputs maintain a minimum contrast ratio of `3.0:1` against adjacent elements.

### 9.2 Keyboard Navigation & Focus Ring Standards
*   **Focus Ring Style:** All interactive elements feature a clear focus indicator (`focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none`).
*   **Tab Order Flow:** Tab navigation moves logically through page elements from top-left to bottom-right:
    ```
    [1. Sidebar Navigation] ➔ [2. Global Filters] ➔ [3. KPI Cards] ➔ [4. Interactive Map/Chart] ➔ [5. Recommendation Items]
    ```

### 9.3 Non-Color Dependent Visual Indicators
*   **Visual Patterns:** When utilizing color to show statistical categories (e.g., in map charts), RANCAGE uses distinct visual indicators alongside colors, such as custom text labels or numeric badges.
*   **Chart Highlights:** Legends and labels explicitly state the meaning of colors, and charts use distinct dashed, dotted, or solid stroke styles to differentiate lines.

---

## 10. Comprehensive Microcopy Blueprint

All system text must be objective, analytical, and highly structured, avoiding conversational filler or promotional language.

### 10.1 System State Messaging

*   **Authentication Portal Loading State:**
    *   *Title:* `Verifying Secure Access Credentials`
    *   *Sub-label:* `Connecting to West Java Gov-ID directory. Establishing secure, audited session...`
*   **Poverty Map Empty Filter State:**
    *   *Title:* `No Spatial Data Matches Active Filters`
    *   *Sub-label:* `The combination of selected temporal and demographic filters returned no records for this district. Reset your filters to restore the baseline map view.`
*   **Analytical Engine Error State:**
    *   *Title:* `Decomposition Computation Timeout`
    *   *Sub-label:* `The database took too long to return the requested sub-district records. This issue is logged and reported to the Bappeda systems team. Press 'Retry Computation' to execute again.`

### 10.2 Targeted Tooltips & Policy Help Text
*   **Theil Index Tooltip:**
    `Theil Index (T) decomposes total inequality into Within-district (household gaps) and Between-district (regional gaps) shares. A Within-district share above 70% indicates that policy interventions must prioritize targeted household assistance (like PKH or BLT) rather than general infrastructure funds.`
*   **PMT Score Tooltip:**
    `The Proxy Means Testing (PMT) score represents an estimated welfare index calculated using household assets, housing conditions, and demographic indicators. Lower scores indicate higher vulnerability, qualifying the household for Decile 1 and Decile 2 classifications.`

---

## 11. Complete Dashboard Wireframe Layout Blueprints

Below are structural layout mockups of the two primary user views, mapping the component locations, spacing, and grids defined above.

### 11.1 Executive Dashboard (Public View Layout)

```
========================================================================================================
[ RANCAGE ] (DSS Poverty West Java)                 | Role Toggle: [ PUBLIC ]  [GOVERNMENT (Lock)]
========================================================================================================
  Home               |  Jawa Barat / Analytical DSS Overview / 2026 Baseline
  Diagnosis          |----------------------------------------------------------------------------------
  Typology           |  [ KPI: P0 Headcount ] [ KPI: Poverty Gap ] [ KPI: Gini Ratio ] [ KPI: Household Match ]
  Profile (Select)   |  [ 7.62%  ▼ -0.34%   ] [ 1.24  ▼ -0.08   ] [ 0.412  STABLE  ] [ 91.3%  ▲ +0.5%      ]
  Evaluation         |----------------------------------------------------------------------------------
  Recommendations    |  [ GEOGRAPHIC CHOROPLETH POVERTY MAP ]           | [ THEIL DECOMPOSITION ]
  Monitoring         |  [                                   ]           | [ Total Inequality (T)  ]
                     |  [                                   ]           | [ [Within-District] 78% ]
                     |  [        [West Java Map Area]       ]           | [ [Between-District]22% ]
                     |  [                                   ]           |-------------------------
                     |  [                                   ]           | [ REGIONAL COMPARISON ]
                     |  [                                   ]           | [ Kab. Sukabumi  - 9.4% ]
                     |  [                                   ]           | [ Kab. Tasikmalaya-8.8% ]
                     |  [                                   ]           | [ Kab. Karawang - 7.2% ]
========================================================================================================
```

### 11.2 Secure Household Targeting Dashboard (Government View Layout)

```
========================================================================================================
[ RANCAGE ] (DSS Poverty West Java)                 | Role Toggle: [ Public ]  [ SECURE GOVERNMENT (Audit) ]
========================================================================================================
  Home               |  Jawa Barat / Household PMT Targeting Directory / Audited Session: Admin_Bappeda
  Diagnosis          |----------------------------------------------------------------------------------
  Typology           |  Filters: [ Kab. Sukabumi ▼ ] [ Kec. Cisolok ▼ ] [ Decile: D1-D2 ◄───► ] [ Export CSV ]
  Profile (Select)   |----------------------------------------------------------------------------------
  Targeting (Secure) |  [ TARGETED HOUSEHOLD DIRECTORY ]               | [ SELECTED HOUSEHOLD INSPECTOR ]
  Evaluation         |  | ID       | Name   | Decile | PMT Score |     | ID: HH-320412-0081 (Ahmad S.)
  Recommendations    |  |----------|--------|--------|-----------|     |----------------------------------
  Monitoring         |  | HH-0081  | Ahmad  | D1     | 12.11     |     | Welfare Index Gauge: [ Poorest ]
                     |  | HH-1102  | Cucum  | D1     | 14.88     |     | housing: Wood Walls, Dirt Floor
                     |  | HH-1422  | Dadang | D2     | 19.34     |     | Water: Shared Access, No BPJS
                     |  | HH-2911  | Emin   | D2     | 21.05     |     | Dependent: 3 Children, Unemployed
                     |  | HH-3121  | Farida | D2     | 22.40     |     |----------------------------------
                     |  | HH-4012  | Ginan  | D2     | 23.11     |     | Action: [ Dispatch Re-survey Agent ]
========================================================================================================
```

This completes the UX, UI, and Design System Specification for the RANCAGE DSS platform. Every spacing, color token, typography alignment, and visual layout rule is structured to guide downstream implementation with perfect precision and consistency.
