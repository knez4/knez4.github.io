import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { profile } from '../data/profile';
import { useLang } from '../lib/useLang';
import { Close, GitHub, LinkedIn, Menu } from './icons';
import { LangToggle, ThemeToggle } from './Toggles';

const sections = [
  { id: 'projects', key: 'nav.projects' },
  { id: 'schema', key: 'nav.schema' },
  { id: 'skills', key: 'nav.skills' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'contact', key: 'nav.contact' },
] as const;

export function Nav() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const onHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile panel whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={
        'no-print sticky top-0 z-40 transition-colors duration-200 ' +
        (scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'bg-transparent')
      }
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link to="/" className="flex items-center gap-2.5 rounded-md font-medium">
          <span
            className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-mono text-[12px]
                       font-bold text-accent-fg"
            aria-hidden="true"
          >
            {profile.initials}
          </span>
          <span className="hidden text-sm sm:inline">{profile.name}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={onHome ? `#${s.id}` : `/#${s.id}`}
              className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
            >
              {t(s.key)}
            </a>
          ))}
          <Link
            to="/cv"
            className="ml-1 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
          >
            {t('nav.cv')}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface
                       text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:inline-flex"
            aria-label="GitHub"
          >
            <GitHub />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface
                       text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:inline-flex"
            aria-label="LinkedIn"
          >
            <LinkedIn />
          </a>
          <LangToggle />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line
                       bg-surface text-muted hover:text-fg md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t('nav.menu')}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-bg md:hidden">
          <div className="container-page flex flex-col py-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={onHome ? `#${s.id}` : `/#${s.id}`}
                className="rounded-md px-2 py-3 text-sm text-muted hover:text-fg"
                onClick={() => setOpen(false)}
              >
                {t(s.key)}
              </a>
            ))}
            <Link to="/cv" className="rounded-md px-2 py-3 text-sm text-muted hover:text-fg">
              {t('nav.cv')}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
