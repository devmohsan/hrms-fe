'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Award,
  Edit3
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
  status: Yup.string().oneOf(['active', 'on_leave', 'terminated', 'resigned']).required()
});

export default function EditEmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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
      address: '',
      status: 'active'
    },
    validationSchema,
    onSubmit: async (values: any, { setSubmitting }) => {
      setError(null);
      try {
        const payload = {
          ...values,
          salary: Number(values.salary),
          id_code: values.employee_code // Synonym for backward compatibility
        };
        const response = await axiosInstance.patch(`/employees/${id}`, payload);
        if (response.data.success) {
          setSuccess(true);
          setTimeout(() => {
            router.push('/dashboard/employees');
          }, 2000);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update workforce node. Verify inputs.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchEmployeeData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/employees/${id}`);
      console.log("Fetched Personnel Matrix:", response.data);
      if (response.data.success) {
        const employee = response.data.data || response.data.employee;
        formik.setValues({
          employee_code: employee.employee_code || employee.id_code || '',
          first_name: employee.first_name || '',
          last_name: employee.last_name || '',
          email: employee.email || '',
          username: employee.username || '',
          phone: employee.phone || '',
          designation: employee.designation || '',
          department: employee.department || '',
          salary: employee.salary || '',
          joining_date: employee.joining_date?.split('T')[0] || '',
          dob: employee.dob?.split('T')[0] || '',
          gender: employee.gender?.toLowerCase() || 'male',
          address: employee.address || '',
          status: employee.status || 'active'
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load personnel data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary-blue" size={48} />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Syncing Personnel Data...</p>
        </div>
      </div>
    );
  }

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
              Update Personnel
              <Edit3 size={24} className="text-primary-blue" />
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Modify human capital node in matrix</p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[3rem] shadow-xl shadow-gray-200/20 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
               <div className="w-12 h-12 bg-primary-blue/5 rounded-2xl flex items-center justify-center text-primary-blue">
                 <User size={24} />
               </div>
               <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Core Identity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">ID Code</label>
                <input {...formik.getFieldProps('employee_code')} className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Username</label>
                <input {...formik.getFieldProps('username')} className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">First Name</label>
                <input {...formik.getFieldProps('first_name')} className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Last Name</label>
                <input {...formik.getFieldProps('last_name')} className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[3rem] shadow-xl shadow-gray-200/20 relative overflow-hidden">
             <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
               <div className="w-12 h-12 bg-warning-orange/5 rounded-2xl flex items-center justify-center text-warning-orange">
                 <Mail size={24} />
               </div>
               <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Digital Access & Personal</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email</label>
                <input {...formik.getFieldProps('email')} className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone</label>
                <input {...formik.getFieldProps('phone')} className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Date of Birth</label>
                <input {...formik.getFieldProps('dob')} type="date" className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Address</label>
                <textarea {...formik.getFieldProps('address')} rows={3} className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900 resize-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/20 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-success-green/5 rounded-xl flex items-center justify-center text-success-green">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight uppercase italic">Professional Status</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Personnel Status</label>
                    <select {...formik.getFieldProps('status')} className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 outline-none font-bold text-xs text-gray-900">
                      <option value="active">Active</option>
                      <option value="on_leave">On Leave</option>
                      <option value="resigned">Resigned</option>
                      <option value="terminated">Terminated</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Department</label>
                    <select {...formik.getFieldProps('department')} className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 outline-none font-bold text-xs text-gray-900">
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="HR">Human Resources</option>
                      <option value="Operations">Operations</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Designation</label>
                    <input {...formik.getFieldProps('designation')} className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-xl py-3 px-4 outline-none font-bold text-xs text-gray-900" />
                </div>
                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Salary</label>
                    <input {...formik.getFieldProps('salary')} type="number" className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-xl py-3 px-4 outline-none font-bold text-xs text-gray-900" />
                </div>
              </div>
           </div>

           <div className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-2xl space-y-8">
              <h3 className="text-xl font-black italic tracking-tight uppercase">Update Manifest</h3>
              <div className="space-y-4 border-t border-white/5 pt-6">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/50 tracking-widest">
                   <span>Personnel:</span>
                   <span className="text-white">{formik.values.first_name} {formik.values.last_name}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/50 tracking-widest">
                   <span>Node Status:</span>
                   <span className={`uppercase ${formik.values.status === 'active' ? 'text-success-green' : 'text-warning-orange'}`}>{formik.values.status}</span>
                 </div>
              </div>

              <AnimatePresence>
                {Object.keys(formik.errors).length > 0 && formik.submitCount > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase text-center space-y-1">
                    <p className="border-b border-red-500/10 pb-2 mb-2">Fix validation errors:</p>
                    {Object.entries(formik.errors).map(([key, value]) => (
                      <div key={key}>{key}: {value as string}</div>
                    ))}
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-success-green/10 border border-success-green/20 rounded-2xl text-success-green text-[10px] font-black uppercase text-center">
                    Manifest Updated Successfully!
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="submit" disabled={formik.isSubmitting || success} className="w-full bg-primary-blue text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                {formik.isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <>Update & Sync <Zap size={16} /></>}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
