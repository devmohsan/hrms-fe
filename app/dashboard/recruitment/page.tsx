'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Users, 
  Calendar, 
  MapPin, 
  Clock,
  Briefcase,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Timer,
  Loader2,
  AlertCircle,
  Award,
  Share2,
  X,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ all: 0, active: 0, draft: 0, closed: 0 });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const fetchStats = useCallback(async () => {
    try {
      const [allRes, activeRes, draftRes, closedRes] = await Promise.all([
        axiosInstance.get('/jobs', { params: { limit: 1 } }),
        axiosInstance.get('/jobs', { params: { status: 'active', limit: 1 } }),
        axiosInstance.get('/jobs', { params: { status: 'draft', limit: 1 } }),
        axiosInstance.get('/jobs', { params: { status: 'closed', limit: 1 } }),
      ]);

      setStats({
        all: allRes.data.pagination?.total || 0,
        active: activeRes.data.pagination?.total || 0,
        draft: draftRes.data.pagination?.total || 0,
        closed: closedRes.data.pagination?.total || 0,
      });
    } catch (err) {
      console.error("Failed to fetch job stats", err);
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (searchQuery) params.search = searchQuery;
      if (activeTab !== 'All') {
        const statusMap: any = {
          'Active': 'active',
          'On Hold': 'draft',
          'Closed': 'closed'
        };
        params.status = statusMap[activeTab] || activeTab.toLowerCase();
      }

      const response = await axiosInstance.get('/jobs', { params });
      if (response.data.success) {
        setRecruitments(response.data.data);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sync with Talent Terminal.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 500); 
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Recruitment Suite
            <span className="px-3 py-1 bg-primary-blue/10 text-primary-blue text-[10px] rounded-full uppercase tracking-widest font-black">
              Enterprise
            </span>
          </h1>
          <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Manage your global talent acquisition pipeline</p>
        </div>
        <Link href="/dashboard/recruitment/create" className="group flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-blue transition-all shadow-xl shadow-gray-900/10 active:scale-95">
          <Plus className="w-4 h-4" />
          Post New Job
        </Link>
      </div>

      {/* Analytics Mini-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-primary-blue/20 transition-all">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Openings</p>
            <p className="text-3xl font-black text-gray-900">{stats.active}</p>
          </div>
          <div className="w-12 h-12 bg-primary-blue/5 rounded-2xl flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white transition-all">
            <Briefcase size={20} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-success-green/20 transition-all">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Jobs</p>
            <p className="text-3xl font-black text-gray-900">{stats.all}</p>
          </div>
          <div className="w-12 h-12 bg-success-green/5 rounded-2xl flex items-center justify-center group-hover:bg-success-green group-hover:text-white transition-all">
            <Users size={20} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-warning-orange/20 transition-all">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Draft / Hold</p>
            <p className="text-3xl font-black text-gray-900">{stats.draft}</p>
          </div>
          <div className="w-12 h-12 bg-warning-orange/5 rounded-2xl flex items-center justify-center group-hover:bg-warning-orange group-hover:text-white transition-all">
            <Timer size={20} />
          </div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white/50 backdrop-blur-xl border border-white p-4 rounded-[2.5rem] shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex bg-gray-100/50 p-1.5 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
          {[
            { label: 'All', count: stats.all },
            { label: 'Active', count: stats.active },
            { label: 'On Hold', count: stats.draft },
            { label: 'Closed', count: stats.closed }
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.label 
                  ? 'bg-white text-primary-blue shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-md text-[8px] ${
                activeTab === tab.label ? 'bg-primary-blue/10 text-primary-blue' : 'bg-gray-200/50 text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-primary-blue transition-colors" />
          <input 
            type="text" 
            placeholder="Filter by title or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/50 border border-gray-100 focus:border-primary-blue focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-bold text-xs shadow-inner"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 text-red-600">
          <AlertCircle size={24} />
          <p className="font-bold text-sm uppercase tracking-wider">{error}</p>
        </div>
      )}

      {/* Recruitment Cards List */}
      <div className="grid grid-cols-1 gap-6 relative min-h-[400px] items-start">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center py-20"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-primary-blue" size={40} />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Loading Recruitment Data...</p>
              </div>
            </motion.div>
          ) : recruitments.length > 0 ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-4 w-full items-start"
            >
              {recruitments.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200 w-full"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-black text-gray-900">No Recruitments Found</h3>
              <p className="text-gray-400 font-medium mt-2">Try adjusting your filters or search keywords.</p>
              <button 
                onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
                className="mt-6 text-primary-blue font-black uppercase tracking-widest text-[10px] hover:underline"
              >
                Reset All filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination (Simplified for now) */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(pagination.totalPages)].map((_, i) => (
             <button
               key={i}
               onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
               className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                 pagination.page === i + 1 
                   ? 'bg-gray-900 text-white shadow-lg' 
                   : 'bg-white text-gray-400 hover:bg-gray-100'
               }`}
             >
               {i + 1}
             </button>
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ job, index }: { job: any; index: number }) {
  const [showMenu, setShowMenu] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setSharing(true);
    try {
      const response = await axiosInstance.get(`/jobs/${job.id}/share-whatsapp`);
      if (response.data.success && response.data.data.whatsapp_url) {
        setWhatsappUrl(response.data.data.whatsapp_url);
        setShowShareModal(true);
      }
    } catch (err) {
      console.error("Failed to get WhatsApp share URL", err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      key={job.id}
      className="group block bg-white hover:bg-gray-50/50 border border-gray-100 p-5 md:p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-gray-200/30 transition-all cursor-pointer relative"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-[2rem] ${
          job.status === 'active' ? 'bg-success-green' : 
          job.status === 'draft' ? 'bg-warning-orange' : 'bg-gray-300'
      }`}></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex gap-5 items-start">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform shrink-0">
            <Briefcase size={24} className="text-gray-400 group-hover:text-primary-blue transition-colors" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-lg font-black text-gray-900 tracking-tight capitalize">{job.role_title}</h3>
              <div className="flex flex-wrap gap-2 mt-0.5">
                {job.skills?.slice(0, 3).map((skill: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px] font-black uppercase tracking-tighter">
                    {skill}
                  </span>
                ))}
                {job.assessment_format && (
                  <span className="px-2 py-0.5 bg-primary-blue/5 text-primary-blue border border-primary-blue/10 rounded text-[8px] font-black uppercase tracking-tighter">
                    {job.assessment_format}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2">
              <span className="flex items-center gap-1.5 text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                <MapPin size={10} />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5 text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                <Clock size={10} />
                {job.work_mode}
              </span>
              <span className="flex items-center gap-1.5 text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                <Award size={10} />
                {job.experience} Yrs Exp.
              </span>
            </div>
          </div>
        </div>

         <div className="flex flex-wrap items-center gap-8">
          <Link 
            href={`/dashboard/recruitment/${job.id}/applications`}
            className="flex flex-col items-center gap-0.5 bg-gray-50/80 p-2.5 rounded-xl min-w-[80px] hover:bg-white transition-colors border border-gray-100/50 hover:shadow-md active:scale-95 group/stats cursor-pointer"
          >
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none group-hover/stats:text-primary-blue transition-colors">Applicants</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Users size={12} className="text-primary-blue" />
              <span className="text-lg font-black text-gray-900">{job.application_count || 0}</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
              <div className="flex items-center gap-2 justify-end">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  job.status === 'active' ? 'bg-success-green animate-pulse' : 
                  job.status === 'draft' ? 'bg-warning-orange' : 'bg-gray-300'
                }`}></div>
                <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">{job.status}</span>
              </div>
            </div>
            
            <div className="flex gap-2 relative">
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-all active:scale-90 shadow-sm border border-gray-100"
                >
                  <MoreVertical size={14} />
                </button>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50"
                    >
                      <button 
                        onClick={handleShareClick}
                        disabled={sharing}
                        className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-600 hover:text-primary-blue group/item disabled:opacity-50"
                      >
                        <div className="w-8 h-8 bg-primary-blue/5 rounded-lg flex items-center justify-center group-hover/item:bg-primary-blue group-hover/item:text-white transition-colors">
                          {sharing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{sharing ? 'Link...' : 'Share Job'}</span>
                      </button>

                      <Link 
                        href={`/dashboard/recruitment/${job.id}/assessment`}
                        className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-600 hover:text-primary-blue group/item"
                      >
                        <div className="w-8 h-8 bg-purple-500/5 rounded-lg flex items-center justify-center group-hover/item:bg-purple-500 group-hover/item:text-white transition-colors">
                          <HelpCircle size={14} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Assessment</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link 
                href={`/dashboard/recruitment/${job.id}/applications`}
                className="flex items-center gap-2 bg-primary-blue/5 hover:bg-primary-blue hover:text-white text-primary-blue px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all group/btn shadow-sm active:scale-95"
              >
                View
                <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-primary-blue/10 rounded-2xl flex items-center justify-center text-primary-blue">
                    <Share2 size={24} />
                  </div>
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Share Job Opening</h3>
                <p className="text-gray-500 font-medium text-sm mb-8 leading-relaxed">
                  The recruitment link is ready to be shared. You can now send it to your professional network.
                </p>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      if (whatsappUrl) window.open(whatsappUrl, '_blank');
                      setShowShareModal(false);
                    }}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-blue transition-all shadow-xl shadow-gray-900/10 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Share2 size={16} />
                    Share on WhatsApp
                  </button>
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
