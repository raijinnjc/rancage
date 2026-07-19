import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard utility to combine and merge Tailwind CSS classes cleanly,
 * preventing style conflicts and supporting conditional styling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
