import AppIcon from './AppIcon.jsx'

export default function About() {
  const features = [
    { title: 'Basseyn', desc: 'Toza va zamonaviy basseynda salqin dam oling.', icon: null },
    {
      title: 'Tandir va Barbekyu',
      desc: "Do'stlaringiz bilan mazali ovqatlar tayyorlash imkoniyati.",
      icon: 'fire',
    },
    { title: 'Tabiat', desc: "Sangardakning go'zal tabiati va toza havosi.", icon: null },
    {
      title: 'PlayStation',
      desc: "Maroqli o'yinlar bilan vaqt o'tkazish imkoniyati.",
      icon: 'playstation',
    },
    {
      title: 'Karaoke',
      desc: "Qo'shiqlar bilan vaqt o'tkazish imkoniyati.",
      icon: 'microphone',
    },
  ]

  return (
    <section id="about">
      <h2 className="section-title reveal">
        <AppIcon name="info" style={{ color: 'var(--text)' }} />{' '}
        Biz haqimizda
      </h2>

      <p className="about-text">
        Elite Dacha Sangardak tog'lari bag'rida joylashgan zamonaviy dam olish maskani. Bu
        yerda siz tabiat qo'ynida oila va do'stlaringiz bilan unutilmas dam olishingiz mumkin.
      </p>
 

      <div className="about-cards reveal">
        {features.map((f) => (
          <div className="about-card reveal" key={f.title}>
            <h3>
              {f.icon && (
                <AppIcon name={f.icon} style={{ color: 'var(--text)', marginRight: '6px' }} />
              )}
              {f.title}
            </h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
