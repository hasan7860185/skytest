import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function validatePhoneNumber(phoneNumber: string): string {
  // Basic phone number validation - accepts formats like:
  // +1234567890, 1234567890, 123-456-7890, (123) 456-7890
  const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phoneNumber) ? phoneNumber : '';
}