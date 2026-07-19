/**
 * Comprehensive statistical database for Regional Diagnosis in West Java
 * Supporting multi-year tracking (2022 - 2025) and multi-dimensional filter syncing.
 */

export interface YearDecomposition {
  year: string;
  totalTheil: number;
  withinDisparity: number;
  betweenDisparity: number;
  withinContribution: number;
  betweenContribution: number;
}

export const THEIL_DECOMPOSITION_BY_YEAR: Record<string, YearDecomposition[]> = {
  All: [
    { year: '2022', totalTheil: 0.150, withinDisparity: 0.130, betweenDisparity: 0.020, withinContribution: 86.6, betweenContribution: 13.4 },
    { year: '2023', totalTheil: 0.145, withinDisparity: 0.127, betweenDisparity: 0.018, withinContribution: 87.6, betweenContribution: 12.4 },
    { year: '2024', totalTheil: 0.140, withinDisparity: 0.124, betweenDisparity: 0.016, withinContribution: 88.6, betweenContribution: 11.4 },
    { year: '2025', totalTheil: 0.135, withinDisparity: 0.121, betweenDisparity: 0.014, withinContribution: 89.6, betweenContribution: 10.4 }
  ],
  Urban: [
    { year: '2022', totalTheil: 0.110, withinDisparity: 0.098, betweenDisparity: 0.012, withinContribution: 89.1, betweenContribution: 10.9 },
    { year: '2023', totalTheil: 0.106, withinDisparity: 0.095, betweenDisparity: 0.011, withinContribution: 89.6, betweenContribution: 10.4 },
    { year: '2024', totalTheil: 0.101, withinDisparity: 0.091, betweenDisparity: 0.010, withinContribution: 90.1, betweenContribution: 9.9 },
    { year: '2025', totalTheil: 0.097, withinDisparity: 0.088, betweenDisparity: 0.009, withinContribution: 90.7, betweenContribution: 9.3 }
  ],
  Rural: [
    { year: '2022', totalTheil: 0.170, withinDisparity: 0.142, betweenDisparity: 0.028, withinContribution: 83.5, betweenContribution: 16.5 },
    { year: '2023', totalTheil: 0.165, withinDisparity: 0.139, betweenDisparity: 0.026, withinContribution: 84.2, betweenContribution: 15.8 },
    { year: '2024', totalTheil: 0.160, withinDisparity: 0.136, betweenDisparity: 0.024, withinContribution: 85.0, betweenContribution: 15.0 },
    { year: '2025', totalTheil: 0.155, withinDisparity: 0.133, betweenDisparity: 0.022, withinContribution: 85.8, betweenContribution: 14.2 }
  ]
};

export interface PovertyIndicatorPoint {
  year: string;
  p0: number; // Headcount (%)
  p1: number; // Gap index
  p2: number; // Severity index
  gini: number; // Gini ratio
}

export const POVERTY_INDICATORS_BY_YEAR: Record<string, PovertyIndicatorPoint[]> = {
  All: [
    { year: '2022', p0: 8.24, p1: 1.38, p2: 0.36, gini: 0.380 },
    { year: '2023', p0: 7.98, p1: 1.31, p2: 0.33, gini: 0.378 },
    { year: '2024', p0: 7.89, p1: 1.28, p2: 0.31, gini: 0.375 },
    { year: '2025', p0: 7.62, p1: 1.24, p2: 0.29, gini: 0.373 }
  ],
  Urban: [
    { year: '2022', p0: 5.80, p1: 0.95, p2: 0.22, gini: 0.395 },
    { year: '2023', p0: 5.50, p1: 0.89, p2: 0.20, gini: 0.392 },
    { year: '2024', p0: 5.35, p1: 0.86, p2: 0.19, gini: 0.389 },
    { year: '2025', p0: 5.12, p1: 0.81, p2: 0.17, gini: 0.386 }
  ],
  Rural: [
    { year: '2022', p0: 10.40, p1: 1.76, p2: 0.48, gini: 0.355 },
    { year: '2023', p0: 10.10, p1: 1.68, p2: 0.45, gini: 0.352 },
    { year: '2024', p0: 9.92, p1: 1.64, p2: 0.42, gini: 0.349 },
    { year: '2025', p0: 9.68, p1: 1.58, p2: 0.39, gini: 0.347 }
  ]
};

