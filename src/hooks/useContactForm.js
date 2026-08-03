import { useCallback, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { validators } from '../utils/validation'

const INITIAL = {
  from_name: '',
  from_email: '',
  subject: '',
  message: '',
  reply_to: '',
}

const emptyErrors = () =>
  Object.keys(INITIAL).reduce((acc, key) => {
    if (key === 'reply_to') return acc
    acc[key] = ''
    return acc
  }, {})

const emptyTouched = () =>
  Object.keys(INITIAL).reduce((acc, key) => {
    if (key === 'reply_to') return acc
    acc[key] = false
    return acc
  }, {})

const useContactForm = () => {
  const formRef = useRef(null)
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState(emptyErrors)
  const [touched, setTouched] = useState(emptyTouched)
  const [sending, setSending] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' })

  const validateField = useCallback((name, value) => {
    const fn = validators[name]
    if (!fn) return { valid: true, error: '' }
    return fn(value)
  }, [])

  const isFormValid = Object.keys(validators).every(
    (key) => validateField(key, values[key]).valid,
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'from_email') next.reply_to = value
      return next
    })
    if (touched[name]) {
      const { error } = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const { error } = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextTouched = emptyTouched()
    const nextErrors = emptyErrors()
    let valid = true

    Object.keys(validators).forEach((key) => {
      nextTouched[key] = true
      const result = validateField(key, values[key])
      nextErrors[key] = result.error
      if (!result.valid) valid = false
    })

    setTouched(nextTouched)
    setErrors(nextErrors)
    if (!valid || sending) return

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      console.error(
        'EmailJS env vars missing. Copy .env.example → .env and add your keys, then restart Vite.',
      )
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Email is not configured. Add EmailJS keys to .env and restart the server.',
      })
      return
    }

    setSending(true)
    try {
      // Use send() with explicit params so MUI fields always map correctly.
      // EmailJS template must set Reply To → {{reply_to}} (or {{from_email}}).
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: values.from_name.trim(),
          from_email: values.from_email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
          reply_to: values.from_email.trim(),
        },
        publicKey,
      )
      setValues(INITIAL)
      setErrors(emptyErrors())
      setTouched(emptyTouched())
      setSnackbar({
        open: true,
        severity: 'success',
        message: "Message sent! I'll reply within 24 hours. ✓",
      })
    } catch (err) {
      console.error('EmailJS send failed:', err)
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Something went wrong. Please try emailing me directly.',
      })
    } finally {
      setSending(false)
    }
  }

  const fieldMeta = (name) => {
    const { valid } = validateField(name, values[name])
    const isTouched = touched[name]
    return {
      showError: isTouched && Boolean(errors[name]),
      showValid: isTouched && valid && Boolean(values[name]),
      showInvalid: isTouched && !valid,
    }
  }

  return {
    formRef,
    values,
    errors,
    sending,
    snackbar,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
    closeSnackbar,
    fieldMeta,
  }
}

export default useContactForm
