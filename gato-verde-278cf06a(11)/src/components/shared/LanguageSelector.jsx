import React from 'react';
import { useTranslation } from '../i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { locale, setLocale } = useTranslation();

  const languages = [
    { code: 'pt', label: '🇧🇷 PT', name: 'Português' },
    { code: 'en', label: '🇺🇸 EN', name: 'English' },
    { code: 'es', label: '🇪🇸 ES', name: 'Español' }
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" style={{ color: 'var(--mist-primary)' }} />
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          className={`text-sm px-3 py-1 ${
            locale === lang.code 
              ? 'mist-button-primary' 
              : 'mist-button-tertiary'
          }`}
          size="sm"
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}