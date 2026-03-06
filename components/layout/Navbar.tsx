import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, Briefcase, Settings, Menu, X, Bell } from 'lucide-react';
import { useState } from 'react';

import { signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/" className="flex items-center gap-2 ml-2 md:mr-24 font-bold">
              <img 
                src="/logo.png" 
                alt="Workforce One Logo" 
                className="h-12 w-auto object-contain"
              />
              <span className="text-xl font-black tracking-tighter text-gray-900">
                WORKFORCE<span className="text-primary-blue">ONE</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-error-red"></span>
            </button>
            <div className="flex items-center ml-3 gap-3">
              <button 
                onClick={handleLogout}
                className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
              <button className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300">
                <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center text-white font-bold">
                  JS
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
