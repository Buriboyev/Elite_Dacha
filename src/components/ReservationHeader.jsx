import { Link } from 'react-router-dom'
import AppIcon from './AppIcon.jsx'
import { useTheme } from '../hooks/useTheme.jsx'

export default function ReservationHeader() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="reservation-header">
      <h2>Joy band qilish</h2>
      <div className="reservation-header-right">
        <Link className="btn_back" to="/">
          <AppIcon name="arrowLeft" /> Orqaga
        </Link>
        <label className="switch" aria-label="Temani almashtirish">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <span className="slider" />
        </label>
      </div>
    </header>
  )
}
