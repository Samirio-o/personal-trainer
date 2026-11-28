import { lazy, Suspense } from 'react'

const CustomerList = lazy(() => import('../components/CustomerList'))

function CustomersPage() {
    return (
        <>
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

            <section className="dashboard-card">
                <Suspense fallback={<p>Loading customers...</p>}>
                    <CustomerList />
                </Suspense>
            </section>
        </>
    )
}

export default CustomersPage