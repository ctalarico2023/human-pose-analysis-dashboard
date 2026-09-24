import { useState } from 'react'
import { useAuth } from '../context/AuthProvider.jsx'

function Login({ onSuccess, onGoToSignup }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: signInError } = await signIn(email, password)
    setSubmitting(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    onSuccess()
  }

  return (
    <section className="page auth-page">
      <div className="auth-panel">
        <p className="eyebrow">Account</p>
        <h1>Log in</h1>
        <p className="lede">
          Sign in with the email and password for your dashboard account.
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
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          Need an account?{' '}
          <button type="button" className="text-link" onClick={onGoToSignup}>
            Sign up
          </button>
        </p>
      </div>
    </section>
  )
}

export default Login
