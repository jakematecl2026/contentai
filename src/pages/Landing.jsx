import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Landing.module.css'

const FEATURES = [
  { icon: '◈', name: 'Perfil de marca propio', desc: 'Define tu voz, cliente ideal y nicho una sola vez. Todo el contenido se adapta a tu negocio específico.', tag: 'Gratis' },
  { icon: '▦', name: 'Carruseles con IA', desc: '10 slides completos con estructura probada: hook, problema, sistema y CTA. Generados en 2 minutos.', tag: 'Gratis · 3/mes' },
  { icon: '✎', name: 'Captions que convierten', desc: 'Caption para feed, versión corta para stories y hashtags segmentados para tu nicho.', tag: 'Gratis · 5/mes' },
  { icon: '▶', name: 'Scripts de Reels', desc: 'Scripts de 30–45 segundos listos para grabar. Con hook visual, 3 puntos y CTA incluido.', tag: 'Pro', pro: true },
  { icon: '◫', name: 'Plan mensual', desc: '4 semanas completas con lógica algorítmica. Cada post tiene formato, gancho y objetivo definidos.', tag: 'Pro', pro: true },
  { icon: '→', name: 'Secuencia de ataque', desc: 'Orden algorítmico para tus próximos 10 posts. Cada publicación construye sobre la anterior.', tag: 'Pro', pro: true },
]

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.navLogo}>Content<em>AI</em></div>
        <div className={styles.navRight}>
          <button className={styles.navLink} onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}>Precios</button>
          {user
            ? <button className="btn" onClick={() => navigate('/app')}>Ir al dashboard</button>
            : <>
                <button className={styles.navLink} onClick={() => navigate('/auth?mode=login')}>Iniciar sesión</button>
                <button className="btn" onClick={() => navigate('/auth')}>Empezar gratis</button>
              </>
          }
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <p className={styles.heroEye}>Potenciado por Inteligencia Artificial</p>
        <h1 className={styles.heroH1}>Crea contenido que<br /><em>vende.</em> En minutos.</h1>
        <p className={styles.heroSub}>Define tu marca una vez. La IA genera carruseles, captions, scripts de reels y planes de contenido adaptados específicamente a tu negocio y tu audiencia.</p>
        <div className={styles.heroBtns}>
          <button className="btn" style={{ padding: '15px 36px' }} onClick={() => navigate('/auth')}>Empezar gratis — sin tarjeta</button>
          <button className="btn btn-sec" style={{ padding: '15px 36px' }} onClick={() => navigate('/auth?mode=login')}>Ya tengo cuenta</button>
        </div>
        <div className={styles.heroStats}>
          {[['60', 'Ideas listas'], ['10', 'Slides / carrusel'], ['5', 'Herramientas'], ['2min', 'Por carrusel']].map(([n, l]) => (
            <div key={l} className={styles.hstat}>
              <div className={styles.hstatN}>{n}</div>
              <div className={styles.hstatL}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <p className="section-eye" style={{ textAlign: 'center' }}>Lo que incluye</p>
        <h2 className={styles.featTitle}>Una suite <em>completa</em><br />para tu contenido</h2>
        <div className={styles.featGrid}>
          {FEATURES.map(f => (
            <div key={f.name} className={styles.featCell}>
              <div className={styles.featIcon}>{f.icon}</div>
              <div className={styles.featName}>{f.name}</div>
              <div className={styles.featDesc}>{f.desc}</div>
              <span className={`badge ${f.pro ? 'badge-pro' : 'badge-free'}`}>{f.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.pricing} id="pricing">
        <p className="section-eye" style={{ textAlign: 'center' }}>Planes</p>
        <h2 className={styles.featTitle}>Sin contratos.<br /><em>Sin complicaciones.</em></h2>
        <div className={styles.priceGrid}>
          <div className={styles.priceCell}>
            <div className={styles.planLabel}>Gratis</div>
            <div className={styles.priceN}>$0<span>/mes</span></div>
            <div className={styles.priceDesc}>Para empezar y ver resultados antes de comprometerte.</div>
            <ul className={styles.priceList}>
              {['1 perfil de marca personalizado', '3 carruseles por mes', '5 captions por mes', '60 ideas disponibles', 'Diseño visual personalizable'].map(i => (
                <li key={i} className={styles.priceItem}>{i}</li>
              ))}
              {['Plan de contenidos mensual', 'Scripts de Reels', 'Secuencia algorítmica', 'Historial ilimitado'].map(i => (
                <li key={i} className={`${styles.priceItem} ${styles.locked}`}>{i}</li>
              ))}
            </ul>
            <button className="btn btn-sec btn-full" onClick={() => navigate('/auth')}>Empezar gratis</button>
          </div>
          <div className={`${styles.priceCell} ${styles.proCeil}`}>
            <div className={`${styles.planLabel} ${styles.proLabel}`}>Pro</div>
            <div className={styles.priceN}>$19<span>USD/mes</span></div>
            <div className={styles.priceDesc}>Para negocios que publican con sistema y quieren resultados predecibles.</div>
            <ul className={styles.priceList}>
              {['Todo lo del plan gratis', 'Carruseles y captions ilimitados', 'Plan de contenidos mensual', 'Scripts de Reels ilimitados', 'Secuencia algorítmica', 'Historial completo', 'Soporte prioritario'].map(i => (
                <li key={i} className={styles.priceItem}>{i}</li>
              ))}
            </ul>
            <button className="btn btn-full" onClick={() => navigate('/auth')}>Empezar con Pro</button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Content<em>AI</em></div>
        <div className={styles.footerSub}>Powered by Jake Mate · Inteligencia Digital</div>
      </footer>
    </div>
  )
}
