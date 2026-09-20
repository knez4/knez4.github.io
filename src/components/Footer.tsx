import { profile } from '../data/profile';
import { useLang } from '../lib/useLang';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="no-print border-t border-line py-10">
      <div className="container-page flex flex-col gap-3 text-[12px] text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
        <p className="font-mono">{t('footer.builtWith')}</p>
      </div>
    </footer>
  );
}
