import { lazy, Suspense } from 'react'
import { useOutletContext } from 'react-router'
import type { LayoutContext } from '../components/Layout'

const TrainingCalendar = lazy(() => import('../components/TrainingCalendar'))

function CalendarPage() {
    const { trainingVersion } = useOutletContext<LayoutContext>()

    return (
        <section className="dashboard-card">
            <Suspense fallback={<p>Loading calendar...</p>}>
                <TrainingCalendar refreshKey={trainingVersion} />
            </Suspense>
        </section>
    )
}

export default CalendarPage