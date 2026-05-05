import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProGate({ tool }) {
  const { upgradeToPro } = useAuth()
  return (
    <div className="fade-up">
      <p className="section-eye">Función Pro</p>
      <h1 className="section-title"><em>{tool}</em></h1>
      <div style={{ border: '1.5px solid var(--burg)', background: 'rgba(122,12,46,.06)', padding: '28px 24px', maxWidth: 520 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 18, color: 'var(--cr)', marginBottom: 8 }}>Función disponible en el plan Pro</div>
        <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6, marginBottom: 20 }}>
          Desbloquea {tool} junto con scripts de Reels, plan mensual, secuencia algorítmica y contenido ilimitado por $19 USD/mes.
        </div>
        <button className="btn" onClick={upgradeToPro}>Actualizar a Pro — $19/mes</button>
        <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 10 }}>Cancela cuando quieras. Sin contratos.</div>
      </div>
    </div>
  )
}
