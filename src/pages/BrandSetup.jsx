import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './BrandSetup.module.css'

const NICHO_OPTIONS = ['Marketing digital','Turismo','Salud y estética','Comercio local','Gastronomía','Educación','Bienestar','Tecnología','Moda y estilo','Fotografía','Finanzas','Legal','Arquitectura','Fitness','Otro']
const TONE_OPTIONS = ['Directo','Cercano','Con autoridad','Educativo','Inspirador','Provocador','Empoderador','Técnico','Humano','Sin rodeos','Sofisticado','Divertido']

function StepBar({ current }) {
  const steps = ['Identidad', 'Cliente', 'Tono', 'Confirmar']
  return (
    <div className={styles.stepBar}>
      {steps.map((s, i) => (
        <div key={s} className={`${styles.step} ${i + 1 === current ? styles.stepActive : ''} ${i + 1 < current ? styles.stepDone : ''}`}>
          <div className={styles.stepN}>{i + 1 < current ? '✓' : i + 1}</div>
          <div className={styles.stepL}>{s}</div>
        </div>
      ))}
    </div>
  )
}

export default function BrandSetup() {
  const { brand, saveBrand } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '', specialty: '', handle: '', niche: [],
    client_ideal: '', client_pain: '', client_result: '',
    tone: [], avoid_words: '', voice_description: ''
  })

  useEffect(() => {
    if (brand) {
      setForm({
        name: brand.name || '',
        specialty: brand.specialty || '',
        handle: brand.handle || '',
        niche: brand.niche ? brand.niche.split(',').map(s => s.trim()) : [],
        client_ideal: brand.client_ideal || '',
        client_pain: brand.client_pain || '',
        client_result: brand.client_result || '',
        tone: brand.tone ? brand.tone.split(',').map(s => s.trim()) : [],
        avoid_words: brand.avoid_words || '',
        voice_description: brand.voice_description || ''
      })
    }
  }, [brand])

  function toggle(field, val) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val)
        ? f[field].filter(x => x !== val)
        : [...f[field], val]
    }))
  }

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function handleSave() {
    setSaving(true)
    await saveBrand({
      ...form,
      niche: form.niche.join(', '),
      tone: form.tone.join(', ')
    })
    setSaving(false)
    navigate('/app')
  }

  return (
    <div className="fade-up">
      <p className="section-eye">Configuración</p>
      <h1 className="section-title">Tu <em>marca</em> y voz</h1>
      <p className="section-desc">Esta información define todo el contenido que genera la IA. La IA se adaptará completamente a tu negocio, nicho y forma de comunicarte.</p>

      <StepBar current={step} />

      {/* STEP 1 */}
      {step === 1 && (
        <div className={styles.stepContent}>
          <div className="two-col">
            <div className="field">
              <label className="field-label">Nombre de tu marca *</label>
              <input className="field-input" placeholder="Ej: Centro Kinésico Balance" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Tu especialidad</label>
              <input className="field-input" placeholder="Ej: Kinesióloga, Coach, Fotógrafo" value={form.specialty} onChange={e => set('specialty', e.target.value)} />
            </div>
          </div>
          <div className="two-col">
            <div className="field">
              <label className="field-label">Handle de Instagram</label>
              <input className="field-input" placeholder="@tu_cuenta" value={form.handle} onChange={e => set('handle', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Industria o nicho (puedes elegir varios)</label>
            <div className="chip-row">
              {NICHO_OPTIONS.map(n => (
                <span key={n} className={`chip ${form.niche.includes(n) ? 'on' : ''}`} onClick={() => toggle('niche', n)}>{n}</span>
              ))}
            </div>
          </div>
          <div className={styles.btnRow}>
            <button className="btn" disabled={!form.name.trim()} onClick={() => setStep(2)}>Continuar →</button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className={styles.stepContent}>
          <div className="field">
            <label className="field-label">¿A quién ayudas? (cliente ideal)</label>
            <input className="field-input" placeholder="Ej: Dueños de negocio 30-55 años que ya venden pero no escalan digitalmente" value={form.client_ideal} onChange={e => set('client_ideal', e.target.value)} />
            <p className="field-hint">Sé específico con edad, situación y contexto. Más detalle = mejor contenido.</p>
          </div>
          <div className="field">
            <label className="field-label">¿Cuál es su dolor o frustración principal?</label>
            <input className="field-input" placeholder="Ej: Invierte en redes pero no genera ventas reales" value={form.client_pain} onChange={e => set('client_pain', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">¿Qué resultado concreto logran contigo?</label>
            <input className="field-input" placeholder="Ej: Implementar un sistema de marketing que genera clientes constantes" value={form.client_result} onChange={e => set('client_result', e.target.value)} />
          </div>
          <div className={styles.btnRow}>
            <button className="btn btn-sec" onClick={() => setStep(1)}>← Volver</button>
            <button className="btn" onClick={() => setStep(3)}>Continuar →</button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className={styles.stepContent}>
          <div className="field">
            <label className="field-label">Tono de comunicación (elige todos los que apliquen)</label>
            <div className="chip-row">
              {TONE_OPTIONS.map(t => (
                <span key={t} className={`chip ${form.tone.includes(t) ? 'on' : ''}`} onClick={() => toggle('tone', t)}>{t}</span>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">Palabras o frases que NUNCA usarías</label>
            <input className="field-input" placeholder="Ej: potenciar sinergias, disruptivo, viaje transformacional, holístico" value={form.avoid_words} onChange={e => set('avoid_words', e.target.value)} />
            <p className="field-hint">La IA las evitará activamente en todo el contenido.</p>
          </div>
          <div className="field">
            <label className="field-label">Una frase que define cómo hablas (opcional)</label>
            <input className="field-input" placeholder="Ej: Hablo como experto que respeta la inteligencia del cliente y va directo al punto" value={form.voice_description} onChange={e => set('voice_description', e.target.value)} />
          </div>
          <div className={styles.btnRow}>
            <button className="btn btn-sec" onClick={() => setStep(2)}>← Volver</button>
            <button className="btn" onClick={() => setStep(4)}>Ver resumen →</button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className={styles.stepContent}>
          <div className={styles.preview}>
            <div className={styles.previewEye}>Vista previa de tu perfil de marca</div>
            <div className={styles.previewGrid}>
              {[
                ['Marca', form.name],
                ['Especialidad', form.specialty],
                ['Nicho', form.niche.join(', ')],
                ['Handle', form.handle],
                ['Cliente ideal', form.client_ideal],
                ['Dolor principal', form.client_pain],
                ['Resultado', form.client_result],
                ['Tono', form.tone.join(', ')],
                ['Evitar', form.avoid_words],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className={styles.previewRow}>
                  <div className={styles.previewKey}>{k}</div>
                  <div className={styles.previewVal}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.btnRow}>
            <button className="btn btn-sec" onClick={() => setStep(3)}>← Editar</button>
            <button className="btn" disabled={saving} onClick={handleSave}>
              {saving ? <><div className="spinner" />Guardando...</> : 'Guardar y empezar →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
