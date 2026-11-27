import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Customer } from '../types/customer'
import type { TrainingInput } from '../types/training'

import type { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

type TrainingFormProps = {
    customers: Customer[],
    onSave: (training: TrainingInput) => Promise<void>,
    onCancel: () => void,
}

function TrainingForm({ customers, onSave, onCancel }: TrainingFormProps) {
    // Collects the selected date, activity, duration, and customer API link.
    const [activity, setActivity] = useState('')
    const [duration, setDuration] = useState('')
    const [customerUrl, setCustomerUrl] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    // Keeps the selected date for the MUI date-time picker.
    const [date, setDate] = useState<Dayjs | null>(null)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!date || !date.isValid()) {
            setError('Please select a valid training date and time.')
            return
        }
        setError(null)
        setIsSaving(true)

        try {
            // The API expects duration as a number and customer as a resource URL.
            await onSave({
                date: date.toISOString(),
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

            {/* MUI picker lets the user choose the training date and time. */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label="Date and time"
                    value={date}
                    onChange={newDate => setDate(newDate)}
                    slotProps={{ textField: { required: true } }}
                />
            </LocalizationProvider>

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