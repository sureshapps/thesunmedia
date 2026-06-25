import { Link } from 'react-router-dom'
import { LOGO_URL } from '@/lib/wp'

export default function Logo({ className = '', size = 'md', to = '/' }) {
  const sizes = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20',
  }
  return (
    <Link to={to} className={`inline-flex items-center ${className}`} aria-label="theSun - Home">
      <img src={LOGO_URL} alt="theSun" className={`${sizes[size]} w-auto object-contain`} />
    </Link>
  )
}
