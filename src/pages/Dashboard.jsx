import { sampleRecords } from '../data/sampleRecords.js'
import { useAuth } from '../context/AuthProvider.jsx'

function Dashboard() {
  const { user } = useAuth()

  return (
    <section className="page dashboard-page">
      <div className="page-heading">
        <div>
          <h1>Pose analysis records</h1>
          <p className="signed-in-as">Signed in as {user?.email}</p>
          <p className="lede">
            Sample records are shown below so the layout is visible. View, edit,
            add, and delete actions are placeholders and do not save changes
            yet.
          </p>
        </div>
        <button type="button" className="btn btn-primary">
          Add record
        </button>
      </div>

      <div className="record-list">
        {sampleRecords.map((record) => (
          <article key={record.id} className="record-card">
            <div className="record-main">
              <div className="record-title-row">
                <h2>{record.title}</h2>
                <span className={`status status-${slug(record.status)}`}>
                  {record.status}
                </span>
              </div>
              <dl className="record-meta">
                <div>
                  <dt>Recorded</dt>
                  <dd>{record.recordedOn}</dd>
                </div>
                <div>
                  <dt>Joints tracked</dt>
                  <dd>{record.jointsTracked}</dd>
                </div>
                <div>
                  <dt>Camera view</dt>
                  <dd>{record.cameraView}</dd>
                </div>
              </dl>
              <p className="record-notes">{record.notes}</p>
            </div>
            <div className="record-actions">
              <button type="button" className="btn btn-secondary">
                View
              </button>
              <button type="button" className="btn btn-secondary">
                Edit
              </button>
              <button type="button" className="btn btn-danger">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function slug(value) {
  return value.toLowerCase().replace(/\s+/g, '-')
}

export default Dashboard
