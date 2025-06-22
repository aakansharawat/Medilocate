import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A nice, standard blue
    },
    secondary: {
      main: '#dc004e', // A vibrant pink/magenta for contrast
    },
    background: {
      default: '#f4f6f8', // A very light grey for the background
      paper: '#ffffff', // White for paper elements like cards
    },
    text: {
        primary: '#333333',
        secondary: '#555555'
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 'bold'
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }
        }
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
        }
    }
  }
});

export default theme; 