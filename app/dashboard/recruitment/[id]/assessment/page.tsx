'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  Save, 
  HelpCircle, 
  Type, 
  CheckSquare, 
  Loader2,
  AlertCircle,
  GripVertical,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';

interface Question {
  id: string;
  type: 'text' | 'multiple_choice';
  question_text: string;
  options?: string[];
}

export default function AssessmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobRes, assessmentRes] = await Promise.all([
          axiosInstance.get(`/jobs/${id}`),
          axiosInstance.get(`/assessments/questions/${id}`)
        ]);

        if (jobRes.data.success) {
          setJobTitle(jobRes.data.data.role_title);
        }

        if (assessmentRes.data.success) {
          // Robust mapping to handle both array and object responses
          const rawData = assessmentRes.data.data;
          const questionsArray = Array.isArray(rawData) 
            ? rawData 
            : (rawData?.questions || []);

          const mappedQuestions = questionsArray.map((q: any) => ({
            id: q.id,
            type: q.type === 'mcq' ? 'multiple_choice' : 'text',
            question_text: q.question,
            options: q.options
          }));
          setQuestions(mappedQuestions);
        } else if (assessmentRes.data.message?.includes('not found')) {
          // If questions are not found, it's a new assessment, not a hard error
          setQuestions([]);
        }
      } catch (err: any) {
        // If the API returns a 404 status code, handle it gracefully
        if (err.response?.status === 404 || err.response?.data?.message?.includes('not found')) {
           setQuestions([]);
        } else {
          console.error("Failed to fetch assessment data", err);
          setError("Failed to load assessment data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const addQuestion = (type: 'text' | 'multiple_choice') => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question_text: '',
      options: type === 'multiple_choice' ? ['', ''] : undefined
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = [...(newQuestions[qIndex].options || []), ''];
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options) {
      newQuestions[qIndex].options![oIndex] = value;
    }
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options) {
      newQuestions[qIndex].options = newQuestions[qIndex].options!.filter((_, i) => i !== oIndex);
    }
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const payload = {
        job_id: Number(id),
        questions: questions.map((q, idx) => ({
          id: idx + 1, // API seems to expect numeric IDs or sequence
          type: q.type === 'multiple_choice' ? 'mcq' : 'text',
          question: q.question_text,
          options: q.options
        })),
        status: "active"
      };

      const response = await axiosInstance.post(`/assessments/questions`, payload);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save assessment questions.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary-blue" size={48} />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Opening Assessment Matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6 sticky top-0 z-50 backdrop-blur-xl bg-white/80 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.back()}
              className="p-3 bg-gray-50 hover:bg-white hover:shadow-lg rounded-2xl transition-all border border-gray-100 text-gray-900 active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Assessment Designer</h1>
              <p className="text-[10px] font-black text-primary-blue uppercase tracking-widest mt-1">
                {jobTitle || 'Role Assessment'} • {questions.length} Questions
              </p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-blue transition-all shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Syncing...' : 'Save Assessment'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-8">
        {/* Error/Success Feedbacks */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 text-red-600 shadow-sm"
            >
              <AlertCircle size={24} />
              <p className="font-bold text-sm uppercase tracking-wider">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-success-green/10 border border-success-green/20 p-6 rounded-[2rem] flex items-center gap-4 text-success-green shadow-sm"
            >
              <CheckCircle2 size={24} />
              <p className="font-bold text-sm uppercase tracking-wider">Assessment data deployment successful.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-dashed border-gray-200 p-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle size={32} className="text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Initialize Assessment</h3>
              <p className="text-gray-400 font-medium text-sm mb-10">Add questions to evaluate candidates during the application process.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => addQuestion('text')}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 border border-gray-100"
                >
                  <Type size={16} />
                  Text Question
                </button>
                <button 
                  onClick={() => addQuestion('multiple_choice')}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 border border-gray-100"
                >
                  <CheckSquare size={16} />
                  Multiple Choice
                </button>
              </div>
            </div>
          ) : (
            <>
              {questions.map((q, qIndex) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={q.id}
                  className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
                        {q.type === 'text' ? <Type size={18} /> : <CheckSquare size={18} />}
                      </div>
                      <span className="text-[10px] font-black text-primary-blue uppercase tracking-widest">Question {qIndex + 1} • {q.type === 'text' ? 'Free Text' : 'Options'}</span>
                    </div>
                    <button 
                      onClick={() => removeQuestion(qIndex)}
                      className="p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white active:scale-90"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Question Content</label>
                      <textarea 
                        value={q.question_text}
                        onChange={(e) => updateQuestion(qIndex, { question_text: e.target.value })}
                        placeholder="What would you like to ask the candidate?"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-primary-blue transition-all min-h-[100px] resize-none"
                      />
                    </div>

                    {q.type === 'multiple_choice' && (
                      <div className="space-y-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Response Options</label>
                          <button 
                            onClick={() => addOption(qIndex)}
                            className="text-[9px] font-black text-primary-blue uppercase tracking-widest hover:underline"
                          >
                            + Add Option
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {q.options?.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-3 group/opt">
                              <div className="w-8 h-8 shrink-0 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center text-[10px] font-black">
                                {String.fromCharCode(65 + oIndex)}
                              </div>
                              <input 
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                                className="flex-grow bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 outline-none focus:bg-white focus:border-primary-blue transition-all"
                              />
                              <button 
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              <div className="flex items-center justify-center gap-4 py-6">
                <button 
                  onClick={() => addQuestion('text')}
                  className="flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 border border-gray-100 shadow-sm"
                >
                  <Plus size={16} />
                  Add Text Block
                </button>
                <button 
                  onClick={() => addQuestion('multiple_choice')}
                  className="flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 border border-gray-100 shadow-sm"
                >
                  <Plus size={16} />
                  Add Multiple Choice
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
