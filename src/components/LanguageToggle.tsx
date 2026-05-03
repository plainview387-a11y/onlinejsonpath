'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage} className="min-w-[72px]">
      {language === 'zh' ? 'EN' : '中文'}
    </Button>
  );
}
