'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Clock, 
  Award, 
  DollarSign, 
  FileText, 
  Link as LinkIcon,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Upload,
  File,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

const validationSchema = Yup.object().shape({
  full_name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  location: Yup.string().required('Location is required'),
  current_status: Yup.string().required('Current status is required'),
  notice_period: Yup.string().required('Notice period is required'),
  total_experience: Yup.number().min(0, 'Experience cannot be negative').required('Experience is required'),
  current_salary: Yup.string().required('Current salary is required'),
  expected_salary: Yup.string().required('Expected salary is required'),
  introduction: Yup.string().min(50, 'Tell us a bit more (min 50 characters)').required('Introduction is required'),
  resume_file: Yup.mixed().required('Resume file is required'),
  portfolio_link: Yup.string().url('Invalid URL'),
  custom_fields: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required('Title is required'),
      value: Yup.string().required('Information is required'),
    })
  ),
});

export default function JobApplicationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`/jobs/${id}`);
        if (response.data.success) {
          setJob(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch job info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      current_status: '',
      notice_period: '',
      total_experience: '',
      current_salary: '',
      expected_salary: '',
      introduction: '',
      resume_file: null,
      portfolio_link: '',
      custom_fields: [] as { label: string; value: string }[],
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const formData = new FormData();
        
        // Primary Fields
        formData.append('job_id', String(id));
        formData.append('full_name', values.full_name);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('location', values.location);
        
        if (values.resume_file) {
          formData.append('resume', values.resume_file);
        }

        // Professional Metadata
        const metadata = {
          current_status: values.current_status,
          notice_period: values.notice_period,
          total_experience: values.total_experience,
          current_salary: values.current_salary,
          expected_salary: values.expected_salary,
          introduction: values.introduction,
          portfolio_link: values.portfolio_link,
          custom_info: values.custom_fields // Adding applicant defined fields here
        };
        
        formData.append('metadata', JSON.stringify(metadata));

        const response = await axiosInstance.post('/applications/submit', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          setIsSuccess(true);
        }
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to deliver your transmission. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary-blue" size={48} />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Calibrating Application Matrix...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100 text-center"
        >
          <div className="w-24 h-24 bg-success-green/10 text-success-green rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Transmission Received!</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            Your application for <span className="text-primary-blue font-bold">{job?.role_title}</span> has been securely uploaded to our talent matrix.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-primary-blue transition-all shadow-xl shadow-gray-900/10 active:scale-95 flex items-center justify-center gap-3"
          >
            Return to Base
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6 sticky top-0 z-50 backdrop-blur-xl bg-white/80">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="p-3 hover:bg-gray-50 rounded-2xl transition-all">
            <ChevronLeft size={24} className="text-gray-900" />
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-black text-gray-900 tracking-tight">Job Application</h1>
            <p className="text-[10px] font-black text-primary-blue uppercase tracking-widest leading-none mt-0.5">{job?.role_title}</p>
          </div>
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
            <Briefcase size={20} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-12">
        <form onSubmit={formik.handleSubmit} className="space-y-10">
          
          {/* Section: Personal Info */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-primary-blue/5 rounded-xl flex items-center justify-center text-primary-blue">
                <User size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest">Personal Identification</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField 
                label="Full Name"
                icon={<User size={16} />}
                {...formik.getFieldProps('full_name')}
                error={formik.touched.full_name && formik.errors.full_name ? String(formik.errors.full_name) : undefined}
              />
              <InputField 
                label="Email Address"
                icon={<Mail size={16} />}
                type="email"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && formik.errors.email ? String(formik.errors.email) : undefined}
              />
              <InputField 
                label="Phone Number"
                icon={<Phone size={16} />}
                {...formik.getFieldProps('phone')}
                error={formik.touched.phone && formik.errors.phone ? String(formik.errors.phone) : undefined}
              />
              <InputField 
                label="Current Location"
                icon={<MapPin size={16} />}
                placeholder="e.g. San Francisco, US"
                {...formik.getFieldProps('location')}
                error={formik.touched.location && formik.errors.location ? String(formik.errors.location) : undefined}
              />
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Upload Resume (PDF only)</label>
                <div 
                  className={`relative group/upload border-2 border-dashed rounded-2xl p-4 transition-all ${
                    formik.values.resume_file 
                      ? 'border-success-green bg-success-green/5' 
                      : formik.touched.resume_file && formik.errors.resume_file 
                        ? 'border-red-500 bg-red-50/5' 
                        : 'border-gray-100 hover:border-primary-blue hover:bg-gray-50/50'
                  }`}
                >
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={(event) => {
                      if (event.currentTarget.files && event.currentTarget.files[0]) {
                        formik.setFieldValue("resume_file", event.currentTarget.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {formik.values.resume_file ? (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-success-green/20 text-success-green rounded-xl flex items-center justify-center shrink-0">
                          <File size={20} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-black text-gray-900 truncate uppercase tracking-tight">{(formik.values.resume_file as File).name}</p>
                          <p className="text-[8px] font-medium text-gray-400 uppercase tracking-widest">{((formik.values.resume_file as File).size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          formik.setFieldValue("resume_file", null);
                        }}
                        className="p-2 bg-white rounded-lg text-gray-400 hover:text-red-500 transition-colors z-20"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2 text-center">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-hover/upload:text-primary-blue transition-colors mb-2">
                        <Upload size={20} />
                      </div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select CV Asset</p>
                    </div>
                  )}
                </div>
                {formik.touched.resume_file && formik.errors.resume_file && (
                  <p className="text-[10px] text-red-500 font-bold ml-1">{String(formik.errors.resume_file)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Professional Details */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-success-green/5 rounded-xl flex items-center justify-center text-success-green">
                <Briefcase size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest">Core Experience</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SelectField 
                label="Current Professional Status"
                icon={<Briefcase size={16} />}
                {...formik.getFieldProps('current_status')}
                error={formik.touched.current_status && formik.errors.current_status ? String(formik.errors.current_status) : undefined}
              >
                <option value="">Select Status</option>
                <option value="employed">Currently Employed</option>
                <option value="open_to_work">Open to Work / Unemployed</option>
                <option value="student">Student / Recent Graduate</option>
                <option value="freelance">Freelancing / Contract</option>
              </SelectField>

              <SelectField 
                label="Availability / Notice Period"
                icon={<Clock size={16} />}
                {...formik.getFieldProps('notice_period')}
                error={formik.touched.notice_period && formik.errors.notice_period ? String(formik.errors.notice_period) : undefined}
              >
                <option value="">Select Notice Period</option>
                <option value="immediate">Immediate Availability</option>
                <option value="15_days">15 Days or less</option>
                <option value="1_month">1 Month</option>
                <option value="2_months">2 Months</option>
                <option value="negotiable">Negotiable</option>
              </SelectField>

              <InputField 
                label="Total Years of Experience"
                icon={<Award size={16} />}
                type="number"
                {...formik.getFieldProps('total_experience')}
                error={formik.touched.total_experience && formik.errors.total_experience ? String(formik.errors.total_experience) : undefined}
              />
              <InputField 
                label="Portfolio / LinkedIn URL"
                icon={<LinkIcon size={16} />}
                placeholder="Optional"
                {...formik.getFieldProps('portfolio_link')}
                error={formik.touched.portfolio_link && formik.errors.portfolio_link ? String(formik.errors.portfolio_link) : undefined}
              />
            </div>
          </div>

          {/* Section: Financial Expectations */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-warning-orange/5 rounded-xl flex items-center justify-center text-warning-orange">
                <DollarSign size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest">Comp Distribution</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField 
                label="Current Monthly Salary"
                icon={<DollarSign size={16} />}
                placeholder="e.g. 80,000"
                {...formik.getFieldProps('current_salary')}
                error={formik.touched.current_salary && formik.errors.current_salary ? String(formik.errors.current_salary) : undefined}
              />
              <InputField 
                label="Expected Monthly Salary"
                icon={<DollarSign size={16} />}
                placeholder="e.g. 100,000"
                {...formik.getFieldProps('expected_salary')}
                error={formik.touched.expected_salary && formik.errors.expected_salary ? String(formik.errors.expected_salary) : undefined}
              />
            </div>
          </div>

          {/* Section: Tell us about yourself */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-gray-900/5 rounded-xl flex items-center justify-center text-gray-900">
                <FileText size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest">Protocol Introduction</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">About yourself (Min 50 chars)</label>
              <textarea 
                rows={6}
                {...formik.getFieldProps('introduction')}
                className={`w-full bg-gray-50/50 border ${formik.touched.introduction && formik.errors.introduction ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} focus:border-primary-blue focus:bg-white rounded-2xl p-5 outline-none transition-all font-medium text-sm text-gray-900 placeholder:text-gray-300 shadow-inner`}
                placeholder="Tell us what makes you the perfect fit for this protocol..."
              />
              {formik.touched.introduction && formik.errors.introduction && (
                <p className="text-[10px] text-red-500 font-bold ml-1">{String(formik.errors.introduction)}</p>
              )}
            </div>
          </div>

          {/* Section: Additional Intelligence (Custom Applicant Fields) */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-blue/5 rounded-xl flex items-center justify-center text-primary-blue">
                  <Plus size={20} />
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest">Additional Assets</h2>
              </div>
              <button 
                type="button"
                onClick={() => {
                  const currentFields = [...formik.values.custom_fields];
                  currentFields.push({ label: '', value: '' });
                  formik.setFieldValue('custom_fields', currentFields);
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary-blue transition-all flex items-center gap-2"
              >
                <Plus size={14} />
                Add Field
              </button>
            </div>
            
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-8 leading-relaxed">
              Add any extra context, certificates, or links that strengthen your transmission.
            </p>

            <div className="space-y-6">
              <AnimatePresence>
                {formik.values.custom_fields.map((field, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-gray-50/50 p-4 rounded-3xl border border-gray-100"
                  >
                    <div className="md:col-span-4">
                      <input 
                        placeholder="Title (e.g. GitHub)"
                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 outline-none focus:border-primary-blue transition-all"
                        value={field.label}
                        onChange={(e) => {
                          const fields = [...formik.values.custom_fields];
                          fields[index].label = e.target.value;
                          formik.setFieldValue('custom_fields', fields);
                        }}
                      />
                    </div>
                    <div className="md:col-span-7">
                      <input 
                        placeholder="Details or URL"
                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 outline-none focus:border-primary-blue transition-all"
                        value={field.value}
                        onChange={(e) => {
                          const fields = [...formik.values.custom_fields];
                          fields[index].value = e.target.value;
                          formik.setFieldValue('custom_fields', fields);
                        }}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <button 
                        type="button"
                        onClick={() => {
                          const fields = [...formik.values.custom_fields];
                          fields.splice(index, 1);
                          formik.setFieldValue('custom_fields', fields);
                        }}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {formik.values.custom_fields.length === 0 && (
                <div className="text-center py-10 border border-dashed border-gray-100 rounded-[2rem]">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No additional assets defined.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Submit Button Container */}
          <div className="sticky bottom-8 z-40 bg-white/5 backdrop-blur-md p-2 rounded-3xl border border-white/20 shadow-2xl">
            <button 
              type="submit"
              disabled={submitting || !formik.isValid}
              className="w-full bg-gray-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-primary-blue transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Uploading Application...
                </>
              ) : (
                <>
                  Post Application
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function InputField({ label, icon, error, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group/field">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/field:text-primary-blue transition-colors">
          {icon}
        </div>
        <input 
          {...props}
          className={`w-full bg-gray-50/50 border ${error ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-xs text-gray-900 placeholder:text-gray-300 shadow-inner`}
        />
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>
      )}
    </div>
  );
}

function SelectField({ label, icon, error, children, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group/field">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/field:text-primary-blue transition-colors">
          {icon}
        </div>
        <select 
          {...props}
          className={`w-full bg-gray-50/50 border ${error ? 'border-red-500 bg-red-50/10' : 'border-gray-100'} focus:border-primary-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-xs text-gray-900 appearance-none shadow-inner cursor-pointer`}
        >
          {children}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronLeft className="-rotate-90 text-gray-300" size={16} />
        </div>
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>
      )}
    </div>
  );
}
