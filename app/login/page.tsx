'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';
import axiosInstance from '@/lib/axios';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        // 1. Establish NextAuth session using credentials
        const result = await signIn('credentials', {
          ...values,
          redirect: false,
        });

        if (result?.error) {
          setError('Authentication failed. Please check your credentials.');
          return;
        }

        // Wait a small bit for session to propagate if necessary, 
        // though getSession() in axios interceptor will handle it.
        
        // 2. Check Onboarding Status using the now-authenticated axiosInstance
        try {
          const statusRes = await axiosInstance.get('/onboarding/status');
          const { is_onboarding, onboarding_step } = statusRes.data?.data || {};
          
          if (is_onboarding === 1) {
            setSuccess(true);
            setTimeout(() => {

              if(onboarding_step == 'completed'){
                router.push(`/dashboard`);
              }else{
                router.push(`/onboarding/${onboarding_step}`);
              }
            }, 1500);
            return;
          }
        } catch (statusErr) {
          console.error("Status check failed", statusErr);
        }

        setSuccess(true);
        setTimeout(() => {
          // router.push('/dashboard');
        }, 1500);
      } catch (err: any) {
        setError('An unexpected error occurred during authentication.');
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
        <div className="absolute top-[30%] right-[10%] w-32 h-32 bg-warning-orange/5 rounded-full blur-3xl animate-float"></div>
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
              Welcome Back
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-2">Access your AI-powered dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
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

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Secure Pin</label>
                <Link href="/forgot-password" className="text-[10px] font-black text-primary-blue hover:underline uppercase tracking-widest">Reset?</Link>
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-primary-blue transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-gray-50 border ${formik.touched.password && formik.errors.password ? 'border-red-400' : 'border-gray-100'} focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-14 pr-14 outline-none transition-all font-medium text-gray-900 shadow-sm`}
                  {...formik.getFieldProps('password')}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-blue transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <AnimatePresence>
                  {formik.touched.password && formik.errors.password && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-1.5 mt-2 ml-4 text-[10px] font-black uppercase tracking-widest text-red-500"
                    >
                      <AlertCircle size={10} />
                      {formik.errors.password}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold animate-shake">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl text-sm font-bold">
                Identity Verified! Accessing Terminal...
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
                  Authenticating...
                </>
              ) : (
                <>
                  Identity Verified
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-500 text-xs font-medium">
              Enterprise Client? <br />
              <Link href="/register-company" className="text-primary-blue font-black hover:underline uppercase tracking-widest text-[10px] mt-2 inline-block">Register Organization</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-primary-blue transition-colors"
          >
            <ArrowLeft size={14} />
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
