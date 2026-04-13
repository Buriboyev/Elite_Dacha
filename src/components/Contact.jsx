import AppIcon from './AppIcon.jsx'

export default function Contact() {
  return (
    <section id="contact">
      <h2
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          fontSize: '30px',
        }}
      >
        <AppIcon name="phone" style={{ color: 'var(--text)' }} /> Bog'lanish
      </h2>

      <div className="contact-grid reveal">
        <div className="contact-card reveal">
          <h3>
            <AppIcon name="phone" style={{ color: 'var(--text)' }} /> Telefon
          </h3>
          <p>
            <a href="tel:+998997381515">+998 99 738 15 15</a>
          </p>
          <p>
            <a href="tel:+998937900200">+998 93 790 02 00</a>
          </p>
        </div>

        <div className="contact-card reveal">
          <h3>
            <AppIcon name="telegram" /> Telegram
          </h3>
          <p>
            <a href="https://t.me/Sangardakelitdacha" target="_blank" rel="noreferrer">
              @Sangardakelitdacha
            </a>
          </p>
        </div>

        <div className="contact-card reveal">
          <h3>
            <AppIcon name="instagram" /> Instagram
          </h3>
          <p>
            <a
              href="https://www.instagram.com/elite_dacha"
              target="_blank"
              rel="noreferrer"
            >
              @elite_dacha
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
