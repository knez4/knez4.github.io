import { Link } from 'react-router-dom';
import { useLang } from '../lib/useLang';

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-6xl font-semibold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-semibold">{t('notFound.title')}</h1>
      <Link to="/" className="btn btn-primary mt-6">
        {t('notFound.back')}
      </Link>
    </div>
  );
}
