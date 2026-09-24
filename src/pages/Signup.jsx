import { useState } from 'react'
import { useAuth } from '../context/AuthProvider.jsx'

function Signup({ onSuccess, onGoToLogin }) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)

    const { data, error: signUpError } = await signUp(email, password)
    setSubmitting(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      onSuccess()
      return
    }

    setInfo(
      'Account created. Check your email to confirm the address, then log in.',
    )
  }

  return (
    <section className="page auth-page">
      <div className="auth-panel">
        <p className="eyebrow">Account</p>
        <h1>Sign up</h1>
        <p className="lede">
          Create an account with an email and password to open the dashboard.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="form-field">
            Password
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          {info ? <p className="form-info">{info}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button type="button" className="text-link" onClick={onGoToLogin}>
            Log in
          </button>
        </p>
      </div>
    </section>
  )
}

export default Signup
