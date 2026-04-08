import { createTheme } from '@mui/material/styles';

const SIDEBAR_NAVY = '#1a2035';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#6366f1',
    },
    background: {
      default: '#f8f9fc',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: SIDEBAR_NAVY,
          color: '#ffffff',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: '1px solid #e8ebf0',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        sizeSmall: {
          fontSize: 11,
          fontWeight: 500,
          height: 24,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: 11,
          fontWeight: 600,
          color: '#8892a4',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.04em',
          borderBottom: '1px solid #e8ebf0',
        },
        body: {
          fontSize: 13,
          borderBottom: '1px solid #f0f2f5',
        },
      },
    },
  },
});

export default theme;
