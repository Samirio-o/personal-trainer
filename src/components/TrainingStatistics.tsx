import { useEffect, useState } from 'react'
import { groupBy, sumBy } from 'lodash'
import {
    Alert,
    CircularProgress,
    Paper,
    Typography,
} from '@mui/material'
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import type { Training } from '../types/training'
import { getTrainings } from '../services/trainingService'

function TrainingStatistics() {
    const [trainings, setTrainings] = useState<Training[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Loads sessions once so the chart reflects the data returned by the API.
    useEffect(() => {
        getTrainings()
            .then(setTrainings)
            .catch((reason: unknown) => {
                const message = reason instanceof Error
                    ? reason.message
                    : 'An unexpected error occurred'
                setError(message)
            })
            .finally(() => setIsLoading(false))
    }, [])

    // Groups sessions by activity and adds their durations in minutes.
    const minutesByActivity = Object.entries(
        groupBy(trainings, training => training.activity),
    ).map(([activity, sessions]) => ({
        activity,
        minutes: sumBy(sessions, session => session.duration),
    }))

    return (
        <Paper component="section" elevation={2} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h2" component="h2" gutterBottom>
                Training statistics
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                Total training minutes by activity
            </Typography>

            {isLoading && <CircularProgress aria-label="Loading statistics" />}
            {error && <Alert severity="error">{error}</Alert>}

            {!isLoading && !error && minutesByActivity.length === 0 && (
                <Typography>No training data available yet.</Typography>
            )}

            {!isLoading && !error && minutesByActivity.length > 0 && (
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={minutesByActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="activity" />
                        <YAxis
                            allowDecimals={false}
                            label={{
                                value: 'Minutes',
                                angle: -90,
                                position: 'insideLeft',
                            }}
                        />
                        <Tooltip />
                        <Bar dataKey="minutes" fill="#1976d2" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Paper>
    )
}

export default TrainingStatistics