import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, Briefcase, Settings, CreditCard, PieChart } from 'lucide-react';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Employees', href: '/employees' },
  { icon: Calendar, label: 'Attendance', href: '/attendance' },
  { icon: Briefcase, label: 'Recruitment', href: '/dashboard/recruitment' },
  { icon: PieChart, label: 'Payroll', href: '/payroll' },
  { icon: CreditCard, label: 'Subscriptions', href: '/subscriptions' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 lg:translate-x-0">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 group transition-colors ${
                    isActive ? 'bg-primary-blue/10 text-primary-blue font-semibold' : ''
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition duration-75 ${isActive ? 'text-primary-blue' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100">
          <div className="p-4 rounded-xl bg-primary-blue/5 border border-primary-blue/10">
            <h4 className="text-sm font-bold text-primary-blue">Enterprise Plan</h4>
            <p className="text-xs text-gray-500 mt-1">Upgrade for more features</p>
            <button className="mt-3 w-full py-2 bg-primary-blue text-white text-xs rounded-lg font-bold hover:bg-opacity-90">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
