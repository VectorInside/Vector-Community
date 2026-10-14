'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GeneralModal } from '@/components/common/GeneralModal';

export const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const isMicroLanding = pathname?.startsWith('/m/') || pathname === '/m';
  const isStandalonePage = pathname === '/login' || pathname === '/landing';

  if (isMicroLanding) {
    return <>{children}</>;
  }

  if (isStandalonePage) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] selection:bg-[#E7F900] selection:text-black">
        <GeneralModal />
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden selection:bg-[#E7F900] selection:text-black">
      <GeneralModal />
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[var(--bg-base)] w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
};

