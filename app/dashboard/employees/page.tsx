'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Building2, 
  UserCheck, 
  UserMinus, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Download,
  MoreVertical,
  Briefcase,
  Trash2,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, on_leave: 0, terminated: 0 });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // Filter States
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    designation: '',
  });

  const fetchData = useCallback(async (resetPage = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: resetPage ? 1 : pagination.page,
        limit: pagination.limit,
      };

      if (searchQuery) params.search = searchQuery;
      if (filters.status) params.status = filters.status;
      if (filters.department) params.department = filters.department;
      if (filters.designation) params.designation = filters.designation;

      const response = await axiosInstance.get('/employees', { params });
      
      if (response.data.success) {
        setEmployees(response.data.employees || []);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            ...response.data.pagination,
            page: resetPage ? 1 : response.data.pagination.page
          }));
        }
        
        // Update stats if available in response or fallback
        setStats({
          total: response.data.pagination?.total || 0,
          active: (response.data.employees || []).filter((e: any) => e.status === 'active').length, // Fallback logic
          on_leave: (response.data.employees || []).filter((e: any) => e.status === 'on_leave').length,
          terminated: (response.data.employees || []).filter((e: any) => e.status === 'terminated').length,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to sync with Workforce Matrix.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, filters]);

  const handleTerminate = async (id: number) => {
    if (!window.confirm("Are you sure you want to terminate this employee? This action is irreversible.")) return;
    try {
      const response = await axiosInstance.delete(`/employees/${id}`);
      if (response.data.success) {
        fetchData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to terminate node.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Global Workforce
            <span className="px-3 py-1 bg-primary-blue/10 text-primary-blue text-[10px] rounded-full uppercase tracking-widest font-black">
              Enterprise Data
            </span>
          </h1>
          <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Manage and monitor your internal talent pool</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center justify-center gap-2 bg-white border border-gray-100 text-gray-900 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <Link href="/dashboard/employees/create" className="flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-blue transition-all shadow-xl shadow-gray-900/10 active:scale-95">
            <Plus className="w-4 h-4" />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Analytics Mini-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Workforce', value: stats.total, icon: Users, color: 'primary-blue' },
          { label: 'Active Personnel', value: stats.active || 0, icon: UserCheck, color: 'success-green' },
          { label: 'On Leave', value: stats.on_leave || 0, icon: Clock, color: 'warning-orange' },
          { label: 'Off-boarding', value: stats.terminated || 0, icon: UserMinus, color: 'red-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-gray-200 transition-all">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-${stat.color} group-hover:text-white transition-all text-gray-400`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white/50 backdrop-blur-xl border border-white p-4 rounded-[2.5rem] shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-primary-blue transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, ID or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/50 border border-gray-100 focus:border-primary-blue focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-bold text-xs text-gray-900 placeholder:text-gray-400 shadow-inner"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          <div className="flex bg-gray-100/50 p-1.5 rounded-2xl shrink-0">
             <Filter className="w-4 h-4 text-gray-400 mx-2 self-center" />
             <select 
               name="status"
               value={filters.status}
               onChange={handleFilterChange}
               className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-gray-600 cursor-pointer px-2"
             >
               <option value="">All Statuses</option>
               <option value="active">Active</option>
               <option value="on_leave">On Leave</option>
               <option value="terminated">Terminated</option>
               <option value="resigned">Resigned</option>
             </select>
          </div>

          <div className="flex bg-gray-100/50 p-1.5 rounded-2xl shrink-0">
             <Building2 className="w-4 h-4 text-gray-400 mx-2 self-center" />
             <select 
               name="department"
               value={filters.department}
               onChange={handleFilterChange}
               className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-gray-600 cursor-pointer px-2"
             >
               <option value="">All Departments</option>
               <option value="engineering">Engineering</option>
               <option value="marketing">Marketing</option>
               <option value="hr">HR</option>
               <option value="operations">Operations</option>
             </select>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm relative min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Personnel</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Department & Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID / Code</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Protocol Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr key="loader">
                    <td colSpan={5} className="py-20 text-center">
                       <div className="flex flex-col items-center gap-3">
                          <Loader2 className="animate-spin text-primary-blue" size={32} />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fetching Matrix...</p>
                       </div>
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr key="empty">
                    <td colSpan={5} className="py-20 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <Users size={48} className="text-gray-100" />
                          <div>
                            <p className="text-sm font-black text-gray-900 uppercase">No Personnel Found</p>
                            <p className="text-xs text-gray-400 mt-1">Adjust filters or search criteria pool.</p>
                          </div>
                          <button 
                            onClick={() => { setFilters({ status: '', department: '', designation: '' }); setSearchQuery(''); }}
                            className="text-[10px] font-black text-primary-blue uppercase tracking-widest hover:underline"
                          >
                            Clear All Filters
                          </button>
                       </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((employee, idx) => (
                    <motion.tr 
                      key={employee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-gray-50/50 transition-all cursor-pointer"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-black uppercase text-xs border border-primary-blue/20 group-hover:scale-110 transition-transform">
                            {employee.first_name?.[0]}{employee.last_name?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 tracking-tight">{employee.first_name} {employee.last_name}</p>
                            <p className="text-[10px] font-medium text-gray-400">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight italic flex items-center gap-1.5">
                            <Building2 size={10} className="text-primary-blue" />
                            {employee.department || "General"}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Briefcase size={10} />
                            {employee.designation || "Executive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="bg-gray-100 px-3 py-1 rounded-lg text-[10px] font-black text-gray-600 uppercase tracking-widest border border-gray-200 shadow-sm">
                          {employee.id_code || `EMP-${employee.id}`}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex justify-center">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border-2 ${
                            employee.status === 'active' ? 'bg-success-green/10 text-success-green border-success-green/20' :
                            employee.status === 'on_leave' ? 'bg-warning-orange/10 text-warning-orange border-warning-orange/20' :
                            'bg-red-50 text-red-500 border-red-100'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              employee.status === 'active' ? 'bg-success-green' :
                              employee.status === 'on_leave' ? 'bg-warning-orange' :
                              'bg-red-500'
                            }`} />
                            {employee.status || 'Active'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <Link 
                              href={`/dashboard/employees/${employee.id}/edit`}
                              className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-primary-blue hover:bg-white border border-transparent hover:border-gray-100 transition-all shadow-sm active:scale-95"
                            >
                               <Edit3 size={14} />
                            </Link>
                            <button 
                              onClick={() => handleTerminate(employee.id)}
                              className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-gray-100 transition-all shadow-sm active:scale-95"
                            >
                               <Trash2 size={14} />
                            </button>
                         </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Status / Error Toast Area */}
        {error && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce">
            <AlertCircle size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
           <button 
             disabled={pagination.page <= 1 || loading}
             onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
             className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary-blue disabled:opacity-50 transition-all shadow-sm"
           >
             <ChevronLeft size={18} />
           </button>
           <div className="flex gap-2">
             {[...Array(pagination.totalPages)].map((_, i) => (
               <button 
                 key={i}
                 onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                 className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                   pagination.page === i + 1 ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/20' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
                 }`}
               >
                 {i + 1}
               </button>
             ))}
           </div>
           <button 
             disabled={pagination.page >= pagination.totalPages || loading}
             onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
             className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary-blue disabled:opacity-50 transition-all shadow-sm"
           >
             <ChevronRight size={18} />
           </button>
        </div>
      )}
    </div>
  );
}
