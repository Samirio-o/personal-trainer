import { useCallback, useEffect, useState } from 'react'
import type { Customer, CustomerInput } from '../types/customer'
import {
    createCustomer,
    deleteCustomer,
    getCustomers,
    updateCustomer,
} from '../services/customerService'
import { exportCustomersToCsv } from '../utils/exportCustomers'
import CustomerForm from './CustomerForm'
import ConfirmDialog from './ConfirmDialog'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'


function CustomerList() {
    // These states track the list, loading/errors, and which form is open.
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)

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

    // Filters customers across their contact and address details.
    const search = searchTerm.trim().toLocaleLowerCase()
    const filteredCustomers = customers.filter(customer =>
        [
            customer.firstname,
            customer.lastname,
            customer.email,
            customer.phone,
            customer.streetaddress,
            customer.postcode,
            customer.city,
        ].some(value => value.toLocaleLowerCase().includes(search)),
    )

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

    // Opens the confirm dialog for the selected customer.
    function requestDelete(customer: Customer) {
        setCustomerToDelete(customer)
    }

    // Runs after the user confirms deletion in the dialog.
    async function confirmDelete() {
        if (!customerToDelete) {
            return
        }

        try {
            setError(null)
            await deleteCustomer(customerToDelete._links.self.href)
            await loadCustomers()
        } catch (reason: unknown) {
            const message = reason instanceof Error
                ? reason.message
                : 'An unexpected error occurred'
            setError(message)
        } finally {
            setCustomerToDelete(null)
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

    // DataGrid provides sorting when the user clicks a sortable column heading.
    const columns: GridColDef<Customer>[] = [
        { field: 'firstname', headerName: 'First name', flex: 1, minWidth: 120 },
        { field: 'lastname', headerName: 'Last name', flex: 1, minWidth: 120 },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'city', headerName: 'City', flex: 1, minWidth: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 160,
            sortable: false,
            filterable: false,
            renderCell: params => (
                <>
                    <button type="button" onClick={() => openEditForm(params.row)}>
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => requestDelete(params.row)}
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ]

    return (
        <section>
            <div>
                <h2>Customers</h2>
                <button type="button" onClick={openAddForm}>
                    Add customer
                </button>

                {/* Exports only customer details, not the table's action buttons. */}
                <button
                    type="button"
                    onClick={() => exportCustomersToCsv(customers)}
                    disabled={customers.length === 0}
                >
                    Export CSV
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

            <label>
                Search customers
                <input
                    type="search"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    placeholder="Name, email, phone, city..."
                />
            </label>

            <div style={{ height: 520, width: '100%' }}>
                <DataGrid
                    rows={filteredCustomers}
                    columns={columns}
                    getRowId={customer => customer._links.self.href}
                    loading={isLoading}
                    autoPageSize
                    disableRowSelectionOnClick
                />
            </div>

            <ConfirmDialog
                open={customerToDelete !== null}
                title="Delete customer"
                message={customerToDelete
                    ? `Delete ${customerToDelete.firstname} ${customerToDelete.lastname} and their trainings?`
                    : ''}
                onConfirm={() => void confirmDelete()}
                onCancel={() => setCustomerToDelete(null)}
            />
        </section>
    )
}

export default CustomerList