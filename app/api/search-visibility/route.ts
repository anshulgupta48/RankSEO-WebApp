import { z } from 'zod';
import { tasks } from '@trigger.dev/sdk';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ReportStatus } from '@/generated/prisma/client';
import { visibilitySearchSchema } from '@/lib/search-visibility-schema';
import type { searchVisibilityTask } from '@/trigger/search-visibility';

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const requestBody = await request.json().catch(() => null);
  const input = visibilitySearchSchema.safeParse(requestBody);
  if (!input.success) {
    return NextResponse.json(
      {
        message: 'Enter a valid website, brand, and topic',
        errors: z.flattenError(input.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const usage = { allowed: true };
  if (!usage.allowed) {
    return NextResponse.json(
      {
        message: 'You have reached your AI visibility scan limit.',
        code: 'LIMIT_REACHED',
      },
      { status: 403 },
    );
  }

  const report = await prisma.report.create({
    data: {
      userId: session.user.id,
      type: 'VISIBILITY',
      status: ReportStatus.PENDING,
      progress: 5,
      currentStep: 'Preparing visibility scan',
      website: input.data.website,
      brand: input.data.brand,
      topic: input.data.topic,
    },
    select: {
      id: true,
      status: true,
      progress: true,
      currentStep: true,
    },
  });

  try {
    const handle = await tasks.trigger<typeof searchVisibilityTask>(
      'search-visibility',
      {
        jobId: report.id,
        website: input.data.website,
        brand: input.data.brand,
        topic: input.data.topic,
      },
      {
        tags: [`report:${report.id}`, `user:${session.user.id}`],
      },
    );

    await prisma.report.update({
      where: { id: report.id },
      data: { triggerRunId: handle.id },
      select: { id: true },
    });

    return NextResponse.json(
      {
        jobId: report.id,
        runId: handle.id,
        publicAccessToken: handle.publicAccessToken,
        report: {
          status: report.status,
          progress: report.progress,
          currentStep: report.currentStep ?? 'Preparing visibility scan',
        },
      },
      { status: 202 },
    );
  } catch (error) {
    console.error('Failed to start AI visibility scan', {
      reportId: report.id,
      error,
    });

    await prisma.report.update({
      where: { id: report.id },
      data: {
        status: ReportStatus.FAILED,
        currentStep: 'Could not start AI visibility scan',
        errorMessage: 'The AI visibility job could not be started.',
      },
      select: { id: true },
    });

    return NextResponse.json(
      { message: 'Failed to start AI visibility scan' },
      { status: 500 },
    );
  }
}
