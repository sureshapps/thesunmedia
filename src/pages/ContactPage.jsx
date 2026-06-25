import StaticPage from '@/components/site/StaticPage'
import SocialIcons from '@/components/site/SocialIcons'
import useSeo from '@/lib/useSeo'
import { Phone, Printer, MapPin, Mail } from 'lucide-react'

const DEPTS = [
  ['News Desk (General)', 'newsdesk@thesundaily.com'],
  ['Business Desk', 'sunbiz@thesundaily.com'],
  ['Lifestyle & Entertainment Desk', 'lifestyle@thesundaily.com'],
  ['Sports Desk', 'sunsport@thesundaily.com'],
  ['Motoring Desk', 'gearup@thesundaily.com'],
  ['Letters to the Editor', 'letters@thesundaily.com'],
  ['Advertising & Marketing', 'advertise@thesundaily.com'],
  ['Distribution & Subscriptions', 'subscribe@thesundaily.com'],
  ['General Feedback', 'feedback@thesundaily.com'],
  ['Human Resources', 'hr@thesundaily.com'],
  ['Finance', 'finance@thesundaily.com'],
]

const SOCIAL_HANDLES = [
  ['Facebook', '@thesundaily'],
  ['Instagram', '@thesundaily'],
  ['Telegram', 'thesuntelegram'],
  ['TikTok', '@thesundaily'],
  ['X (Twitter)', '@thesundaily'],
  ['WhatsApp', '@thesunmalaysia'],
  ['YouTube', '@thesunmedia'],
]

export default function ContactPage() {
  useSeo({ title: 'Contact Us', description: 'Get in touch with theSun Malaysia.' })
  return (
    <StaticPage title="Contact Us" subtitle="We welcome your feedback, inquiries, and contributions. Whether you're a reader, an advertiser, or have a general query, we're here to help.">
      <div className="grid md:grid-cols-2 gap-8 not-prose">
        <section className="bg-muted/40 rounded-lg p-6">
          <h2 className="font-serif-headline text-xl font-bold mb-4">Headquarters</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <span>
                <strong>Sun Media Corporation Sdn Bhd (221220-K)</strong><br />
                Level 4, Lot 6, Jalan 51/217<br />
                46050 Petaling Jaya, Selangor, Malaysia
              </span>
            </li>
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> <span><strong>General:</strong> +603-7784 6688</span></li>
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> <span><strong>Advertising:</strong> +603-7784 8888</span></li>
            <li className="flex items-center gap-3"><Printer className="h-4 w-4 text-primary" /> <span><strong>Fax:</strong> +603-7785 2625</span></li>
          </ul>
        </section>

        <section className="bg-muted/40 rounded-lg p-6">
          <h2 className="font-serif-headline text-xl font-bold mb-4">Connect on Social Media</h2>
          <p className="text-sm text-muted-foreground mb-4">Follow us on our social media channels for the latest news, updates, and behind-the-scenes content.</p>
          <SocialIcons />
          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
            {SOCIAL_HANDLES.map(([k, v]) => (
              <li key={k}><strong>{k}:</strong> <span className="text-muted-foreground">{v}</span></li>
            ))}
          </ul>
        </section>
      </div>

      <h2 className="mt-10">Email Us by Department</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 mt-2">
        {DEPTS.map(([dept, email]) => (
          <a key={email} href={`mailto:${email}`} className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary hover:shadow-sm transition">
            <Mail className="h-4 w-4 mt-1 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-sm">{dept}</div>
              <div className="text-xs text-muted-foreground break-all">{email}</div>
            </div>
          </a>
        ))}
      </div>
    </StaticPage>
  )
}
