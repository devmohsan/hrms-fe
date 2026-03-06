'use client';

import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Building2, User, Mail, Lock, ChevronRight, Globe, Users, Loader2, AlertCircle } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
  company_name: Yup.string().required('Required'),
  weburl: Yup.string().url('Invalid URL').required('Required'),
  size: Yup.string().required('Required'),
  username: Yup.string().min(3, 'Too short').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Min 8 chars').required('Required'),
});

export default function CompanySignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      company_name: '',
      weburl: '',
      size: '1-10',
      username: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        const response = await axiosInstance.post('/auth/register', values);
        if (response.status === 201 || response.status === 200) {
          setSuccess(true);
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Initialization failed. Please verify credentials and try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 relative overflow-hidden py-20">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-blue/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-success-green/5 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[10%] w-48 h-48 bg-warning-orange/5 rounded-full blur-[80px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="flex justify-between items-end mb-12">
          <Link href="/" className="flex items-center gap-4 group">
            <img 
              src="/logo.png" 
              alt="Workforce One" 
              className="h-14 w-auto object-contain transition-transform group-hover:rotate-12"
            />
            <div className="hidden md:block">
              <span className="text-xl font-black tracking-tighter text-gray-900">
                WORKFORCE<span className="text-primary-blue">ONE</span>
              </span>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] leading-none italic">Intelligence OS</p>
            </div>
          </Link>
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary-blue transition-colors"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </div>

        <div className="bg-white/90 backdrop-blur-2xl rounded-[3.5rem] p-10 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-blue via-success-green to-warning-orange opacity-40"></div>
          
          <div className="mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-blue/5 text-primary-blue text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              Organization Onboarding
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-[0.85]">
              Deploy Your <br />
              <span className="text-primary-blue underline decoration-primary-blue/10">Business OS.</span>
            </h1>
            <p className="text-gray-500 font-medium text-xl mt-6">Initialize your AI-powered workforce intelligence unit.</p>
          </div>

          <form className="space-y-12" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Company Info */}
              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 border-b border-gray-50 pb-2">Business Vector</h3>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Legal Name</label>
                  <div className="relative group/input">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-primary-blue transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Acme Global Inc"
                      className={`w-full bg-gray-50/50 border ${formik.touched.company_name && formik.errors.company_name ? 'border-red-400' : 'border-gray-100'} focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-14 pr-4 outline-none transition-all font-medium text-gray-900`}
                      {...formik.getFieldProps('company_name')}
                    />
                    <AnimatePresence>
                      {formik.touched.company_name && formik.errors.company_name && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-1.5 mt-2 ml-4 text-[10px] font-black uppercase tracking-widest text-red-500"
                        >
                          <AlertCircle size={10} />
                          {formik.errors.company_name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Domain / Website URL</label>
                  <div className="relative group/input">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-primary-blue transition-colors" />
                    <input 
                      type="url" 
                      placeholder="https://acme.io"
                      className={`w-full bg-gray-50/50 border ${formik.touched.weburl && formik.errors.weburl ? 'border-red-400' : 'border-gray-100'} focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-14 pr-4 outline-none transition-all font-medium text-gray-900`}
                      {...formik.getFieldProps('weburl')}
                    />
                    <AnimatePresence>
                      {formik.touched.weburl && formik.errors.weburl && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-1.5 mt-2 ml-4 text-[10px] font-black uppercase tracking-widest text-red-500"
                        >
                          <AlertCircle size={10} />
                          {formik.errors.weburl}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Workforce Size</label>
                  <div className="relative group/input">
                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-primary-blue transition-colors" />
                    <select 
                      className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-14 pr-4 outline-none transition-all font-medium text-gray-900 appearance-none pointer-events-auto"
                      {...formik.getFieldProps('size')}
                    >
                        <option value="1-10">1-10 Employees</option>
                        <option value="11-50">11-50 Employees</option>
                        <option value="51-200">51-200 Employees</option>
                        <option value="200+">200+ Employees</option>
                        <option value="Enterprise">Enterprise (500+)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Founder/Admin Info */}
              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 border-b border-gray-50 pb-2">Primary Controller</h3>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">UserName</label>
                  <div className="relative group/input">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-primary-blue transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      className={`w-full bg-gray-50/50 border ${formik.touched.username && formik.errors.username ? 'border-red-400' : 'border-gray-100'} focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-14 pr-4 outline-none transition-all font-medium text-gray-900`}
                      {...formik.getFieldProps('username')}
                    />
                    <AnimatePresence>
                      {formik.touched.username && formik.errors.username && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-1.5 mt-2 ml-4 text-[10px] font-black uppercase tracking-widest text-red-500"
                        >
                          <AlertCircle size={10} />
                          {formik.errors.username}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-primary-blue transition-colors" />
                    <input 
                      type="email" 
                      placeholder="admin@acme.com"
                      className={`w-full bg-gray-50/50 border ${formik.touched.email && formik.errors.email ? 'border-red-400' : 'border-gray-100'} focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-14 pr-4 outline-none transition-all font-medium text-gray-900`}
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/input:text-primary-blue transition-colors" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className={`w-full bg-gray-50/50 border ${formik.touched.password && formik.errors.password ? 'border-red-400' : 'border-gray-100'} focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-14 pr-4 outline-none transition-all font-medium text-gray-900`}
                      {...formik.getFieldProps('password')}
                    />
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
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold animate-shake">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl text-sm font-bold">
                Initialization Successful! Redirecting to Terminal...
              </div>
            )}

            <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
              <p className="text-[10px] text-gray-400 font-bold max-w-xs leading-relaxed uppercase tracking-widest">
                By initializing deployment, you synchronize with our <a href="#" className="text-primary-blue underline">Operations Manual</a> and <a href="#" className="text-primary-blue underline">Privacy Shield</a>.
              </p>
              <button 
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full md:w-auto bg-gray-900 text-white px-16 py-6 rounded-2xl font-black text-xl hover:bg-primary-blue transition-all shadow-2xl shadow-gray-900/20 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    Create Account
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-16 text-center text-xs font-black text-gray-300 uppercase tracking-[0.3em]">
            Already have an account? <Link href="/login" className="text-primary-blue hover:underline underline-offset-4 ml-2">Login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
