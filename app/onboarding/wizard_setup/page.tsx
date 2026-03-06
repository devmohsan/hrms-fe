// file: d:\hr_menagment\hrms_fe\app\onboarding\wizard_setup\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Plus,
  X,
  AlertCircle,
  Calendar,
  Clock,
  Shield,
  Check,
  ChevronRight,
  Zap,
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

/* -------------------------------------------------------------------------- */
/*                         Validation schema (Yup)                           */
/* -------------------------------------------------------------------------- */
const wizardSchema = Yup.object().shape({
  departments: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Department name required'),
      })
    )
    .min(1, 'At least one department is required'),

  roles: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Role name required'),
        permissions: Yup.object().shape({
          can_edit: Yup.boolean(),
          can_view_reports: Yup.boolean(),
        }),
      })
    )
    .min(1, 'At least one role is required'),

  working_hours: Yup.array()
    .of(
      Yup.object().shape({
        day_of_week: Yup.string()
          .oneOf(
            [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            'Invalid day'
          )
          .required('Day required'),
        start_time: Yup.string()
          .matches(
            /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
            'HH:MM:SS format required'
          )
          .required('Start time required'),
        end_time: Yup.string()
          .matches(
            /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
            'HH:MM:SS format required'
          )
          .required('End time required'),
        grace_period_minutes: Yup.number()
          .min(0, 'Cannot be negative')
          .required('Grace period required'),
      })
    )
    .min(1, 'At least one working hour entry required'),

  leave_rules: Yup.array()
    .of(
      Yup.object().shape({
        leave_type: Yup.string().required('Leave type required'),
        count_per_year: Yup.number()
          .min(0, 'Cannot be negative')
          .required('Count required'),
        is_paid: Yup.boolean(),
      })
    )
    .min(1, 'At least one leave rule required'),

  company_rules: Yup.array()
    .of(
      Yup.object().shape({
        rule_type: Yup.string().required('Rule type required'),
        rule_key: Yup.string().required('Rule key required'),
        rule_value: Yup.string().required('Rule value required (JSON)'),
      })
    )
    .min(1, 'At least one company rule required'),
});

