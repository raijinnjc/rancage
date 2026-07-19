/**
 * Government and Socioeconomic Data Formatting Helpers for RANCAGE
 */

/**
 * Formats a decimal ratio into a West Java poverty headcount percentage.
 * Example: 0.0762 => "7.62%" or 7.62 => "7.62%"
 */
export function formatPercentage(value: number, decimals = 2): string {
  if (value === undefined || value === null || isNaN(value)) return '0.00%';
  const parsedValue = value > 1 ? value : value * 100;
  return `${parsedValue.toFixed(decimals)}%`;
}

/**
 * Formats a numeric value into Indonesian Rupiah (IDR) for fiscal budget tracking.
 * Example: 4200000000000 => "Rp 4.20 Triliun" or detailed Rp 4.200.000.000.000
 */
export function formatRupiah(value: number, compact = true): string {
  if (value === undefined || value === null || isNaN(value)) return 'Rp 0';
  
  if (compact) {
    if (value >= 1e12) {
      return `Rp ${(value / 1e12).toFixed(2)} Triliun`;
    }
    if (value >= 1e9) {
      return `Rp ${(value / 1e9).toFixed(2)} Miliar`;
    }
    if (value >= 1e6) {
      return `Rp ${(value / 1e6).toFixed(2)} Juta`;
    }
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats standard integers with local separators for population counts.
 * Example: 49300000 => "49.300.000"
 */
export function formatNumber(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return new Intl.NumberFormat('id-ID').format(value);
}

/**
 * Mask sensitive household personal data for PDP (UU 27/2022) compliance.
 * Example: "Ahmad Subarjo" => "Ah*** Su*****"
 */
export function maskName(name: string): string {
  if (!name) return '';
  const parts = name.split(' ');
  return parts
    .map((part) => {
      if (part.length <= 2) return part;
      return `${part.substring(0, 2)}${'*'.repeat(Math.max(1, part.length - 2))}`;
    })
    .join(' ');
}

/**
 * Mask national identification number (NIK) for secure audit views.
 * Example: "3204121204850001" => "3204**********01"
 */
export function maskNIK(nik: string): string {
  if (!nik || nik.length < 6) return '**********';
  return `${nik.substring(0, 4)}**********${nik.substring(nik.length - 2)}`;
}
