import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import AppSidebar from './_components/AppSidebar';

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='w-full'>
        {children}
      </div>
    </SidebarProvider>
  );
}

export default DashboardProvider;
