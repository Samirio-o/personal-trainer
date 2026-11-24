import { useState } from 'react';
import type { Customer } from '../types/customer';

function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([])
}

export default CustomerList;