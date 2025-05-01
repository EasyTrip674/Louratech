import React, { Suspense } from 'react';
import StatsStepLayout from '@/components/Dashboards/StepDashboard/StatsStep/StatsStepLayout';
import ClientsStepLayout from '@/components/Dashboards/StepDashboard/ClientsStep/ClientsStepLayout';
import ClientsStepLayoutSkeleton from '@/components/Dashboards/StepDashboard/ClientsStep/ClientsStepSkeleton';
import StatsStepSkeleton from '@/components/Dashboards/StepDashboard/StatsStep/StatsStepSkeleton';

type PageProps = {
  params: {
    procedureId: string;
    stepId: string;
  };
};

export default async function StepDetailPage({ params }: PageProps) {
  
  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header section with breadcrumb and actions */}
    <Suspense fallback={<StatsStepSkeleton />}>
        <StatsStepLayout stepId={params.stepId} />
    </Suspense>

      {/* Client table */}
     <Suspense fallback={<ClientsStepLayoutSkeleton />}>
        <ClientsStepLayout stepId={params.stepId} />
     </Suspense>
    </div>
  );
}