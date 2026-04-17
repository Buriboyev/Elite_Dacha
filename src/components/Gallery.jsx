import { useEffect, useRef, useState } from 'react'
import AppIcon from './AppIcon.jsx'
import { getAssetUrl } from '../lib/runtimeBase.js'

const images = [
  {
    src: 'images/1.jpg',
    alt: 'Elite Dacha Sangardak xona va hovuz',
    title: 'Hovuz va hovli',
    description: "Kun bo'yi salqin basseyn va keng dam olish hududi.",
  },
  {
    src: 'images/2.jpg',
    alt: 'Sangardak dacha tabiat manzarasi',
    title: 'Tabiat manzarasi',
    description: "Sangardakning sokin havosi va yashil atrof-muhiti.",
  },
  {
    src: 'images/3.jpg',
    alt: 'Dacha playstation va karaoke xonasi',
    title: 'Karaoke va PlayStation',
    description: "Do'stlar bilan kechki hordiq uchun zamonaviy ko'ngilochar zona.",
  },
  {
    src: 'images/4.jpg',
    alt: 'Barbekyu zonasi va tandir',
    title: 'Barbekyu hududi',
    description: 'Tandir, grill va ochiq havodagi mazali davralar uchun joy.',
  },
  {
    src: 'images/5.jpg',
    alt: 'Dacha maydoni va chodirlar',
    title: 'Keng maydon',
    description: 'Oila va katta davralar uchun qulay, ochiq va keng makon.',
  },
  {
    src: 'images/6.jpg',
    alt: "Sangardakdagi dacha bog'ida dam olish",
    title: "Bog' muhiti",
    description: "Yashil hudud orasida tinch va premium dam olish kayfiyati.",
  },
  {
    src: 'images/7.jpg',
    alt: 'Premium dacha xizmati',
    title: 'Premium servis',
    description: 'Qulaylik, tozalik va mehmonlar uchun puxta tayyorlangan sharoit.',
  },
  {
    src: 'images/8.jpg',
    alt: 'Elite Dacha Sangardak mehmonxonasi',
    title: 'Shinam xonalar',
    description: "Tunash va dam olish uchun yorug', saranjom va hashamatli joy.",
  },
]

export default function Gallery() {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(images.length > 1)
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const isLightboxOpen = lightboxIndex >= 0

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frameId = 0

    const updateTrackState = () => {
      const slides = Array.from(track.children)
      if (!slides.length) return

      const trackRect = track.getBoundingClientRect()
      const viewportCenter = trackRect.left + trackRect.width / 2
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect()
        const slideCenter = rect.left + rect.width / 2
        const distance = Math.abs(slideCenter - viewportCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setActiveIndex(closestIndex)
      setCanScrollPrev(track.scrollLeft > 6)
      setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 6)
    }

    const handleScroll = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(updateTrackState)
    }

    updateTrackState()
    track.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateTrackState)

    return () => {
      cancelAnimationFrame(frameId)
      track.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateTrackState)
    }
  }, [])

  useEffect(() => {
    if (!isLightboxOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightboxIndex(-1)
      }
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((current) => (current - 1 + images.length) % images.length)
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((current) => (current + 1) % images.length)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen])

  const goToSlide = (index) => {
    const nextIndex = (index + images.length) % images.length
    const nextSlide = trackRef.current?.children?.[nextIndex]

    if (!nextSlide) return

    nextSlide.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
    setActiveIndex(nextIndex)
  }

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(-1)
  const showPrevLightbox = () => setLightboxIndex((current) => (current - 1 + images.length) % images.length)
  const showNextLightbox = () => setLightboxIndex((current) => (current + 1) % images.length)

  return (
    <>
      <section id="gallery" className="gallery-section">
        <h2 className="section-title">
          <AppIcon name="images" /> Galereya
        </h2>

        <div className="gallery-top">
         

       
        </div>

        <div
          className={`gallery-carousel${canScrollPrev ? ' has-prev' : ''}${canScrollNext ? ' has-next' : ''}`}
        >
          <div
            ref={trackRef}
            className="gallery-track"
            aria-label="Elite Dacha Sangardak suratlari"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') goToSlide(activeIndex - 1)
              if (event.key === 'ArrowRight') goToSlide(activeIndex + 1)
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openLightbox(activeIndex)
              }
            }}
          >
            {images.map((img, index) => (
              <article
                key={img.src}
                className={`gallery-slide${activeIndex === index ? ' is-active' : ''}`}
              >
                <button
                  type="button"
                  className="gallery-slide-button"
                  aria-label={`${img.title} rasmini katta ochish`}
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={getAssetUrl(img.src)}
                    alt={img.alt}
                    loading="lazy"
                  />
                  <div className="gallery-slide-overlay" />
                  <div className="gallery-slide-copy">
                    <span className="gallery-slide-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3>{img.title}</h3>
                    <p>{img.description}</p>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="gallery-footer">
          <div className="gallery-progress">
            <span className="gallery-progress-number">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>

            <div className="gallery-dots" aria-label="Galereya indikatorlari">
              {images.map((img, index) => (
                <button
                  key={img.src}
                  type="button"
                  className={`gallery-dot${activeIndex === index ? ' is-active' : ''}`}
                  aria-label={`${index + 1}-suratga o'tish`}
                  aria-pressed={activeIndex === index}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>

            <span className="gallery-progress-number gallery-progress-total">
              {String(images.length).padStart(2, '0')}
            </span>
          </div>
   <div className="gallery-controls">
            <button
              type="button"
              className="gallery-nav-btn"
              aria-label="Oldingi surat"
              onClick={() => goToSlide(activeIndex - 1)}
            >
              <AppIcon name="arrowLeft" />
            </button>
            <button
              type="button"
              className="gallery-nav-btn gallery-nav-btn-next"
              aria-label="Keyingi surat"
              onClick={() => goToSlide(activeIndex + 1)}
            >
              <AppIcon name="arrowLeft" />
            </button>
          </div>
        
        </div>
      </section>

      {isLightboxOpen ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Galereya rasmi"
          onClick={closeLightbox}
        >
          <div
            className="gallery-lightbox-shell"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="gallery-lightbox-close"
              aria-label="Yopish"
              onClick={closeLightbox}
            >
              X
            </button>

            <button
              type="button"
              className="gallery-lightbox-nav"
              aria-label="Oldingi surat"
              onClick={showPrevLightbox}
            >
              <AppIcon name="arrowLeft" />
            </button>

            <figure className="gallery-lightbox-figure">
              <img
                src={getAssetUrl(images[lightboxIndex].src)}
                alt={images[lightboxIndex].alt}
              />
              <figcaption className="gallery-lightbox-caption">
                <span className="gallery-lightbox-count">
                  {String(lightboxIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </span>
                <h3>{images[lightboxIndex].title}</h3>
                <p>{images[lightboxIndex].description}</p>
              </figcaption>
            </figure>

            <button
              type="button"
              className="gallery-lightbox-nav gallery-lightbox-nav-next"
              aria-label="Keyingi surat"
              onClick={showNextLightbox}
            >

              <AppIcon name="arrowLeft" />
            </button>
            
          </div>
          
        </div>
        
      ) : null}
      
    </>
  )
}
