import React from 'react';
import { getCurrentUser } from '@/lib/permissions/rbac';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'BIDDROHO CMS & CRM Portal',
  description: 'Administration and operations portal for heavy rock band BIDDROHO.',
  robots: { index: false, follow: false },
  icons: {
    icon: '/assets/logo.png',
    shortcut: '/assets/logo.png',
    apple: '/assets/logo.png'
  }
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If not logged in, children will be the /admin/login page or middleware redirected
  if (!user) {
    return <>{children}</>;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .admin-root-layout,
          .admin-main-container {
            display: block !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #111827 !important;
            min-height: auto !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
        }
      ` }} />
      <div className="admin-root-layout" style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#09090b',
        color: '#f4f4f5',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <AdminSidebar user={user} />
        <div className="admin-main-container" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowX: 'hidden',
          backgroundColor: '#0c0c0e'
        }}>
          {children}
        </div>
      </div>
    </>
  );
}
