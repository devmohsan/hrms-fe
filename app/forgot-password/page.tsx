                                                                                                                                                                                                                                                                                                                    'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, ChevronRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import axiosInstance from '@/lib/axios';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      setSuccess(false);
      try {
        const response = await axiosInstance.post('/auth/forgot-password', values);
        if (response.data.success) {
          setSuccess(true);
        } else {
          setError(response.data.message || 'Failed to send reset link.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An unexpected error occurred.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs & Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-blue/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-success-green/5 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex flex-col items-center gap-4 group">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary-blue/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src="/logo.png" 
                alt="Workforce One" 
                className="h-20 w-auto object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="text-center">
              <span className="text-2xl font-black tracking-tighter text-gray-900">
                WORKFORCE<span className="text-primary-blue">ONE</span>
              </span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1 italic">Intelligence OS</p>
            </div>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-blue via-success-green to-warning-orange opacity-50"></div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tighter text-gray-900">
              Recovery Mode
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-2">Reset your secure access node</p>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6" 
                onSubmit={formik.handleSubmit}
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Email Identity</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-primary-blue transition-colors" />
                    <input 
                      type="email" 
                      placeholder="name@company.com"
                      className={`w-full bg-gray-50 border ${formik.touched.email && formik.errors.email ? 'border-red-400' : 'border-gray-100'} focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-14 pr-4 outline-none transition-all font-medium text-gray-900 shadow-sm`}
                      {...formik.getFieldProps('email')}
                    />
                    <AnimatePresence>
                      {formik.touched.email && formik.errors.email && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-1.5 mt-2 ml-4 text-[10px] font-black uppercase tracking-widest text-red-500"
                        >
                          <AlertCircle size={10} />
                          {formik.errors.email}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-blue transition-all shadow-2xl shadow-gray-900/20 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formik.isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      Request Reset Link
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-500 w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Transmission Sent</h3>
                <p className="text-gray-500 font-medium text-sm">
                  Check your inbox for the recovery key. <br />
                  Link expires in 120 minutes.
                </p>
                <div className="mt-8">
                  <Link href="/login" className="text-xs font-black text-primary-blue hover:underline uppercase tracking-widest">Return to Login</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-500 text-xs font-medium">
              Remember your pin? <br />
              <Link href="/login" className="text-primary-blue font-black hover:underline uppercase tracking-widest text-[10px] mt-2 inline-block">Secure Login</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-primary-blue transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Authentication
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
