import { useState } from 'react'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home')

  return (
    <div className="app-shell">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      <main>
        {currentView === 'home' ? (
          <Home onOpenDashboard={() => setCurrentView('dashboard')} />
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  )
}

export default App
