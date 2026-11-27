import './App.css'
import CustomerList from './components/CustomerList'
import TrainingList from './components/TrainingList'
import TrainingCalendar from './components/TrainingCalendar'

function App() {
    return (
        <main>
            <h1>Personal Trainer</h1>

            {/* The app keeps customer and training management on one page. */}
            <CustomerList />
            <TrainingList />
            {/* Shows all scheduled trainings in month, week, and day views. */}
            <TrainingCalendar />
        </main>
    )
}

export default App