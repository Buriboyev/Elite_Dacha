import { useEffect, useRef } from 'react'

const stats = [
  { target: 75, label: 'Maksimal mehmonlar' },
  { target: 5, label: 'Yillik tajriba' },
  { target: 3000, label: 'Mamnun mehmonlar' },
]

function StatCard({ target, label }) {
  const numRef = useRef(null)
  const observed = useRef(false)

  useEffect(() => {
    const el = numRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !observed.current) {
          observed.current = true
          const duration = 1800
          const step = target / (duration / 16)
          let current = 0
          const update = () => {
            current = Math.min(current + step, target)
            el.textContent = Math.round(current) + (target >= 100 ? '+' : '')
            if (current < target) requestAnimationFrame(update)
          }
          requestAnimationFrame(update)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div className="stat-card reveal">
      <div className="stat-num" ref={numRef}>0</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="stats-grid">
        {stats.map((s) => (
          <StatCard key={s.label} target={s.target} label={s.label} />
        ))}
      </div>
    </section>
  )
}
