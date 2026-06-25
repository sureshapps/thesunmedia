import StaticPage from '@/components/site/StaticPage'
import useSeo from '@/lib/useSeo'

export default function AdvertisePage() {
  useSeo({ title: 'Advertise', description: 'Advertise with theSun Malaysia.' })
  return (
    <StaticPage title="Advertise" subtitle="Reach millions of readers across Malaysia and beyond.">
      <p className="text-muted-foreground">This page is coming soon. For all advertising enquiries, please contact <a href="mailto:advertise@thesundaily.com">advertise@thesundaily.com</a> or call <strong>+603-7784 8888</strong>.</p>
    </StaticPage>
  )
}
