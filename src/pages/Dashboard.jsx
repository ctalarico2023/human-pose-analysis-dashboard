import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthProvider.jsx'
import { supabase } from '../lib/supabaseClient.js'

const STATUS_OPTIONS = ['Draft', 'In review', 'Complete']

const EXAMPLE_KEYPOINTS = {
  nose: { x: 512, y: 238, confidence: 0.97 },
  left_shoulder: { x: 450, y: 320, confidence: 0.94 },
}

const EMPTY_FORM = {
  title: '',
  image_name: '',
  model: '',
  camera_view: '',
  joints_tracked: '',
  status: 'Draft',
  notes: '',
  keypoints: '',
}

function Dashboard() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [loadingRecords, setLoadingRecords] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [mode, setMode] = useState('list')
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!user) {
      return undefined
    }

    let cancelled = false

    async function loadRecords() {
      setLoadingRecords(true)
      setLoadError('')

      const { data, error } = await supabase
        .from('pose_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (cancelled) {
        return
      }

      if (error) {
        setLoadError(error.message || 'Could not load pose analysis records.')
      } else {
        setRecords(data ?? [])
      }

      setLoadingRecords(false)
    }

    loadRecords()

    return () => {
      cancelled = true
    }
  }, [user, reloadKey])

  const selectedRecord = records.find((record) => record.id === selectedId) ?? null

  function refreshRecords() {
    setReloadKey((current) => current + 1)
  }

  function closePanel() {
    setMode('list')
    setSelectedId(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  function openCreate() {
    setMode('create')
    setSelectedId(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setPendingDeleteId(null)
  }

  function openView(record) {
    setMode('view')
    setSelectedId(record.id)
    setFormError('')
    setPendingDeleteId(null)
  }

  function openEdit(record) {
    setMode('edit')
    setSelectedId(record.id)
    setForm(recordToForm(record))
    setFormError('')
    setPendingDeleteId(null)
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function useExampleKeypoints() {
    setForm((current) => ({
      ...current,
      keypoints: JSON.stringify(EXAMPLE_KEYPOINTS, null, 2),
    }))
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (!user) {
      setFormError('You must be signed in to save a record.')
      return
    }

    const { payload, error: validationError } = buildPayload(form)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setSaving(true)

    if (mode === 'create') {
      const { error } = await supabase.from('pose_analyses').insert({
        ...payload,
        user_id: user.id,
      })

      setSaving(false)

      if (error) {
        setFormError(error.message || 'Could not create the record.')
        return
      }
    } else {
      const { error } = await supabase
        .from('pose_analyses')
        .update(payload)
        .eq('id', selectedId)
        .eq('user_id', user.id)

      setSaving(false)

      if (error) {
        setFormError(error.message || 'Could not update the record.')
        return
      }
    }

    closePanel()
    refreshRecords()
  }

  async function handleDelete(record) {
    if (!user) {
      setLoadError('You must be signed in to delete a record.')
      return
    }

    setDeletingId(record.id)
    setLoadError('')

    const { error } = await supabase
      .from('pose_analyses')
      .delete()
      .eq('id', record.id)
      .eq('user_id', user.id)

    setDeletingId(null)

    if (error) {
      setLoadError(error.message || 'Could not delete the record.')
      return
    }

    if (selectedId === record.id) {
      closePanel()
    }

    setPendingDeleteId(null)
    refreshRecords()
  }

  return (
    <section className="page dashboard-page">
      <div className="page-heading">
        <div>
          <h1>Pose analysis records</h1>
          <p className="signed-in-as">Signed in as {user?.email}</p>
          <p className="lede">
            Records saved to your account are listed below. Add a pose analysis,
            or view, edit, and delete one that is already saved.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          Add record
        </button>
      </div>

      {loadError ? (
        <div className="banner-error" role="alert">
          <p>{loadError}</p>
          <button type="button" className="btn btn-secondary" onClick={refreshRecords}>
            Try again
          </button>
        </div>
      ) : null}

      {mode === 'create' || mode === 'edit' ? (
        <form className="editor-panel" onSubmit={handleSubmit}>
          <h2>{mode === 'create' ? 'Add a record' : 'Edit record'}</h2>
          <div className="editor-grid">
            <label className="form-field">
              Title
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                required
              />
            </label>
            <label className="form-field">
              Status
              <select name="status" value={form.status} onChange={updateField}>
                {statusOptionsFor(form.status).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              Image name
              <input
                name="image_name"
                value={form.image_name}
                onChange={updateField}
                placeholder="session-photo.jpg"
              />
            </label>
            <label className="form-field">
              Model
              <input
                name="model"
                value={form.model}
                onChange={updateField}
                placeholder="MoveNet"
              />
            </label>
            <label className="form-field">
              Camera view
              <input
                name="camera_view"
                value={form.camera_view}
                onChange={updateField}
                placeholder="Side"
              />
            </label>
            <label className="form-field">
              Joints tracked
              <input
                name="joints_tracked"
                type="number"
                min="0"
                step="1"
                value={form.joints_tracked}
                onChange={updateField}
              />
            </label>
            <label className="form-field full">
              Notes
              <textarea
                name="notes"
                rows="3"
                value={form.notes}
                onChange={updateField}
              />
            </label>
            <label className="form-field full">
              Keypoints
              <textarea
                name="keypoints"
                rows="8"
                value={form.keypoints}
                onChange={updateField}
                placeholder='{"nose": {"x": 512, "y": 238, "confidence": 0.97}}'
                spellCheck="false"
              />
            </label>
          </div>
          <p className="field-hint">
            Keypoints are stored as JSON. Leave the field blank if this record
            does not have keypoints yet.
          </p>
          {formError ? (
            <p className="form-error" role="alert">
              {formError}
            </p>
          ) : null}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : mode === 'create' ? 'Create record' : 'Save changes'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={useExampleKeypoints}
            >
              Use example keypoints
            </button>
            <button type="button" className="btn btn-secondary" onClick={closePanel}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {mode === 'view' && selectedRecord ? (
        <RecordDetails
          record={selectedRecord}
          onEdit={() => openEdit(selectedRecord)}
          onClose={closePanel}
        />
      ) : null}

      {loadingRecords && records.length === 0 ? (
        <p className="status-message">Loading records…</p>
      ) : null}

      {!loadingRecords && records.length === 0 && !loadError ? (
        <p className="status-message">No pose analysis records yet.</p>
      ) : null}

      <div className="record-list">
        {records.map((record) => (
          <article
            key={record.id}
            className={
              record.id === selectedId ? 'record-card selected' : 'record-card'
            }
          >
            <div className="record-main">
              <div className="record-title-row">
                <h2>{record.title}</h2>
                <span className={`status status-${slug(record.status)}`}>
                  {record.status || 'Draft'}
                </span>
              </div>
              <dl className="record-meta">
                <div>
                  <dt>Recorded</dt>
                  <dd>{formatRecordedOn(record.created_at)}</dd>
                </div>
                <div>
                  <dt>Joints tracked</dt>
                  <dd>{formatJoints(record.joints_tracked)}</dd>
                </div>
                <div>
                  <dt>Camera view</dt>
                  <dd>{record.camera_view || '—'}</dd>
                </div>
              </dl>
              <p className="record-notes">
                {record.notes || 'No notes for this record.'}
              </p>
            </div>
            <div className="record-actions">
              {pendingDeleteId === record.id ? (
                <>
                  <p className="confirm-text">Delete this record?</p>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(record)}
                    disabled={deletingId === record.id}
                  >
                    {deletingId === record.id ? 'Deleting…' : 'Confirm'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setPendingDeleteId(null)}
                    disabled={deletingId === record.id}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => openView(record)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => openEdit(record)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setPendingDeleteId(record.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function RecordDetails({ record, onEdit, onClose }) {
  const keypointsText = formatKeypoints(record.keypoints)

  return (
    <section className="editor-panel" aria-label="Record details">
      <div className="record-title-row">
        <h2>{record.title}</h2>
        <span className={`status status-${slug(record.status)}`}>
          {record.status || 'Draft'}
        </span>
      </div>
      <dl className="detail-list">
        <div>
          <dt>Recorded</dt>
          <dd>{formatRecordedOn(record.created_at)}</dd>
        </div>
        <div>
          <dt>Image name</dt>
          <dd>{record.image_name || '—'}</dd>
        </div>
        <div>
          <dt>Model</dt>
          <dd>{record.model || '—'}</dd>
        </div>
        <div>
          <dt>Camera view</dt>
          <dd>{record.camera_view || '—'}</dd>
        </div>
        <div>
          <dt>Joints tracked</dt>
          <dd>{formatJoints(record.joints_tracked)}</dd>
        </div>
        <div className="full">
          <dt>Notes</dt>
          <dd>{record.notes || '—'}</dd>
        </div>
      </dl>
      <p className="detail-label">Keypoints</p>
      {keypointsText ? (
        <pre className="keypoints-block">{keypointsText}</pre>
      ) : (
        <p className="record-notes">No keypoints stored.</p>
      )}
      <div className="form-actions">
        <button type="button" className="btn btn-primary" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </section>
  )
}

function recordToForm(record) {
  return {
    title: record.title ?? '',
    image_name: record.image_name ?? '',
    model: record.model ?? '',
    camera_view: record.camera_view ?? '',
    joints_tracked:
      record.joints_tracked == null || record.joints_tracked === ''
        ? ''
        : String(record.joints_tracked),
    status: record.status || 'Draft',
    notes: record.notes ?? '',
    keypoints: formatKeypoints(record.keypoints),
  }
}

function statusOptionsFor(currentStatus) {
  if (!currentStatus || STATUS_OPTIONS.includes(currentStatus)) {
    return STATUS_OPTIONS
  }
  return [currentStatus, ...STATUS_OPTIONS]
}

function buildPayload(form) {
  const title = form.title.trim()
  if (!title) {
    return { payload: null, error: 'Title is required.' }
  }

  let jointsTracked = null
  const jointsText = String(form.joints_tracked).trim()
  if (jointsText !== '') {
    const parsedJoints = Number(jointsText)
    if (!Number.isInteger(parsedJoints) || parsedJoints < 0) {
      return {
        payload: null,
        error: 'Joints tracked must be a whole number zero or greater.',
      }
    }
    jointsTracked = parsedJoints
  }

  const keypointsText = form.keypoints.trim()
  let keypoints = null
  if (keypointsText !== '') {
    try {
      keypoints = JSON.parse(keypointsText)
    } catch {
      return {
        payload: null,
        error: 'Keypoints must be valid JSON.',
      }
    }
  }

  return {
    payload: {
      title,
      image_name: form.image_name.trim(),
      model: form.model.trim(),
      camera_view: form.camera_view.trim(),
      joints_tracked: jointsTracked,
      status: form.status,
      notes: form.notes.trim(),
      keypoints,
    },
    error: '',
  }
}

function formatKeypoints(value) {
  if (value == null || value === '') {
    return ''
  }

  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }

  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function formatRecordedOn(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatJoints(value) {
  if (value == null || value === '') {
    return '—'
  }
  return String(value)
}

function slug(value) {
  return String(value || 'draft')
    .toLowerCase()
    .replace(/\s+/g, '-')
}

export default Dashboard
