import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Lang, UiKey } from '../i18n/ui';
import { t as translate } from '../i18n/ui';

type LangValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: UiKey) => string;
  /** Pick the right side of a { en, sr } pair. */
  pick: <T>(pair: { en: T; sr: T }) => T;
};

const LangContext = createContext<LangValue | null>(null);

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'sr') return stored;
  } catch {
    // ignore
  }
  // Serbian visitors get Serbian; everyone else gets English.
  return navigator.language?.toLowerCase().startsWith('sr') ? 'sr' : 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((l) => (l === 'en' ? 'sr' : 'en')), []);

  const value = useMemo<LangValue>(
    () => ({
      lang,
      setLang,
      toggle,
      t: (key: UiKey) => translate(key, lang),
      pick: <T,>(pair: { en: T; sr: T }) => pair[lang],
    }),
    [lang, setLang, toggle],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
