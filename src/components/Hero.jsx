import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AppIcon from './AppIcon.jsx'
import { getAssetUrl } from '../lib/runtimeBase.js'

export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let dots = []
    let W, H

    function resize() {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const N = Math.min(50, Math.floor(window.innerWidth / 24))
    for (let i = 0; i < N; i++) {
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.5,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        o: Math.random() * 0.45 + 0.18,
      })
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 115) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255,255,255,${0.11 * (1 - d / 115)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.stroke()
          }
        }
      }
      dots.forEach((d) => {
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${d.o})`
        ctx.fill()
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > W) d.vx *= -1
        if (d.y < 0 || d.y > H) d.vy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${getAssetUrl('images/1.jpg')})` }}
    >
      <canvas ref={canvasRef} id="particles" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-badge fade-up" style={{ animationDelay: '0.1s' }}>
          <AppIcon name="star" /> Sangardak, O'zbekiston
        </div>
        <h2 className="fade-up" style={{ animationDelay: '0.25s' }}>
          <span className="accent-text">Sangardak Dacha</span>
          <br />
           premium dam olish maskani
        </h2>
        <p className="fade-up" style={{ animationDelay: '0.45s' }}>
          Sangardakda oila va do'stlar bilan tabiat qo'ynida hashamatli dam oling
        </p>
        <div className="hero-btns fade-up" style={{ animationDelay: '0.6s' }}>
          <Link to="/reservation" className="btn btn-primary">
            <AppIcon name="calendarCheck" /> Bron qilish
          </Link>
        </div>
      </div>
      <div className="hero-scroll-hint fade-up" style={{ animationDelay: '1s' }}>
        <span>Pastga aylantiring</span>
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
      </div>
    </section>
  )
}
