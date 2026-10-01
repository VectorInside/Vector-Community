'use client';

import React from 'react';
import { PerformanceDashboard } from '@/components/metrics/PerformanceDashboard';

export default function PerformancePage() {
  return (
    <div className="animate-fadeIn">
      <PerformanceDashboard />
    </div>
  );
}
