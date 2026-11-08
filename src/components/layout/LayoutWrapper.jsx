'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GeneralModal } from '@/components/common/GeneralModal';
import { ClientPasswordChangeModal } from '@/components/common/ClientPasswordChangeModal';
import { OnboardingTour } from '@/components/common/OnboardingTour';
import { INITIAL_BUSINESS_ACCOUNTS } from '@/utils/mockAccounts';

export const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { closeMobileSidebar, role, activeTenantKey, isAuthenticated, authChecking } = useAuth();
  const [clientMustChangeAccount, setClientMustChangeAccount] = useState(null);

  const isMicroLanding = pathname?.startsWith('/m/') || pathname === '/m';
  const isStandalonePage = pathname === '/' || pathname === '/login' || pathname === '/landing';

  // Automatically dismiss mobile sidebar on route change
  useEffect(() => {
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
  }, [pathname, closeMobileSidebar]);

  // Guard estricto de sesión y conexión a PostgreSQL:
  // Si no está autenticado contra PostgreSQL (o la BD está apagada), redirigir a /login
  useEffect(() => {
    if (!isMicroLanding && !isStandalonePage && !authChecking && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isMicroLanding, isStandalonePage, authChecking, isAuthenticated, router]);

  // Check if current client user must change their temporary password
  useEffect(() => {
    if (role === 'client' && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vector_tenant_owner_accounts');
        const list = saved ? JSON.parse(saved) : INITIAL_BUSINESS_ACCOUNTS;
        const currentAccount = list.find((a) => a.tenantId === activeTenantKey) || null;

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

  // Mientras se verifica la sesión con el servidor, mostrar indicador limpio
  if (authChecking || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07080A] text-white flex flex-col items-center justify-center gap-3 font-mono text-xs">
        <div className="w-6 h-6 border-2 border-[#c3f400] border-t-transparent rounded-full animate-spin" />
        <span className="text-zinc-400">Verificando sesión...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden selection:bg-[#c3f400] selection:text-black">
      <GeneralModal />
      <OnboardingTour />

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
