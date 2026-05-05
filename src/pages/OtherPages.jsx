import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { generateReel, generatePlan, generateSequence } from '../lib/ai'
import { supabase } from '../lib/supabase'
import ProGate from '../components/ProGate'

export function Reel() {
  const { brand, isPro, saveCreation } = useAuth()
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState('')
  const [saved, setSaved] = useState(false)
  if (!isPro) return <ProGate tool="Script de Reel" />
  async function handleGenerate() {
    setLoading(true); setScript(''); setSaved(false)
    try { setScript(await generateReel(brand, topic)) }
    catch { setScript('Error generando el script. Intenta de nuevo.') }
    setLoading(false)
  }
  return (
    <div className="fade-up">
      <p className="section-eye">Herramienta 03 · Pro</p>
      <h1 className="section-title">Script de <em>Reel</em></h1>
      <p className="section-desc">Script de 30–45 segundos con hook visual, 3 puntos y CTA. Listo para grabar.</p>
      <div className="field"><label className="field-label">Tema del Reel</label><input className="field-input" placeholder="Ej: Por qué tu publicidad no funcionó" value={topic} onChange={e => setTopic(e.target.value)} /></div>
      <button className="btn" disabled={loading || !topic.trim()} onClick={handleGenerate}>{loading ? <><div className="spinner" />Generando...</> : 'Generar script →'}</button>
      {script && (
        <>
          <div style={{ marginTop: 20, border: '1.5px solid var(--bor)' }}>
            <div style={{ background: 'var(--mid)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)' }}>Script completo</span>
              <button className="btn btn-sec" style={{ padding: '4px 10px', fontSize: 9 }} onClick={() => navigator.clipboard.writeText(script).then(() => alert('Copiado'))}>Copiar</button>
            </div>
            <div style={{ padding: 20, fontSize: 13, color: 'var(--cr)', lineHeight: 1.9, whiteSpace: 'pre-wrap', background: 'rgba(255,255,255,.02)' }}>{script}</div>
          </div>
          <div style={{ marginTop: 12 }}><button className="btn" disabled={saved} onClick={async () => { await saveCreation('reel', topic, { script }); setSaved(true) }}>{saved ? '✓ Guardado' : 'Guardar'}</button></div>
        </>
      )}
    </div>
  )
}

export function Plan() {
  const { brand, isPro, saveCreation } = useAuth()
  const [loading, setLoading] = useState(false)
  const [weeks, setWeeks] = useState([])
  const [saved, setSaved] = useState(false)
  if (!isPro) return <ProGate tool="Plan mensual" />
  async function handleGenerate() {
    setLoading(true); setWeeks([]); setSaved(false)
    try { setWeeks(await generatePlan(brand)) }
    catch { setWeeks([]) }
    setLoading(false)
  }
  const fmtColor = { Carrusel: 'var(--burg)', Reel: 'rgba(255,255,255,.15)', Imagen: 'var(--mid)' }
  return (
    <div className="fade-up">
      <p className="section-eye">Herramienta 04 · Pro</p>
      <h1 className="section-title">Plan de contenidos <em>mensual</em></h1>
      <p className="section-desc">4 semanas completas con lógica algorítmica. Formato, gancho y objetivo por cada post.</p>
      <button className="btn" disabled={loading} onClick={handleGenerate}>{loading ? <><div className="spinner" />Construyendo plan...</> : 'Generar plan →'}</button>
      {weeks.map((w, wi) => (
        <div key={wi} style={{ marginTop: 24 }}>
          <div style={{ background: 'var(--mid)', padding: '14px 20px', display: 'flex', gap: 16, alignItems: 'center', border: '1px solid var(--bor)' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 40, color: 'var(--burg)', opacity: .5, lineHeight: 1 }}>{w.week}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 16, color: 'var(--cr)' }}>Semana {w.week}{w.theme ? ` — ${w.theme}` : ''}</div>
          </div>
          {(w.posts || []).map((p, pi) => (
            <div key={pi} style={{ display: 'grid', gridTemplateColumns: '56px 1fr', border: '1px solid var(--bor)', borderTop: 'none' }}>
              <div style={{ background: 'rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 8px' }}>
                <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)' }}>{(p.day||'').substring(0,3)}</div>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', padding: '2px 8px', background: fmtColor[p.format]||'var(--mid)', color: 'var(--cr)' }}>{p.format}</span>
                  <span style={{ fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--red)', border: '1px solid rgba(122,12,46,.3)', padding: '2px 7px' }}>{p.objetivo}</span>
                </div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 14, color: 'var(--cr)', marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: 'var(--gray)' }}>{p.hook}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
      {weeks.length > 0 && <div style={{ marginTop: 16 }}><button className="btn" disabled={saved} onClick={async () => { await saveCreation('plan', 'Plan mensual', { weeks }); setSaved(true) }}>{saved ? '✓ Guardado' : 'Guardar plan'}</button></div>}
    </div>
  )
}

