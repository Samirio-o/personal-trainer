import { lazy, Suspense } from 'react'
import { useOutletContext } from 'react-router'
import type { LayoutContext } from '../components/Layout'

const TrainingList = lazy(() => import('../components/TrainingList'))

function TrainingsPage() {
    const { bumpTrainingVersion } = useOutletContext<LayoutContext>()

    return (
        <section className="dashboard-card">
            <Suspense fallback={<p>Loading trainings...</p>}>
                <TrainingList onTrainingsChanged={bumpTrainingVersion} />
            </Suspense>
        </section>
    )
}

export default TrainingsPage