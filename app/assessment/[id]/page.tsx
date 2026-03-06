'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Timer, 
  ChevronRight, 
  ChevronLeft,
  Send,
  HelpCircle,
  Clock,
  Briefcase,
  User,
  ShieldCheck,
  BrainCircuit,
  FileQuestion
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';

interface Question {
  id: number;
  type: 'text' | 'mcq';
  question: string;
  options?: string[];
}

export default function CandidateAssessmentPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'welcome' | 'testing' | 'completed' | 'already-submitted'>('welcome');
  
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Link Verification
  useEffect(() => {
    const verifyLink = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/assessments/candidate/${id}`);
        if (response.data.success) {
          setAssessmentData(response.data.data);
          setQuestions(response.data.data.questions || []);
        } else {
          const msg = response.data.message?.toLowerCase() || "";
          if (msg.includes('submitted')) {
            setStep('already-submitted');
          } else {
            setError(response.data.message || "Invalid or expired assessment link.");
          }
        }
      } catch (err: any) {
        const msg = err.response?.data?.message?.toLowerCase() || "";
        if (msg.includes('submitted')) {
          setStep('already-submitted');
        } else {
          setError(err.response?.data?.message || "Assessment link is no longer active.");
        }
      } finally {
        setLoading(false);
      }
    };
    verifyLink();
  }, [id]);

  const handleStart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/assessments/start/${id}`);
      if (response.data.success) {
        setStep('testing');
      }
    } catch (err: any) {
      console.error("Failed to start assessment", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([qId, ans]) => ({
          question_id: Number(qId),
          answer: ans
        }))
      };
      const response = await axiosInstance.post(`/assessments/submit/${id}`, payload);
      if (response.data.success) {
        setStep('completed');
      }
    } catch (err: any) {
      console.error("Submission failed", err);
      alert("Failed to submit assessment. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && step === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="w-24 h-24 border-4 border-primary-blue/10 border-t-primary-blue rounded-full animate-spin" />
            <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-blue" size={32} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.4em]">Verifying Invitation</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Establishing secure assessment tunnel...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl max-w-lg w-full"
        >
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-red-100">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Link Inactive</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed uppercase text-xs tracking-wide">
            {error}. This link may have expired or was incorrectly formatted. Please contact HR for a new invitation.
          </p>
          <div className="h-px bg-gray-100 w-full mb-8" />
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Deployment Error: 403_ACCESS_REVOKED</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 md:p-12">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="max-w-4xl w-full"
          >
            <div className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-blue/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="p-12 md:p-20 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                  <div className="w-32 h-32 bg-gray-900 rounded-[3rem] flex items-center justify-center shadow-2xl shrink-0">
                    <Briefcase size={48} className="text-primary-blue" />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                        <span className="px-4 py-1.5 bg-primary-blue/10 text-primary-blue rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-blue/10">Candidate Assessment</span>
                        <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Active Link</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-4">
                        {assessmentData?.job_title || 'Role Verification'}
                    </h1>
                    <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl">
                      Welcome to the official talent assessment. Please ensure you are in a quiet environment and have a stable connection before proceeding.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  <InfoCard icon={<Clock size={20}/>} label="Total Duration" value={`${assessmentData?.duration_minutes || 0} Minutes`} color="blue" />
                  <InfoCard icon={<FileQuestion size={20}/>} label="Assessment Volume" value={`${questions.length} Questions`} color="purple" />
                  <InfoCard icon={<ShieldCheck size={20}/>} label="Security Protocol" value="Proctored Session" color="green" />
                </div>

                <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 mb-12">
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <AlertCircle size={14} className="text-primary-blue" />
                     Confidentiality Agreement
                   </h3>
                   <ul className="space-y-4">
                     {[
                        "All questions and materials are proprietary and strictly confidential.",
                        "The session will be timed and automatically submitted once the duration expires.",
                        "Using external assistance or leaving the window may invalidate your results."
                     ].map((item, idx) => (
                       <li key={idx} className="flex gap-4 text-sm font-bold text-gray-600">
                         <div className="w-1.5 h-1.5 bg-primary-blue rounded-full mt-2 shrink-0" />
                         {item}
                       </li>
                     ))}
                   </ul>
                </div>

                <button 
                  onClick={handleStart}
                  className="w-full bg-gray-900 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-primary-blue transition-all shadow-2xl shadow-gray-900/10 active:scale-[0.98] group flex items-center justify-center gap-4"
                >
                  Start Official Assessment
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'testing' && questions.length > 0 && (
          <motion.div 
            key="testing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl w-full h-[90vh] flex flex-col"
          >
            {/* Minimal Control Bar */}
            <div className="bg-white px-10 py-6 rounded-t-[3rem] border border-gray-100 shadow-sm flex items-center justify-between z-10">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-100 font-black">
                    {currentQuestionIndex + 1}
                 </div>
                 <div>
                    <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">{questions[currentQuestionIndex].type === 'mcq' ? 'Multiple Choice' : 'Open Ended'}</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">Progress: {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</p>
                 </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                   <div className="text-right hidden sm:block">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Session Link</p>
                      <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">Active_Matrix_Alpha</p>
                   </div>
                   <div className="w-12 h-12 bg-primary-blue/5 rounded-2xl flex items-center justify-center text-primary-blue">
                      <Timer size={22} className="animate-pulse" />
                   </div>
                </div>
              </div>
            </div>

            {/* Question Workspace */}
            <div className="flex-grow bg-[#F1F5F9] relative flex flex-col">
               <div className="absolute inset-x-0 top-0 h-1 bg-gray-100">
                  <motion.div 
                    className="h-full bg-primary-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
               </div>

               <div className="flex-grow overflow-y-auto p-12 md:p-20 scrollbar-hide">
                  <div className="max-w-3xl mx-auto space-y-12">
                     <motion.div 
                        key={questions[currentQuestionIndex].id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10"
                     >
                        <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                            {questions[currentQuestionIndex].question}
                        </h2>

                        {questions[currentQuestionIndex].type === 'mcq' ? (
                          <div className="grid grid-cols-1 gap-4">
                            {questions[currentQuestionIndex].options?.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleAnswer(questions[currentQuestionIndex].id, option)}
                                className={`group p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-between text-left ${
                                  answers[questions[currentQuestionIndex].id] === option
                                    ? 'bg-primary-blue border-primary-blue text-white shadow-xl shadow-primary-blue/20'
                                    : 'bg-white border-transparent text-gray-600 hover:border-primary-blue/30 hover:shadow-lg'
                                }`}
                              >
                                <div className="flex items-center gap-6">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${
                                      answers[questions[currentQuestionIndex].id] === option
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-100 text-gray-400 group-hover:bg-primary-blue/10 group-hover:text-primary-blue'
                                   }`}>
                                      {String.fromCharCode(65 + idx)}
                                   </div>
                                   <span className="font-bold text-lg">{option}</span>
                                </div>
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                                   answers[questions[currentQuestionIndex].id] === option
                                      ? 'border-white bg-white text-primary-blue'
                                      : 'border-gray-100'
                                }`}>
                                   {answers[questions[currentQuestionIndex].id] === option && <CheckCircle2 size={16} />}
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="relative">
                             <textarea 
                                value={answers[questions[currentQuestionIndex].id] || ''}
                                onChange={(e) => handleAnswer(questions[currentQuestionIndex].id, e.target.value)}
                                placeholder="Type your professional response here..."
                                className="w-full bg-white border-none rounded-[3rem] p-12 text-lg font-medium text-gray-900 min-h-[400px] outline-none shadow-xl focus:ring-4 ring-primary-blue/10 placeholder:text-gray-200 transition-all resize-none"
                             />
                             <div className="absolute bottom-10 right-10 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                Neural Text Processor Active
                             </div>
                          </div>
                        )}
                     </motion.div>
                  </div>
               </div>
            </div>

            {/* Pagination Controls */}
            <div className="bg-white border-t border-gray-100 p-8 rounded-b-[3rem] shadow-2xl z-10">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <button 
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-3 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-0 transition-all active:scale-95"
                >
                  <ChevronLeft size={16} />
                  Prev Question
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button 
                    onClick={handleFinish}
                    disabled={isSubmitting || Object.keys(answers).length === 0}
                    className="flex items-center gap-3 px-12 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-success-green transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {isSubmitting ? 'Finalizing...' : 'Submit Assessment'}
                  </button>
                ) : (
                  <button 
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={!answers[questions[currentQuestionIndex]?.id]}
                    className="flex items-center gap-3 px-12 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary-blue transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-30"
                  >
                    Next Question
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'completed' && (
          <motion.div 
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full text-center"
          >
            <div className="bg-white p-16 md:p-24 rounded-[5rem] border border-gray-100 shadow-2xl relative overflow-hidden">
               <div className="absolute -top-24 -left-24 w-64 h-64 bg-success-green/5 rounded-full blur-3xl" />
               <div className="relative z-10">
                  <div className="w-32 h-32 bg-success-green text-white rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-success-green/30">
                     <CheckCircle2 size={64} />
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Assessment Secured</h1>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed mb-12">
                     Your responses have been successfully encrypted and delivered to the recruitment team. No further action is required.
                  </p>
                  <div className="h-px bg-gray-100 w-full mb-8" />
                  <div className="flex flex-col items-center gap-2">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Confirmation Token</p>
                     <p className="text-[11px] font-black text-primary-blue uppercase tracking-tight">{Math.random().toString(36).substring(2, 10).toUpperCase()}-NODE_SYNC</p>
                  </div>
               </div>
            </div>
            <p className="mt-12 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">You may close this protocol window now</p>
          </motion.div>
        )}

        {step === 'already-submitted' && (
          <motion.div 
            key="already-submitted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full text-center"
          >
            <div className="bg-white p-16 md:p-24 rounded-[5rem] border border-gray-100 shadow-2xl relative overflow-hidden">
               <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-blue/5 rounded-full blur-3xl" />
               <div className="relative z-10">
                  <div className="w-32 h-32 bg-primary-blue text-white rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary-blue/30">
                     <ShieldCheck size={64} />
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Already Submitted</h1>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed mb-12">
                     This assessment protocol has already been completed and confirmed. Your responses are securely stored in the recruitment pipeline.
                  </p>
                  <div className="h-px bg-gray-100 w-full mb-8" />
                  <div className="flex flex-col items-center gap-2">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Session Protocol</p>
                     <p className="text-[11px] font-black text-success-green uppercase tracking-tight">STATUS: SECURE_ARCHIVED</p>
                  </div>
               </div>
            </div>
            <p className="mt-12 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Access to this link is now restricted</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoCard({ icon, label, value, color }: any) {
  const colors: any = {
    blue: "bg-primary-blue text-white shadow-primary-blue/20",
    purple: "bg-purple-600 text-white shadow-purple-600/20",
    green: "bg-gray-900 text-white shadow-gray-900/20"
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all border-b-4 border-b-gray-50">
      <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
        {icon}
      </div>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className="text-xl font-black text-gray-900 tracking-tight">{value}</p>
    </div>
  );
}