export function Sequence() {
  const { brand, isPro, saveCreation } = useAuth()
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const [saved, setSaved] = useState(false)
  if (!isPro) return <ProGate tool="Secuencia de ataque" />
  async function handleGenerate() {
    setLoading(true); setPosts([]); setSaved(false)
    try { setPosts(await generateSequence(brand)) }
    catch { setPosts([]) }
    setLoading(false)
  }
  const faseColors = { 'Prueba': '#c8364a', 'Autoridad': '#e8891a', 'Conversión': '#2d7a4a' }
  return (
    <div className="fade-up">
      <p className="section-eye">Herramienta 05 · Pro</p>
      <h1 className="section-title">Secuencia de <em>ataque</em></h1>
      <p className="section-desc">10 posts ordenados por lógica algorítmica progresiva. Prueba → Autoridad → Conversión.</p>
      <button className="btn" disabled={loading} onClick={handleGenerate}>{loading ? <><div className="spinner" />Calculando...</> : 'Generar secuencia →'}</button>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {posts.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', border: '1px solid var(--bor)' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 22, color: 'var(--burg)', opacity: .5, flexShrink: 0, width: 28 }}>{p.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--cr)', marginBottom: 2 }}>{p.title}</div>
              <div style={{ fontSize: 10, color: 'var(--gray)' }}>{p.format} · Señal: {p.signal} · {p.why}</div>
            </div>
            <div style={{ fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 8px', border: `1px solid ${faseColors[p.fase]||'var(--bor)'}`, color: faseColors[p.fase]||'var(--gray)', flexShrink: 0 }}>{p.fase}</div>
          </div>
        ))}
      </div>
      {posts.length > 0 && <div style={{ marginTop: 12 }}><button className="btn" disabled={saved} onClick={async () => { await saveCreation('sequence', 'Secuencia algorítmica', { posts }); setSaved(true) }}>{saved ? '✓ Guardado' : 'Guardar'}</button></div>}
    </div>
  )
}

export function History() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('creations').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setItems(data || []); setLoading(false)
    }
    if (user) load()
  }, [user])
  const typeLabels = { carousel: 'Carrusel', caption: 'Caption', reel: 'Reel', plan: 'Plan', sequence: 'Secuencia' }
  return (
    <div className="fade-up">
      <p className="section-eye">Mis creaciones</p>
      <h1 className="section-title">Historial de <em>contenido</em></h1>
      <p className="section-desc">Todo el contenido que has generado.</p>
      {loading ? <div className="loading-row"><div className="spinner" />Cargando...</div>
      : items.length === 0 ? <div style={{ padding: 24, border: '1.5px solid var(--bor)', textAlign: 'center', fontSize: 13, color: 'var(--gray)' }}>Aún no has creado contenido.</div>
      : <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {items.map((item, i) => (
            <div key={item.id} style={{ padding: '14px 18px', border: '1px solid var(--bor)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 22, color: 'var(--burg)', opacity: .5, width: 28 }}>{i+1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--cr)', marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 10, color: 'var(--gray)' }}>{new Date(item.created_at).toLocaleDateString('es-CL')}</div>
              </div>
              <span className="badge">{typeLabels[item.type]||item.type}</span>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
