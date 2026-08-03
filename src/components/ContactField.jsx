import { FiCheck, FiX } from 'react-icons/fi'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { motion } from 'framer-motion'

export const fieldSx = {
  '& .MuiInputBase-root': {
    color: '#f1f5f9',
    backgroundColor: 'transparent',
    caretColor: 'var(--mint)',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  '& .MuiInputLabel-root': {
    color: '#94a3b8',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--mint)' },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255,255,255,0.15)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255,255,255,0.25)',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--mint)',
    borderWidth: 2,
  },
  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: '#f87171',
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"Space Grotesk", sans-serif',
  },
  '& .MuiFormHelperText-root.Mui-error': {
    color: '#f87171',
  },
  '& .MuiFormHelperText-root:not(.Mui-error)': {
    color: '#94a3b8',
  },
  '& .MuiInputLabel-asterisk': { color: 'var(--yellow)' },
}

const StatusIcon = ({ showValid, showInvalid }) => {
  if (showValid) {
    return <FiCheck className="text-[var(--green)]" aria-hidden="true" size={18} />
  }
  if (showInvalid) {
    return <FiX className="text-[#f87171]" aria-hidden="true" size={18} />
  }
  return null
}

const ContactField = ({
  name,
  label,
  value,
  error,
  meta,
  onChange,
  onBlur,
  multiline = false,
  rows,
  type = 'text',
  inputProps,
  helperExtra,
  variants,
  custom = 0,
  reduceMotion,
}) => {
  const field = (
    <TextField
      fullWidth
      required
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={meta.showError}
      helperText={meta.showError ? error : helperExtra || ' '}
      multiline={multiline}
      rows={rows}
      inputProps={{
        'data-cursor': 'hover',
        ...inputProps,
      }}
InputProps={{
          'data-cursor': 'hover',
          endAdornment: (
            <InputAdornment position="end">
              <StatusIcon showValid={meta.showValid} showInvalid={meta.showInvalid} />
            </InputAdornment>
          ),
        }}
      sx={fieldSx}
    />
  )

  if (reduceMotion || !variants) return <div>{field}</div>

  return (
    <motion.div variants={variants} custom={custom} initial="hidden" animate="visible">
      {field}
    </motion.div>
  )
}

export default ContactField
