import type { Customer } from '../types/customer'

// Escapes quotes and wraps each value so commas do not break CSV columns.
function formatCsvValue(value: string): string {
    return `"${value.replaceAll('"', '""')}"`
}

export function exportCustomersToCsv(customers: Customer[]): void {
    // These are the customer fields to include; API links and UI actions are excluded.
    const headers = [
        'First name',
        'Last name',
        'Email',
        'Phone',
        'Street address',
        'Postcode',
        'City',
    ]

    const rows = customers.map(customer => [
        customer.firstname,
        customer.lastname,
        customer.email,
        customer.phone,
        customer.streetaddress,
        customer.postcode,
        customer.city,
    ].map(formatCsvValue).join(','))

    const csvContent = [headers.join(','), ...rows].join('\r\n')
    const csvFile = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8',
    })
    const downloadUrl = URL.createObjectURL(csvFile)
    const downloadLink = document.createElement('a')

    // Starts the browser download, then releases the temporary file URL.
    downloadLink.href = downloadUrl
    downloadLink.download = 'customers.csv'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0)
}