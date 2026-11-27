import './App.css'
import CustomerList from './components/CustomerList'
import TrainingList from './components/TrainingList'
import TrainingCalendar from './components/TrainingCalendar'
import TrainingStatistics from './components/TrainingStatistics'

function App() {
    return (
        <main>
            <h1>Personal Trainer</h1>

            {/* The app keeps customer and training management on one page. */}
            <CustomerList />
            <TrainingList />
            {/* Shows all scheduled trainings in month, week, and day views. */}
            <TrainingCalendar />
            {/* Shows total training minutes grouped by activity. */}
            <TrainingStatistics />
        </main>
    )
}

export default App