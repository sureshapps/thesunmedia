import StaticPage from '@/components/site/StaticPage'
import useSeo from '@/lib/useSeo'

export default function AboutPage() {
  useSeo({ title: 'About Us', description: 'About The Sun Malaysia.' })
  return (
    <StaticPage title="About Us">
      <p>The Sun Malaysia is the nation’s premier English-language daily newspaper, proudly owned by <strong>Sun Media Corporation Sdn Bhd (221220-K)</strong>.</p>
      <p>Since our launch in 1993, we have been a cornerstone of Malaysian journalism, providing millions of readers with reliable, balanced, and concise news. On April 8, 2002, we solidified our place as Malaysia’s first national free daily, making quality journalism accessible to everyone.</p>
      <p>Our website, <strong>thesun.my</strong>, is the digital extension of this commitment, delivering real-time news and analysis to a diverse online audience across Malaysia and the world.</p>

      <h2>The Sun Malaysia Mission and Values</h2>
      <p><strong>Quality Journalism for the Digital Age.</strong> At The Sun, our mission is to empower our readers with accurate and timely information. Our editorial approach is driven by a deep commitment to integrity, authority, and impartiality.</p>

      <h3>Integrity</h3>
      <p>We adhere to the highest standards of journalism, striving for accuracy and transparency in all our reporting. Our readers’ trust is our greatest asset.</p>

      <h3>Authority</h3>
      <p>As a long-standing national newspaper, our expertise covers a wide range of topics, including national and international affairs, business, sports, and lifestyle. Our experienced editorial team ensures in-depth and authoritative coverage.</p>

      <h3>Relevance</h3>
      <p>We focus on the news that matters most to urban and educated Malaysians. Our content is crafted to be engaging and easily digestible, catering to the fast-paced lifestyle of our audience.</p>

      <h3>Accessibility</h3>
      <p>By providing our content for free, both in print and online, we ensure that quality news is accessible to all Malaysians.</p>

      <h2>The Sun Malaysia Story</h2>
      <p><strong>A Legacy of Excellence in Malaysian Media.</strong> The Sun’s journey is one of continuous growth and adaptation. Starting as a paid newspaper, we re-emerged in 2002 with a groundbreaking free distribution model, which transformed the local media landscape. Over the years, our dedication to public service journalism and insightful opinion writing has been recognized with multiple awards from the Society of Publishers in Asia (SOPA). Today, thesun.my continues this legacy, using digital platforms to deliver breaking news and thought-provoking stories instantly. Our online presence, powered by our trusted reputation, makes us a go-to source for anyone seeking reliable Malaysian news.</p>

      <h2>The Company</h2>
      <p>The Sun Malaysia is published by <strong>Sun Media Corporation Sdn Bhd (221220-K)</strong>. With our headquarters in Petaling Jaya, Selangor, we are committed to contributing to Malaysia’s dynamic media landscape. Our digital team works tirelessly to uphold the same standards of excellence that have defined The Sun for decades.</p>

      <h2>Connect With Us</h2>
      <p>Your feedback is invaluable. Stay connected with the latest news and stories by following us on social media and exploring the various sections of our website.</p>
      <p><strong>Head Office:</strong> Sun Media Corporation Sdn Bhd, Level 4, Lot 6, Jalan 51/217, 46050 Petaling Jaya, Selangor, Malaysia.</p>
      <p><strong>Email:</strong> Visit our <a href="/contact">Contact Us</a> page for specific department emails, including <a href="mailto:newsdesk@thesundaily.com">newsdesk@thesundaily.com</a> and <a href="mailto:feedback@thesundaily.com">feedback@thesundaily.com</a>.</p>
      <p className="font-semibold italic">The Sun Malaysia—Informing and empowering Malaysians for over three decades.</p>
    </StaticPage>
  )
}
