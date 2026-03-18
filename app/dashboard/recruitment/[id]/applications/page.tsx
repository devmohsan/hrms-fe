'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Users, 
  ChevronLeft, 
  Search, 
  Filter, 
  MoreHorizontal, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Award,
  FileText, 
  ExternalLink,
  Loader2,
  Clock,
  Briefcase,
  DollarSign,
  Eye,
  ArrowUpRight,
  Zap,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

export default function JobApplicationsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [jobInfo, setJobInfo] = useState<any>(null);
  
  // New Filter States
  const [filters, setFilters] = useState({
    status: '',
    location: '',
    experience: '',
    expected_salary: '',
  });

  // State for Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const fetchData = async (resetPage = false) => {
    try {
      setLoading(true);
      
      // Fetch Job Info if not already fetched
      if (!jobInfo) {
        const jobResponse = await axiosInstance.get(`/jobs/${id}`);
        if (jobResponse.data.success) {
          setJobInfo(jobResponse.data.data);
        }
      }

      // Prepare query parameters
      const params: any = {
        page: resetPage ? 1 : pagination.page,
        limit: pagination.limit,
      };

      if (searchQuery) params.search = searchQuery;
      if (filters.status) params.status = filters.status;
      if (filters.location) params.location = filters.location;
      if (filters.experience) params.experience = filters.experience;
      if (filters.expected_salary) params.expected_salary = filters.expected_salary;

      const response = await axiosInstance.get(`/applications/job/${id}`, { params });
      
      if (response.data.success) {
        setApplications(response.data.applications || []);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            ...response.data.pagination
          }));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load application matrix.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, pagination.page, filters]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary-blue" size={48} />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Loading Applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-3 hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 shadow-sm"
            >
              <ChevronLeft size={20} className="text-gray-900" />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900 tracking-tight">Candidate Review</h1>
              <p className="text-[10px] font-black text-primary-blue uppercase tracking-widest leading-none mt-0.5">
                {jobInfo?.role_title} • {pagination.total} Applicants
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
              <Users size={14} className="text-gray-400" />
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{pagination.total} Total</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-grow max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search by candidate name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-4 pl-12 pr-4 outline-none focus:border-primary-blue transition-all font-bold text-xs text-gray-900 placeholder:text-gray-400 shadow-sm hover:shadow-md"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-4 border rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-sm ${
                  showFilters ? 'bg-primary-blue text-white border-primary-blue' : 'bg-white border-gray-100 text-gray-400 hover:text-primary-blue'
                }`}
              >
                <Filter size={16} />
                {showFilters ? 'Hide Filters' : 'Filter Applications'}
              </button>
            </div>
          </div>

          {/* Advanced Filters Bar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-sm">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Status</label>
                    <select 
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[10px] font-bold text-gray-900 outline-none focus:border-primary-blue transition-all"
                    >
                      <option value="" className="text-gray-900">All Statuses</option>
                      <option value="applied" className="text-gray-900">Applied</option>
                      <option value="screening" className="text-gray-900">Screening</option>
                      <option value="shortlisted" className="text-gray-900">Shortlisted</option>
                      <option value="interview_scheduled" className="text-gray-900">Interview</option>
                      <option value="hired" className="text-gray-900">Hired</option>
                      <option value="rejected" className="text-gray-900">Rejected</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Location</label>
                    <input 
                      name="location"
                      type="text"
                      placeholder="e.g. London"
                      value={filters.location}
                      onChange={handleFilterChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[10px] font-bold text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-blue transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Min. Experience</label>
                    <input 
                      name="experience"
                      type="number"
                      placeholder="Years"
                      value={filters.experience}
                      onChange={handleFilterChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[10px] font-bold text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-blue transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Max. Salary (Expected)</label>
                    <input 
                      name="expected_salary"
                      type="text"
                      placeholder="Max Amount"
                      value={filters.expected_salary}
                      onChange={handleFilterChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[10px] font-bold text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-blue transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Applications List as List */}
        <div className="flex flex-col gap-6 relative min-h-[400px]">
          {loading && applications.length > 0 && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-[3rem]">
              <Loader2 className="animate-spin text-primary-blue" size={32} />
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {applications.length > 0 ? (
              <div className="flex flex-col gap-6">
                {applications.map((app, index) => (
                  <ApplicationCard key={app.id} application={app} index={index} jobId={id} />
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-20 bg-white rounded-[3rem] border border-dashed border-gray-200 text-center"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-200" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">No Applications Found</h3>
                <p className="text-gray-400 font-medium text-sm">No applicants found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setFilters({ status: '', location: '', experience: '', expected_salary: '' });
                    setSearchQuery('');
                  }}
                  className="mt-6 text-primary-blue font-black uppercase tracking-widest text-[10px] hover:underline"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
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
              className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary-blue disabled:opacity-50 transition-all shadow-sm group"
            >
              <ChevronLeft size={18} className="rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


function ApplicationCard({ application, index, jobId }: { application: any, index: number, jobId: any }) {
  const [showModal, setShowModal] = useState(false);
  const metadata = typeof application.metadata === 'string' ? JSON.parse(application.metadata) : application.metadata;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all relative overflow-hidden"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform relative">
            <div className="bg-primary-blue text-white w-full h-full flex items-center justify-center rounded-2xl font-black text-xl">
              {application.full_name?.charAt(0)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-gray-900 tracking-tight group-hover:text-primary-blue transition-colors line-clamp-1">{application.full_name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                application.status === 'shortlisted' || application.status === 'hired' ? 'bg-success-green/10 text-success-green border border-success-green/20' :
                application.status === 'rejected' ? 'bg-red-50 text-red-500 border border-red-100' :
                application.status === 'under_review' ? 'bg-warning-orange/10 text-warning-orange border border-warning-orange/20' :
                'bg-gray-100 text-gray-400 border border-gray-200'
              }`}>
                {application.status || 'Pending'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-gray-400 truncate max-w-[250px]">
              <Mail size={12} />
              <span className="text-[10px] font-medium truncate">{application.email}</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-300 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Card Info */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100/50">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Location</p>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <MapPin size={10} className="text-primary-blue shrink-0" />
            <span className="text-[10px] font-black text-gray-900 truncate uppercase tracking-tight">{application.location || 'Unknown'}</span>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100/50">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Exp Level</p>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Briefcase size={10} className="text-success-green shrink-0" />
            <span className="text-[10px] font-black text-gray-900 truncate uppercase tracking-tight">{metadata?.total_experience || 'N/A'} Yrs</span>
          </div>
        </div>
        <div className="col-span-2 bg-primary-blue/5 p-3 rounded-2xl border border-primary-blue/10">
          <p className="text-[8px] font-black text-primary-blue uppercase tracking-widest leading-none mb-1.5">Comp Expectations (Monthly)</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <DollarSign size={10} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Current:</span>
              <span className="text-[10px] font-black text-gray-900">{metadata?.current_salary || 'N/A'}</span>
            </div>
            <div className="w-px h-3 bg-primary-blue/20 mx-2" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-primary-blue uppercase tracking-tight">Expected:</span>
              <span className="text-[10px] font-black text-primary-blue">{metadata?.expected_salary || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-400">
          <span>Applied On</span>
          <div className="flex items-center gap-1 text-gray-900">
            <Calendar size={12} className="text-primary-blue" />
            {application.applied_at 
              ? new Date(application.applied_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : 'Date Unknown'}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {application.resume_url && (
            <a 
              href={application.resume_url?.startsWith('http') ? application.resume_url : `${process.env.NEXT_PUBLIC_RESOURCES_URL}${application.resume_url}`} 
              target="_blank" 
              className="px-4 flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-blue transition-all shadow-lg shadow-gray-900/10 active:scale-95 group/resume"
            >
              <FileText size={14} className="group-hover:rotate-12 transition-transform" />
              CV
            </a>
          )}
          <Link 
            href={`/dashboard/recruitment/${jobId}/applications/${application.id}`}
            className="flex-grow flex items-center justify-center gap-3 bg-primary-blue/5 hover:bg-primary-blue text-primary-blue hover:text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 group/analyze border border-primary-blue/10"
          >
            <Zap size={14} className="group-hover:animate-pulse" />
            Review Profile
          </Link>
          <button 
            onClick={() => setShowModal(true)}
            className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 hover:text-primary-blue transition-all active:scale-95 group/details"
            title="View Full Profile"
          >
            <Eye size={16} className="group-hover:scale-110 transition-transform" />
          </button>
          {metadata?.portfolio_link && (
            <a 
              href={metadata.portfolio_link}
              target="_blank"
              className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 hover:text-success-green transition-all active:scale-95 group/link"
              title="Portfolio / LinkedIn"
            >
              <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary-blue text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shadow-primary-blue/20">
                      {application.full_name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">{application.full_name}</h3>
                      <p className="text-[10px] font-black text-primary-blue uppercase tracking-[0.2em]">{application.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm border border-gray-100"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-10">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ModalStat label="Notice Period" value={metadata?.notice_period} icon={<Clock size={14}/>} color="orange" />
                    <ModalStat label="Current Status" value={metadata?.current_status} icon={<Briefcase size={14}/>} color="blue" />
                    <ModalStat label="Experience" value={`${metadata?.total_experience} Yrs`} icon={<Award size={14}/>} color="green" />
                    <ModalStat label="Phone" value={application.phone} icon={<Phone size={14}/>} color="purple" />
                  </div>

                  {/* Introduction */}
                  <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText size={18} className="text-primary-blue" />
                      <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Protocol Introduction</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {metadata?.introduction || "No introduction provided."}
                    </p>
                  </div>

                  {/* Custom Info / Assets */}
                  {metadata?.custom_info && metadata.custom_info.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Users size={18} className="text-success-green" />
                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Additional Info</h4>
                      </div>
                      <ul className="space-y-2">
                        {metadata.custom_info.map((info: any, i: number) => (
                          <li key={i} className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{info}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}

function ModalStat({ label, value, icon, color }: { label: string, value: string, icon: JSX.Element, color: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 bg-${color}-50`}>
      <div className="mb-2">{icon}</div>
      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
      <p className="text-[10px] font-black text-gray-900">{value || 'N/A'}</p>
    </div>
  );
}
