'use client';
import { CheckIcon, CircleIcon, LoaderCircleIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { KeywordReport } from '@/lib/keyword-report';
import type { KeywordResearchResponse } from '@/types/keyword-research';

const keywordSteps = [
  'Preparing keyword search',
  'Collecting research sources',
  'Reviewing cited sources',
  'Analysing research findings',
  'Building keyword report',
];

type LiveReportProgressProps = {
  accessToken: string;
  initialProgress: KeywordResearchResponse['report'];
  keyword: string;
  onComplete: (
    result: KeywordReport | null,
    succeeded: boolean,
    errorMessage?: string,
  ) => void;
  runId: string;
};

export function LiveReportProgress({
  initialProgress,
  keyword,
}: LiveReportProgressProps) {
  const run = {
    metadata: {
      progress: 40,
      currentStep: 'Collecting research sources',
    },
  };

  const error = {
    message: 'The live report connection was interrupted. Please try again.',
  };

  const metadataProgress = run?.metadata?.progress;
  const metadataStep = run?.metadata?.currentStep;
  const progress =
    typeof metadataProgress === 'number'
      ? metadataProgress
      : initialProgress.progress;

  const currentStep =
    typeof metadataStep === 'string'
      ? metadataStep
      : initialProgress.currentStep;
  const safeProgress = Math.min(100, Math.max(0, progress));
  const matchedStepIndex = keywordSteps.findIndex(
    (step) => step === currentStep,
  );
  const activeStepIndex = Math.max(0, matchedStepIndex);

  return (
    <Card
      className='rounded-2xl border shadow-none ring-0 [--card-spacing:--spacing(7)]'
      aria-live='polite'
      aria-label={`Generating report for ${keyword}`}
    >
      <CardHeader className='border-b'>
        <CardTitle className='text-2xl font-semibold tracking-tight normal-case'>
          Generating your report
        </CardTitle>
        <CardDescription className='text-base'>
          You can leave this page. RankSEO will keep processing the report.
        </CardDescription>
      </CardHeader>

      <CardContent className='flex flex-col gap-7'>
        {error && (
          <div
            className='rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive'
            role='alert'
          >
            {error.message ||
              'The live report connection was interrupted. Please try again.'}
          </div>
        )}

        <div className='flex flex-col gap-2.5'>
          <div className='flex items-center justify-between gap-4 text-sm'>
            <span className='font-semibold'>{currentStep}</span>
            <span className='font-semibold tabular-nums'>{safeProgress}%</span>
          </div>

          <div
            className='h-2 overflow-hidden rounded-full bg-muted'
            role='progressbar'
            aria-label={`Report generation progress for ${keyword}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safeProgress}
          >
            <div
              className='h-full rounded-full bg-primary transition-[width] duration-500'
              style={{ width: `${safeProgress}%` }}
            />
          </div>
        </div>

        <div className='grid gap-x-10 gap-y-4 sm:grid-cols-2'>
          {keywordSteps.map((step, index) => {
            const isComplete = index < activeStepIndex;
            const isActive = index === activeStepIndex;

            return (
              <div key={step} className='flex items-center gap-3 text-sm'>
                {isComplete ? (
                  <span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <CheckIcon className='size-4' aria-hidden='true' />
                  </span>
                ) : isActive ? (
                  <span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <LoaderCircleIcon
                      className='size-4 animate-spin'
                      aria-hidden='true'
                    />
                  </span>
                ) : (
                  <span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                    <CircleIcon className='size-3.5' aria-hidden='true' />
                  </span>
                )}

                <span className={isActive ? 'font-semibold' : undefined}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
