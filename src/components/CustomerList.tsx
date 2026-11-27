import { useCallback, useEffect, useState } from 'react'
import type { Customer, CustomerInput } from '../types/customer'
import {
    createCustomer,
    deleteCustomer,
    getCustomers,
    updateCustomer,
} from '../services/customerService'
import CustomerForm from './CustomerForm'

function CustomerList() {
    // These states track the list, loading/errors, and which form is open.
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

    // Fetches the latest list after the page opens or a customer changes.
    const loadCustomers = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const customerList = await getCustomers()
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

    // Runs the first customer request when this component appears.
    useEffect(() => {
        void loadCustomers()
    }, [loadCustomers])

    // Chooses create or update based on whether a customer is being edited.
    async function handleSave(data: CustomerInput) {
        if (editingCustomer) {
            await updateCustomer(editingCustomer._links.self.href, data)
        } else {
            await createCustomer(data)
        }

        setIsFormOpen(false)
        setEditingCustomer(null)
        await loadCustomers()
    }

    // Confirms the destructive action before calling the API.
    async function handleDelete(customer: Customer) {
        const name = `${customer.firstname} ${customer.lastname}`
        const confirmed = window.confirm(`Delete ${name} and their trainings?`)

        if (!confirmed) {
            return
        }

        try {
            setError(null)
            await deleteCustomer(customer._links.self.href)
            await loadCustomers()
        } catch (reason: unknown) {
            const message = reason instanceof Error
                ? reason.message
                : 'An unexpected error occurred'
            setError(message)
        }
    }

    function openAddForm() {
        setEditingCustomer(null)
        setIsFormOpen(true)
    }

    function openEditForm(customer: Customer) {
        setEditingCustomer(customer)
        setIsFormOpen(true)
    }

    function closeForm() {
        setIsFormOpen(false)
        setEditingCustomer(null)
    }

    return (
        <section>
            <div>
                <h2>Customers</h2>
                <button type="button" onClick={openAddForm}>
                    Add customer
                </button>
            </div>

            {isFormOpen && (
                <CustomerForm
                    customer={editingCustomer ?? undefined}
                    onSave={handleSave}
                    onCancel={closeForm}
                />
            )}

            {error && <p role="alert">{error}</p>}

            {isLoading ? (
                <p>Loading customers...</p>
            ) : customers.length === 0 ? (
                <p>No customers found. You can add the first customer.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">City</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer._links.self.href}>
                                <td>{customer.firstname} {customer.lastname}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.city}</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => openEditForm(customer)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => void handleDelete(customer)}
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

export default CustomerList