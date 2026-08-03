/**
 * EmailJS setup (required before the form will send):
 * 1. VITE_EMAILJS_SERVICE_ID  — from EmailJS → Email Services
 * 2. VITE_EMAILJS_TEMPLATE_ID — from EmailJS → Email Templates
 * 3. VITE_EMAILJS_PUBLIC_KEY  — from EmailJS → Account → API Keys
 * Copy .env.example → .env and replace the placeholders with your real values.
 *
 * In the EmailJS template settings, set:
 *   To Email   → your own inbox
 *   From Name  → {{from_name}}
 *   Reply To   → {{reply_to}}     ← required so client email shows / reply works
 *   Subject    → {{subject}}
 * Content example:
 *   From: {{from_name}} ({{from_email}})
 *   {{message}}
 */
import { useRef } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import GlassCard from './ui/GlassCard'
import ContactInfoPanel from './ContactInfoPanel'
import ContactForm from './ContactForm'
import useContactForm from '../hooks/useContactForm'

const CONTACT_DATA = {
  email: 'amralshabasy10@gmail.com',
  location: 'Cairo, Egypt',
  responseTime: 'Within 24 hours',
  status: 'Available for creativity',
  socials: {
    github: 'https://github.com/Alshabasy',
    linkedin: 'https://www.linkedin.com/in/amr-alshabasy-a7aa90314',
    twitter: 'https://x.com/',
  },
}

const Contact = () => {
  const form = useContactForm()
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.2 })
  const show = reduceMotion || inView

  return (
    <section id="contact" ref={sectionRef} className="w-full bg-[var(--black)] py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="mb-14 text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={show || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: 'easeOut' }}
        >
          <p
            className="mb-3 font-['Space_Grotesk'] text-xs font-medium uppercase
              tracking-[0.2em] text-[var(--skyblue)]"
          >
            GET IN TOUCH
          </p>
          <h2 className="mb-4 font-['Space_Grotesk'] text-4xl font-bold text-[#f1f5f9] md:text-5xl">
            Let&apos;s{' '}
            <span
              className="bg-gradient-to-br from-[var(--mint)] to-[var(--skyblue)]
                bg-clip-text text-transparent"
            >
              Work Together
            </span>
          </h2>
          <p className="mx-auto max-w-2xl font-['Space_Grotesk'] text-[#94a3b8]">
            Have a project in mind or just want to say hi? Fill out the form and I&apos;ll get
            back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -40 }}
            animate={
              show || reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }
            }
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.55, delay: 0.2, ease: 'easeOut' }
            }
          >
            <GlassCard className="h-full overflow-hidden">
              <ContactInfoPanel data={CONTACT_DATA} />
            </GlassCard>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 40 }}
            animate={
              show || reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }
            }
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.55, delay: 0.3, ease: 'easeOut' }
            }
          >
            <GlassCard className="overflow-hidden">
              <ContactForm form={form} reduceMotion={reduceMotion} />
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <Snackbar
        open={form.snackbar.open}
        autoHideDuration={5000}
        onClose={form.closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={form.closeSnackbar}
          severity={form.snackbar.severity}
          variant="filled"
          sx={{ width: '100%', fontFamily: '"Space Grotesk", sans-serif' }}
        >
          {form.snackbar.message}
        </Alert>
      </Snackbar>
    </section>
  )
}

export default Contact
