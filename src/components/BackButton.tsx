'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackButton({
  fallbackHref = '/',
  variant = 'outline',
  className,
}: {
  fallbackHref?: string;
  variant?: 'outline' | 'secondary';
  className?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <Button variant={variant} onClick={handleBack} className={className}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      返回
    </Button>
  );
}
