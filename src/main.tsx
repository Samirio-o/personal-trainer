import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { appTheme } from './theme'
import Layout from './components/Layout'
import CustomersPage from './pages/CustomersPage'
import TrainingsPage from './pages/TrainingsPage'
import CalendarPage from './pages/CalendarPage'
import StatisticsPage from './pages/StatisticsPage'

// Each page renders inside Layout's <Outlet />, so the header and navigation
// stay fixed while only the page content changes when the URL changes.
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            // The root path shows the customers page by default.
            { index: true, element: <CustomersPage /> },
            { path: 'customers', element: <CustomersPage /> },
            { path: 'trainings', element: <TrainingsPage /> },
            { path: 'calendar', element: <CalendarPage /> },
            { path: 'statistics', element: <StatisticsPage /> },
        ],
    },
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            {/* RouterProvider replaces the old single <App /> render, since the
                page shown now depends on the current URL. */}
            <RouterProvider router={router} />
        </ThemeProvider>
    </StrictMode>,
)