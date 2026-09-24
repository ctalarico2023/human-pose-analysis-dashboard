function Home({ onOpenDashboard }) {
  return (
    <section className="page home-page">
      <div className="hero-panel">
        <p className="eyebrow">Engineering Design 2</p>
        <h1>Review and organize human pose analysis records</h1>
        <p className="lede">
          This dashboard will store session notes, camera views, and joint
          key-point summaries so you can look back at saved analyses in one
          place. Pose estimation itself is handled separately; this app is the
          record-keeping front end.
        </p>
        <button type="button" className="btn btn-primary" onClick={onOpenDashboard}>
          Open dashboard
        </button>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <h2>Saved sessions</h2>
          <p>
            Each record will represent one captured movement session, including
            the date, camera view, and how many joints were tracked.
          </p>
        </article>
        <article className="feature-card">
          <h2>Simple review</h2>
          <p>
            View, edit, add, and delete controls are laid out on the dashboard
            so those actions can be connected to a database later.
          </p>
        </article>
        <article className="feature-card">
          <h2>Signed-in dashboard</h2>
          <p>
            The home page stays public. Opening the dashboard requires an
            account so saved records can later be tied to the signed-in user.
          </p>
        </article>
      </div>
    </section>
  )
}

export default Home
