import { lazy, Suspense } from 'react'
import './App.css'
import CustomerList from './components/CustomerList'
import TrainingList from './components/TrainingList'

// Load the larger calendar and chart only when the app needs them.
const TrainingCalendar = lazy(() => import('./components/TrainingCalendar'))
const TrainingStatistics = lazy(() => import('./components/TrainingStatistics'))

function App() {
    return (
        <main>
            <h1>Personal Trainer</h1>

            {/* Customer and training lists stay available on the main page. */}
            <CustomerList />
            <TrainingList />

            {/* React displays this message while loading the larger components. */}
            <Suspense fallback={<p>Loading calendar and statistics...</p>}>
                <TrainingCalendar />
                <TrainingStatistics />
            </Suspense>
        </main>
    )
}

export default App