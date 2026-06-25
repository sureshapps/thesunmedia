import { Facebook, Instagram, Youtube } from 'lucide-react'

// Monochrome social icons — white icons, no brand color backgrounds.

function TikTokSvg(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.79a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.22z" />
    </svg>
  )
}

function XSvg(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TelegramSvg(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.5 2.5L2.5 10.2c-.9.3-.9 1.4 0 1.7l4.9 1.5 1.9 5.9c.2.7 1.1.9 1.6.3l2.5-2.8 4.6 3.4c.7.5 1.7.1 1.8-.7l2.6-15.4c.2-1-.7-1.8-1.6-1.4zM10 14.8l-.5 4 1.4-3.6 7.4-7-8.3 6.6z" />
    </svg>
  )
}

function WhatsAppSvg(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.8 3.3 1.3 5.2 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  )
}

export const SOCIAL = [
  { name: 'Facebook',  href: 'https://www.facebook.com/thesundaily',     icon: Facebook   },
  { name: 'Instagram', href: 'https://www.instagram.com/thesundaily',    icon: Instagram  },
  { name: 'X',         href: 'https://x.com/thesundaily',                icon: XSvg       },
  { name: 'YouTube',   href: 'https://www.youtube.com/@thesunmedia',     icon: Youtube    },
  { name: 'WhatsApp',  href: 'https://wa.me/thesunmalaysia',             icon: WhatsAppSvg },
]

export default function SocialIcons({ size = 'md', className = '', dark = false }) {
  const iconSize  = size === 'sm' ? 'w-3 h-3'   : 'w-3.5 h-3.5'
  const wrapSize  = size === 'sm' ? 'w-5 h-5'   : 'w-6 h-6'
  const colorCls  = dark ? 'text-foreground/60 hover:text-foreground' : 'text-white/70 hover:text-white'

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {SOCIAL.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className={`${wrapSize} flex items-center justify-center rounded ${colorCls} transition-colors shrink-0`}
        >
          <Icon className={iconSize} />
        </a>
      ))}
    </div>
  )
}