import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { generateCategories, generateCarousel } from '../lib/ai'
import CarouselViewer from '../components/CarouselViewer'
import styles from './Carousel.module.css'

export default function Carousel() {
  const { brand, canCarousel, saveCreation, isPro } = useAuth()
  const [step, setStep] = useState(1)
  const [categories, setCategories] = useState([])
  const [loadingCats, setLoadingCats] = useState(false)
  const [selectedCat, setSelectedCat] = useState(null)
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [slides, setSlides] = useState([])
  const [loadingSlides, setLoadingSlides] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (brand && step === 1 && categories.length === 0) loadCategories()
  }, [brand, step])

  async function loadCategories() {
    setLoadingCats(true)
    try {
      const cats = await generateCategories(brand)
      setCategories(cats)
    } catch {
      setCategories(FALLBACK_CATS)
    }
    setLoadingCats(false)
  }

  async function handleGenerate() {
    if (!canCarousel) return
    setStep(3)
    setLoadingSlides(true)
    try {
      const s = await generateCarousel(brand, selectedIdea)
      setSlides(s)
    } catch {
      setSlides(FALLBACK_SLIDES(selectedIdea))
    }
    setLoadingSlides(false)
  }

  async function handleSave() {
    await saveCreation('carousel', selectedIdea, { slides, category: selectedCat?.name })
    setSaved(true)
  }

  if (!brand) return (
    <div className="fade-up">
      <p className="section-eye">Herramienta 01</p>
      <h1 className="section-title">Crear <em>carrusel</em></h1>
      <div className={styles.noBrand}>Configura tu marca primero para que la IA adapte el contenido a tu negocio.</div>
    </div>
  )

  if (!canCarousel && !isPro) return (
    <div className="fade-up">
      <p className="section-eye">Herramienta 01</p>
      <h1 className="section-title">Crear <em>carrusel</em></h1>
      <div className={styles.limitBox}>
        <div className={styles.limitTitle}>Límite del plan gratis alcanzado</div>
        <div className={styles.limitDesc}>Has creado los 3 carruseles gratuitos de este mes. Actualiza a Pro para crear ilimitados.</div>
        <button className="btn" style={{ marginTop: 16 }}>Actualizar a Pro — $19/mes</button>
      </div>
    </div>
  )

  return (
    <div className="fade-up">
      <p className="section-eye">Herramienta 01</p>
      <h1 className="section-title">Crear <em>carrusel</em></h1>
      <p className="section-desc">La IA genera categorías e ideas adaptadas a <strong style={{ color: 'var(--cr)' }}>{brand.name}</strong>. Elige y genera en segundos.</p>

      {/* STEP 1: CATEGORY */}
      {step === 1 && (
        <div>
          <div className={styles.stepLabel}>Paso 1 — Elige una categoría</div>
          {loadingCats ? (
            <div className="loading-row"><div className="spinner" />Generando categorías para {brand.name}...</div>
          ) : (
            <div className={styles.catList}>
              {categories.map((c, i) => (
                <div key={i} className={`${styles.catPill} ${selectedCat?.id === c.id ? styles.catOn : ''}`} onClick={() => { setSelectedCat(c); setSelectedIdea(null) }}>
                  <div>
                    <div className={styles.catName}>{String(i + 1).padStart(2, '0')} — {c.name}</div>
                    <div className={styles.catDesc}>{c.desc}</div>
                  </div>
                  <div className={styles.catChk}>✓</div>
                </div>
              ))}
            </div>
          )}
          <div className={styles.btnRow}>
            <button className="btn" disabled={!selectedCat} onClick={() => setStep(2)}>Ver ideas →</button>
          </div>
        </div>
      )}

      {/* STEP 2: IDEA */}
      {step === 2 && selectedCat && (
        <div>
          <div className={styles.stepLabel}>Paso 2 — Elige una idea</div>
          <p className={styles.catContext}>{selectedCat.name}</p>
          <div className={styles.ideaList}>
            {selectedCat.ideas.map((idea, i) => (
              <div key={i} className={`${styles.ideaCard} ${selectedIdea === idea ? styles.ideaOn : ''}`} onClick={() => setSelectedIdea(idea)}>
                <div className={styles.ideaN}>{i + 1}</div>
                <div className={styles.ideaText}>{idea}</div>
              </div>
            ))}
          </div>
          <div className={styles.btnRow}>
            <button className="btn btn-sec" onClick={() => setStep(1)}>← Categoría</button>
            <button className="btn" disabled={!selectedIdea} onClick={handleGenerate}>Generar con IA →</button>
          </div>
        </div>
      )}

      {/* STEP 3: SLIDES */}
      {step === 3 && (
        <div>
          <div className={styles.stepLabel}>Paso 3 — Slides generados</div>
          {loadingSlides ? (
            <div className="loading-row"><div className="spinner" />Generando 10 slides para "{selectedIdea?.substring(0, 50)}..."</div>
          ) : (
            <>
              <div className={styles.slidesGrid}>
                {slides.map((s, i) => (
                  <div key={i} className={styles.slideCard}>
                    <div className={styles.slideBar}>
                      <span className={styles.slideN}>S{s.n}</span>
                      <span className={styles.slideNm}>{s.name}</span>
                    </div>
                    <div
                      className={styles.slideBody}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => {
                        const updated = [...slides]
                        updated[i] = { ...s, text: e.target.innerText }
                        setSlides(updated)
                      }}
                    >{s.text}</div>
                  </div>
                ))}
              </div>
              <div className={styles.btnRow}>
                <button className="btn btn-sec" onClick={() => setStep(2)}>← Cambiar idea</button>
                <button className="btn" onClick={() => setStep(4)}>Diseñar visual →</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* STEP 4: DESIGN */}
      {step === 4 && slides.length > 0 && (
        <div>
          <div className={styles.stepLabel}>Paso 4 — Diseño visual</div>
          <CarouselViewer slides={slides} brand={brand} />
          <div className={styles.btnRow} style={{ marginTop: 20 }}>
            <button className="btn btn-sec" onClick={() => setStep(3)}>← Editar slides</button>
            <button className="btn" disabled={saved} onClick={handleSave}>
              {saved ? '✓ Guardado en historial' : 'Guardar carrusel'}
            </button>
            <button className="btn btn-sec" onClick={() => { setStep(1); setSelectedCat(null); setSelectedIdea(null); setSlides([]); setSaved(false) }}>
              Crear otro →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Fallback categories if AI fails
const FALLBACK_CATS = [
  { id: 1, name: 'El diagnóstico que duele', desc: 'Errores que tu cliente comete sin saberlo', ideas: ['5 errores que bloquean tus ventas en redes', 'Por qué tu publicidad no funcionó', 'Las 4 señales de que necesitas un sistema', 'Por qué tienes seguidores pero no ventas', 'Lo que hace tu competencia que tú no', 'El diagnóstico que nadie te hace'] },
  { id: 2, name: 'El sistema que cambia todo', desc: 'Tu método y diferenciación', ideas: ['Qué es un sistema de marketing real', 'El método antes de proponer cualquier acción', 'La diferencia entre presencia y sistema digital', 'Las 3 fases de un sistema de ventas', 'Por qué la automatización no es solo para grandes', 'Cómo funciona un funnel para servicios'] },
  { id: 3, name: 'Contenido que convierte', desc: 'Estrategia de contenido con propósito', ideas: ['La diferencia entre publicar y tener estrategia', 'Cómo crear un carrusel que genera guardados', 'El hook perfecto para el slide 1', 'Por qué tus Reels no crecen tu cuenta', 'Los 3 tipos de post que necesita tu negocio', 'Cómo planificar 30 días de contenido con IA'] },
]

function FALLBACK_SLIDES(idea) {
  const names = ['HOOK', 'PROBLEMA', 'COSTO', 'CAMBIO', 'SISTEMA 1', 'SISTEMA 2', 'SISTEMA 3', 'RESULTADO', 'DECISIÓN', 'CTA']
  return names.map((name, i) => ({ n: i + 1, name, text: `Slide ${i + 1} sobre: ${idea?.substring(0, 60) || 'tu tema'}` }))
}
