import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import type { EventInput } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { getTrainings } from '../services/trainingService'

// Loads all trainings once and turns each one into a calendar event.
function TrainingCalendar() {
    const [events, setEvents] = useState<EventInput[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getTrainings()
            .then(trainings => {
                // The event title shows the activity and the customer's name.
                const calendarEvents = trainings.map(training => ({
                    id: String(training.id),
                    title: `${training.activity} — ${training.customer.firstname} ${training.customer.lastname}`,
                    start: training.date,
                }))
                setEvents(calendarEvents)
            })
            .catch((reason: unknown) => {
                const message = reason instanceof Error
                    ? reason.message
                    : 'An unexpected error occurred'
                setError(message)
            })
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <Paper component="section" elevation={2} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h2" component="h2" gutterBottom>
                Training calendar
            </Typography>

            {isLoading && <CircularProgress aria-label="Loading calendar" />}
            {error && <Alert severity="error">{error}</Alert>}

            {!isLoading && !error && (
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    buttonText={{
                        today: 'Today',
                        month: 'Month',
                        week: 'Week',
                        day: 'Day',
                    }}
                    events={events}
                    height="auto"
                />
            )}
        </Paper>
    )
}

export default TrainingCalendar