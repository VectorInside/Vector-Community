'use client';

import React from 'react';
import { SystemConfigHub } from '@/components/settings/SystemConfigHub';

export default function SettingsPage() {
  return <SystemConfigHub initialTab="policies" />;
}
