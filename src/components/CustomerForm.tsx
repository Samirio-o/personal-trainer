import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Customer, CustomerInput } from '../types/customer'

type CustomerFormProps = {
    customer?: Customer,
    onSave: (data: CustomerInput) => Promise<void>,
    onCancel: () => void,
}

// Maps each customer property to the label shown in the form.
const fields: {
    name: keyof CustomerInput,
    label: string,
    type?: string,
}[] = [
    { name: 'firstname', label: 'First name' },
    { name: 'lastname', label: 'Last name' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone' },
    { name: 'streetaddress', label: 'Street address' },
    { name: 'postcode', label: 'Postcode' },
    { name: 'city', label: 'City' },
]

function CustomerForm({ customer, onSave, onCancel }: CustomerFormProps) {
    // Prefills the fields when editing; otherwise starts with an empty form.
    const [formData, setFormData] = useState<CustomerInput>({
        firstname: customer?.firstname ?? '',
        lastname: customer?.lastname ?? '',
        email: customer?.email ?? '',
        phone: customer?.phone ?? '',
        streetaddress: customer?.streetaddress ?? '',
        postcode: customer?.postcode ?? '',
        city: customer?.city ?? '',
    })
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        // Keep the user on this page while the form is submitted.
        event.preventDefault()
        setError(null)
        setIsSaving(true)

        try {
            await onSave(formData)
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
            <h2>{customer ? 'Edit customer' : 'Add customer'}</h2>

            {fields.map(field => (
                <label key={field.name}>
                    {field.label}
                    <input
                        name={field.name}
                        type={field.type ?? 'text'}
                        required
                        value={formData[field.name]}
                        onChange={event => setFormData({
                            ...formData,
                            [field.name]: event.target.value,
                        })}
                    />
                </label>
            ))}

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : customer ? 'Save changes' : 'Add customer'}
            </button>
            <button type="button" onClick={onCancel} disabled={isSaving}>
                Cancel
            </button>
        </form>
    )
}

export default CustomerForm