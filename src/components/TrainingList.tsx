import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import type { Customer } from '../types/customer'
import type { Training, TrainingInput } from '../types/training'
import { getCustomers } from '../services/customerService'
import {
    createTraining,
    deleteTraining,
    getTrainings,
} from '../services/trainingService'


function TrainingList() {
    // Stores the data needed by the table and the customer selector.
    const [trainings, setTrainings] = useState<Training[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    // Load the date-picker form only when the user opens it.
    const TrainingForm = lazy(() => import('./TrainingForm'))

    // Loads both datasets together so the list and form stay in sync.
    const loadData = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const [trainingList, customerList] = await Promise.all([
                getTrainings(),
                getCustomers(),
            ])
            setTrainings(trainingList)
            setCustomers(customerList)
        } catch (reason: unknown) {
            const message = reason instanceof Error
                ? reason.message
                : 'An unexpected error occurred'
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Gets the latest data when the training section first appears.
    useEffect(() => {
        void loadData()
    }, [loadData])

    // Creates the training, closes the form, and refreshes the table.
    async function handleSave(training: TrainingInput) {
        await createTraining(training)
        setIsFormOpen(false)
        await loadData()
    }

    // Confirms deletion because removing a training cannot be undone.
    async function handleDelete(training: Training) {
        const confirmed = window.confirm(
            `Delete ${training.activity} for ${training.customer.firstname} ${training.customer.lastname}?`,
        )

        if (!confirmed) {
            return
        }

        try {
            setError(null)
            await deleteTraining(training.id)
            await loadData()
        } catch (reason: unknown) {
            const message = reason instanceof Error
                ? reason.message
                : 'An unexpected error occurred'
            setError(message)
        }
    }

    return (
        <section>
            <h2>Trainings</h2>

            <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                disabled={customers.length === 0}
            >
                Add training
            </button>

            {customers.length === 0 && !isLoading && (
                <p>Add a customer before scheduling a training.</p>
            )}

            {isFormOpen && (
                <Suspense fallback={<p>Loading training form...</p>}>
                    <TrainingForm
                        customers={customers}
                        onSave={handleSave}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </Suspense>
            )}

            {error && <p role="alert">{error}</p>}

            {isLoading ? (
                <p>Loading trainings...</p>
            ) : trainings.length === 0 ? (
                <p>No trainings found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Activity</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainings.map(training => (
                            <tr key={training.id}>
                                <td>{new Date(training.date).toLocaleString()}</td>
                                <td>{training.activity}</td>
                                <td>{training.duration} min</td>
                                <td>
                                    {training.customer.firstname} {training.customer.lastname}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => void handleDelete(training)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    )
}

export default TrainingList