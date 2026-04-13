import AppIcon from './AppIcon.jsx'

export default function Location() {
  return (
    <section id="location" className="reveal">
      <h2
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          fontSize: '30px',
        }}
      >
        <AppIcon name="location" /> Joylashuv
      </h2>
      <p className="about-text reveal">
      
      </p>
      <iframe
        title="Elite Dacha Sangardak manzili"
        src="https://maps.google.com/maps?q=38.545268,67.544153&z=15&output=embed"
      />
    </section>
  )
}
