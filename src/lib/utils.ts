import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format pence/cents to currency string */
export function formatCurrency(amount: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100)
}

/** Format a date string to readable format */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

/** Get initials from a full name */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Calculate how many numbers in `entry` match `winning` */
export function countMatches(entry: number[], winning: number[]): number {
  return entry.filter(n => winning.includes(n)).length
}

/** Calculate prize pool amounts for a given total */
export function calculatePrizePools(totalPool: number) {
  return {
    fiveMatch:  Math.round(totalPool * 0.40 * 100) / 100,
    fourMatch:  Math.round(totalPool * 0.35 * 100) / 100,
    threeMatch: Math.round(totalPool * 0.25 * 100) / 100,
  }
}
