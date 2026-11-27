// HAL links identify API resources through URLs instead of a separate id field.
export type ApiLink = {
    href: string,
}

// Customer data returned by the API, including links to related resources.
export type Customer = {
    firstname: string,
    lastname: string,
    streetaddress: string,
    postcode: string,
    city: string,
    email: string,
    phone: string,
    _links: {
        self: ApiLink,
        customer: ApiLink,
        trainings: ApiLink,
    },
}

// Data sent when creating or updating a customer; API links are not sent.
export type CustomerInput = Omit<Customer, '_links'>