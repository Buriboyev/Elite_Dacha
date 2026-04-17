import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme.jsx'
import { useManagedMeta } from '../hooks/useManagedMeta.js'
import ReservationHeader from '../components/ReservationHeader.jsx'
import PageShell from '../components/PageShell.jsx'
import { db, ref, push, serverTimestamp } from '../firebase.js'
import Swal from 'sweetalert2'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import '../styles/reservation.css'

const TOKEN = '7439506932:AAFvrYTvLEnlRd1_QTKtruU2NHedVamdKWk'
const CHAT_ID = '-1003768294685'

function formatPhone(value) {
  let numbers = value.replace(/\D/g, '')
  if (!numbers.startsWith('998')) numbers = '998' + numbers
  numbers = numbers.substring(0, 12)
  let formatted = '+998 '
  if (numbers.length > 3) formatted += numbers.substring(3, 5)
  if (numbers.length >= 6) formatted += ' ' + numbers.substring(5, 8)
  if (numbers.length >= 9) formatted += ' ' + numbers.substring(8, 10)
  if (numbers.length >= 11) formatted += ' ' + numbers.substring(10, 12)
  return formatted
}

export default function ReservationPage() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const dateRef = useRef(null)
  const fpRef = useRef(null)

  const [form, setForm] = useState({ name: '', phone: '', date: '', guests: '' })
  const [loading, setLoading] = useState(false)

  useManagedMeta({
    title: 'Sangardak Dacha bron qilish | Elite Dacha Sangardak',
    description:
      "Elite Dacha Sangardak uchun bron qoldiring. Sana, telefon raqami va mehmonlar sonini yuborib, joyingizni oldindan band qiling.",
    path: '/reservation',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (dateRef.current) {
      fpRef.current = flatpickr(dateRef.current, {
        dateFormat: 'Y-m-d',
        minDate: 'today',
        disableMobile: true,
        monthSelectorType: 'static',
        prevArrow: '<span aria-hidden="true">‹</span>',
        nextArrow: '<span aria-hidden="true">›</span>',
        onChange: ([date], dateStr) => {
          setForm((prev) => ({ ...prev, date: dateStr }))
        },
      })
    }
    return () => fpRef.current?.destroy()
  }, [])

  const handlePhoneChange = (e) => {
    setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))
  }

  const getSwalTheme = () => (isDark ? 'swal-dark' : 'swal-light')

  const saveToFirebase = async ({ name, phone, date, guests, tgMsgId }) => {
    try {
      const bookingsRef = ref(db, 'bookings')
      await push(bookingsRef, {
        name,
        phone,
        date,
        guests: Number(guests),
        tgMsgId: tgMsgId || null,
        status: 'new',
        comment: '',
        received: new Date().toISOString().slice(0, 10),
        createdAt: serverTimestamp(),
        source: 'website',
      })
    } catch (err) {
      console.error('Firebase save error:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, phone, date, guests } = form

    if (!date) {
      Swal.fire({ icon: 'warning', title: 'Sanani tanlang!', customClass: { popup: getSwalTheme() } })
      return
    }

    setLoading(true)

    const text = `🟢Yangi bron!\n\n👤Ism: ${name}\n📞Telefon: ${phone}\n📅Sana: ${date}\n👥Odamlar soni: ${guests}`

    try {
      const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      })

      if (!response.ok) throw new Error('Telegram xatolik')

      const tgData = await response.json()
      const tgMsgId = tgData?.result?.message_id || null

      await saveToFirebase({ name, phone, date, guests, tgMsgId })

      await Swal.fire({
        icon: 'success',
        title: 'Bron muvaffaqiyatli yuborildi!',
        text: 'Tez orada siz bilan bog\'lanamiz',
        confirmButtonText: 'Bosh sahifaga o\'tish',
        confirmButtonColor: '#16a34a',
        customClass: { popup: getSwalTheme() },
      })

      navigate('/')
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Xatolik yuz berdi!',
        text: 'Iltimos qayta urinib ko\'ring',
        confirmButtonText: 'Yopish',
        confirmButtonColor: '#dc2626',
        customClass: { popup: getSwalTheme() },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell className="reservation-page">
      <ReservationHeader />
      <section className="reservation">
        <div className="booking-card">
          <form id="bookingForm" onSubmit={handleSubmit}>
            <input
              type="text"
              id="name"
              placeholder="Ismingiz"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />

            <input
              type="tel"
              id="phone"
              placeholder="+998 __ ___ __ __"
              required
              value={form.phone}
              onChange={handlePhoneChange}
            />

            <h4 style={{ display: 'flex', justifyContent: 'center' }}>Sana tanlang</h4>
            <input
              ref={dateRef}
              type="text"
              id="date"
              placeholder="Sana tanlang"
              required
              readOnly
            />

            <input
              type="number"
              id="guests"
              placeholder="Odamlar soni"
              min="1"
              max="75"
              required
              value={form.guests}
              onChange={(e) => setForm((prev) => ({ ...prev, guests: e.target.value }))}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Yuborilmoqda...' : 'Joy band qilish'}
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  )
}