export interface DistrictDiagnosisDetail {
  id: string;
  name: string;
  theil: number;
  within: number;
  p0: number;
  p1: number;
  p2: number;
  gini: number;
  priorityScore: number;
  trend: 'up' | 'down' | 'stable';
  typology: 'I' | 'II' | 'III' | 'IV';
  urbanRural: 'Urban' | 'Rural';
  region: 'BOGOR' | 'SUKABUMI' | 'PRIANGAN' | 'CIREBON' | 'PURWAKARTA';
  population: number;
}

// 27 districts detailed diagnostic metrics indexed by Year
export const DISTRICT_DIAGNOSIS_DATA: Record<string, DistrictDiagnosisDetail[]> = {
  '2022': [
    { id: '3201', name: 'Kabupaten Bogor', theil: 0.130, within: 0.112, p0: 7.73, p1: 1.34, p2: 0.35, gini: 0.375, priorityScore: 55, trend: 'stable', typology: 'III', urbanRural: 'Rural', region: 'BOGOR', population: 5350000 },
    { id: '3202', name: 'Kabupaten Sukabumi', theil: 0.155, within: 0.138, p0: 9.95, p1: 1.62, p2: 0.42, gini: 0.382, priorityScore: 78, trend: 'up', typology: 'IV', urbanRural: 'Rural', region: 'SUKABUMI', population: 2580000 },
    { id: '3203', name: 'Kabupaten Cianjur', theil: 0.165, within: 0.148, p0: 10.75, p1: 1.81, p2: 0.48, gini: 0.389, priorityScore: 84, trend: 'up', typology: 'IV', urbanRural: 'Rural', region: 'SUKABUMI', population: 2440000 },
    { id: '3204', name: 'Kabupaten Bandung', theil: 0.115, within: 0.101, p0: 7.24, p1: 1.15, p2: 0.28, gini: 0.362, priorityScore: 42, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PRIANGAN', population: 3580000 },
    { id: '3205', name: 'Kabupaten Garut', theil: 0.178, within: 0.161, p0: 11.95, p1: 1.95, p2: 0.52, gini: 0.395, priorityScore: 91, trend: 'up', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 2540000 },
    { id: '3206', name: 'Kabupaten Tasikmalaya', theil: 0.185, within: 0.168, p0: 12.65, p1: 2.10, p2: 0.55, gini: 0.398, priorityScore: 95, trend: 'up', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1840000 },
    { id: '3207', name: 'Kabupaten Ciamis', theil: 0.125, within: 0.108, p0: 8.42, p1: 1.30, p2: 0.32, gini: 0.368, priorityScore: 50, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1210000 },
    { id: '3208', name: 'Kabupaten Kuningan', theil: 0.182, within: 0.163, p0: 13.42, p1: 2.18, p2: 0.58, gini: 0.396, priorityScore: 93, trend: 'up', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1100000 },
    { id: '3209', name: 'Kabupaten Cirebon', theil: 0.170, within: 0.151, p0: 11.82, p1: 1.88, p2: 0.49, gini: 0.388, priorityScore: 86, trend: 'up', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 2240000 },
    { id: '3210', name: 'Kabupaten Majalengka', theil: 0.168, within: 0.149, p0: 12.52, p1: 1.98, p2: 0.51, gini: 0.385, priorityScore: 87, trend: 'up', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1190000 },
    { id: '3211', name: 'Kabupaten Sumedang', theil: 0.140, within: 0.122, p0: 10.31, p1: 1.55, p2: 0.39, gini: 0.372, priorityScore: 68, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1150000 },
    { id: '3212', name: 'Kabupaten Indramayu', theil: 0.180, within: 0.160, p0: 13.35, p1: 2.15, p2: 0.57, gini: 0.394, priorityScore: 92, trend: 'up', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1720000 },
    { id: '3213', name: 'Kabupaten Subang', theil: 0.135, within: 0.118, p0: 9.38, p1: 1.42, p2: 0.36, gini: 0.371, priorityScore: 62, trend: 'stable', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 1580000 },
    { id: '3214', name: 'Kabupaten Purwakarta', theil: 0.118, within: 0.102, p0: 7.62, p1: 1.18, p2: 0.29, gini: 0.360, priorityScore: 45, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 940000 },
    { id: '3215', name: 'Kabupaten Karawang', theil: 0.122, within: 0.106, p0: 8.24, p1: 1.25, p2: 0.31, gini: 0.364, priorityScore: 48, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 2380000 },
    { id: '3216', name: 'Kabupaten Bekasi', theil: 0.102, within: 0.088, p0: 5.48, p1: 0.82, p2: 0.18, gini: 0.352, priorityScore: 28, trend: 'down', typology: 'I', urbanRural: 'Rural', region: 'BOGOR', population: 3050000 },
    { id: '3217', name: 'Kabupaten Bandung Barat', theil: 0.150, within: 0.132, p0: 11.12, p1: 1.74, p2: 0.44, gini: 0.379, priorityScore: 75, trend: 'up', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1750000 },
    { id: '3218', name: 'Kabupaten Pangandaran', theil: 0.132, within: 0.115, p0: 9.61, p1: 1.48, p2: 0.37, gini: 0.370, priorityScore: 60, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 400000 },
    { id: '3271', name: 'Kota Bogor', theil: 0.108, within: 0.096, p0: 6.42, p1: 0.98, p2: 0.24, gini: 0.392, priorityScore: 38, trend: 'down', typology: 'III', urbanRural: 'Urban', region: 'BOGOR', population: 1020000 },
    { id: '3272', name: 'Kota Sukabumi', theil: 0.120, within: 0.105, p0: 7.82, p1: 1.22, p2: 0.30, gini: 0.378, priorityScore: 49, trend: 'stable', typology: 'IV', urbanRural: 'Urban', region: 'SUKABUMI', population: 330000 },
    { id: '3273', name: 'Kota Bandung', theil: 0.095, within: 0.082, p0: 4.28, p1: 0.65, p2: 0.14, gini: 0.398, priorityScore: 22, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'PRIANGAN', population: 2420000 },
    { id: '3274', name: 'Kota Cirebon', theil: 0.128, within: 0.111, p0: 9.15, p1: 1.38, p2: 0.34, gini: 0.384, priorityScore: 58, trend: 'stable', typology: 'III', urbanRural: 'Urban', region: 'CIREBON', population: 320000 },
    { id: '3275', name: 'Kota Bekasi', theil: 0.098, within: 0.085, p0: 4.42, p1: 0.68, p2: 0.15, gini: 0.380, priorityScore: 24, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'BOGOR', population: 2500000 },
    { id: '3276', name: 'Kota Depok', theil: 0.088, within: 0.076, p0: 2.78, p1: 0.42, p2: 0.09, gini: 0.365, priorityScore: 12, trend: 'down', typology: 'III', urbanRural: 'Urban', region: 'BOGOR', population: 2020000 },
    { id: '3277', name: 'Kota Cimahi', theil: 0.105, within: 0.091, p0: 5.52, p1: 0.85, p2: 0.19, gini: 0.372, priorityScore: 31, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'PRIANGAN', population: 560000 },
    { id: '3278', name: 'Kota Tasikmalaya', theil: 0.162, within: 0.142, p0: 12.12, p1: 1.90, p2: 0.49, gini: 0.390, priorityScore: 82, trend: 'up', typology: 'IV', urbanRural: 'Urban', region: 'PRIANGAN', population: 710000 },
    { id: '3279', name: 'Kota Banjar', theil: 0.112, within: 0.098, p0: 7.15, p1: 1.12, p2: 0.27, gini: 0.366, priorityScore: 39, trend: 'down', typology: 'IV', urbanRural: 'Urban', region: 'PRIANGAN', population: 1750000 }
  ],
  '2023': [
    { id: '3201', name: 'Kabupaten Bogor', theil: 0.125, within: 0.109, p0: 7.51, p1: 1.28, p2: 0.33, gini: 0.373, priorityScore: 53, trend: 'stable', typology: 'III', urbanRural: 'Rural', region: 'BOGOR', population: 5380000 },
    { id: '3202', name: 'Kabupaten Sukabumi', theil: 0.150, within: 0.134, p0: 9.72, p1: 1.56, p2: 0.40, gini: 0.380, priorityScore: 76, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'SUKABUMI', population: 2590000 },
    { id: '3203', name: 'Kabupaten Cianjur', theil: 0.160, within: 0.144, p0: 10.51, p1: 1.75, p2: 0.46, gini: 0.386, priorityScore: 82, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'SUKABUMI', population: 2450000 },
    { id: '3204', name: 'Kabupaten Bandung', theil: 0.111, within: 0.098, p0: 7.02, p1: 1.10, p2: 0.26, gini: 0.360, priorityScore: 40, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PRIANGAN', population: 3600000 },
    { id: '3205', name: 'Kabupaten Garut', theil: 0.174, within: 0.158, p0: 11.72, p1: 1.89, p2: 0.50, gini: 0.392, priorityScore: 89, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 2550000 },
    { id: '3206', name: 'Kabupaten Tasikmalaya', theil: 0.180, within: 0.164, p0: 12.42, p1: 2.02, p2: 0.53, gini: 0.395, priorityScore: 93, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1850000 },
    { id: '3207', name: 'Kabupaten Ciamis', theil: 0.121, within: 0.105, p0: 8.21, p1: 1.25, p2: 0.30, gini: 0.365, priorityScore: 48, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1220000 },
    { id: '3208', name: 'Kabupaten Kuningan', theil: 0.178, within: 0.160, p0: 13.15, p1: 2.11, p2: 0.55, gini: 0.393, priorityScore: 91, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1110000 },
    { id: '3209', name: 'Kabupaten Cirebon', theil: 0.166, within: 0.148, p0: 11.58, p1: 1.81, p2: 0.47, gini: 0.385, priorityScore: 84, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 2250000 },
    { id: '3210', name: 'Kabupaten Majalengka', theil: 0.164, within: 0.146, p0: 12.28, p1: 1.91, p2: 0.49, gini: 0.382, priorityScore: 85, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1200000 },
    { id: '3211', name: 'Kabupaten Sumedang', theil: 0.136, within: 0.119, p0: 10.08, p1: 1.49, p2: 0.37, gini: 0.369, priorityScore: 66, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1160000 },
    { id: '3212', name: 'Kabupaten Indramayu', theil: 0.176, within: 0.157, p0: 13.12, p1: 2.09, p2: 0.54, gini: 0.391, priorityScore: 90, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1730000 },
    { id: '3213', name: 'Kabupaten Subang', theil: 0.131, within: 0.115, p0: 9.18, p1: 1.37, p2: 0.34, gini: 0.368, priorityScore: 60, trend: 'stable', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 1590000 },
    { id: '3214', name: 'Kabupaten Purwakarta', theil: 0.114, within: 0.099, p0: 7.42, p1: 1.13, p2: 0.27, gini: 0.357, priorityScore: 43, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 950000 },
    { id: '3215', name: 'Kabupaten Karawang', theil: 0.118, within: 0.103, p0: 8.02, p1: 1.20, p2: 0.29, gini: 0.361, priorityScore: 46, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 2400000 },
    { id: '3216', name: 'Kabupaten Bekasi', theil: 0.099, within: 0.085, p0: 5.32, p1: 0.78, p2: 0.17, gini: 0.349, priorityScore: 26, trend: 'down', typology: 'I', urbanRural: 'Rural', region: 'BOGOR', population: 3080000 },
    { id: '3217', name: 'Kabupaten Bandung Barat', theil: 0.146, within: 0.129, p0: 10.88, p1: 1.68, p2: 0.42, gini: 0.376, priorityScore: 73, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1760000 },
    { id: '3218', name: 'Kabupaten Pangandaran', theil: 0.128, within: 0.112, p0: 9.42, p1: 1.42, p2: 0.35, gini: 0.367, priorityScore: 58, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 4050000 },
    { id: '3271', name: 'Kota Bogor', theil: 0.104, within: 0.092, p0: 6.25, p1: 0.93, p2: 0.22, gini: 0.389, priorityScore: 36, trend: 'down', typology: 'III', urbanRural: 'Urban', region: 'BOGOR', population: 1030000 },
    { id: '3272', name: 'Kota Sukabumi', theil: 0.116, within: 0.102, p0: 7.60, p1: 1.17, p2: 0.28, gini: 0.375, priorityScore: 47, trend: 'stable', typology: 'IV', urbanRural: 'Urban', region: 'SUKABUMI', population: 335000 },
    { id: '3273', name: 'Kota Bandung', theil: 0.091, within: 0.079, p0: 4.12, p1: 0.61, p2: 0.13, gini: 0.395, priorityScore: 20, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'PRIANGAN', population: 2430000 },
    { id: '3274', name: 'Kota Cirebon', theil: 0.124, within: 0.108, p0: 8.92, p1: 1.33, p2: 0.32, gini: 0.381, priorityScore: 56, trend: 'stable', typology: 'III', urbanRural: 'Urban', region: 'CIREBON', population: 325000 },
    { id: '3275', name: 'Kota Bekasi', theil: 0.095, within: 0.082, p0: 4.28, p1: 0.65, p2: 0.14, gini: 0.377, priorityScore: 22, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'BOGOR', population: 2520000 },
    { id: '3276', name: 'Kota Depok', theil: 0.085, within: 0.073, p0: 2.65, p1: 0.40, p2: 0.08, gini: 0.362, priorityScore: 10, trend: 'down', typology: 'III', urbanRural: 'Urban', region: 'BOGOR', population: 2040000 },
    { id: '3277', name: 'Kota Cimahi', theil: 0.101, within: 0.088, p0: 5.35, p1: 0.81, p2: 0.18, gini: 0.369, priorityScore: 29, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'PRIANGAN', population: 565000 },
    { id: '3278', name: 'Kota Tasikmalaya', theil: 0.158, within: 0.139, p0: 11.88, p1: 1.83, p2: 0.46, gini: 0.387, priorityScore: 80, trend: 'stable', typology: 'IV', urbanRural: 'Urban', region: 'PRIANGAN', population: 720000 },
    { id: '3279', name: 'Kota Banjar', theil: 0.109, within: 0.095, p0: 6.98, p1: 1.08, p2: 0.25, gini: 0.363, priorityScore: 37, trend: 'down', typology: 'IV', urbanRural: 'Urban', region: 'PRIANGAN', population: 1770000 }
  ],
  '2024': [
    { id: '3201', name: 'Kabupaten Bogor', theil: 0.120, within: 0.105, p0: 7.21, p1: 1.25, p2: 0.31, gini: 0.371, priorityScore: 50, trend: 'stable', typology: 'III', urbanRural: 'Rural', region: 'BOGOR', population: 5400000 },
    { id: '3202', name: 'Kabupaten Sukabumi', theil: 0.146, within: 0.131, p0: 9.51, p1: 1.51, p2: 0.38, gini: 0.378, priorityScore: 74, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'SUKABUMI', population: 2600000 },
    { id: '3203', name: 'Kabupaten Cianjur', theil: 0.155, within: 0.141, p0: 10.35, p1: 1.68, p2: 0.43, gini: 0.383, priorityScore: 80, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'SUKABUMI', population: 2460000 },
    { id: '3204', name: 'Kabupaten Bandung', theil: 0.108, within: 0.095, p0: 6.91, p1: 1.06, p2: 0.24, gini: 0.358, priorityScore: 38, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PRIANGAN', population: 3610000 },
    { id: '3205', name: 'Kabupaten Garut', theil: 0.170, within: 0.155, p0: 11.52, p1: 1.83, p2: 0.47, gini: 0.389, priorityScore: 86, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 2560000 },
    { id: '3206', name: 'Kabupaten Tasikmalaya', theil: 0.175, within: 0.160, p0: 12.21, p1: 1.95, p2: 0.50, gini: 0.392, priorityScore: 90, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1855000 },
    { id: '3207', name: 'Kabupaten Ciamis', theil: 0.118, within: 0.103, p0: 8.05, p1: 1.21, p2: 0.28, gini: 0.362, priorityScore: 45, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1225000 },
    { id: '3208', name: 'Kabupaten Kuningan', theil: 0.172, within: 0.156, p0: 12.91, p1: 2.05, p2: 0.52, gini: 0.390, priorityScore: 88, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1115000 },
    { id: '3209', name: 'Kabupaten Cirebon', theil: 0.162, within: 0.145, p0: 11.35, p1: 1.74, p2: 0.44, gini: 0.382, priorityScore: 81, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 2260000 },
    { id: '3210', name: 'Kabupaten Majalengka', theil: 0.160, within: 0.143, p0: 12.08, p1: 1.85, p2: 0.46, gini: 0.379, priorityScore: 82, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1205000 },
    { id: '3211', name: 'Kabupaten Sumedang', theil: 0.132, within: 0.116, p0: 9.88, p1: 1.44, p2: 0.35, gini: 0.366, priorityScore: 64, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1165000 },
    { id: '3212', name: 'Kabupaten Indramayu', theil: 0.171, within: 0.154, p0: 12.91, p1: 2.02, p2: 0.51, gini: 0.388, priorityScore: 87, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1740000 },
    { id: '3213', name: 'Kabupaten Subang', theil: 0.128, within: 0.112, p0: 9.02, p1: 1.32, p2: 0.32, gini: 0.365, priorityScore: 58, trend: 'stable', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 1600000 },
    { id: '3214', name: 'Kabupaten Purwakarta', theil: 0.111, within: 0.097, p0: 7.28, p1: 1.09, p2: 0.25, gini: 0.354, priorityScore: 40, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 955000 },
    { id: '3215', name: 'Kabupaten Karawang', theil: 0.115, within: 0.100, p0: 7.89, p1: 1.16, p2: 0.27, gini: 0.358, priorityScore: 44, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 2410000 },
    { id: '3216', name: 'Kabupaten Bekasi', theil: 0.096, within: 0.083, p0: 5.18, p1: 0.74, p2: 0.16, gini: 0.346, priorityScore: 24, trend: 'down', typology: 'I', urbanRural: 'Rural', region: 'BOGOR', population: 3100000 },
    { id: '3217', name: 'Kabupaten Bandung Barat', theil: 0.142, within: 0.126, p0: 10.65, p1: 1.62, p2: 0.39, gini: 0.373, priorityScore: 70, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1770000 },
    { id: '3218', name: 'Kabupaten Pangandaran', theil: 0.125, within: 0.109, p0: 9.24, p1: 1.36, p2: 0.33, gini: 0.364, priorityScore: 55, trend: 'stable', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 4080000 },
    { id: '3271', name: 'Kota Bogor', theil: 0.101, within: 0.089, p0: 6.11, p1: 0.89, p2: 0.20, gini: 0.386, priorityScore: 34, trend: 'down', typology: 'III', urbanRural: 'Urban', region: 'BOGOR', population: 1035000 },
    { id: '3272', name: 'Kota Sukabumi', theil: 0.113, within: 0.099, p0: 7.42, p1: 1.12, p2: 0.26, gini: 0.372, priorityScore: 45, trend: 'stable', typology: 'IV', urbanRural: 'Urban', region: 'SUKABUMI', population: 338000 },
    { id: '3273', name: 'Kota Bandung', theil: 0.088, within: 0.076, p0: 3.98, p1: 0.58, p2: 0.12, gini: 0.391, priorityScore: 18, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'PRIANGAN', population: 2440000 },
    { id: '3274', name: 'Kota Cirebon', theil: 0.121, within: 0.105, p0: 8.75, p1: 1.28, p2: 0.30, gini: 0.378, priorityScore: 54, trend: 'stable', typology: 'III', urbanRural: 'Urban', region: 'CIREBON', population: 328000 },
    { id: '3275', name: 'Kota Bekasi', theil: 0.092, within: 0.080, p0: 4.15, p1: 0.62, p2: 0.13, gini: 0.374, priorityScore: 20, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'BOGOR', population: 2530000 },
    { id: '3276', name: 'Kota Depok', theil: 0.082, within: 0.070, p0: 2.55, p1: 0.38, p2: 0.07, gini: 0.359, priorityScore: 8, trend: 'down', typology: 'III', urbanRural: 'Urban', region: 'BOGOR', population: 2050000 },
    { id: '3277', name: 'Kota Cimahi', theil: 0.098, within: 0.085, p0: 5.21, p1: 0.78, p2: 0.17, gini: 0.365, priorityScore: 27, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'PRIANGAN', population: 568000 },
    { id: '3278', name: 'Kota Tasikmalaya', theil: 0.154, within: 0.136, p0: 11.65, p1: 1.76, p2: 0.43, gini: 0.384, priorityScore: 78, trend: 'stable', typology: 'IV', urbanRural: 'Urban', region: 'PRIANGAN', population: 725000 },
    { id: '3279', name: 'Kota Banjar', theil: 0.106, within: 0.092, p0: 6.81, p1: 1.04, p2: 0.23, gini: 0.360, priorityScore: 35, trend: 'down', typology: 'IV', urbanRural: 'Urban', region: 'PRIANGAN', population: 1790000 }
  ],
  '2025': [
    { id: '3201', name: 'Kabupaten Bogor', theil: 0.115, within: 0.101, p0: 7.12, p1: 1.22, p2: 0.29, gini: 0.369, priorityScore: 48, trend: 'down', typology: 'III', urbanRural: 'Rural', region: 'BOGOR', population: 5420000 },
    { id: '3202', name: 'Kabupaten Sukabumi', theil: 0.142, within: 0.128, p0: 9.42, p1: 1.48, p2: 0.36, gini: 0.375, priorityScore: 72, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'SUKABUMI', population: 2610000 },
    { id: '3203', name: 'Kabupaten Cianjur', theil: 0.151, within: 0.137, p0: 10.22, p1: 1.62, p2: 0.40, gini: 0.380, priorityScore: 78, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'SUKABUMI', population: 2470000 },
    { id: '3204', name: 'Kabupaten Bandung', theil: 0.105, within: 0.092, p0: 6.81, p1: 1.02, p2: 0.22, gini: 0.355, priorityScore: 36, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PRIANGAN', population: 3620000 },
    { id: '3205', name: 'Kabupaten Garut', theil: 0.165, within: 0.151, p0: 11.45, p1: 1.78, p2: 0.44, gini: 0.385, priorityScore: 84, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 2580000 },
    { id: '3206', name: 'Kabupaten Tasikmalaya', theil: 0.170, within: 0.155, p0: 12.11, p1: 1.88, p2: 0.47, gini: 0.389, priorityScore: 88, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1860000 },
    { id: '3207', name: 'Kabupaten Ciamis', theil: 0.114, within: 0.100, p0: 7.97, p1: 1.18, p2: 0.26, gini: 0.359, priorityScore: 42, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1230000 },
    { id: '3208', name: 'Kabupaten Kuningan', theil: 0.167, within: 0.152, p0: 12.82, p1: 1.98, p2: 0.49, gini: 0.387, priorityScore: 86, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1120000 },
    { id: '3209', name: 'Kabupaten Cirebon', theil: 0.158, within: 0.142, p0: 11.24, p1: 1.68, p2: 0.41, gini: 0.379, priorityScore: 78, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 2270000 },
    { id: '3210', name: 'Kabupaten Majalengka', theil: 0.156, within: 0.140, p0: 11.94, p1: 1.79, p2: 0.43, gini: 0.376, priorityScore: 79, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1210000 },
    { id: '3211', name: 'Kabupaten Sumedang', theil: 0.128, within: 0.113, p0: 9.76, p1: 1.39, p2: 0.33, gini: 0.363, priorityScore: 61, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1170000 },
    { id: '3212', name: 'Kabupaten Indramayu', theil: 0.166, within: 0.150, p0: 12.77, p1: 1.95, p2: 0.48, gini: 0.385, priorityScore: 85, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'CIREBON', population: 1750000 },
    { id: '3213', name: 'Kabupaten Subang', theil: 0.124, within: 0.109, p0: 8.92, p1: 1.28, p2: 0.30, gini: 0.361, priorityScore: 55, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 1610000 },
    { id: '3214', name: 'Kabupaten Purwakarta', theil: 0.108, within: 0.094, p0: 7.21, p1: 1.05, p2: 0.23, gini: 0.351, priorityScore: 37, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 960000 },
    { id: '3215', name: 'Kabupaten Karawang', theil: 0.111, within: 0.097, p0: 7.83, p1: 1.12, p2: 0.25, gini: 0.355, priorityScore: 41, trend: 'down', typology: 'II', urbanRural: 'Rural', region: 'PURWAKARTA', population: 2420000 },
    { id: '3216', name: 'Kabupaten Bekasi', theil: 0.092, within: 0.080, p0: 5.11, p1: 0.70, p2: 0.15, gini: 0.342, priorityScore: 22, trend: 'down', typology: 'I', urbanRural: 'Rural', region: 'BOGOR', population: 3120000 },
    { id: '3217', name: 'Kabupaten Bandung Barat', theil: 0.138, within: 0.123, p0: 10.52, p1: 1.56, p2: 0.36, gini: 0.370, priorityScore: 68, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 1780000 },
    { id: '3218', name: 'Kabupaten Pangandaran', theil: 0.121, within: 0.106, p0: 9.11, p1: 1.31, p2: 0.31, gini: 0.361, priorityScore: 52, trend: 'down', typology: 'IV', urbanRural: 'Rural', region: 'PRIANGAN', population: 410000 },
    { id: '3271', name: 'Kota Bogor', theil: 0.097, within: 0.086, p0: 6.05, p1: 0.85, p2: 0.18, gini: 0.383, priorityScore: 31, trend: 'down', typology: 'III', urbanRural: 'Urban', region: 'BOGOR', population: 1040000 },
    { id: '3272', name: 'Kota Sukabumi', theil: 0.109, within: 0.096, p0: 7.32, p1: 1.08, p2: 0.24, gini: 0.369, priorityScore: 42, trend: 'down', typology: 'IV', urbanRural: 'Urban', region: 'SUKABUMI', population: 340000 },
    { id: '3273', name: 'Kota Bandung', theil: 0.084, within: 0.073, p0: 3.96, p1: 0.55, p2: 0.11, gini: 0.387, priorityScore: 15, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'PRIANGAN', population: 2450000 },
    { id: '3274', name: 'Kota Cirebon', theil: 0.118, within: 0.102, p0: 8.71, p1: 1.23, p2: 0.28, gini: 0.374, priorityScore: 51, trend: 'down', typology: 'III', urbanRural: 'Urban', region: 'CIREBON', population: 330000 },
    { id: '3275', name: 'Kota Bekasi', theil: 0.088, within: 0.077, p0: 4.12, p1: 0.58, p2: 0.12, gini: 0.370, priorityScore: 18, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'BOGOR', population: 2540000 },
    { id: '3276', name: 'Kota Depok', theil: 0.078, within: 0.067, p0: 2.53, p1: 0.35, p2: 0.06, gini: 0.355, priorityScore: 6, trend: 'down', typology: 'III', urbanRural: 'Urban', region: 'BOGOR', population: 2060000 },
    { id: '3277', name: 'Kota Cimahi', theil: 0.094, within: 0.082, p0: 5.18, p1: 0.74, p2: 0.15, gini: 0.361, priorityScore: 24, trend: 'down', typology: 'I', urbanRural: 'Urban', region: 'PRIANGAN', population: 570000 },
    { id: '3278', name: 'Kota Tasikmalaya', theil: 0.150, within: 0.132, p0: 11.52, p1: 1.71, p2: 0.40, gini: 0.380, priorityScore: 75, trend: 'down', typology: 'IV', urbanRural: 'Urban', region: 'PRIANGAN', population: 730000 },
    { id: '3279', name: 'Kota Banjar', theil: 0.102, within: 0.089, p0: 6.73, p1: 1.00, p2: 0.21, gini: 0.356, priorityScore: 32, trend: 'down', typology: 'IV', urbanRural: 'Urban', region: 'PRIANGAN', population: 180000 }
  ]
};

// West Java Priority Drivers details with realistic values
export interface PriorityDriver {
  id: string;
  title: string;
  metric: string;
  districtCount: number;
  criticalCases: string[];
  evaluation: string;
  recom: string;
}

export const PRIORITY_DRIVERS_DATA: PriorityDriver[] = [
  {
    id: 'high-poverty',
    title: 'High Poverty Headcount (P0)',
    metric: 'P0 > 11.0%',
    districtCount: 6,
    criticalCases: ['Kab. Kuningan', 'Kab. Indramayu', 'Kab. Garut', 'Kab. Tasikmalaya'],
    evaluation: 'Poverty headcount rates remain entrenched above double digits in northern agricultural basins and southern mountain belts.',
    recom: 'Intensify conditional cash assistance and rural infrastructure grants targeting local smallholders.'
  },
  {
    id: 'high-within',
    title: 'Severe Within-District Disparity',
    metric: 'Within Contrib > 88%',
    districtCount: 8,
    criticalCases: ['Kab. Bogor', 'Kab. Sukabumi', 'Kab. Cianjur', 'Kota Tasikmalaya'],
    evaluation: 'Local inequality is concentrated heavily within the boundaries of large, heterogeneous districts rather than between them.',
    recom: 'Reallocate public service centers and healthcare access points closer to marginalized rural sub-districts.'
  },
  {
    id: 'increasing-p1',
    title: 'Elevated Poverty Gap (P1)',
    metric: 'P1 > 1.80',
    districtCount: 5,
    criticalCases: ['Kab. Tasikmalaya', 'Kab. Kuningan', 'Kab. Indramayu'],
    evaluation: 'The depth of poverty is expanding, indicating that the poorest households are falling further below the standard poverty line.',
    recom: 'Deploy supplementary nutrition vouchers and primary healthcare outreach squads to remote rural outposts.'
  },
  {
    id: 'increasing-gini',
    title: 'Elevated Consumption Gini Ratio',
    metric: 'Gini > 0.380',
    districtCount: 7,
    criticalCases: ['Kota Bandung', 'Kota Tasikmalaya', 'Kab. Sukabumi'],
    evaluation: 'High urban-fringe areas show severe income disparities, driven by rapid industrialization alongside stagnant informal wages.',
    recom: 'Enforce local progressive living-wage brackets and expand technical vocational training access.'
  },
  {
    id: 'low-education',
    title: 'Educational Attainment Gap',
    metric: 'Avg School < 7.4 yrs',
    districtCount: 9,
    criticalCases: ['Kab. Cianjur', 'Kab. Garut', 'Kab. Indramayu'],
    evaluation: 'Generational poverty cycles are reinforced by early dropout patterns in primary agriculture regions.',
    recom: 'Build technical vocational academies linked to local food processing and supply chain industries.'
  },
  {
    id: 'poor-infrastructure',
    title: 'Basic Infrastructure Deprivation',
    metric: 'Water Deficit > 35%',
    districtCount: 8,
    criticalCases: ['Kab. Tasikmalaya', 'Kab. Sukabumi', 'Kab. Majalengka'],
    evaluation: 'High deprivation coordinates in clean water and sanitation access compound multidimensional poverty levels.',
    recom: 'Allocate provincial fiscal matching funds for public deepwell grids and community-managed sanitation facilities.'
  }
];
