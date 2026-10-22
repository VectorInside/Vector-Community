'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GeneralModal } from '@/components/common/GeneralModal';

export const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const { closeMobileSidebar } = useAuth();
  const isMicroLanding = pathname?.startsWith('/m/') || pathname === '/m';
  const isStandalonePage = pathname === '/' || pathname === '/login' || pathname === '/landing';

  // Automatically dismiss mobile sidebar on route change
  useEffect(() => {
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
  }, [pathname]);

  if (isMicroLanding) {
    return <>{children}</>;
  }

  if (isStandalonePage) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] selection:bg-[#c3f400] selection:text-black">
        <GeneralModal />
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden selection:bg-[#c3f400] selection:text-black">
      <GeneralModal />
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[var(--bg-base)] w-full relative min-w-0">
          <div className="w-full max-w-[1920px] 2xl:max-w-[96vw] mx-auto min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

