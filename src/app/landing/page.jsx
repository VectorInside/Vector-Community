import { AnalyticsLandingPage } from '@/components/landing/AnalyticsLandingPage';

export const metadata = {
  title: 'Vector Analytics — Modern SaaS Telemetry & AI Control OS',
  description:
    'Real-time SaaS analytics dashboard and conversational intelligence platform. Sub-second telemetry, Meta CAPI server attribution, DeepSeek R1 AI triage, and multi-tenant RAG sovereignty.',
};

export default function LandingRoute() {
  return <AnalyticsLandingPage />;
}
