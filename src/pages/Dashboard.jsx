import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { profile, brand, isPro, canCarousel, canCaption, upgradeToPro } = useAuth()
  const navigate = useNavigate()

  const carouselUsed = profile?.carousel_count || 0
  const captionUsed = profile?.caption_count || 0

  return (
    <div className="fade-up">
      <p className="section-eye">Bienvenido</p>
      <h1 className="section-title">
        Hola, <em>{profile?.full_name?.split(' ')[0] || 'ahí'}</em>
      </h1>
      <p className="section-desc">
        {brand ? `Todo listo para crear contenido para ${brand.name}.` : 'Configura tu marca para empezar a crear contenido inteligente.'}
      </p>

      {!brand && (
        <div className={styles.noBrand} onClick={() => navigate('/app/brand')}>
          <div className={styles.noBrandIcon}>◈</div>
          <div>
            <div className={styles.noBrandTitle}>Configura tu marca primero</div>
            <div className={styles.noBrandDesc}>Define tu voz, cliente ideal y nicho para que la IA genere contenido adaptado a tu negocio.</div>
          </div>
          <div className={styles.noBrandArrow}>→</div>
        </div>
      )}

      {/* STATS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Carruseles creados</div>
          <div className={styles.statVal}>{carouselUsed}</div>
          <div className={styles.statSub}>{isPro ? 'Ilimitados (Pro)' : `de 3 disponibles este mes`}</div>
          {!isPro && <div className={styles.statBar}><div className={styles.statFill} style={{ width: `${Math.min((carouselUsed/3)*100, 100)}%` }} /></div>}
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Captions generados</div>
          <div className={styles.statVal}>{captionUsed}</div>
          <div className={styles.statSub}>{isPro ? 'Ilimitados (Pro)' : `de 5 disponibles este mes`}</div>
          {!isPro && <div className={styles.statBar}><div className={styles.statFill} style={{ width: `${Math.min((captionUsed/5)*100, 100)}%` }} /></div>}
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Ideas disponibles</div>
          <div className={styles.statVal}>60</div>
          <div className={styles.statSub}>en 10 categorías de tu nicho</div>
        </div>
        <div className={styles.statCell}>
          <div className={styles.statLabel}>Plan activo</div>
          <div className={styles.statVal} style={{ fontSize: 22 }}>{isPro ? 'Pro' : 'Gratis'}</div>
          <div className={styles.statSub}>{isPro ? 'Acceso completo' : 'Actualiza para desbloquear todo'}</div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className={styles.actionsGrid}>
        <div className={styles.action} onClick={() => navigate('/app/carousel')}>
          <div className={styles.actionIcon}>▦</div>
          <div className={styles.actionName}>Crear carrusel</div>
          <div className={styles.actionDesc}>10 slides con IA en 2 minutos</div>
          {!canCarousel && <div className={styles.actionLock}>Límite alcanzado</div>}
        </div>
        <div className={styles.action} onClick={() => navigate('/app/caption')}>
          <div className={styles.actionIcon}>✎</div>
          <div className={styles.actionName}>Crear caption</div>
          <div className={styles.actionDesc}>Feed + Stories + Hashtags</div>
          {!canCaption && <div className={styles.actionLock}>Límite alcanzado</div>}
        </div>
        <div className={styles.action} onClick={() => navigate('/app/brand')}>
          <div className={styles.actionIcon}>◈</div>
          <div className={styles.actionName}>{brand ? 'Editar marca' : 'Configurar marca'}</div>
          <div className={styles.actionDesc}>Voz, tono, cliente ideal</div>
        </div>
        <div className={`${styles.action} ${!isPro ? styles.actionPro : ''}`} onClick={() => isPro ? navigate('/app/reel') : null}>
          <div className={styles.actionIcon}>▶</div>
          <div className={styles.actionName}>Script Reel</div>
          <div className={styles.actionDesc}>30–45 segundos, listo para grabar</div>
          {!isPro && <div className={styles.actionLock}>Pro</div>}
        </div>
        <div className={`${styles.action} ${!isPro ? styles.actionPro : ''}`} onClick={() => isPro ? navigate('/app/plan') : null}>
          <div className={styles.actionIcon}>◫</div>
          <div className={styles.actionName}>Plan mensual</div>
          <div className={styles.actionDesc}>4 semanas completas</div>
          {!isPro && <div className={styles.actionLock}>Pro</div>}
        </div>
        <div className={`${styles.action} ${!isPro ? styles.actionPro : ''}`} onClick={() => isPro ? navigate('/app/sequence') : null}>
          <div className={styles.actionIcon}>→</div>
          <div className={styles.actionName}>Secuencia</div>
          <div className={styles.actionDesc}>Orden algorítmico de 10 posts</div>
          {!isPro && <div className={styles.actionLock}>Pro</div>}
        </div>
      </div>

      {/* UPGRADE BANNER */}
      {!isPro && (
        <div className={styles.upgradeBanner}>
          <div>
            <div className={styles.upgradeTitle}>Desbloquea la suite completa</div>
            <div className={styles.upgradeDesc}>Scripts de Reels, plan mensual, secuencia algorítmica y contenido ilimitado por $19 USD/mes.</div>
          </div>
          <button className="btn" onClick={upgradeToPro}>Actualizar a Pro — $19/mes</button>
        </div>
      )}
    </div>
  )
}
