import { CreditCardIcon } from 'lucide-react';
import {
  ManageBillingButton,
  PricingSection,
} from '@/components/pricing/pricingSection';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentBillingStatus } from '@/lib/billing';

export default async function BillingPage() {
  const billing = await getCurrentBillingStatus();
  const currentPlan = billing?.plan ?? 'free';
  const activeSubscription = billing?.subscription;
  const currentPlanName =
    currentPlan === 'free' ? 'Free' : currentPlan === 'pro' ? 'Pro' : 'Plus';

  return (
    <div className='mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-7 sm:px-8'>
      <Card className='rounded-2xl border shadow-none ring-0'>
        <CardHeader>
          <CardTitle className='text-xl normal-case tracking-tight'>
            Your current plan
          </CardTitle>
          <CardDescription>
            You are currently using RankSEO {currentPlanName}.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <span className='flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <CreditCardIcon className='size-4' aria-hidden='true' />
            </span>
            <span className='flex flex-col gap-0.5'>
              <span className='font-semibold'>{currentPlanName} plan</span>
              <span className='text-sm text-muted-foreground'>
                {activeSubscription
                  ? activeSubscription.cancelAtPeriodEnd
                    ? 'Cancels at the end of the billing period'
                    : 'Active Stripe subscription'
                  : 'No active paid subscription'}
              </span>
            </span>
          </div>

          {activeSubscription ? (
            <ManageBillingButton />
          ) : (
            <p className='text-sm text-muted-foreground'>
              Upgrade below to increase your monthly limits.
            </p>
          )}
        </CardContent>
      </Card>

      <PricingSection
        context='billing'
        currentPlan={currentPlan}
        currentSubscriptionId={activeSubscription?.stripeSubscriptionId}
      />
    </div>
  );
}
