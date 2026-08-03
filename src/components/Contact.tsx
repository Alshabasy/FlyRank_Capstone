import { useState, type FormEvent, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import SendIcon from '@mui/icons-material/Send'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { contactInfo, socialLinks } from '../utils/data'

type FormData = {
  name: string
  email: string
  message: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const iconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: FaEnvelope,
}

const Contact = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    success: true,
    message: '',
  })

  const validate = (): FormErrors => {
    const next: FormErrors = {}

    if (!form.name.trim()) {
      next.name = 'Name is required'
    } else if (form.name.trim().length < 2) {
      next.name = 'Name must be at least 2 characters'
    }

    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!emailPattern.test(form.email.trim())) {
      next.email = 'Enter a valid email address'
    }

    if (!form.message.trim()) {
      next.message = 'Message is required'
    } else if (form.message.trim().length < 10) {
      next.message = 'Message must be at least 10 characters'
    }

    return next
  }

  const handleChange =
    (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)

    try {
      // Client-side demo submit — swap for Formspree / API when ready
      await new Promise((resolve) => setTimeout(resolve, 900))

      setForm({ name: '', email: '', message: '' })
      setSnackbar({
        open: true,
        success: true,
        message: 'Message sent — thanks for reaching out!',
      })
    } catch {
      setSnackbar({
        open: true,
        success: false,
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-20 md:py-28"
      aria-labelledby="contact-heading"
    >
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl"
        style={{ animation: 'glow-pulse 6s ease-in-out infinite' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
        style={{ animation: 'glow-pulse 7s ease-in-out infinite 1s' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-12 text-center md:mb-16"
        >
          <h2
            id="contact-heading"
            className="mb-4 text-3xl font-semibold md:text-4xl"
          >
            <span className="gradient-text">{contactInfo.heading}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-400">
            {contactInfo.subheading}
          </p>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-12">
          <motion.aside
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass p-6 md:p-8">
              <h3 className="mb-3 text-xl font-semibold text-white">
                Other ways to reach me
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                Prefer socials? Find me on these platforms or send an email
                directly.
              </p>

              <ul className="flex flex-col gap-3">
                {socialLinks.map((link) => {
                  const Icon = iconMap[link.icon]
                  return (
                    <li key={link.name}>
                      <a
                        href={link.url}
                        target={link.icon === 'email' ? undefined : '_blank'}
                        rel={
                          link.icon === 'email'
                            ? undefined
                            : 'noopener noreferrer'
                        }
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/40 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
                      >
                        <Icon className="text-lg text-purple-300" aria-hidden />
                        <span className="text-sm font-medium">{link.name}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="glass flex flex-col gap-5 p-6 md:gap-6 md:p-8"
            >
              <TextField
                id="contact-name"
                label="Name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange('name')}
                error={Boolean(errors.name)}
                helperText={errors.name}
                disabled={submitting}
              />

              <TextField
                id="contact-email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange('email')}
                error={Boolean(errors.email)}
                helperText={errors.email}
                disabled={submitting}
              />

              <TextField
                id="contact-message"
                label="Message"
                name="message"
                multiline
                minRows={5}
                value={form.message}
                onChange={handleChange('message')}
                error={Boolean(errors.message)}
                helperText={errors.message}
                disabled={submitting}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                endIcon={
                  submitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
              >
                {submitting ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.success ? 'success' : 'error'}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </section>
  )
}

export default Contact
