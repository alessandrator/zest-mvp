/**
 * Utility functions for email validation
 */

// List of common personal email providers that should not be used for corporate roles
const PERSONAL_EMAIL_DOMAINS = [
  // Gmail
  'gmail.com',
  'googlemail.com',
  
  // Microsoft/Outlook
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  
  // Yahoo
  'yahoo.com',
  'yahoo.it',
  'yahoo.co.uk',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.es',
  'ymail.com',
  
  // Other popular personal providers
  'aol.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'protonmail.com',
  'tutanota.com',
  'zoho.com',
  'mail.com',
  'gmx.com',
  'web.de',
  
  // Italian providers
  'libero.it',
  'virgilio.it',
  'tiscali.it',
  'alice.it',
  'tim.it',
  'fastweb.it',
] as const

/**
 * Checks if an email domain is considered a personal email provider
 */
export function isPersonalEmailDomain(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1]
  if (!domain) return false
  
  return PERSONAL_EMAIL_DOMAINS.includes(domain as typeof PERSONAL_EMAIL_DOMAINS[number])
}

/**
 * Validates if an email is suitable for corporate/institutional use
 */
export function isCorporateEmail(email: string): boolean {
  return !isPersonalEmailDomain(email)
}

/**
 * Gets the domain from an email address
 */
export function getEmailDomain(email: string): string {
  return email.toLowerCase().split('@')[1] || ''
}

/**
 * Generates a helpful error message for corporate email validation
 */
export function getCorporateEmailErrorMessage(role: 'brand' | 'school_admin'): string {
  const roleText = role === 'brand' ? 'companies' : 'schools and institutions'
  return `Please use your official ${roleText === 'companies' ? 'company' : 'institutional'} email address. Personal email providers (Gmail, Yahoo, Outlook, etc.) are not allowed for ${roleText}.`
}