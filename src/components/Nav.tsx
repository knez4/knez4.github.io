import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { profile } from '../data/profile';
import { useLang } from '../lib/useLang';
import { Logo } from './Logo';

const sections = [
  { id: 'services', key: 'nav.services' },
  { id: 'process', key: 'nav.process' },
  { id: 'about', key: 'nav.about' },
  { id: 'projects', key: 'nav.work' },
  { id: 'tech', key: 'nav.tech' },
] as const;

function LangSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="flex items-center rounded-full border border-fg/12 p-0.5 font-mono text-[11px]" role="group" aria-label={t('lang.toggle')}>
      {(['sr', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={
            'rounded-full px-2.5 py-1 uppercase tracking-wider transition-colors ' +
            (lang === l ? 'bg-fg text-bg' : 'text-muted hover:text-fg')
          }
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onHome = pathname === '/';
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header
      className={
        'no-print fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ' +
        (scrolled && !open ? 'border-b border-fg/10 bg-bg/[0.92]' : 'border-b border-transparent')
      }
    >
      <nav className="container-page flex h-[72px] items-center justify-between gap-4" aria-label="Main">
        <Link to="/" className="group flex items-center gap-3 rounded-full" aria-label={profile.name}>
          <Logo className="h-10 w-10" spin />
          <span className="hidden text-[14px] font-semibold tracking-tight sm:inline">{profile.name}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={href(s.id)}
              className="group px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted"
            >
              {/* The clip box is the line itself, not the padded link, so the outgoing copy fully leaves. */}
              <span className="relative block overflow-hidden">
                <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">{t(s.key)}</span>
                <span
                  className="absolute inset-0 block translate-y-full text-accent transition-transform duration-300 ease-out group-hover:translate-y-0"
                  aria-hidden="true"
                >
                  {t(s.key)}
                </span>
              </span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LangSwitch />
          {/* Visible at every width: on a phone this is the one action that matters most. */}
          <a
            href={href('contact')}
            className="btn-pill btn-pill--solid !px-4 !py-2 !text-[11px] sm:!px-6 sm:!py-2.5 sm:!text-[12px]"
            data-magnetic
          >
            {t('nav.talk')}
          </a>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-fg/12 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t('nav.menu')}
          >
            <span className={'absolute h-px w-4 bg-fg transition-transform duration-300 ' + (open ? 'rotate-45' : '-translate-y-1')} />
            <span className={'absolute h-px w-4 bg-fg transition-transform duration-300 ' + (open ? '-rotate-45' : 'translate-y-1')} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={
          'fixed inset-0 top-[72px] bg-bg transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden ' +
          (open ? '[clip-path:inset(0_0_0_0)]' : 'pointer-events-none [clip-path:inset(0_0_100%_0)]')
        }
        aria-hidden={!open}
      >
        <div className="container-page flex h-full flex-col justify-between pb-10 pt-6">
          <div className="flex flex-col">
            {[...sections, { id: 'contact', key: 'nav.contact' } as const].map((s, i) => (
              <a
                key={s.id}
                href={href(s.id)}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="font-display flex items-baseline gap-3 border-b border-fg/10 py-3 text-[clamp(2.6rem,12vw,5rem)] text-fg"
              >
                <span className="font-mono text-[11px] tracking-widest text-accent">0{i + 1}</span>
                {t(s.key)}
              </a>
            ))}
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted">
            <Link to="/cv" tabIndex={open ? 0 : -1} className="text-fg">
              {t('nav.cv')} ↗
            </Link>
            <a href={profile.github} tabIndex={open ? 0 : -1}>GitHub</a>
            <a href={profile.linkedin} tabIndex={open ? 0 : -1}>LinkedIn</a>
          </div>
        </div>
      </div>
    </header>
  );
}
