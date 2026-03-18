'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ShieldCheck, 
  Send,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function CandidateOfferResponsePage() {
  const { token } = useParams();
  const [action, setAction] = useState<'accepted' | 'rejected' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!action) return;
    if (action === 'accepted' && !file) {
      setError("Please upload the signed offer letter to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('action', action);
      if (file) {
        formData.append('signed_file', file);
      }

      // Using process.env.NEXT_PUBLIC_API_URL or a fallback if not defined
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await axios.post(`${apiUrl}/offer-letters/respond/${token}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to process your response. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 text-center"
        >
          <div className="w-24 h-24 bg-success-green/10 text-success-green rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Response Received</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            {action === 'accepted' 
              ? "Congratulations! Your signed offer letter has been submitted successfully. Our team will contact you soon regarding the next steps."
              : "Thank you for your response. We have updated your offer status as per your decision."}
          </p>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-xs text-gray-400">
            You can now close this window.
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 py-20 font-sans">
      <div className="max-w-2xl w-full">
        {/* Branding / Header */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-blue/5 border border-primary-blue/10 rounded-full mb-6">
                <ShieldCheck size={14} className="text-primary-blue" />
                <span className="text-[10px] font-black text-primary-blue uppercase tracking-widest">Secure Candidate Portal</span>
            </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Review Your Offer</h1>
          <p className="text-gray-500 font-medium">Please review and respond to the employment offer sent by the recruitment team.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Decision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAction('accepted')}
              className={`p-8 rounded-[2.5rem] border-2 text-left transition-all ${
                action === 'accepted' 
                ? 'bg-white border-primary-blue shadow-2xl shadow-primary-blue/10' 
                : 'bg-white/50 border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                action === 'accepted' ? 'bg-primary-blue text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Accept Offer</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">I am excited to join the team and accept the terms outlined in my offer letter.</p>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setAction('rejected');
                setFile(null);
              }}
              className={`p-8 rounded-[2.5rem] border-2 text-left transition-all ${
                action === 'rejected' 
                ? 'bg-white border-red-500 shadow-2xl shadow-red-500/10' 
                : 'bg-white/50 border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                action === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <XCircle size={24} />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Decline Offer</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">I appreciate the opportunity, however, I am unable to accept the offer at this time.</p>
            </motion.button>
          </div>

          <AnimatePresence>
            {action === 'accepted' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText size={20} className="text-primary-blue" />
                    <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Upload Signed Agreement</h4>
                  </div>
                  
                  <label className="group relative border-2 border-dashed border-gray-100 hover:border-primary-blue/30 rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-white">
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden" 
                    />
                    
                    {file ? (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-success-green/10 text-success-green rounded-2xl flex items-center justify-center mx-auto mb-4 border border-success-green/20">
                          <FileText size={24} />
                        </div>
                        <p className="text-sm font-black text-gray-900 mb-1">{file.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Ready to upload • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="text-center group-hover:scale-105 transition-transform">
                        <div className="w-16 h-16 bg-primary-blue/5 text-primary-blue rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-blue group-hover:text-white transition-all">
                          <Upload size={24} />
                        </div>
                        <p className="text-sm font-black text-gray-900 mb-1 uppercase tracking-tight">Select Signed PDF</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">PDF or High-quality Image</p>
                      </div>
                    )}
                  </label>
                  
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                    <AlertCircle size={18} className="text-primary-blue shrink-0 mt-0.5" />
                    <p className="text-[11px] text-primary-blue/80 font-medium leading-relaxed">
                      Please ensure you have physically signed the document or used a legally binding electronic signature before uploading.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-center gap-4 text-red-600"
            >
              <AlertCircle size={20} />
              <p className="text-xs font-black uppercase tracking-wide">{error}</p>
            </motion.div>
          )}

          <div className="flex flex-col gap-4 pt-6">
            <motion.button
              type="submit"
              disabled={!action || loading}
              className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.99] disabled:opacity-50 disabled:grayscale ${
                action === 'rejected' 
                  ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600' 
                  : 'bg-primary-blue text-white shadow-primary-blue/20 hover:bg-gray-900'
              }`}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} />}
              {loading ? 'Processing Protocol...' : 'Submit Your Formal Response'}
            </motion.button>
            <p className="text-[10px] text-center text-gray-400 font-black uppercase tracking-widest mt-2">
              All responses are logged and encrypted for security.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
