import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import type { Customer } from '../types/customer'
import type { Training, TrainingInput } from '../types/training'
import { getCustomers } from '../services/customerService'
import {
    createTraining,
    deleteTraining,
    getTrainings,
} from '../services/trainingService'
import dayjs from 'dayjs'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import ConfirmDialog from './ConfirmDialog'

// Load the date-picker form only when the user opens it.
const TrainingForm = lazy(() => import('./TrainingForm'))

type TrainingListProps = {
    onTrainingsChanged?: () => void,
}

function TrainingList({ onTrainingsChanged }: TrainingListProps) {
    // Stores the data needed by the table and the customer selector.
    const [trainings, setTrainings] = useState<Training[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null)

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

    const search = searchTerm.trim().toLocaleLowerCase()
    const filteredTrainings = trainings.filter(training =>
        [
            training.activity,
            training.customer.firstname,
            training.customer.lastname,
        ].some(value => value.toLocaleLowerCase().includes(search)),
    )

    // Creates the training, closes the form, and refreshes the table.
    async function handleSave(training: TrainingInput) {
        await createTraining(training)
        setIsFormOpen(false)
        await loadData()
        onTrainingsChanged?.()
    }

    // Opens the confirm dialog for the selected training.
    function requestDelete(training: Training) {
        setTrainingToDelete(training)
    }

    // Confirms deletion because removing a training cannot be undone.
    async function confirmDelete() {
        if (!trainingToDelete) {
            return
        }

        try {
            setError(null)
            await deleteTraining(trainingToDelete.id)
            await loadData()
            onTrainingsChanged?.()
        } catch (reason: unknown) {
            const message = reason instanceof Error
                ? reason.message
                : 'An unexpected error occurred'
            setError(message)
        } finally {
            setTrainingToDelete(null)
        }
    }

    const columns: GridColDef<Training>[] = [
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            minWidth: 150,
            valueFormatter: (value: string) => dayjs(value).format('DD.MM.YYYY HH:mm'),
        },
        { field: 'activity', headerName: 'Activity', flex: 1, minWidth: 120 },
        {
            field: 'duration',
            headerName: 'Duration',
            flex: 0.7,
            minWidth: 100,
            valueFormatter: (value: number) => `${value} min`,
        },
        {
            field: 'customer',
            headerName: 'Customer',
            flex: 1,
            minWidth: 140,
            valueGetter: (_value, row) =>
                `${row.customer.firstname} ${row.customer.lastname}`,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.6,
            minWidth: 100,
            sortable: false,
            filterable: false,
            renderCell: params => (
                <button type="button" onClick={() => requestDelete(params.row)}>
                    Delete
                </button>
            ),
        },
    ]

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

            <label>
                Search trainings
                <input
                    type="search"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    placeholder="Activity or customer name..."
                />
            </label>

            <div style={{ height: 520, width: '100%' }}>
                <DataGrid
                    rows={filteredTrainings}
                    columns={columns}
                    getRowId={training => training.id}
                    loading={isLoading}
                    autoPageSize
                    disableRowSelectionOnClick
                />
            </div>

            <ConfirmDialog
                open={trainingToDelete !== null}
                title="Delete training"
                message={trainingToDelete
                    ? `Delete ${trainingToDelete.activity} for ${trainingToDelete.customer.firstname} ${trainingToDelete.customer.lastname}?`
                    : ''}
                onConfirm={() => void confirmDelete()}
                onCancel={() => setTrainingToDelete(null)}
            />
        </section>
    )
}


export default TrainingList