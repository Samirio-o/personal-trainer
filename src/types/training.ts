// Customer details returned with a training by the /gettrainings endpoint.
export type TrainingCustomer = {
    id: number,
    firstname: string,
    lastname: string,
}

// Training data returned by the API, including its associated customer.
export type Training = {
    id: number,
    date: string,
    duration: number,
    activity: string,
    customer: TrainingCustomer,
}

// Data sent to the API when adding a training; customer is its API URL.
export type TrainingInput = {
    date: string,
    duration: number,
    activity: string,
    customer: string,
}