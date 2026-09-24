import { useAuth } from '../context/AuthProvider.jsx'

function Header({ currentView, onNavigate }) {
  const { user, signOut } = useAuth()

  async function handleLogout() {
    await signOut()
    onNavigate('home')
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <p className="brand">Human Pose Analysis Dashboard</p>
        <div className="header-controls">
          <nav className="main-nav" aria-label="Primary">
            <button
              type="button"
              className={currentView === 'home' ? 'nav-link active' : 'nav-link'}
              onClick={() => onNavigate('home')}
            >
              Home
            </button>
            <button
              type="button"
              className={
                currentView === 'dashboard' ? 'nav-link active' : 'nav-link'
              }
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </button>
          </nav>
          {user ? (
            <button type="button" className="btn btn-secondary" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <nav className="main-nav" aria-label="Account">
              <button
                type="button"
                className={
                  currentView === 'login' ? 'nav-link active' : 'nav-link'
                }
                onClick={() => onNavigate('login')}
              >
                Log in
              </button>
              <button
                type="button"
                className={
                  currentView === 'signup' ? 'nav-link active' : 'nav-link'
                }
                onClick={() => onNavigate('signup')}
              >
                Sign up
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
