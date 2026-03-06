'use client';

import Link from 'next/link';
import { Users, Clock, FileText, UserPlus, TrendingUp, Briefcase, ChevronRight } from 'lucide-react';

const stats = [
  { label: 'Total Employees', value: '1,248', change: '+12%', icon: Users, color: 'text-primary-blue', bg: 'bg-primary-blue/10' },
  { label: 'Time & Attendance', value: '98.5%', change: '+2.4%', icon: Clock, color: 'text-success-green', bg: 'bg-success-green/10' },
  { label: 'Open Positions', value: '24', change: '-3%', icon: Briefcase, color: 'text-warning-orange', bg: 'bg-warning-orange/10' },
  { label: 'Pending Leaves', value: '18', change: '+5', icon: FileText, color: 'text-error-red', bg: 'bg-error-red/10' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark-gray">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, here's what's happening today.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-md">
          <UserPlus className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-sm font-bold ${stat.change.startsWith('+') ? 'text-success-green' : 'text-error-red'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-text-dark-gray mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-text-dark-gray">Recent Activities</h2>
            <button className="text-primary-blue text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-dark-gray">New employee registration</p>
                  <p className="text-xs text-gray-400">Ahmed Khan joined the Design Team</p>
                </div>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recruitment Snapshot */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="p-6 bg-gray-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black tracking-tight leading-none italic uppercase">Hiring Protocol</h2>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Live Acquisition Feed</p>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Briefcase size={20} className="text-primary-blue" />
              </div>
            </div>
            
            <div className="p-3 space-y-3">
              {[
                { title: 'Senior Developer', count: 12, status: 'Active' },
                { title: 'UX Designer', count: 8, status: 'Active' },
              ].map((job, i) => (
                <div key={i} className="group p-4 bg-gray-50/50 hover:bg-white border border-gray-100/50 hover:border-primary-blue/20 rounded-2xl transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-black text-gray-900 tracking-tight">{job.title}</h3>
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary-blue bg-primary-blue/5 px-2 py-0.5 rounded">
                      {job.count} Applications
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-success-green animate-pulse"></div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{job.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
               <Link 
                href="/dashboard/recruitment" 
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm"
               >
                 Go to Talent Terminal
                 <ChevronRight size={14} />
               </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Action Matrix</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-5 rounded-[2rem] border border-gray-100 hover:bg-primary-blue/5 hover:border-primary-blue/20 transition-all gap-3 group bg-gray-50/30">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary-blue" />
                </div>
                <span className="text-[9px] font-black italic uppercase text-gray-600 tracking-widest">Reports</span>
              </button>
              <button className="flex flex-col items-center justify-center p-5 rounded-[2rem] border border-gray-100 hover:bg-success-green/5 hover:border-success-green/20 transition-all gap-3 group bg-gray-50/30">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-success-green" />
                </div>
                <span className="text-[9px] font-black italic uppercase text-gray-600 tracking-widest">Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
