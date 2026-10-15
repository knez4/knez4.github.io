import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { Cursor, IntroReady, Preloader, SmoothScroll } from './components/Stage';
import { scrollToTarget } from './lib/motion';
import { useLang } from './lib/useLang';
import CvPage from './pages/CvPage';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProjectCase from './pages/ProjectCase';

/** Jump to the hash target on navigation, otherwise go to the top. */
function ScrollBehaviour() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        scrollToTarget(el);
        return;
      }
    }
    scrollToTarget(0, true);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  const onIntroDone = useCallback(() => setReady(true), []);

  return (
    <IntroReady.Provider value={ready}>
      <SmoothScroll />
      <Cursor />
      <Preloader onDone={onIntroDone} />
      <a href="#main" className="skip-link">
        {t('nav.skipToContent')}
      </a>
      <ScrollBehaviour />
      <Nav />
      {/* The nav is fixed; every page but the home stage needs room under it. */}
      <main id="main" className={pathname === '/' ? '' : 'pt-[72px] print:pt-0'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projekti/:id" element={<ProjectCase />} />
          <Route path="/cv" element={<CvPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </IntroReady.Provider>
  );
}
