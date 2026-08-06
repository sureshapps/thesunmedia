import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import HomePage from '@/pages/HomePage'
import ArticlePage from '@/pages/ArticlePage'
import CategoryPage from '@/pages/CategoryPage'
import TagPage from '@/pages/TagPage'
import SearchPage from '@/pages/SearchPage'
import LatestPage from '@/pages/LatestPage'
import VideoPage from '@/pages/VideoPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PrintDigitalPage from '@/pages/PrintDigitalPage'
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage'
import ContactPage from '@/pages/ContactPage'
import AboutPage from '@/pages/AboutPage'
import DisclaimerPage from '@/pages/DisclaimerPage'
import AdvertisePage from '@/pages/AdvertisePage'
import TermsPage from '@/pages/TermsPage'
import InstallPrompt from '@/components/site/InstallPrompt'
import BackToTop from '@/components/site/BackToTop'

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, search])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ScrollToTop />
      <SiteHeader />
<main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/tag/:slug" element={<TagPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/latest" element={<LatestPage />} />
          <Route path="/category/videos" element={<VideoPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/advertise" element={<AdvertisePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/get-newspaper" element={<PrintDigitalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
      <InstallPrompt />
      <BackToTop />
    </div>
  )
}
