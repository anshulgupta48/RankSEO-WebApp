import { z } from 'zod';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { tasks } from '@trigger.dev/sdk';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ReportStatus } from '@/generated/prisma/client';
import type { keywordResearchTask } from '@/trigger/keyword-research';

const keywordResearchInputSchema = z.object({
  keyword: z.string().trim().min(2).max(120),
  country: z
    .string()
    .trim()
    .transform((country) => country.toUpperCase())
    .pipe(z.string().regex(/^[A-Z]{2}$/)),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const requestBody = await request.json().catch(() => null);
  const input = keywordResearchInputSchema.safeParse(requestBody);

  if (!input.success) {
    return NextResponse.json(
      {
        message: 'Enter a valid keyword and two-letter country code',
        errors: z.flattenError(input.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const usage = { allowed: true };
  if (!usage.allowed) {
    return NextResponse.json(
      {
        message: 'You have reached your keyword research limit.',
        code: 'LIMIT_REACHED',
      },
      { status: 403 },
    );
  }

  const report = await prisma.report.create({
    data: {
      userId: session.user.id,
      type: 'KEYWORD',
      status: ReportStatus.PENDING,
      progress: 5,
      currentStep: 'Preparing keyword search',
      keyword: input.data.keyword,
      country: input.data.country,
    },
    select: {
      id: true,
      status: true,
      progress: true,
      currentStep: true,
    },
  });

  try {
    const handle = await tasks.trigger<typeof keywordResearchTask>(
      'keyword-research',
      {
        jobId: report.id,
        keyword: input.data.keyword,
        country: input.data.country,
      },
      {
        tags: [`report:${report.id}`, `user:${session.user.id}`],
      },
    );

    await prisma.report.update({
      where: {
        id: report.id,
      },
      data: {
        triggerRunId: handle.id,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(
      {
        jobId: report.id,
        runId: handle.id,
        publicAccessToken: handle.publicAccessToken,
        report: {
          status: report.status,
          progress: report.progress,
          currentStep: report.currentStep ?? 'Preparing keyword search',
        },
      },
      { status: 202 },
    );
  } catch (error) {
    console.error('Failed to start keyword research', {
      reportId: report.id,
      error,
    });

    await prisma.report.update({
      where: {
        id: report.id,
      },
      data: {
        status: ReportStatus.FAILED,
        currentStep: 'Could not start keyword research',
        errorMessage: 'The keyword research job could not be started.',
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(
      { message: 'Failed to start keyword research' },
      { status: 500 },
    );
  }
}
