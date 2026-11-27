import { createTheme } from '@mui/material/styles'

// Defines the shared dark palette and button styling for the app.
export const appTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#c7f36b',
            contrastText: '#17200c',
        },
        secondary: {
            main: '#42d6c3',
        },
        background: {
            default: '#0d110f',
            paper: '#171d19',
        },
        text: {
            primary: '#f1f5ef',
            secondary: '#a4afa7',
        },
        divider: 'rgba(255, 255, 255, 0.1)',
    },
    shape: {
        borderRadius: 14,
    },
    typography: {
        fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
        h1: {
            fontWeight: 800,
            letterSpacing: '-0.04em',
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.025em',
        },
        button: {
            fontWeight: 700,
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    paddingInline: 16,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
})