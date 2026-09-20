import { useLang } from '../lib/useLang';
import { useTheme } from '../lib/useTheme';
import { Globe, Moon, Sun } from './icons';

const buttonClass =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface ' +
  'px-2.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLang();
  return (
    <button type="button" onClick={toggle} className={buttonClass} aria-label={t('theme.toggle')} title={t('theme.toggle')}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}

export function LangToggle() {
  const { lang, toggle, t } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      className={buttonClass}
      aria-label={t('lang.toggle')}
      title={t('lang.toggle')}
    >
      <Globe />
      <span className="font-mono text-[11px] uppercase tracking-wider">{lang === 'en' ? 'EN' : 'SR'}</span>
    </button>
  );
}
