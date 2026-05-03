'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackButton({ fallbackHref = '/' }: { fallbackHref?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <Button variant="outline" onClick={handleBack}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      返回上一页
    </Button>
  );
}
