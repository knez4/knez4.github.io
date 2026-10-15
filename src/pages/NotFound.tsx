import { Link } from 'react-router-dom';
import { Ball } from '../components/Logo';
import { useLang } from '../lib/useLang';

/** A basketball miss for a missing page. The ball rolls off the line on a loop. */
export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="container-page relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden py-20 text-center">
      <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-accent">404 · {t('notFound.title')}</p>
      <h1 className="font-display mt-6 text-[clamp(4.5rem,22vw,18rem)] text-fg">Airball.</h1>
      <p className="mt-6 max-w-md text-[16px] leading-relaxed text-muted">{t('notFound.lead')}</p>
      <Link to="/" className="btn-pill btn-pill--solid mt-10" data-magnetic>
        {t('notFound.back')}
      </Link>

      <div className="pointer-events-none relative mt-16 h-16 w-full max-w-xl" aria-hidden="true">
        <span className="absolute inset-x-0 bottom-0 h-px bg-fg/15" />
        <span className="absolute bottom-0 left-0 h-12 w-12 animate-[roll_5s_linear_infinite]">
          <Ball className="h-full w-full" />
        </span>
      </div>
    </div>
  );
}
