/**
 * @jest-environment node
 */
import {
  validateName,
  validateEmail,
  validateSubject,
  validateMessage,
} from './validation.js'

describe('validateName', () => {
  it('rejects empty values', () => {
    expect(validateName('').valid).toBe(false)
  })

  it('rejects names shorter than 2 characters', () => {
    expect(validateName('A').valid).toBe(false)
  })

  it('rejects names with numbers or symbols', () => {
    expect(validateName('Amr1').valid).toBe(false)
    expect(validateName('Amr!').valid).toBe(false)
  })

  it('accepts letters and spaces', () => {
    expect(validateName('Amr Alshabasy')).toEqual({ valid: true, error: '' })
  })
})

describe('validateEmail', () => {
  it('rejects empty and invalid emails', () => {
    expect(validateEmail('').valid).toBe(false)
    expect(validateEmail('not-an-email').valid).toBe(false)
  })

  it('accepts valid emails', () => {
    expect(validateEmail('you@example.com').valid).toBe(true)
  })
})

describe('validateSubject', () => {
  it('enforces min and max length', () => {
    expect(validateSubject('Hey').valid).toBe(false)
    expect(validateSubject('a'.repeat(81)).valid).toBe(false)
    expect(validateSubject('Project inquiry').valid).toBe(true)
  })
})

describe('validateMessage', () => {
  it('enforces min and max length', () => {
    expect(validateMessage('Too short').valid).toBe(false)
    expect(validateMessage('a'.repeat(1001)).valid).toBe(false)
    expect(
      validateMessage('This is a long enough message for the contact form.').valid,
    ).toBe(true)
  })
})
