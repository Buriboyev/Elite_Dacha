import { Link } from 'react-router-dom'
import AppIcon from './AppIcon.jsx'

const features = ['Basseyn', 'Tandir va Barbekyu', 'Karaoke', 'PlayStation', 'Chiroyli tabiat']

function FeatureList({ extras = [] }) {
  return (
    <ul className="pricing-features">
      {[...features.slice(0, features.length - (extras.length > 0 ? 1 : 0)), ...extras].map((f) => (
        <li key={f}>
          <AppIcon name="check" /> {f}
        </li>
      ))}
    </ul>
  )
}

export default function Pricing() {
  return (
    <section id="pricing">
      <h2 className="section-title reveal">
        <AppIcon name="tag" /> Narxlar
      </h2>
      <p className="about-text reveal">
        Qulay narxlarda hashamatli dam olish. Bron qilish uchun murojaat qiling.
      </p>

      <div className="pricing-grid">
        {/* Card 1 - Weekdays */}
        <div className="pricing-card reveal">
          <div className="pricing-label">
            Kunlik ijara{' '}
            <span
              style={{
                color: 'red',
                fontSize: '18px',
                fontFamily: "'Trebuchet MS', sans-serif",
                fontWeight: 1000,
              }}
            >
              CHEGIRMA
            </span>
          </div>
          <div className="pricing-price-wrap">
            <span className="price-old reveal">200 000 so'm</span>
            <span className="price-new reveal">150 000 so'm</span>
          </div>
          <div className="pricing-sub">Dushanba - Payshanba</div>
          <ul className="pricing-features">
            {features.map((f) => (
              <li key={f}><AppIcon name="check" /> {f}</li>
            ))}
          </ul>
          <Link to="/reservation" className="pricing-btn">
            Bron qilish
          </Link>
        </div>

        {/* Card 2 - Weekends (featured) */}
        <div
          className="pricing-card pricing-featured reveal"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="pricing-badge">Eng mashhur</div>
          <div className="pricing-label">Dam olish kunlari</div>
          <div className="pricing-price-wrap">
            <span className="price-new reveal">200 000 so'm</span>
          </div>
          <div className="pricing-sub">Juma - Yakshanba</div>
          <ul className="pricing-features">
            {features.map((f) => (
              <li key={f}><AppIcon name="check" /> {f}</li>
            ))}
          </ul>
          <Link to="/reservation" className="pricing-btn">
            Bron qilish
          </Link>
        </div>

        {/* Card 3 - Full venue */}
        <div className="pricing-card reveal" style={{ animationDelay: '0.2s' }}>
          <div className="pricing-label">Alohida narx</div>
          <div className="pricing-price-wrap">
            <span className="price-new price-contact reveal">Butun hudud ijarasi</span>
          </div>
          <div className="pricing-sub">75 kishigacha</div>
          <ul className="pricing-features">
            {features.map((f) => (
              <li key={f}><AppIcon name="check" /> {f}</li>
            ))}
            <li>
              <AppIcon name="check" /> Butun hudud sizning ixtiyoringizda
            </li>
          </ul>
          <a href="tel:+998937900200" className="pricing-btn pricing-btn-call">
            <AppIcon name="phone" /> Narxni bilish uchun bog'laning
          </a>
        </div>
      </div>
    </section>
  )
}
