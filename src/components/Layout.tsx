import { Link, NavLink, Outlet } from 'react-router'
import { useState } from 'react'
import '../App.css'

// Shared with the pages below via useOutletContext.
export type LayoutContext = {
    trainingVersion: number,
    bumpTrainingVersion: () => void,
}

function Layout() {
    // Incremented whenever a training is added or deleted, so the calendar and
    // statistics pages reload fresh data without needing a page refresh.
    const [trainingVersion, setTrainingVersion] = useState(0)
    const bumpTrainingVersion = () => setTrainingVersion(v => v + 1)

    return (
        <main className="app-shell" id="top">
            <header className="app-header">
                <Link className="brand" to="/" aria-label="Pulse home">
                    <span className="brand-mark">PT</span>
                    <span className="brand-name">
                        <strong>Pulse</strong>
                        <small>PERSONAL TRAINER</small>
                    </span>
                </Link>

                <nav className="main-nav" aria-label="Main navigation">
                    <NavLink to="/customers">Customers</NavLink>
                    <NavLink to="/trainings">Trainings</NavLink>
                    <NavLink to="/calendar">Calendar</NavLink>
                    <NavLink to="/statistics">Statistics</NavLink>
                </nav>
            </header>

            <div className="dashboard-content">
                <Outlet context={{ trainingVersion, bumpTrainingVersion }} />
            </div>
        </main>
    )
}

export default Layout