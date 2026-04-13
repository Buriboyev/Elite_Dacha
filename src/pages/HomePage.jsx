import { useEffect } from 'react'
import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import Stats from '../components/Stats.jsx'
import About from '../components/About.jsx'
import Gallery from '../components/Gallery.jsx'
import Pricing from '../components/Pricing.jsx'
import Location from '../components/Location.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'
import ScrollTopBtn from '../components/ScrollTopBtn.jsx'
import PageShell from '../components/PageShell.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { useManagedMeta } from '../hooks/useManagedMeta.js'

export default function HomePage() {
  useReveal()
  useManagedMeta({
    title: 'Sangardak Dacha | Elite Dacha Sangardak dam olish maskani',
    description:
      "Sangardak dacha qidiryapsizmi? Elite Dacha Sangardakda basseyn, karaoke, tandir, barbekyu va oilaviy dam olish uchun qulay sharoitlar mavjud.",
    path: '/',
    keywords:
      'sangardak dacha, elite dacha sangardak, sangardakdagi dacha, sangardak dam olish maskani, dacha sangardak, sangardak hovli',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageShell>
      <ScrollTopBtn />
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <Gallery />
        <Pricing />
        <Location />
        <Contact />
      </main>
      <Footer />
    </PageShell>
  )
}
