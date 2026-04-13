import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppIcon from './AppIcon.jsx'
import { useTheme } from '../hooks/useTheme.jsx'

export default function Header() {
  const { isDark, toggleTheme } = useTheme()
  const [navOpen, setNavOpen] = useState(false)

  const closeNav = () => setNavOpen(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 820) closeNav()
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeNav()
    }
    window.addEventListener('resize', handleResize, { passive: true })
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [navOpen])

  const handleNavClick = (e) => {
    const href = e.currentTarget.getAttribute('href')
    if (href && href.startsWith('#')) {
      e.preventDefault()
      closeNav()
      const target = document.querySelector(href)
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    } else {
      closeNav()
    }
  }

  return (
    <>
      <div
        id="navOverlay"
        className={navOpen ? 'open' : ''}
        onClick={closeNav}
      />
      <header>
        <h1>
          <AppIcon name="home" className="title-icon" />
          Elite Dacha Sangardak
        </h1>

        <nav id="mainNav" className={navOpen ? 'open' : ''}>
          <a className="navs" href="#about" onClick={handleNavClick}>Biz haqimizda</a>
          <a className="navs" href="#gallery" onClick={handleNavClick}>Galereya</a>
          <a className="navs" href="#pricing" onClick={handleNavClick}>Narxlar</a>
          <a className="navs" href="#location" onClick={handleNavClick}>Joylashuv</a>
          <Link className="navs" to="/reservation" onClick={closeNav}>Joy band qilish</Link>
        </nav>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <label className="switch" aria-label="Temani almashtirish">
            <input type="checkbox" checked={isDark} onChange={toggleTheme} />
            <span className="slider" />
          </label>
          <button
            className={`burger${navOpen ? ' active' : ''}`}
            id="burgerBtn"
            aria-label="Menyu"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  )
}
