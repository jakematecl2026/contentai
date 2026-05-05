import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Auth() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('mode') === 'login' ? 'login' : 'signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signUp, signIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/app')
  }, [user])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup') {
      if (!name.trim()) { setError('Ingresa tu nombre.'); setLoading(false); return }
      const { error: err } = await signUp(email, password, name)
      if (err) setError(err.message)
      else setSuccess('Revisa tu email para confirmar tu cuenta, luego inicia sesión.')
    } else {
      const { error: err } = await signIn(email, password)
      if (err) setError(err.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos.' : err.message)
      else navigate('/app')
    }
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo} onClick={() => navigate('/')}>Content<em>AI</em></div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`} onClick={() => { setMode('signup'); setError(''); setSuccess('') }}>
            Crear cuenta
          </button>
          <button className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`} onClick={() => { setMode('login'); setError(''); setSuccess('') }}>
            Iniciar sesión
          </button>
        </div>

        {success ? (
          <div className={styles.success}>{success}</div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {mode === 'signup' && (
              <div className="field">
                <label className="field-label">Tu nombre</label>
                <input className="field-input" type="text" placeholder="Ej: María González" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div className="field">
              <label className="field-label">Email</label>
              <input className="field-input" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label className="field-label">Contraseña</label>
              <input className="field-input" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button className="btn btn-full" type="submit" disabled={loading}>
              {loading ? <><div className="spinner" />Procesando...</> : mode === 'signup' ? 'Crear cuenta gratis' : 'Iniciar sesión'}
            </button>

            {mode === 'signup' && (
              <p className={styles.terms}>Al crear tu cuenta aceptas nuestros términos de uso.</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
