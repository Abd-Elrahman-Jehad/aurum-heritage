import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppProvider } from './lib/state'
import { SmoothScroll } from './lib/smooth'
import { NavProvider } from './lib/nav'
import Header from './components/Header'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import Loader from './components/Loader'
import Home from './pages/Home'
import Anatomy from './pages/Anatomy'
import CollectionPage from './pages/CollectionPage'
import WatchPage from './pages/WatchPage'
import Pricing from './pages/Pricing'
import Seo from './components/Seo'
import About from './pages/About'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <SmoothScroll>
        <NavProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="anatomy" element={<Anatomy />} />
              <Route path="collection" element={<CollectionPage />} />
              <Route path="watch/:id" element={<WatchPage />} />
              <Route path="details" element={<Navigate to="/collection" replace />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="legal" element={<Legal />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Loader />
          <Seo />
        </NavProvider>
      </SmoothScroll>
    </AppProvider>
  )
}
