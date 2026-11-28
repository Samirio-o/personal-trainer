import { lazy, Suspense, useState } from 'react'
import './App.css'

const CustomerList = lazy(() => import('./components/CustomerList'))
const TrainingList = lazy(() => import('./components/TrainingList'))
const TrainingCalendar = lazy(() => import('./components/TrainingCalendar'))
const TrainingStatistics = lazy(() => import('./components/TrainingStatistics'))

function App() {
    // Incremented whenever a training is added or deleted, so the calendar and
    // statistics sections reload fresh data without needing a page refresh.
    const [trainingVersion, setTrainingVersion] = useState(0)

    return (
        <main className="app-shell" id="top">
            {/* Brand and anchor links make the main sections easy to reach. */}
            <header className="app-header">
                <a className="brand" href="#top" aria-label="Pulse home">
                    <span className="brand-mark">PT</span>
                    <span className="brand-name">
                        <strong>Pulse</strong>
                        <small>PERSONAL TRAINER</small>
                    </span>
                </a>

                <nav className="main-nav" aria-label="Main navigation">
                    <a href="#customers">Customers</a>
                    <a href="#trainings">Trainings</a>
                    <a href="#calendar">Calendar</a>
                    <a href="#statistics">Statistics</a>
                </nav>
            </header>

            <div className="dashboard-content">
                {/* Introduces the dashboard and the tools it contains. */}
                <section className="welcome-panel">
                    <div>
                        <p className="eyebrow">TRAINING MANAGEMENT</p>
                        <h1>Build stronger routines.</h1>
                        <p className="welcome-copy">
                            Manage your clients, sessions and training progress in one place.
                        </p>
                    </div>
                    <span className="welcome-badge" aria-hidden="true">MOVE<br />BETTER</span>
                </section>

                {/* Each section has an anchor target for the navigation above. */}
                <section id="customers" className="dashboard-card">
                    <Suspense fallback={<p>Loading customers...</p>}>
                        <CustomerList />
                    </Suspense>
                </section>

                <section id="trainings" className="dashboard-card">
                    <Suspense fallback={<p>Loading trainings...</p>}>
                        <TrainingList onTrainingsChanged={() => setTrainingVersion(v => v + 1)} />
                    </Suspense>
                </section>

                <section id="calendar" className="dashboard-card">
                    <Suspense fallback={<p>Loading calendar...</p>}>
                        <TrainingCalendar refreshKey={trainingVersion} />
                    </Suspense>
                </section>

                <section id="statistics" className="dashboard-card">
                    <Suspense fallback={<p>Loading statistics...</p>}>
                        <TrainingStatistics refreshKey={trainingVersion} />
                    </Suspense>
                </section>
            </div>
        </main>
    )
}

export default App