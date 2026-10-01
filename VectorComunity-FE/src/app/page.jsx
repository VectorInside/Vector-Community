'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { CentroDeMando } from '@/components/dashboard/CentroDeMando';
import { SoberaniaFinanciera } from '@/components/metrics/SoberaniaFinanciera';

export default function HomePage() {
  const { isClient } = useAuth();

  if (isClient) {
    return <SoberaniaFinanciera />;
  }

  return <CentroDeMando />;
}
