import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: '"Noto Sans", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF2A9E',
    },
    secondary: {
      main: '#0f3685',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#170f3a',
      paper: '#170f3a',
    },
    divider: 'rgba(255, 255, 255, 0.30)',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.7rem',
        }
      }
    }
  }
});

export default theme;
