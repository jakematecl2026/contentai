import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './AppLayout.module.css'

const NAV = [
  { to: '/app', label: 'Dashboard', icon: '⊞', end: true },
  { to: '/app/brand', label: 'Mi marca', icon: '◈' },
  null,
  { to: '/app/carousel', label: 'Carrusel', icon: '▦', free: true },
  { to: '/app/caption', label: 'Caption', icon: '✎', free: true },
  { to: '/app/reel', label: 'Script Reel', icon: '▶', pro: true },
  { to: '/app/plan', label: 'Plan mensual', icon: '◫', pro: true },
  { to: '/app/sequence', label: 'Secuencia', icon: '→', pro: true },
  null,
  { to: '/app/history', label: 'Historial', icon: '◷' },
]

export default function AppLayout() {
  const { user, profile, brand, signOut, isPro } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className={styles.layout}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>Content<em>AI</em></span>
          <span className={`badge ${isPro ? 'badge-pro' : 'badge-free'}`}>
            {isPro ? 'Pro' : 'Gratis'}
          </span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userName}>{profile?.full_name || user?.email}</span>
          <button className="btn btn-sec" style={{ padding: '7px 14px', fontSize: '10px' }} onClick={handleSignOut}>
            Salir
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sbSection}>
            <div className={styles.sbLabel}>Navegación</div>
            {NAV.map((item, i) => {
              if (!item) return <div key={i} className={styles.sbDivider} />
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `${styles.sbItem} ${isActive ? styles.sbActive : ''} ${item.pro && !isPro ? styles.sbLocked : ''}`
                  }
                >
                  <span className={styles.sbIcon}>{item.icon}</span>
                  <span className={styles.sbLabel2}>{item.label}</span>
                  {item.pro && !isPro && <span className={styles.sbPro}>Pro</span>}
                </NavLink>
              )
            })}
          </div>

          <div className={styles.sbBrandBox}>
            <div className={styles.sbBrandName}>{brand?.name || 'Sin marca configurada'}</div>
            <div className={styles.sbBrandNiche}>{brand?.niche || 'Configura tu marca →'}</div>
          </div>
        </aside>

        {/* MAIN */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
