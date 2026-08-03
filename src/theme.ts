import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a78bfa',
      light: '#c4b5fd',
      dark: '#7c3aed',
    },
    secondary: {
      main: '#22d3ee',
      light: '#67e8f9',
      dark: '#0891b2',
    },
    background: {
      default: '#0a0a0f',
      paper: 'rgba(255, 255, 255, 0.08)',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
    error: {
      main: '#f472b6',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.15)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#a78bfa',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#9ca3af',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#c4b5fd',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 28px',
          fontSize: '1rem',
        },
        contained: {
          background: 'linear-gradient(135deg, #9333ea, #ec4899, #22d3ee)',
          backgroundSize: '200% 200%',
          boxShadow: '0 8px 24px rgba(147, 51, 234, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7c3aed, #db2777, #06b6d4)',
            boxShadow: '0 12px 32px rgba(147, 51, 234, 0.45)',
          },
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(20, 20, 30, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          fontFamily: '"Space Grotesk", sans-serif',
        },
      },
    },
  },
})

export default theme
