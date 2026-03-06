'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Award, 
  DollarSign, 
  CheckCircle2, 
  ChevronLeft,
  Share2,
  Users,
  Timer,
  Shield,
  Zap,
  Loader2,
  ArrowRight,
  Target,
  BrainCircuit,
  Settings,
  Building2,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`/jobs/${id}`);
        if (response.data.success) {
          setJob(response.data.data);
        } else {
          setError("Failed to locate protocol data.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Transmission interrupted. Protocol not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary-blue" size={48} />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Decoding Protocol Matrix...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Shield size={32} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2 font-mono">CRITICAL ERROR</h1>
        <p className="text-gray-500 font-medium mb-8 max-w-xs">{error || "The requested data block is unavailable at this terminal."}</p>
        <button 
          onClick={() => router.push('/dashboard/recruitment')}
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-blue transition-all"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  const stages = [
    { label: 'Initial Form', weight: job.form_weight, icon: <CheckCircle2 size={16} /> },
    { label: 'Video / AI Assessment', weight: job.video_weight, icon: <Users size={16} /> },
    { label: 'Technical Protocol', weight: job.technical_weight, icon: <BrainCircuit size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation */}
      <div className="sticky top-0 z-[60] bg-white/70 backdrop-blur-2xl border-b border-gray-100/50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-3 bg-gray-50 hover:bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary-blue transition-all active:scale-95 shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="h-10 w-[1px] bg-gray-100 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block leading-none">Job Title</span>
              <p className="text-sm font-black text-gray-900 tracking-tight mt-1">{job.role_title}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-gray-50 hover:bg-primary-blue hover:text-white border border-gray-100 rounded-2xl text-gray-400 transition-all active:scale-95 shadow-sm">
              <Share2 size={20} />
            </button>
            <Link 
              href={`/jobs/${id}/apply`}
              className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-gray-900/10 hover:bg-primary-blue transition-all flex items-center gap-3 active:scale-95"
            >
              Apply
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Role Introduction Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1.5 bg-primary-blue/5 text-primary-blue border border-primary-blue/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {job.status === 'active' ? 'Active' : 'Archived'}
                </span>
                <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                  {job.stage_mode || 'Standard Mode'}
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none capitalize">
                {job.role_title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center">
                    <MapPin size={18} className="text-primary-blue" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest leading-none">Location Strategy</p>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center">
                    <DollarSign size={18} className="text-success-green" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest leading-none">Budget</p>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{job.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center">
                    <Clock size={18} className="text-warning-orange" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest leading-none">Work Protocol</p>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tighter text-capitalize">{job.work_mode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Skills Inventory */}
            <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm shadow-blue-500/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-blue/5 text-primary-blue rounded-2xl flex items-center justify-center">
                    <Zap size={24} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest">Skills</h2>
                </div>
                <div className="h-[1px] flex-grow mx-8 bg-gray-100" />
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Required Assets</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {job.skills?.map((skill: string, i: number) => (
                  <div 
                    key={i} 
                    className="group flex items-center gap-3 px-5 py-3 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-2xl border border-gray-100 transition-all cursor-default"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary-blue group-hover:bg-white shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:shadow-none" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{skill}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* About Company Section */}
            <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success-green/5 text-success-green rounded-2xl flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest">About Company</h2>
                </div>
                <div className="h-[1px] flex-grow mx-8 bg-gray-100" />
                {job.company_website && (
                  <a href={job.company_website} target="_blank" className="text-primary-blue hover:underline flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <Globe size={14} />
                    Official Website
                  </a>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100 overflow-hidden">
                    {job.company_logo ? (
                      <img src={job.company_logo} alt="Company Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 size={32} className="text-gray-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{job.company_name || "Enterprise Partner"}</h3>
                    <p className="text-gray-500 font-medium text-sm mt-1">{job.company_industry || "Technology & Innovation"}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 font-medium leading-relaxed">
                  {job.company_description || "Information about the company and its mission will be displayed here. Join a team dedicated to pushing the boundaries of technology and creating impactful solutions for the global matrix."}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{job.company_size || "50-200"} Members</span>
                  </div>
                  <div className="px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{job.company_location || job.location}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Assessment Logic Breakdown */}
            <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warning-orange/5 text-warning-orange rounded-2xl flex items-center justify-center">
                    <BrainCircuit size={24} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest">Evaluation Matrix</h2>
                </div>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Weight Configuration</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stages.map((stage, i) => (
                  <div key={i} className="relative group p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50 hover:border-primary-blue/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary-blue shadow-sm transition-colors">
                        {stage.icon}
                      </div>
                      <span className="text-2xl font-black text-gray-900 tracking-tighter">
                        {stage.weight}%
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">{stage.label}</p>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.weight}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                        className="h-full bg-primary-blue"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Deployment Details */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gray-900 text-white rounded-[3rem] p-10 shadow-2xl space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/20 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="relative space-y-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5 shadow-xl">
                  <Zap size={32} className="text-primary-blue" />
                </div>
<div className="space-y-2">
  <h3 className="text-3xl font-black tracking-tighter">Join Our Team</h3>
  <p className="text-gray-400 font-medium text-sm leading-relaxed">
    Complete the application below to begin your journey with us. Share your experience, skills, and career goals — our  system will evaluate your profile and guide you through the next steps.
  </p>
</div>
              </div>

              <div className="relative space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <Award size={16} className="text-primary-blue" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Experience Level</span>
                  </div>
                  <span className="text-[10px] font-black uppercase">{job.experience} Years Required</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <Target size={16} className="text-primary-blue" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Assessment Logic</span>
                  </div>
                  <span className="text-[10px] font-black uppercase">{job.assessment_format}</span>
                </div>
              </div>

              <div className="relative pt-4">
                <Link 
                  href={`/jobs/${id}/apply`}
                  className="w-full bg-primary-blue text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  Apply
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Additional Metadata / Security */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-gray-900 border-b border-gray-50 pb-4">
                <Settings size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">System Metadata</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[9px] font-black uppercase tracking-widest">Job ID</span>
                  <span className="text-[10px] font-mono text-gray-900">#PROTO-{id}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[9px] font-black uppercase tracking-widest">Created At</span>
                  <span className="text-[10px] font-mono text-gray-900">{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[9px] font-black uppercase tracking-widest">Auth Required</span>
                  <span className="text-[10px] font-black text-success-green uppercase">Verified Protocol</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
