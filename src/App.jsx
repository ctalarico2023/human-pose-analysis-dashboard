import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import { useAuth } from './context/AuthProvider.jsx'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const { user, loading } = useAuth()

  useEffect(() => {
    if (currentView === 'dashboard' && !loading && !user) {
      setCurrentView('login')
    }
  }, [currentView, loading, user])

  function goToDashboard() {
    setCurrentView('dashboard')
  }

  let page
  if (currentView === 'home') {
    page = <Home onOpenDashboard={goToDashboard} />
  } else if (currentView === 'login') {
    page = (
      <Login
        onSuccess={goToDashboard}
        onGoToSignup={() => setCurrentView('signup')}
      />
    )
  } else if (currentView === 'signup') {
    page = (
      <Signup
        onSuccess={goToDashboard}
        onGoToLogin={() => setCurrentView('login')}
      />
    )
  } else if (loading) {
    page = (
      <section className="page">
        <p className="lede">Checking your session…</p>
      </section>
    )
  } else if (!user) {
    page = (
      <Login
        onSuccess={goToDashboard}
        onGoToSignup={() => setCurrentView('signup')}
      />
    )
  } else {
    page = <Dashboard />
  }

  return (
    <div className="app-shell">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      <main>{page}</main>
    </div>
  )
}

export default App
