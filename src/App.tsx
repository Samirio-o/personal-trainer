import CustomerList from './components/CustomerList'
import TrainingList from './components/TrainingList'
import './App.css'

function App() {
    return (
        <main>
            <h1>Personal Trainer</h1>

            {/* The app keeps customer and training management on one page. */}
            <CustomerList />
            <TrainingList />
        </main>
    )
}

export default App