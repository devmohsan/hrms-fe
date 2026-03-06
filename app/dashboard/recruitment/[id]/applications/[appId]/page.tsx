'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Clock, 
  Award, 
  DollarSign, 
  FileText, 
  ExternalLink,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  FileSearch,
  Zap,
  Cpu,
  Globe,
  Download,
  Maximize2,
  Calendar,
  X,
  ShieldCheck,
  BrainCircuit,
  Save,
  Copy,
  ExternalLink as LinkIcon,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

export default function ApplicationDetailPage() {
  const { id, appId } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [jobInfo, setJobInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'analysis' | 'resume' | 'assessment'>('profile');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduledId, setScheduledId] = useState<string | null>(null);

  const [assessmentResponse, setAssessmentResponse] = useState<any>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [schedulingData, setSchedulingData] = useState({
    scheduled_at: '',
    expires_at: '',
    duration_minutes: 30,
    interview_details: 'Initial technical screening'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Parallel fetch for optimal performance
        const [appResponse, jobResponse] = await Promise.all([
          axiosInstance.get(`/applications/${appId}`),
          axiosInstance.get(`/jobs/${id}`)
        ]);

        if (appResponse.data.success) {
          setApplication(appResponse.data.application || appResponse.data.data);
        }
        if (jobResponse.data.success) {
          setJobInfo(jobResponse.data.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch protocol data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appId, id]);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);
    setScheduleError(null);
    setScheduleSuccess(false);

    try {
      // Formatting to YYYY-MM-DD HH:mm:ss
      const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      };

      const payload = {
        application_id: Number(appId),
        scheduled_at: formatDate(schedulingData.scheduled_at),
        expires_at: formatDate(schedulingData.expires_at),
        duration_minutes: Number(schedulingData.duration_minutes),
        interview_details: schedulingData.interview_details
      };

      const response = await axiosInstance.post('/assessments/schedule', payload);
      
      if (response.data.success) {
        setScheduledId(response.data.data?.id || response.data.id);
        setScheduleSuccess(true);
        // Don't auto-close so they can copy the link
      }
    } catch (err: any) {
      setScheduleError(err.response?.data?.message || "Failed to schedule assessment. Please try again.");
    } finally {
      setIsScheduling(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'assessment' && !assessmentResponse) {
      const fetchAssessmentResponse = async () => {
        setAssessmentLoading(true);
        try {
          // Attempting to fetch using appId. If the backend strictly requires schedule_id, 
          // we assume the API was updated to support querying by application_id since it's the applicant dashboard.
          const response = await axiosInstance.get(`/assessments/response/${appId}`);
          if (response.data.success) {
            setAssessmentResponse(response.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch assessment response:", error);
        } finally {
          setAssessmentLoading(false);
        }
      };
      fetchAssessmentResponse();
    }
  }, [activeTab, appId, assessmentResponse]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="animate-spin text-primary-blue" size={64} />
            <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" size={24} />
          </div>
          <div className="text-center">
            <p className="text-[12px] font-black text-gray-900 uppercase tracking-[0.4em] mb-1">Loading Application Data...</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Application ID: {appId}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl text-center max-w-lg">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100">
            <FileSearch size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Application Not Found</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            The requested application data could not be retrieved from the system.
          </p>
          <button 
            onClick={() => router.back()}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-primary-blue transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <ChevronLeft size={18} />
            Back to Pool
          </button>
        </div>
      </div>
    );
  }

  const metadata = typeof application.metadata === 'string' ? JSON.parse(application.metadata) : application.metadata;
  const parsedData = application.resume_data ? (typeof application.resume_data === 'string' ? JSON.parse(application.resume_data) : application.resume_data) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Banner Control */}
      <div className="bg-white border-b border-gray-100 py-6 sticky top-0 z-[60] backdrop-blur-xl bg-white/80 px-6">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.back()}
              className="p-3.5 bg-gray-50 hover:bg-white hover:shadow-lg rounded-2xl transition-all border border-gray-100 text-gray-900"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="h-10 w-px bg-gray-100 hidden md:block" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black text-gray-900 tracking-tight">{application.full_name}</h1>
                <div className="h-4 w-px bg-gray-200" />
                <span className="px-3 py-1 bg-primary-blue/10 text-primary-blue border border-primary-blue/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {jobInfo?.role_title || 'Position Matrix'}
                </span>
                <span className="px-3 py-1 bg-success-green/10 text-success-green border border-success-green/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {application.status || 'Verified'}
                </span>
              </div>
              <p className="text-[10px] font-black text-primary-blue uppercase tracking-widest mt-1">Applicant Review Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsScheduleModalOpen(true)}
                className="bg-primary-blue text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all shadow-xl shadow-primary-blue/20 flex items-center gap-3"
              >
                Schedule
                <Calendar size={16} />
              </button>
             <div className="hidden lg:flex items-center gap-8 mx-4">
                <HeaderStat icon={<Globe size={14}/>} label="Channel" value="Direct Apply" />
                <HeaderStat icon={<ShieldCheck size={14}/>} label="Review" value="Profile Verified" />
             </div>
             <button 
               onClick={() => window.open(application.resume_url?.startsWith('http') ? application.resume_url : `${process.env.NEXT_PUBLIC_RESOURCES_URL}${application.resume_url}`, '_blank')}
               className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-blue transition-all shadow-xl shadow-gray-900/10 hidden sm:flex items-center gap-3"
             >
               Download Assets
               <Download size={16} />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Profile Card */}
            <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                <BrainCircuit size={80} />
              </div>
              
              <div className="w-24 h-24 bg-primary-blue text-white rounded-[2rem] flex items-center justify-center font-black text-4xl mb-8 shadow-2xl shadow-primary-blue/30 mx-auto">
                {application.full_name?.charAt(0)}
              </div>
              
              <div className="text-center mb-10">
                <h3 className="text-[11px] font-black text-primary-blue uppercase tracking-[0.3em] mb-2">Candidate Info</h3>
                <h2 className="text-xl font-black text-gray-900 tracking-tight line-clamp-1">{application.full_name}</h2>
                <div className="flex items-center justify-center gap-2 mt-3 text-gray-400">
                  <MapPin size={14} className="text-primary-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{application.location || 'Location Not Provided'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <ContactItem icon={<Mail size={16}/>} label="Primary Email" value={application.email} />
                <ContactItem icon={<Phone size={16}/>} label="Direct Line" value={application.phone} />
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white p-3 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-2">
              <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={18}/>} label="Applicant Details" />
              <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} icon={<Cpu size={18}/>} label="AI Analysis" />
              <TabButton active={activeTab === 'resume'} onClick={() => setActiveTab('resume')} icon={<FileText size={18}/>} label="Resume Document" />
              <TabButton active={activeTab === 'assessment'} onClick={() => setActiveTab('assessment')} icon={<ClipboardList size={18}/>} label="Assessment Responses" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  {/* Experience Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureStat icon={<Briefcase size={22}/>} label="Career Span" value={`${metadata?.total_experience || 0} Years`} desc="Total Years Active" color="blue" />
                    <FeatureStat icon={<DollarSign size={22}/>} label="Expected Comp" value={metadata?.expected_salary || 'TBD'} desc="Monthly Expectation" color="green" />
                    <FeatureStat icon={<Clock size={22}/>} label="Notice Window" value={metadata?.notice_period || 'N/A'} desc="Availability Protocol" color="orange" />
                  </div>

                  {/* Introduction Section */}
                  <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center">
                        <Zap size={20} />
                      </div>
                      <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest">Candidate Introduction</h2>
                    </div>
                    <p className="text-lg text-gray-600 font-medium leading-[2] relative z-10">
                      {metadata?.introduction || 'No candidate description provided.'}
                    </p>
                  </div>

                  {/* Professional Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                       <h3 className="text-[10px] font-black text-primary-blue uppercase tracking-[0.3em] mb-8">Current Employment</h3>
                       <div className="space-y-6">
                          <DetailRow label="Current Status" value={metadata?.current_status} />
                          <DetailRow label="Current Salary" value={metadata?.current_salary} />
                          <DetailRow label="Portfolio Link" value={metadata?.portfolio_link} isLink />
                       </div>
                    </div>
                    
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                       <h3 className="text-[10px] font-black text-success-green uppercase tracking-[0.3em] mb-8">Additional Information</h3>
                       <div className="space-y-4">
                          {metadata?.custom_info?.length > 0 ? metadata.custom_info.map((info: any, i: number) => (
                             <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{info.label}</span>
                                <span className="text-[12px] font-bold text-gray-900">{info.value}</span>
                             </div>
                          )) : <p className="text-xs text-gray-300 italic">No extra information provided.</p>}
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analysis' && (
                <motion.div 
                  key="analysis"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-gray-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-blue/20 blur-[100px] rounded-full" />
                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center border border-white/20">
                        <Cpu className="animate-pulse text-primary-blue" size={40} />
                      </div>
                      <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black tracking-tight mb-2">AI Resume Insights</h2>
                        <p className="text-gray-400 font-medium max-w-xl">
                          Automated analysis of the candidate's resume. This data is extracted for better matching and evaluation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {!parsedData ? (
                    <div className="bg-white p-20 rounded-[4rem] border border-dashed border-gray-200 text-center">
                       <Loader2 className="animate-spin text-gray-300 mx-auto mb-6" size={40} />
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Analyzing Resume Background...</h3>
                       <p className="text-gray-400 font-medium text-sm">Resume parsing in progress or no analysis available yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Skills Matrix */}
                      <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
                         <div className="flex items-center gap-3 mb-8">
                            <Zap size={18} className="text-primary-blue" />
                            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Key Skills Extracted</h4>
                         </div>
                         <div className="flex flex-wrap gap-2">
                            {parsedData.skills?.map((skill: string, i: number) => (
                               <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-600 uppercase tracking-widest hover:border-primary-blue transition-all">
                                  {skill}
                               </span>
                            ))}
                         </div>
                      </div>

                      {/* Summary Interpretation */}
                      <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
                         <div className="flex items-center gap-3 mb-8">
                            <FileSearch size={18} className="text-success-green" />
                            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Profile Summary</h4>
                         </div>
                         <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                            "{parsedData.summary || 'Summary not extracted during neural scan.'}"
                         </p>
                      </div>

                      {/* Work History Timeline */}
                      <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm lg:col-span-2">
                         <div className="flex items-center gap-3 mb-10">
                            <Clock size={18} className="text-warning-orange" />
                            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Work Experience Timeline</h4>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {parsedData.work_experience?.map((work: any, i: number) => (
                               <div key={i} className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl transition-all group">
                                  <div className="flex justify-between items-start mb-4">
                                     <h4 className="font-black text-gray-900 text-sm group-hover:text-primary-blue">{work.job_title}</h4>
                                     <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{work.duration}</span>
                                  </div>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-3">{work.company}</p>
                                  <p className="text-[11px] text-gray-500 font-medium line-clamp-3">{work.description}</p>
                               </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Education History if available */}
                  {parsedData.education && parsedData.education.length > 0 && (
                    <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm lg:col-span-2">
                         <div className="flex items-center gap-3 mb-10">
                            <Award size={18} className="text-primary-blue" />
                            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Education History</h4>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {parsedData.education.map((edu: any, i: number) => (
                               <div key={i} className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                  <h4 className="font-black text-gray-900 text-sm mb-1">{edu.degree}</h4>
                                  <p className="text-[10px] font-black text-primary-blue uppercase tracking-widest mb-3">{edu.institution}</p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{edu.duration}</p>
                               </div>
                            ))}
                         </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'resume' && (
                <motion.div 
                  key="resume"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-[80vh] flex flex-col"
                >
                  <div className="bg-white p-4 border border-gray-100 rounded-t-[2.5rem] flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4 pl-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">Original Resume Profile</p>
                        <p className="text-[9px] font-bold text-gray-400 mt-1">{application.full_name?.replace(' ', '_').toLowerCase()}_cv.pdf</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pr-2">
                      <a 
                        href={application.resume_url?.startsWith('http') ? application.resume_url : `${process.env.NEXT_PUBLIC_RESOURCES_URL}${application.resume_url}`} 
                        target="_blank"
                        className="p-3 bg-gray-900 text-white rounded-xl hover:bg-primary-blue transition-all active:scale-95 shadow-lg shadow-gray-900/10"
                      >
                        <Maximize2 size={16} />
                      </a>
                    </div>
                  </div>
                  <div className="flex-grow bg-[#E2E8F0] border border-gray-100 border-t-0 rounded-b-[2.5rem] overflow-hidden shadow-inner relative">
                    {application.resume_url ? (
                      <iframe 
                        src={`${application.resume_url?.startsWith('http') ? application.resume_url : `${process.env.NEXT_PUBLIC_RESOURCES_URL}${application.resume_url}`}#toolbar=0`} 
                        className="w-full h-full border-none"
                        title="CV Asset Preview"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                         <div className="text-center">
                            <XCircle size={64} className="mx-auto mb-4" />
                            <p className="text-sm font-black uppercase tracking-widest">Asset Link Invalid</p>
                         </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'assessment' && (
                <motion.div 
                  key="assessment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {assessmentLoading ? (
                    <div className="bg-white p-16 rounded-[3.5rem] border border-gray-100 flex flex-col items-center justify-center min-h-[50vh]">
                      <Loader2 size={48} className="text-primary-blue animate-spin mb-4" />
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Retrieving Neural Assessment Data</p>
                    </div>
                  ) : assessmentResponse ? (
                    <div className="space-y-8">
                       <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                          <div>
                             <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Assessment Results</h2>
                             <p className="text-sm font-medium text-gray-500">
                               Completed on: {new Date(assessmentResponse.submitted_at || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                             </p>
                          </div>
                          <div className="w-32 h-32 bg-gray-900 text-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl shadow-gray-900/20 shrink-0">
                             <span className="text-3xl font-black">{assessmentResponse.score || 0}%</span>
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Final Score</span>
                          </div>
                       </div>

                       <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
                          <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
                             <ClipboardList size={20} className="text-primary-blue" />
                             Candidate Responses
                          </h3>

                          <div className="space-y-8">
                            {assessmentResponse.answers?.map((item: any, idx: number) => (
                               <div key={idx} className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100">
                                  <div className="flex gap-4 mb-4">
                                     <div className="w-8 h-8 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center font-black text-xs shrink-0">
                                        Q{idx + 1}
                                     </div>
                                     <h4 className="text-base font-bold text-gray-900 leading-snug pt-1">
                                        {item.question?.question || "Question data unavailable"}
                                     </h4>
                                  </div>
                                  <div className="ml-12 p-5 bg-white rounded-2xl border border-gray-100">
                                     <p className="text-[10px] font-black text-success-green uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <CheckCircle2 size={12} />
                                        Candidate's Answer
                                     </p>
                                     <p className="text-sm font-medium text-gray-600">
                                        {item.answer}
                                     </p>
                                  </div>
                               </div>
                            ))}
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="bg-white p-16 md:p-24 rounded-[3.5rem] border border-gray-100 shadow-sm text-center hover:shadow-xl transition-all h-[50vh] flex flex-col items-center justify-center">
                       <div className="w-24 h-24 bg-primary-blue/5 text-primary-blue rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary-blue/10">
                         <ClipboardList size={40} />
                       </div>
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">No Assessment Found</h2>
                       <p className="text-gray-500 font-medium max-w-sm mx-auto">
                          The candidate has not yet completed the assessment, or an assessment has not been scheduled.
                       </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <ScheduleAssessmentModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        data={schedulingData}
        setData={setSchedulingData}
        onSubmit={handleScheduleSubmit}
        loading={isScheduling}
        success={scheduleSuccess}
        error={scheduleError}
        appName={application.full_name}
        scheduledId={scheduledId}
      />
    </div>
  );
}

function ScheduleAssessmentModal({ isOpen, onClose, data, setData, onSubmit, loading, success, error, appName, scheduledId }: any) {
  const assessmentUrl = typeof window !== 'undefined' ? `${window.location.origin}/assessment/${scheduledId}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(assessmentUrl);
    alert("Assessment link copied to clipboard!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-10 md:p-14">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-primary-blue/10 rounded-2xl flex items-center justify-center text-primary-blue">
                      <Calendar size={28} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">Schedule Assessment</h3>
                      <p className="text-[10px] font-black text-primary-blue uppercase tracking-widest mt-1">Candidate: {appName}</p>
                   </div>
                </div>
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-center gap-3 text-red-600 mb-8">
                  <XCircle size={18} />
                  <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
                </div>
              )}

              {success ? (
                <div className="space-y-8">
                  <div className="bg-success-green/10 border border-success-green/20 p-10 rounded-[2.5rem] flex flex-col items-center gap-4 text-center">
                     <div className="w-20 h-20 bg-success-green text-white rounded-full flex items-center justify-center shadow-lg shadow-success-green/20">
                        <CheckCircle2 size={40} />
                     </div>
                     <h4 className="text-xl font-black text-gray-900">Assessment Scheduled</h4>
                     <p className="text-gray-500 text-sm font-medium">The interview protocols have been successfully deployed.</p>
                  </div>

                  <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Shareable Assessment Link</p>
                     <div className="flex items-center gap-3">
                        <input 
                          readOnly
                          value={assessmentUrl}
                          className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-bold text-gray-500 outline-none"
                        />
                        <button 
                          onClick={copyToClipboard}
                          className="p-3 bg-gray-900 text-white rounded-xl hover:bg-primary-blue transition-all active:scale-95"
                        >
                          <Copy size={16} />
                        </button>
                        <a 
                          href={assessmentUrl}
                          target="_blank"
                          className="p-3 bg-white border border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                        >
                          <LinkIcon size={16} />
                        </a>
                     </div>
                  </div>

                  <button 
                    onClick={onClose}
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-primary-blue transition-all"
                  >
                    Close Protocol
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Interview Start Time</label>
                      <input 
                        type="datetime-local" 
                        required
                        value={data.scheduled_at}
                        onChange={(e) => setData({ ...data, scheduled_at: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-primary-blue outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Assessment Link Expiry</label>
                      <input 
                        type="datetime-local" 
                        required
                        value={data.expires_at}
                        onChange={(e) => setData({ ...data, expires_at: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-primary-blue outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Interview Duration (Min)</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={data.duration_minutes}
                        onChange={(e) => setData({ ...data, duration_minutes: Number(e.target.value) })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-primary-blue outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Interview Details / Notes</label>
                    <textarea 
                      required
                      rows={3}
                      value={data.interview_details}
                      onChange={(e) => setData({ ...data, interview_details: e.target.value })}
                      placeholder="e.g. Technical screening focusing on Node.js and React architecture..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm font-bold text-gray-900 focus:bg-white focus:border-primary-blue outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-primary-blue transition-all shadow-2xl shadow-gray-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      {loading ? 'Processing...' : 'Schedule Assessment'}
                    </button>
                    <button 
                      type="button"
                      onClick={onClose}
                      className="w-full mt-4 bg-gray-50 text-gray-400 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function HeaderStat({ icon, label, value }: any) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5 text-gray-400 mb-1">
        {icon}
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{value}</p>
    </div>
  );
}

function ContactItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover:bg-white transition-all">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-300 group-hover:text-primary-blue transition-colors">
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-[11px] font-black text-gray-900 truncate">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all active:scale-95 ${
        active 
          ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20' 
          : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div className={`${active ? 'text-primary-blue' : 'text-current'} transition-colors`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function FeatureStat({ icon, label, value, desc, color }: any) {
  const colors: any = {
    blue: 'bg-primary-blue/10 text-primary-blue border-primary-blue/20',
    green: 'bg-success-green/10 text-success-green border-success-green/20',
    orange: 'bg-warning-orange/10 text-warning-orange border-warning-orange/20'
  }
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
      <div className={`w-14 h-14 ${colors[color]} border rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{label}</p>
      <p className="text-xl font-black text-gray-900 tracking-tight mb-2">{value}</p>
      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tight">{desc}</p>
    </div>
  );
}

function DetailRow({ label, value, isLink }: any) {
  return (
    <div className="flex justify-between items-center group/row">
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</span>
      {isLink ? (
        <a href={value} target="_blank" className="flex items-center gap-1.5 text-primary-blue hover:underline font-bold text-xs truncate max-w-[200px]">
          {value || 'Link Pending'}
          <ExternalLink size={12} />
        </a>
      ) : (
        <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{value || 'N/A'}</span>
      )}
    </div>
  );
}
