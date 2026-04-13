import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const SECRET_CLICK_TARGET = 5
const SECRET_CLICK_RESET_MS = 2200

export default function Footer() {
  const navigate = useNavigate()
  const clickCountRef = useRef(0)
  const resetTimerRef = useRef(null)

  useEffect(() => {
    return () => window.clearTimeout(resetTimerRef.current)
  }, [])

  const handleFooterClick = () => {
    clickCountRef.current += 1

    window.clearTimeout(resetTimerRef.current)

    if (clickCountRef.current >= SECRET_CLICK_TARGET) {
      clickCountRef.current = 0
      sessionStorage.setItem('adminAuth', 'granted')
      navigate('/admin')
      return
    }

    resetTimerRef.current = window.setTimeout(() => {
      clickCountRef.current = 0
    }, SECRET_CLICK_RESET_MS)
  }

  return (
    <footer className="footer reveal">
      <button className="footer-copy" type="button" onClick={handleFooterClick}>
        &copy; {new Date().getFullYear()} Elite Dacha Sangardak
      </button>
    </footer>
  )
}
