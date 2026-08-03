import CircularProgress from '@mui/material/CircularProgress'
import { motion } from 'framer-motion'
import ContactField from './ContactField'

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.35 + i * 0.05, duration: 0.4 },
  }),
}

const SubmitButton = ({ disabled, sending, reduceMotion }) => {
  const btn = (
    <button
      type="submit"
      disabled={disabled}
      data-cursor="hover"
      className="flex h-14 w-full items-center justify-center gap-2 rounded-xl
        bg-gradient-to-br from-[var(--mint)] to-[var(--skyblue)]
        font-['Space_Grotesk'] text-lg font-semibold text-white
        transition-shadow disabled:cursor-not-allowed disabled:opacity-50
        enabled:hover:shadow-[0_0_24px_rgba(110,231,183,0.4)]"
    >
      {sending ? (
        <>
          <CircularProgress size={20} color="inherit" />
          Sending...
        </>
      ) : (
        'Send Message →'
      )}
    </button>
  )

  if (reduceMotion) return btn

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.4 } }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
    >
      {btn}
    </motion.div>
  )
}

const ContactForm = ({ form, reduceMotion }) => {
  const {
    formRef,
    values,
    errors,
    sending,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
    fieldMeta,
  } = form

  const fields = [
    { name: 'from_name', label: 'Full Name', type: 'text' },
    { name: 'from_email', label: 'Email Address', type: 'email' },
    { name: 'subject', label: 'Subject', type: 'text', inputProps: { maxLength: 80 } },
  ]

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 p-6 md:p-8"
    >
      <input type="hidden" name="reply_to" value={values.reply_to || values.from_email} />

      {fields.map((f, i) => (
        <ContactField
          key={f.name}
          {...f}
          value={values[f.name]}
          error={errors[f.name]}
          meta={fieldMeta(f.name)}
          onChange={handleChange}
          onBlur={handleBlur}
          variants={reduceMotion ? undefined : fieldVariants}
          custom={i}
          reduceMotion={reduceMotion}
        />
      ))}

      <ContactField
        name="message"
        label="Message"
        value={values.message}
        error={errors.message}
        meta={fieldMeta('message')}
        onChange={handleChange}
        onBlur={handleBlur}
        multiline
        rows={5}
        inputProps={{ maxLength: 1000 }}
        helperExtra={`${values.message.length}/1000`}
        variants={reduceMotion ? undefined : fieldVariants}
        custom={3}
        reduceMotion={reduceMotion}
      />

      <SubmitButton
        disabled={!isFormValid || sending}
        sending={sending}
        reduceMotion={reduceMotion}
      />
    </form>
  )
}

export default ContactForm
