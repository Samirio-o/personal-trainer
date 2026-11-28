import { lazy, Suspense } from 'react'
import { useOutletContext } from 'react-router'
import type { LayoutContext } from '../components/Layout'

const TrainingStatistics = lazy(() => import('../components/TrainingStatistics'))

function StatisticsPage() {
    const { trainingVersion } = useOutletContext<LayoutContext>()

    return (
        <section className="dashboard-card">
            <Suspense fallback={<p>Loading statistics...</p>}>
                <TrainingStatistics refreshKey={trainingVersion} />
            </Suspense>
        </section>
    )
}

export default StatisticsPage