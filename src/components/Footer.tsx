import { profile } from '../data/profile';
import { scrollToTarget } from '../lib/motion';
import { useLang } from '../lib/useLang';
import { Logo } from './Logo';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="no-print relative overflow-hidden border-t border-fg/10 pt-16">
      <div className="container-page flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <p className="text-[13px] text-muted">
            &copy; {new Date().getFullYear()} {profile.name}
          </p>
        </div>
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="btn-pill btn-pill--ghost self-start sm:self-auto"
          data-magnetic
        >
          {t('footer.top')} ↑
        </button>
      </div>

      {/* The name once more, cut off by the bottom edge. */}
      <p
        className="font-display pointer-events-none mt-12 select-none whitespace-nowrap text-center text-[12.2vw] leading-[0.75] text-fg/[0.06]"
        aria-hidden="true"
      >
        VELJKO KNEŽEVIĆ
      </p>
    </footer>
  );
}
