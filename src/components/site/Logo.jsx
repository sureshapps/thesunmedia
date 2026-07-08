import { Link } from 'react-router-dom'

// New logo asset — place `logo.png` in your project's `public/` folder
// so it's served at this path (e.g. public/logo.png).
const LOGO_URL = '/logo.png'

export default function Logo({ className = '', size = 'md', to = '/' }) {
  const sizes = {
    sm: 'h-9',
    md: 'h-14',
    lg: 'h-16',
    xl: 'h-24',
  }
  return (
    <Link to={to} className={`inline-flex items-center ${className}`} aria-label="theSun - Home">
      <img src={LOGO_URL} alt="theSun" className={`${sizes[size]} w-auto object-contain`} />
    </Link>
  )
}
