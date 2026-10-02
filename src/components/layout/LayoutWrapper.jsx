'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GeneralModal } from '@/components/common/GeneralModal';

export const LayoutWrapper = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden selection:bg-[#E5FF00] selection:text-black">
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
