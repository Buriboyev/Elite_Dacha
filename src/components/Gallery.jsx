import AppIcon from './AppIcon.jsx'
import { getAssetUrl } from '../lib/runtimeBase.js'

const images = [
  { src: 'images/1.jpg', alt: 'Elite Dacha Sangardak xona va hovuz' },
  { src: 'images/2.jpg', alt: 'Sangardak dacha tabiat manzarasi' },
  { src: 'images/3.jpg', alt: 'Dacha playstation va karaoke xonasi' },
  { src: 'images/4.jpg', alt: 'Barbekyu zonasi va tandir' },
  { src: 'images/5.jpg', alt: 'Dacha maydoni va chodirlar' },
  { src: 'images/6.jpg', alt: "Sangardakdagi dacha bog'ida dam olish" },
  { src: 'images/7.jpg', alt: 'Premium dacha xizmati' },
  { src: 'images/8.jpg', alt: 'Elite Dacha Sangardak mehmonxonasi' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="reveal">
      <h2
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          fontSize: '30px',
        }}
      >
        <AppIcon name="images" /> Galereya
      </h2>

      <div className="gallery">
        {images.map((img) => (
          <img
            key={img.src}
            className="reveal"
            src={getAssetUrl(img.src)}
            alt={img.alt}
            loading="lazy"
          />
        ))}
      </div>
    </section>
  )
}