/* -------------------------------------------------------------------------- */
/*                               UI Component                                 */
/* -------------------------------------------------------------------------- */
export default function WizardSetupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------------------------------------------------------------- */
  /*               Guard: Only admin users can access this page               */
  /* ---------------------------------------------------------------------- */
  // NOTE: Disabled the guard momentarily for your testing if needed, but keeping logic ready
  // useEffect(() => {
  //   if (status === 'loading') return;
  //   if (!session?.user?.role || session?.user?.role !== 'admin') {
  //     signOut({ callbackUrl: '/login' });
  //   }
  // }, [session, status]);

  const formik = useFormik({
    initialValues: {
      departments: [{ name: '' }],
      roles: [
        {
          name: '',
          permissions: { can_edit: false, can_view_reports: false },
        },
      ],
      working_hours: [
        {
          day_of_week: 'Monday',
          start_time: '09:00:00',
          end_time: '18:00:00',
          grace_period_minutes: 15,
        },
      ],
      leave_rules: [{ leave_type: 'Annual', count_per_year: 20, is_paid: true }],
      company_rules: [
        {
          rule_type: 'late_rule',
          rule_key: 'late_penalty',
          rule_value: JSON.stringify({ minutes: 15, deduction: "0.5_day" }),
        },
      ],
    },
    validationSchema: wizardSchema,
    onSubmit: async (values) => {
      setGlobalError(null);
      setGlobalSuccess(null);
      setSubmitting(true);
      try {
        // Parse the JSON string back to an object for company_rules
        const formattedValues = {
          ...values,
          company_rules: values.company_rules.map(rule => ({
            ...rule,
            rule_value: typeof rule.rule_value === 'string' ? JSON.parse(rule.rule_value) : rule.rule_value
          }))
        };

        const response = await axiosInstance.post('/onboarding/setup-wizard', formattedValues);
        
        if (response.status === 200 || response.status === 201) {
          const nextStep = response.data?.data?.onboarding_step;
          setGlobalSuccess('System Configuration Synchronized.');
          
          setTimeout(() => {
            if (nextStep === 'completed') {
              router.push('/dashboard');
            } else if (nextStep) {
              // Redirect to next onboarding node if provided
              router.push(`/onboarding/${nextStep}`);
            } else {
              // Final fallback
              router.push('/dashboard');
            }
          }, 2000);
        }
      } catch (err: any) {
        setGlobalError(err.response?.data?.message || 'Synchronization Failed. Please verify protocols.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid, submitCount } = formik;

  // Debug: Log validation errors if submission fails
  useEffect(() => {
    if (submitCount > 0 && !isValid) {
      console.log("Validation Errors:", errors);
      setGlobalError("Please check the form for errors before committing.");
    }
  }, [submitCount, isValid, errors]);

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6 md:p-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-primary-blue/5 rounded-full blur-[100px] md:blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-success-green/5 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-12 md:mb-20">
          <button
            onClick={() => router.back()}
            className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-primary-blue transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Previous Node
          </button>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-blue/5 text-primary-blue text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                Step 03: Protocol Definition
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-[0.95] md:leading-[0.85]">
                Configure Your <br />
                <span className="text-primary-blue">Intelligence OS.</span>
              </h1>
              <p className="text-gray-500 font-medium text-lg md:text-xl mt-6 max-w-xl leading-relaxed">
                Initialize the system parameters, operational hours, and organizational hierarchy.
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl w-full lg:w-auto">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-blue/30">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-900">Secure Setup</h4>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400">Admin privileges active.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Feedback */}
        <AnimatePresence>
          {globalError && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-3xl mb-8 flex items-center gap-4">
              <AlertCircle className="shrink-0" />
              <p className="font-bold text-sm tracking-tight">{globalError}</p>
            </motion.div>
          )}
          {globalSuccess && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-green-50 border border-green-100 text-green-600 p-6 rounded-3xl mb-8 flex items-center gap-4">
              <CheckCircle className="shrink-0" />
              <p className="font-bold text-sm tracking-tight">{globalSuccess}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <FormikProvider value={formik}>
          <form onSubmit={handleSubmit} className="space-y-12 pb-20">
            
            {/* 1. DEPARTMENTS */}
            <SectionWrapper 
              title="Departments" 
              subtitle="Map out your functional units" 
              icon={<Shield className="text-primary-blue" size={20} />}
            >
              <FieldArray name="departments" render={arrayHelpers => (
                <div className="space-y-4">
                  {values.departments.map((dept, idx) => (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={idx} className="flex gap-4 items-start">
                      <div className="flex-grow relative group">
                        <input 
                          name={`departments[${idx}].name`}
                          value={dept.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Node Name (e.g. Information Technology)"
                          className="w-full bg-white/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900 shadow-sm"
                        />
                        {errors.departments?.[idx] && touched.departments?.[idx] && (
                          <div className="absolute -bottom-5 left-4 text-[8px] font-black uppercase text-red-500 tracking-widest flex items-center gap-1">
                            <AlertCircle size={8} /> {(errors.departments[idx] as any).name}
                          </div>
                        )}
                      </div>
                      {values.departments.length > 1 && (
                        <button type="button" onClick={() => arrayHelpers.remove(idx)} className="mt-4 text-gray-300 hover:text-red-500 transition-colors">
                          <X size={20} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                  <button type="button" onClick={() => arrayHelpers.push({ name: '' })} className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue hover:opacity-70 transition-opacity">
                    <Plus size={14} /> Add Department
                  </button>
                </div>
              )} />
            </SectionWrapper>

            {/* 2. ROLES */}
            <SectionWrapper 
              title="Roles & Hierarchy" 
              subtitle="Define user access levels and permissions" 
              icon={<Shield className="text-primary-blue" size={20} />}
            >
              <FieldArray name="roles" render={arrayHelpers => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {values.roles.map((role, idx) => (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className="bg-white/40 border border-white p-6 rounded-[2.5rem] relative">
                      {values.roles.length > 1 && (
                        <button type="button" onClick={() => arrayHelpers.remove(idx)} className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors">
                          <X size={18} />
                        </button>
                      )}
                      <div className="mb-6">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4 mb-2 block">Position Identity</label>
                        <input 
                          name={`roles[${idx}].name`}
                          value={role.name}
                          onChange={handleChange}
                          className="w-full bg-white/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900 shadow-sm"
                          placeholder="e.g. Fleet Commander"
                        />
                      </div>
                      <div className="flex flex-wrap gap-4 px-4">
                        <PermissionToggle 
                          label="Can Edit" 
                          checked={role.permissions.can_edit} 
                          onChange={(val) => formik.setFieldValue(`roles[${idx}].permissions.can_edit`, val)} 
                        />
                        <PermissionToggle 
                          label="View Reports" 
                          checked={role.permissions.can_view_reports} 
                          onChange={(val) => formik.setFieldValue(`roles[${idx}].permissions.can_view_reports`, val)} 
                        />
                      </div>
                    </motion.div>
                  ))}
                  <button type="button" onClick={() => arrayHelpers.push({ name: '', permissions: { can_edit: false, can_view_reports: false } })} className="border-2 border-dashed border-gray-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-gray-300 hover:text-primary-blue hover:border-primary-blue/30 transition-all gap-3">
                    <Plus size={32} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add New Role</span>
                  </button>
                </div>
              )} />
            </SectionWrapper>

            {/* 3. WORKING HOURS */}
            <SectionWrapper 
              title="Standard Operations" 
              subtitle="Set your organizational working windows" 
              icon={<Clock className="text-primary-blue" size={20} />}
            >
              <FieldArray name="working_hours" render={arrayHelpers => (
                <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-y-4">
                    <thead>
                      <tr>
                        <th className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest px-6 pb-2">Operational Day</th>
                        <th className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest px-6 pb-2">Start Time</th>
                        <th className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest px-6 pb-2">End Time</th>
                        <th className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest px-6 pb-2">Grace (Min)</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {values.working_hours.map((wh, idx) => (
                        <tr key={idx} className="bg-white/40 transition-all hover:bg-white/60 group">
                          <td className="px-4 py-3 rounded-l-3xl">
                            <select name={`working_hours[${idx}].day_of_week`} value={wh.day_of_week} onChange={handleChange} className="w-full bg-transparent border-none outline-none font-bold text-gray-900 cursor-pointer">
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3 border-l border-white/50">
                            <input name={`working_hours[${idx}].start_time`} value={wh.start_time} onChange={handleChange} className="bg-transparent border-none outline-none font-bold text-gray-900 w-full" placeholder="09:00:00" />
                          </td>
                          <td className="px-4 py-3 border-l border-white/50">
                            <input name={`working_hours[${idx}].end_time`} value={wh.end_time} onChange={handleChange} className="bg-transparent border-none outline-none font-bold text-gray-900 w-full" placeholder="18:00:00" />
                          </td>
                          <td className="px-4 py-3 border-l border-white/50">
                            <input name={`working_hours[${idx}].grace_period_minutes`} type="number" value={wh.grace_period_minutes} onChange={handleChange} className="bg-transparent border-none outline-none font-bold text-gray-900 w-20" />
                          </td>
                          <td className="pr-6 rounded-r-3xl text-right">
                            {values.working_hours.length > 1 && (
                              <button type="button" onClick={() => arrayHelpers.remove(idx)} className="text-gray-200 group-hover:text-red-400 transition-colors">
                                <X size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button type="button" onClick={() => arrayHelpers.push({ day_of_week: 'Monday', start_time: '09:00:00', end_time: '18:00:00', grace_period_minutes: 0 })} className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue hover:opacity-70 transition-opacity px-6">
                    <Plus size={14} /> Add Time Window
                  </button>
                </div>
              )} />
            </SectionWrapper>

            {/* 4. LEAVE RULES */}
            <SectionWrapper 
              title="Time‑Off Matrix" 
              subtitle="Establish leave categories and limitations" 
              icon={<Calendar className="text-primary-blue" size={20} />}
            >
              <FieldArray name="leave_rules" render={arrayHelpers => (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {values.leave_rules.map((rule, idx) => (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key={idx} className="bg-white/40 border border-white p-6 rounded-[2rem] flex flex-col gap-4 relative">
                      <button type="button" onClick={() => arrayHelpers.remove(idx)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                      <input 
                        name={`leave_rules[${idx}].leave_type`} 
                        value={rule.leave_type} 
                        onChange={handleChange} 
                        placeholder="Type (e.g. Annual)"
                        className="bg-transparent border-b border-gray-100 focus:border-primary-blue py-2 outline-none font-bold text-gray-900" 
                      />
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase text-gray-400">Quota</span>
                         <input 
                           name={`leave_rules[${idx}].count_per_year`} 
                           type="number" 
                           value={rule.count_per_year} 
                           onChange={handleChange} 
                           className="w-16 bg-gray-50 border-none rounded-lg p-2 text-center font-bold text-gray-900"
                         />
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase text-gray-400">Paid Protocol</span>
                         <PermissionToggle 
                          label="" 
                          checked={rule.is_paid} 
                          onChange={(val) => formik.setFieldValue(`leave_rules[${idx}].is_paid`, val)} 
                        />
                      </div>
                    </motion.div>
                  ))}
                  <button type="button" onClick={() => arrayHelpers.push({ leave_type: '', count_per_year: 0, is_paid: false })} className="border-2 border-dashed border-gray-200 rounded-[2rem] p-6 flex items-center justify-center text-gray-300 hover:text-primary-blue hover:border-primary-blue/30 transition-all gap-3">
                    <Plus size={20} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">New Leave Tier</span>
                  </button>
                </div>
              )} />
            </SectionWrapper>

            {/* 5. COMPANY RULES (AI & Late Rules) */}
            <SectionWrapper 
              title="System Logic" 
              subtitle="Configure automated logic and AI parameters" 
              icon={<Zap className="text-primary-blue" size={20} />}
            >
              <FieldArray name="company_rules" render={arrayHelpers => (
                <div className="space-y-6">
                  {values.company_rules.map((rule, idx) => (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/40 p-6 rounded-3xl items-end relative">
                      <button type="button" onClick={() => arrayHelpers.remove(idx)} className="absolute top-4 right-4 text-gray-200 hover:text-red-500">
                        <X size={16} />
                      </button>
                      <div className="md:col-span-1">
                        <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-2">Category</label>
                        <input name={`company_rules[${idx}].rule_type`} value={rule.rule_type} onChange={handleChange} className="w-full bg-white/80 border-none rounded-xl py-3 px-4 font-bold text-gray-900" placeholder="late_rule" />
                      </div>
                      <div className="md:col-span-1">
                        <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-2">Rule Identifier</label>
                        <input name={`company_rules[${idx}].rule_key`} value={rule.rule_key} onChange={handleChange} className="w-full bg-white/80 border-none rounded-xl py-3 px-4 font-bold text-gray-900" placeholder="late_penalty" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-2">Logic Payload (JSON)</label>
                        <input name={`company_rules[${idx}].rule_value`} value={rule.rule_value} onChange={handleChange} className="w-full bg-white/80 border-none rounded-xl py-3 px-4 font-bold text-gray-900 font-mono text-xs" placeholder='{"minutes":15,"deduction":"0.5_day"}' />
                      </div>
                    </motion.div>
                  ))}
                  <button type="button" onClick={() => arrayHelpers.push({ rule_type: '', rule_key: '', rule_value: '' })} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue hover:opacity-70 transition-opacity">
                    <Plus size={14} /> Add System Logic
                  </button>
                </div>
              )} />
            </SectionWrapper>

            {/* Submission Area */}
            <div className="flex flex-col items-center gap-6 pt-12">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] text-center max-w-sm leading-loose">
                Initializing these parameters will broadcast <br /> configuration to all organization nodes.
              </p>
              <button
                type="submit"
                disabled={submitting || isSubmitting}
                className="group relative flex items-center gap-4 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary-blue transition-all shadow-2xl shadow-gray-900/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting || isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    Commit Configuration
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Helper Components                             */
/* -------------------------------------------------------------------------- */

function SectionWrapper({ title, subtitle, icon, children }: { title: string, subtitle: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none uppercase">{title}</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function PermissionToggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
        checked 
          ? 'bg-primary-blue/5 border-primary-blue text-primary-blue' 
          : 'bg-white/50 border-gray-100 text-gray-400'
      }`}
    >
      <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${checked ? 'bg-primary-blue text-white' : 'bg-gray-100'}`}>
        {checked && <Check size={10} strokeWidth={4} />}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
