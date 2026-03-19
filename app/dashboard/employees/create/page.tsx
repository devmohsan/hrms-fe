'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Globe, 
  Zap,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Hash,
  DollarSign,
  Heart,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

const validationSchema = Yup.object().shape({
  employee_code: Yup.string().required('Code is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  designation: Yup.string().required('Designation is required'),
  department: Yup.string().required('Department is required'),
  salary: Yup.number().positive('Salary must be positive').required('Salary is required'),
  joining_date: Yup.date().required('Joining date is required'),
  dob: Yup.date().required('Date of birth is required'),
  gender: Yup.string().oneOf(['male', 'female', 'other']).required('Required'),
  address: Yup.string().required('Address is required'),
  username: Yup.string().optional(),
});

export default function CreateEmployeePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      employee_code: '',
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      phone: '',
      designation: '',
      department: '',
      salary: '',
      joining_date: '',
      dob: '',
      gender: 'male',
      address: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        const response = await axiosInstance.post('/employees/create', values);
        if (response.data.success) {
          setSuccess(true);
          setTimeout(() => {
            router.push('/dashboard/employees');
          }, 2000);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to sync with workforce matrix. Please verify inputs.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/employees" className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all active:scale-90 shadow-sm">
            <ArrowLeft size={20} className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 italic uppercase">
              Onboard Personnel
              <Zap className="text-primary-blue" size={24} />
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Deploy new human capital node to matrix</p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Form Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Core Identity */}
          <div className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[3rem] shadow-xl shadow-gray-200/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
               <div className="w-12 h-12 bg-primary-blue/5 rounded-2xl flex items-center justify-center text-primary-blue">
                 <User size={24} />
               </div>
               <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Core Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Employee ID / Code</label>
                <div className="relative group">
                   <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-primary-blue transition-colors" />
                   <input 
                    {...formik.getFieldProps('employee_code')}
                    placeholder="e.g. EMP-001"
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-gray-900 shadow-inner"
                  />
                </div>
                {formik.touched.employee_code && formik.errors.employee_code && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.employee_code}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Username (Optional)</label>
                <div className="relative group">
                   <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                   <input 
                    {...formik.getFieldProps('username')}
                    placeholder="e.g. sajid_ali_dev"
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-gray-900 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">First Name</label>
                <input 
                  {...formik.getFieldProps('first_name')}
                  placeholder="Sajid"
                  className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900 shadow-inner"
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Last Name</label>
                <input 
                  {...formik.getFieldProps('last_name')}
                  placeholder="Ali"
                  className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900 shadow-inner"
                />
                {formik.touched.last_name && formik.errors.last_name && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.last_name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Personal */}
          <div className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[3rem] shadow-xl shadow-gray-200/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-warning-orange/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
             
             <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
               <div className="w-12 h-12 bg-warning-orange/5 rounded-2xl flex items-center justify-center text-warning-orange">
                 <Mail size={24} />
               </div>
               <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Digital Access & Personal</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address (Credential Sink)</label>
                <div className="relative group">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-primary-blue transition-colors" />
                   <input 
                    {...formik.getFieldProps('email')}
                    placeholder="sajid.ali@example.com"
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-gray-900 shadow-inner"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone Matrix</label>
                <div className="relative group">
                   <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                   <input 
                    {...formik.getFieldProps('phone')}
                    placeholder="+92 3XX XXXXXXX"
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-gray-900 shadow-inner"
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.phone}</p>
                )}
              </div>

               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Date of Birth</label>
                <div className="relative group">
                   <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                   <input 
                    {...formik.getFieldProps('dob')}
                    type="date"
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-gray-900 shadow-inner appearance-none"
                  />
                </div>
                {formik.touched.dob && formik.errors.dob && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.dob as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Gender Protocol</label>
                <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => formik.setFieldValue('gender', g)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        formik.values.gender === g 
                          ? 'bg-white text-primary-blue shadow-sm border border-gray-100' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Permanent Address</label>
                <div className="relative group">
                   <MapPin className="absolute left-5 top-5 text-gray-300 w-4 h-4" />
                   <textarea 
                    {...formik.getFieldProps('address')}
                    placeholder="Full residential details..."
                    rows={3}
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-gray-900 shadow-inner resize-none"
                  />
                </div>
                {formik.touched.address && formik.errors.address && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Protocol */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-success-green/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-success-green/5 rounded-xl flex items-center justify-center text-success-green">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight uppercase italic">Professional Matrix</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Department</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-3 h-3" />
                      <select 
                        {...formik.getFieldProps('department')}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 outline-none font-bold text-xs appearance-none cursor-pointer text-gray-900"
                      >
                        <option value="">Select Department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="HR">Human Resources</option>
                        <option value="Operations">Operations</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Designation</label>
                    <div className="relative">
                      <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-3 h-3" />
                      <input 
                        {...formik.getFieldProps('designation')}
                        placeholder="Staff Engineer"
                        className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-xl py-3 pl-10 pr-4 outline-none font-bold text-xs text-gray-900"
                      />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Salary Allocation</label>
                    <div className="relative group">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-3 h-3" />
                      <input 
                        {...formik.getFieldProps('salary')}
                        type="number"
                        placeholder="150000"
                        className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-xl py-3 pl-10 pr-4 outline-none font-bold text-xs text-gray-900"
                      />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Joining Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-3 h-3" />
                      <input 
                        {...formik.getFieldProps('joining_date')}
                        type="date"
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 outline-none font-bold text-xs text-gray-900 appearance-none"
                      />
                    </div>
                </div>
              </div>
           </div>

           <div className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-blue/40 transition-colors"></div>
              
              <div className="space-y-2 relative z-10">
                 <h3 className="text-xl font-black italic tracking-tight uppercase">Onboarding Manifest</h3>
                 <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">System will auto-generate account</p>
              </div>

              <div className="space-y-4 relative z-10 border-t border-white/5 pt-6">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/50 tracking-widest">
                   <span>Personnel:</span>
                   <span className="text-white">{formik.values.first_name ? `${formik.values.first_name} ${formik.values.last_name}` : 'Pending...'}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/50 tracking-widest">
                   <span>ID Protocol:</span>
                   <span className="text-white">{formik.values.employee_code || '---'}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/50 tracking-widest text-right">
                   <span>Salary Node:</span>
                   <span className="text-success-green font-black">PKR {Number(formik.values.salary).toLocaleString() || '0'}</span>
                 </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-wider"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-3 p-4 bg-success-green/10 border border-success-green/20 rounded-2xl text-success-green text-[10px] font-black uppercase tracking-wider"
                  >
                    <CheckCircle2 size={14} className="shrink-0" />
                    Credentials Dispatched!
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit"
                disabled={formik.isSubmitting || success}
                className="w-full bg-primary-blue text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-gray-900 transition-all shadow-xl shadow-primary-blue/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Deploying Node...
                  </>
                ) : (
                  <>
                    Submit & Dispatch
                    <Zap size={16} />
                  </>
                )}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
