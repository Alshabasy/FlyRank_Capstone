/**
 * Pure validation helpers for the contact form.
 * Each returns { valid: boolean, error: string }.
 */

export const validateName = (value) => {
  const v = value?.trim() ?? ''
  if (!v) return { valid: false, error: 'Full name is required.' }
  if (v.length < 2) return { valid: false, error: 'Name must be at least 2 characters.' }
  if (!/^[A-Za-z\s]+$/.test(v)) {
    return { valid: false, error: 'Name may only contain letters and spaces.' }
  }
  return { valid: true, error: '' }
}

export const validateEmail = (value) => {
  const v = value?.trim() ?? ''
  if (!v) return { valid: false, error: 'Email address is required.' }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(v)) return { valid: false, error: 'Please enter a valid email address.' }
  return { valid: true, error: '' }
}

export const validateSubject = (value) => {
  const v = value?.trim() ?? ''
  if (!v) return { valid: false, error: 'Subject is required.' }
  if (v.length < 5) return { valid: false, error: 'Subject must be at least 5 characters.' }
  if (v.length > 80) return { valid: false, error: 'Subject must be 80 characters or fewer.' }
  return { valid: true, error: '' }
}

export const validateMessage = (value) => {
  const v = value?.trim() ?? ''
  if (!v) return { valid: false, error: 'Message is required.' }
  if (v.length < 20) return { valid: false, error: 'Message must be at least 20 characters.' }
  if (v.length > 1000) {
    return { valid: false, error: 'Message must be 1000 characters or fewer.' }
  }
  return { valid: true, error: '' }
}

export const validators = {
  from_name: validateName,
  from_email: validateEmail,
  subject: validateSubject,
  message: validateMessage,
}
