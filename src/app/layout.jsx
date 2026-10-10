import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

export const metadata = {
  title: 'Vector Community OS — Master Control | Vector Inside',
  description: 'Arquitectura de gobernanza HITL, Orquestación Multi-Agente, Multi-Tenant RAG y Soberanía Financiera impulsada por Vector Inside.',
  icons: {
    icon: '/vector-inside-logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&family=Montserrat:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased selection:bg-[#E7F900] selection:text-black">
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
