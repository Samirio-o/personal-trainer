import type { Customer, CustomerInput } from '../types/customer'
import { API_URL } from './api'

// The API wraps the customer list inside _embedded.customers.
type CustomersResponse = {
    _embedded: {
        customers: Customer[],
    },
}

// Loads all customers and returns only the list used by the UI.
export async function getCustomers(): Promise<Customer[]> {
    const response = await fetch(`${API_URL}/customers`)

    if (!response.ok) {
        throw new Error(`Unable to load customers (${response.status})`)
    }

    const data = await response.json() as CustomersResponse
    return data._embedded.customers
}

// Sends a new customer to the API.
export async function createCustomer(customer: CustomerInput): Promise<void> {
    const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
    })

    // Report API errors so the form can show that saving failed.
    if (!response.ok) {
        throw new Error(`Unable to create customer (${response.status})`)
    }
}

// Updates an existing customer using its API resource URL.
export async function updateCustomer(
    customerUrl: string,
    customer: CustomerInput,
): Promise<void> {
    const response = await fetch(customerUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
    })

    // Report API errors instead of treating a failed update as successful.
    if (!response.ok) {
        throw new Error(`Unable to update customer (${response.status})`)
    }
}

// Deletes a customer using the API URL in the customer's self link.
export async function deleteCustomer(customerUrl: string): Promise<void> {
    const response = await fetch(customerUrl, {
        method: 'DELETE',
    })

    // A non-success response means the customer was not deleted.
    if (!response.ok) {
        throw new Error(`Unable to delete customer (${response.status})`)
    }
}