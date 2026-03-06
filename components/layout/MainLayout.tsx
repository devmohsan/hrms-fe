'use client';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-gray">
      <Navbar />
      <Sidebar />
      <main className="p-4 lg:ml-64 pt-24 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
