import {
  FaArrowLeft,
  FaCalendarCheck,
  FaChartBar,
  FaCheck,
  FaDownload,
  FaFire,
  FaHome,
  FaInfoCircle,
  FaInstagram,
  FaImages,
  FaMapMarkerAlt,
  FaMicrophone,
  FaPenSquare,
  FaPhone,
  FaPlaystation,
  FaPlus,
  FaSignOutAlt,
  FaStar,
  FaTag,
  FaTelegramPlane,
  FaTrash,
} from 'react-icons/fa'

const icons = {
  arrowLeft: FaArrowLeft,
  calendarCheck: FaCalendarCheck,
  chartBar: FaChartBar,
  check: FaCheck,
  download: FaDownload,
  fire: FaFire,
  home: FaHome,
  info: FaInfoCircle,
  instagram: FaInstagram,
  images: FaImages,
  location: FaMapMarkerAlt,
  microphone: FaMicrophone,
  penSquare: FaPenSquare,
  phone: FaPhone,
  playstation: FaPlaystation,
  plus: FaPlus,
  signOut: FaSignOutAlt,
  star: FaStar,
  tag: FaTag,
  telegram: FaTelegramPlane,
  trash: FaTrash,
}

export default function AppIcon({ name, className = '', ...props }) {
  const IconComponent = icons[name]

  if (!IconComponent) {
    return null
  }

  const classes = ['app-icon', className].filter(Boolean).join(' ')

  return <IconComponent className={classes} aria-hidden="true" {...props} />
}
