import type { Training, TrainingInput } from '../types/training'
import { API_URL } from './api'

// The /gettrainings endpoint returns an array with customer details included.
export async function getTrainings(): Promise<Training[]> {
    const response = await fetch(`${API_URL}/gettrainings`)

    // Pass API errors to the component so it can display a message.
    if (!response.ok) {
        throw new Error(`Unable to load trainings (${response.status})`)
    }

    return await response.json() as Training[]
}

// Creates a training linked to the customer's API URL.
export async function createTraining(training: TrainingInput): Promise<void> {
    const response = await fetch(`${API_URL}/trainings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(training),
    })

    // A failed response must not be treated as a successful save.
    if (!response.ok) {
        throw new Error(`Unable to create training (${response.status})`)
    }
}

// Deletes a training by its numeric API id.
export async function deleteTraining(trainingId: number): Promise<void> {
    const response = await fetch(`${API_URL}/trainings/${trainingId}`, {
        method: 'DELETE',
    })

    // The API returns 204 when deletion succeeds; no response body is needed.
    if (!response.ok) {
        throw new Error(`Unable to delete training (${response.status})`)
    }
}