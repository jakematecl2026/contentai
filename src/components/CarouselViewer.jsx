import { useState } from 'react'
import styles from './CarouselViewer.module.css'

const PRESETS = [
  { name: 'Jake Mate', bg: '#f9eee8', main: '#7a0c2e', txt: '#111008', drk: '#111008' },
  { name: 'Oscuro', bg: '#1a1008', main: '#c8364a', txt: '#f5f0ec', drk: '#080605' },
  { name: 'Azul', bg: '#f0f4ff', main: '#1a3a8f', txt: '#0a1020', drk: '#0a1020' },
  { name: 'Verde', bg: '#f0faf4', main: '#1a6b3a', txt: '#061a10', drk: '#061a10' },
  { name: 'Dorado', bg: '#fdf8ee', main: '#8b6914', txt: '#1a1000', drk: '#1a1000' },
]

function esc(t) {
  return (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default function CarouselViewer({ slides, brand }) {
  const [idx, setIdx] = useState(0)
  const [style, setStyle] = useState(PRESETS[0])
  const [tag, setTag] = useState(brand?.niche?.split(',')[0]?.trim() || brand?.name?.split(' ')[0] || '')
  const [handle, setHandle] = useState(brand?.handle || '@tumarca')

  const s = slides[idx]
  const total = slides.length
  const isDark = idx === 0 || idx === total - 1
  const bg = isDark ? style.drk : style.bg
  const tc = isDark ? '#f9eee8' : style.txt
  const ac = style.main
  const wm = isDark ? 'AI' : String(idx + 1)

  function copyOne() {
    navigator.clipboard.writeText(`[Slide ${s.n} - ${s.name}]\n${s.text}`)
      .then(() => alert('Slide copiado'))
  }
  function copyAll() {
    const all = slides.map(sl => `[Slide ${sl.n} - ${sl.name}]\n${sl.text}`).join('\n\n')
    navigator.clipboard.writeText(all).then(() => alert('Todos los slides copiados'))
  }

  // Build title content based on slide position
  function buildBody() {
    const lines = (s.text || '').split('\n')
    if (idx === 0) {
      // Hook: split words into two colors
      const words = s.text.split(' ')
      const mid = Math.ceil(words.length / 2)
      return (
        <div className={styles.title} style={{ color: tc }}>
          {words.map((w, i) => (
            <span key={i} style={{ color: i < mid ? ac : tc }}>{w} </span>
          ))}
        </div>
      )
    }
    if (idx === total - 1) {
      return <div className={styles.title} style={{ color: tc }}>{s.text}</div>
    }
    return (
      <>
        <div className={styles.title} style={{ color: tc }}>{lines[0] || s.text}</div>
        <div className={styles.divider} style={{ background: ac }} />
        <div className={styles.bodyText} style={{ color: tc }}>{lines.slice(1).join(' ')}</div>
      </>
    )
  }

  return (
    <div className={styles.wrap}>
      {/* STYLE CONTROLS */}
      <div className={styles.controls}>
        <div className={styles.colorRow}>
          <div className={styles.cf}>
            <label>Fondo</label>
            <input type="color" value={style.bg} onChange={e => setStyle(s => ({ ...s, bg: e.target.value }))} />
          </div>
          <div className={styles.cf}>
            <label>Principal</label>
            <input type="color" value={style.main} onChange={e => setStyle(s => ({ ...s, main: e.target.value }))} />
          </div>
          <div className={styles.cf}>
            <label>Texto</label>
            <input type="color" value={style.txt} onChange={e => setStyle(s => ({ ...s, txt: e.target.value }))} />
          </div>
          <div className={styles.cf}>
            <label>Oscuro</label>
            <input type="color" value={style.drk} onChange={e => setStyle(s => ({ ...s, drk: e.target.value }))} />
          </div>
          <div className={styles.cf}>
            <label>Tag</label>
            <input type="text" value={tag} onChange={e => setTag(e.target.value)} />
          </div>
          <div className={styles.cf}>
            <label>Handle</label>
            <input type="text" value={handle} onChange={e => setHandle(e.target.value)} />
          </div>
        </div>
        <div className={styles.presets}>
          {PRESETS.map(p => (
            <button key={p.name} className={styles.preset} onClick={() => setStyle(p)}>{p.name}</button>
          ))}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className={styles.navRow}>
        <div className={styles.nav}>
          <button className={styles.nb} onClick={() => setIdx(i => Math.max(0, i - 1))}>←</button>
          <span className={styles.cnt}>{idx + 1} / {total}</span>
          <button className={styles.nb} onClick={() => setIdx(i => Math.min(total - 1, i + 1))}>→</button>
        </div>
        <button className={styles.copyBtn} onClick={copyOne}>Copiar slide</button>
        <button className={styles.copyBtn} onClick={copyAll}>Copiar todos</button>
      </div>

      {/* SLIDE */}
      <div className={styles.slide} style={{ background: bg }}>
        <div className={styles.wm} style={{ color: ac }}>{wm}</div>
        <div className={styles.top} style={{ color: tc }}>{handle}</div>
        <div className={styles.body}>{buildBody()}</div>
        <div className={styles.bottom}>
          <div className={styles.dots}>
            {slides.map((_, i) => (
              <div key={i} className={`${styles.dot} ${i === idx ? styles.dotA : ''}`}
                style={{ background: i === idx ? ac : 'rgba(150,150,150,.3)' }} />
            ))}
          </div>
          <div className={styles.bottomRight}>
            <div className={styles.arrow} style={{ background: ac }} onClick={() => setIdx(i => Math.min(total - 1, i + 1))}>›</div>
            <div className={styles.brandTag} style={{ color: ac }}>{tag}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
