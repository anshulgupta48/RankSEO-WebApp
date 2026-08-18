import type { ReactNode } from 'react';
import Link from 'next/link';
import { LockKeyholeIcon, SparklesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type FeatureLockProps = {
  children: ReactNode;
  locked?: boolean;
  title?: string;
  description?: string;
  actionLabel?: string;
  className?: string;
};

export function FeatureLock({
  children,
  locked = true,
  title = 'Unlock this insight',
  description = 'Upgrade to Pro to access this insight and the complete analysis.',
  actionLabel = 'Unlock with Pro',
  className,
}: FeatureLockProps) {
  if (!locked) return <>{children}</>;

  return (
    <div
      className={cn(
        'relative isolate min-h-64 overflow-hidden rounded-xl border border-primary/20 bg-primary/5',
        className,
      )}
    >
      <div aria-hidden='true' className='flex flex-col gap-4 p-6 opacity-60'>
        <div className='grid grid-cols-[1fr_0.7fr] gap-4'>
          <Skeleton className='h-4' />
          <Skeleton className='h-4' />
        </div>
        <Skeleton className='h-4' />
        <Skeleton className='h-4' />
        <Skeleton className='h-4' />
        <div className='grid grid-cols-[0.7fr_1fr] gap-4'>
          <Skeleton className='h-4' />
          <Skeleton className='h-4' />
        </div>
      </div>

      <div className='absolute inset-0 flex items-center justify-center bg-background/50 p-4 backdrop-blur-[2px]'>
        <div className='flex max-w-sm flex-col items-center gap-3 text-center'>
          <span className='flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-sm'>
            <LockKeyholeIcon className='size-5' aria-hidden='true' />
          </span>
          <div className='flex flex-col gap-1'>
            <p className='font-semibold'>{title}</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              {description}
            </p>
          </div>
          <Button
            size='sm'
            render={<Link href='/billing' />}
            nativeButton={false}
          >
            <SparklesIcon data-icon='inline-start' />
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
