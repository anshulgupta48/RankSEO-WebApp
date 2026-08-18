'use client';
import { useState } from 'react';
import {
  KeywordSearchRow,
  KeywordSearchValues,
} from '@/components/ai-keyword/keywordSearchRow';
import { KeywordReport } from '@/lib/keyword-report';
import { KeywordLandingState } from '@/components/ai-keyword/keywordLandingState';
import { KeywordReportView } from '@/components/reports/keywordReportView';
import { ReportFailed } from '@/components/reports/reportFailed';
import { LiveReportProgress } from '@/components/reports/liveReportProgress';
import { KeywordResearchResponse } from '@/types/keyword-research';

const AIKeyword = () => {
  const [submittedKeyword, setSubmittedKeyword] = useState<string | null>(null);
  const [researchFinished, setResearchFinished] = useState(false);
  const [researchSucceeded, setResearchSucceeded] = useState(false);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const [reportResult, setReportResult] = useState<KeywordReport | null>(null);
  const [submittedSearch, setSubmittedSearch] =
    useState<KeywordSearchValues | null>(null);
  const [researchResponse, setResearchResponse] =
    useState<KeywordResearchResponse | null>(null);

  const billing = {
    data: {
      usage: {
        keywordSearches: {
          remaining: 5,
        },
      },
      isPaid: true,
    },
  };

  const isResearching = false;
  const handleSearch = () => {};
  const handleResearchComplete = () => {};

  return (
    <div className='min-h-full bg-muted/20'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-6 sm:px-8'>
        <KeywordSearchRow
          isSearching={isResearching}
          onSearch={handleSearch}
          remaining={billing.data?.usage.keywordSearches.remaining}
          isPaid={billing.data?.isPaid}
        />

        {researchResponse && submittedKeyword && !researchFinished ? (
          <LiveReportProgress
            keyword={submittedKeyword}
            initialProgress={researchResponse.report}
            runId={researchResponse.runId}
            accessToken={researchResponse.publicAccessToken}
            onComplete={handleResearchComplete}
          />
        ) : researchFinished &&
          researchSucceeded &&
          submittedKeyword &&
          reportResult ? (
          <KeywordReportView keyword={submittedKeyword} report={reportResult} />
        ) : researchFinished && !researchSucceeded ? (
          <ReportFailed
            errorMessage={failureMessage}
            isRetrying={false}
            onRetry={submittedSearch ? () => {} : undefined}
          />
        ) : (
          <KeywordLandingState />
        )}
      </div>
    </div>
  );
};

export default AIKeyword;
