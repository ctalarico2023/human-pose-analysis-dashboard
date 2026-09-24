function Header({ currentView, onNavigate }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <p className="brand">Human Pose Analysis Dashboard</p>
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
      </div>
    </header>
  )
}

export default Header
