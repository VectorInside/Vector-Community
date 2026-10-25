'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GeneralModal } from '@/components/common/GeneralModal';
import { ClientPasswordChangeModal } from '@/components/common/ClientPasswordChangeModal';
import { INITIAL_BUSINESS_ACCOUNTS } from '@/utils/mockAccounts';

export const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const { closeMobileSidebar, role, activeTenantKey } = useAuth();
  const [clientMustChangeAccount, setClientMustChangeAccount] = useState(null);

  const isMicroLanding = pathname?.startsWith('/m/') || pathname === '/m';
  const isStandalonePage = pathname === '/' || pathname === '/login' || pathname === '/landing';

  // Automatically dismiss mobile sidebar on route change
  useEffect(() => {
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
  }, [pathname, closeMobileSidebar]);

  // Check if current client user must change their temporary password
  useEffect(() => {
    if (role === 'client' && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vector_tenant_owner_accounts');
        const list = saved ? JSON.parse(saved) : INITIAL_BUSINESS_ACCOUNTS;
        const currentAccount =
          list.find((a) => a.tenantId === activeTenantKey) ||
          list.find((a) => a.status === 'ACTIVE');

        if (currentAccount && currentAccount.mustChangePassword) {
          setClientMustChangeAccount(currentAccount);
        } else {
          setClientMustChangeAccount(null);
        }
      } catch (e) {
        setClientMustChangeAccount(null);
      }
    } else {
      setClientMustChangeAccount(null);
    }
  }, [role, activeTenantKey, pathname]);

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

      {/* Pop-up de Actualización de Contraseña Obligatoria al entrar para Clientes */}
      {clientMustChangeAccount && (
        <ClientPasswordChangeModal
          account={clientMustChangeAccount}
          isOpen={true}
          onClose={() => setClientMustChangeAccount(null)}
          onSuccess={() => setClientMustChangeAccount(null)}
        />
      )}

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

