import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Customer } from '../types/customer'
import type { TrainingInput } from '../types/training'

type TrainingFormProps = {
    customers: Customer[],
    onSave: (training: TrainingInput) => Promise<void>,
    onCancel: () => void,
}

// Converts the selected local date and time to the ISO format used by the API.
function toIsoDate(localDateTime: string): string {
    return new Date(localDateTime).toISOString()
}

function TrainingForm({ customers, onSave, onCancel }: TrainingFormProps) {
    // Collects the selected date, activity, duration, and customer API link.
    const [date, setDate] = useState('')
    const [activity, setActivity] = useState('')
    const [duration, setDuration] = useState('')
    const [customerUrl, setCustomerUrl] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setIsSaving(true)

        try {
            // The API expects duration as a number and customer as a resource URL.
            await onSave({
                date: toIsoDate(date),
                activity,
                duration: Number(duration),
                customer: customerUrl,
            })
        } catch (reason: unknown) {
            const message = reason instanceof Error
                ? reason.message
                : 'An unexpected error occurred'
            setError(message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add training</h2>

            <label>
                Date and time
                <input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={event => setDate(event.target.value)}
                />
            </label>

            <label>
                Activity
                <input
                    type="text"
                    required
                    value={activity}
                    onChange={event => setActivity(event.target.value)}
                />
            </label>

            <label>
                Duration (minutes)
                <input
                    type="number"
                    min="1"
                    required
                    value={duration}
                    onChange={event => setDuration(event.target.value)}
                />
            </label>

            <label>
                Customer
                <select
                    required
                    value={customerUrl}
                    onChange={event => setCustomerUrl(event.target.value)}
                >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                        <option
                            key={customer._links.self.href}
                            value={customer._links.self.href}
                        >
                            {customer.firstname} {customer.lastname}
                        </option>
                    ))}
                </select>
            </label>

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={isSaving || customers.length === 0}>
                {isSaving ? 'Saving...' : 'Add training'}
            </button>
            <button type="button" onClick={onCancel} disabled={isSaving}>
                Cancel
            </button>
        </form>
    )
}

export default TrainingForm