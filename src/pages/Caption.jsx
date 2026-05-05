// Caption.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { generateCaption } from '../lib/ai'

const OBJ = ['Guardados', 'Comentarios', 'DMs', 'Seguidores', 'Alcance']
const TONE = ['Educativo', 'Directo', 'Provocador', 'Cercano', 'Inspirador']

export default function Caption() {
  const { brand, canCaption, saveCreation } = useAuth()
  const [topic, setTopic] = useState('')
  const [obj, setObj] = useState('Guardados')
  const [tone, setTone] = useState('Directo')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)

  async function handleGenerate() {
    if (!topic.trim()) return
    setLoading(true); setResult(null); setSaved(false)
    try {
      const r = await generateCaption(brand, topic, obj, tone)
      setResult(r)
    } catch { setResult({ feed: 'Error generando el caption. Intenta de nuevo.', story: '', hashtags: '' }) }
    setLoading(false)
  }

  async function handleSave() {
    await saveCreation('caption', topic, result)
    setSaved(true)
  }

  function cp(text) { navigator.clipboard.writeText(text).then(() => alert('Copiado')) }

  return (
    <div className="fade-up">
      <p className="section-eye">Herramienta 02</p>
      <h1 className="section-title">Crear <em>caption</em></h1>
      <p className="section-desc">Caption para feed, versión corta para stories y hashtags segmentados para tu nicho.</p>

      <div className="field">
        <label className="field-label">¿De qué trata el post?</label>
        <textarea className="field-textarea" rows={3} placeholder="Ej: Un carrusel sobre los 5 errores que bloquean las ventas en redes sociales"
          value={topic} onChange={e => setTopic(e.target.value)} />
      </div>
      <div className="two-col">
        <div className="field">
          <label className="field-label">Objetivo del post</label>
          <div className="chip-row">{OBJ.map(o => <span key={o} className={`chip ${obj === o ? 'on' : ''}`} onClick={() => setObj(o)}>{o}</span>)}</div>
        </div>
        <div className="field">
          <label className="field-label">Tono</label>
          <div className="chip-row">{TONE.map(t => <span key={t} className={`chip ${tone === t ? 'on' : ''}`} onClick={() => setTone(t)}>{t}</span>)}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn" disabled={loading || !topic.trim() || !canCaption} onClick={handleGenerate}>
          {loading ? <><div className="spinner" />Generando...</> : 'Generar caption →'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[['Caption Feed', result.feed], ['Caption Stories', result.story], ['Hashtags', result.hashtags]].map(([label, text]) => (
            <div key={label} style={{ border: '1.5px solid var(--bor)' }}>
              <div style={{ background: 'var(--mid)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)' }}>{label}</span>
                <button className="btn btn-sec" style={{ padding: '4px 10px', fontSize: 9 }} onClick={() => cp(text)}>Copiar</button>
              </div>
              <div style={{ padding: 16, fontSize: 13, color: label === 'Hashtags' ? 'var(--red)' : 'var(--cr)', lineHeight: 1.8, background: 'rgba(255,255,255,.02)', whiteSpace: 'pre-wrap' }}>{text}</div>
            </div>
          ))}
          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
            <button className="btn" disabled={saved} onClick={handleSave}>{saved ? '✓ Guardado' : 'Guardar en historial'}</button>
            <button className="btn btn-sec" onClick={() => { setResult(null); setTopic('') }}>Crear otro</button>
          </div>
        </div>
      )}
    </div>
  )
}
