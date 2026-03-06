'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Award, 
  Zap, 
  Layers, 
  Dna,
  CheckCircle2,
  Plus,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

const validationSchema = Yup.object().shape({
  role: Yup.string().required('Role title is required'),
  budget: Yup.string().required('Budget range is required'),
  skills: Yup.array().of(Yup.string()).min(1, 'Add at least one skill'),
  location: Yup.string().required('Location is required'),
  experience: Yup.string().required('Experience info is required'),
  remote_onsite: Yup.string().oneOf(['remote', 'onsite', 'hybrid']).required('Required'),
  assessment_format: Yup.string().required('Assessment format required'),
  stage_mode: Yup.string().required('Stage mode required'),
  weight_config: Yup.object().shape({
    form: Yup.number().min(0).max(100).required(),
    video: Yup.number().min(0).max(100).required(),
    technical: Yup.number().min(0).max(100).required(),
  }).test('total-100', 'Weights must sum to 100', (val: any) => {
    return (val.form + val.video + val.technical) === 100;
  }),
});

export default function CreateJobPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const formik = useFormik({
    initialValues: {
      role: '',
      budget: '',
      skills: [] as string[],
      location: '',
      experience: '',
      remote_onsite: 'remote',
      assessment_format: '2-stage',
      stage_mode: 'multi_stage',
      weight_config: {
        form: 20,
        video: 30,
        technical: 50
      }
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        const response = await axiosInstance.post('/jobs/create', values);
        if (response.data.success) {
          setSuccess(true);
          setTimeout(() => {
            router.push('/dashboard/recruitment');
          }, 2000);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to deploy protocol. Verify inputs.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const addSkill = () => {
    if (skillInput && !formik.values.skills.includes(skillInput)) {
      formik.setFieldValue('skills', [...formik.values.skills, skillInput]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    formik.setFieldValue('skills', formik.values.skills.filter(s => s !== skill));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/recruitment" className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all active:scale-90">
            <ArrowLeft size={20} className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Create New Job</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Configure new acquisition node</p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Form Details */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white/80 backdrop-blur-xl border border-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/20">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
               <div className="w-12 h-12 bg-primary-blue/5 rounded-2xl flex items-center justify-center text-primary-blue">
                 <Briefcase size={24} />
               </div>
               <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Core Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Job Title / Role</label>
                <input 
                  {...formik.getFieldProps('role')}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900 shadow-inner"
                />
                {formik.touched.role && formik.errors.role && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Location Identity</label>
                <div className="relative group">
                   <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                   <input 
                    {...formik.getFieldProps('location')}
                    placeholder="City, Country"
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-gray-900 shadow-inner"
                  />
                </div>
                {formik.touched.location && formik.errors.location && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.location}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Work Protocol</label>
                <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                  {['remote', 'onsite', 'hybrid'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        formik.setFieldValue('remote_onsite', mode);
                        if (mode === 'remote') {
                          formik.setFieldValue('location', 'Remote');
                        }
                      }}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        formik.values.remote_onsite === mode 
                          ? 'bg-white text-primary-blue shadow-sm border border-gray-100' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Experience Matrix</label>
                <div className="relative group">
                   <Award className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                   <input 
                    {...formik.getFieldProps('experience')}
                    placeholder="e.g. 5+ Years"
                    className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-gray-900 shadow-inner"
                  />
                </div>
                {formik.touched.experience && formik.errors.experience && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.experience}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/20">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
               <div className="w-12 h-12 bg-success-green/5 rounded-2xl flex items-center justify-center text-success-green">
                 <Zap size={24} />
               </div>
               <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Requirements & Budget</h2>
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Skill Requirements</label>
                  <div className="flex gap-4">
                    <input 
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                      placeholder="Add technological skill (e.g. React)..."
                      className="flex-1 bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-900 shadow-inner"
                    />
                    <button 
                      type="button" 
                      onClick={addSkill}
                      className="p-5 bg-gray-900 text-white rounded-2xl hover:bg-primary-blue transition-all active:scale-95"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <AnimatePresence>
                      {formik.values.skills.map(skill => (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          key={skill} 
                          className="px-4 py-2 bg-primary-blue/5 border border-primary-blue/10 text-primary-blue rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)}><X size={12} /></button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  {formik.touched.skills && formik.errors.skills && (
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.skills as string}</p>
                  )}
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Budget Allocation</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                    <input 
                      {...formik.getFieldProps('budget')}
                      placeholder="e.g. $80k - $120k"
                      className="w-full bg-gray-50/50 border border-gray-100 focus:border-primary-blue rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-bold text-gray-900 shadow-inner"
                    />
                  </div>
                  {formik.touched.budget && formik.errors.budget && (
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1 ml-2">{formik.errors.budget}</p>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Configuration & Summary */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/20">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-warning-orange/5 rounded-xl flex items-center justify-center text-warning-orange">
                  <Dna size={20} />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight uppercase italic">Assessment Logic</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Stage Mode</label>
                    <select 
                      name="stage_mode"
                      value={formik.values.stage_mode}
                      onChange={(e) => {
                        const val = e.target.value;
                        formik.setFieldValue('stage_mode', val);
                        if (val === 'same_session') {
                          formik.setFieldValue('assessment_format', '1-stage');
                          formik.setFieldValue('weight_config', {
                            form: 0,
                            video: 0,
                            technical: 100
                          });
                        }
                      }}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 outline-none font-bold text-xs appearance-none cursor-pointer"
                    >
                      <option value="multi_stage">Multi-Stage</option>
                      <option value="same_session">Single-stage</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Assessment Format</label>
                    <select 
                      name="assessment_format"
                      value={formik.values.assessment_format}
                      onChange={(e) => {
                        const val = e.target.value;
                        formik.setFieldValue('assessment_format', val);
                        if (val === '1-stage') {
                          formik.setFieldValue('stage_mode', 'same_session');
                          formik.setFieldValue('weight_config', {
                            form: 0,
                            video: 0,
                            technical: 100
                          });
                        }
                      }}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 outline-none font-bold text-xs appearance-none cursor-pointer"
                    >
                      <option value="1-stage">1-Stage</option>
                      <option value="2-stage">2-Stage</option>
                      <option value="3-stage">3-Stage</option>
                    </select>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-gray-50">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 flex items-center justify-between">
                       Weight Distribution
                       <span className={`text-[8px] ${formik.values.weight_config.form + formik.values.weight_config.video + formik.values.weight_config.technical === 100 ? 'text-success-green' : 'text-red-500'}`}>
                         {formik.values.weight_config.form + formik.values.weight_config.video + formik.values.weight_config.technical}% / 100%
                       </span>
                    </label>
                    
                    {[
                      { key: 'form', label: 'Form Assessment' },
                      { key: 'video', label: 'Video Analysis' },
                      { key: 'technical', label: 'Technical Accuracy' }
                    ].map((item) => (
                      <div key={item.key} className="space-y-2">
                         <div className="flex justify-between text-[8px] font-black uppercase text-gray-400">
                           <span>{item.label}</span>
                           <span className="text-gray-900">{formik.values.weight_config[item.key as keyof typeof formik.values.weight_config]}%</span>
                         </div>
                         <input 
                           type="range"
                           min="0"
                           max="100"
                           value={formik.values.weight_config[item.key as keyof typeof formik.values.weight_config]}
                           onChange={(e) => formik.setFieldValue(`weight_config.${item.key}`, parseInt(e.target.value))}
                           className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-blue"
                         />
                      </div>
                    ))}
                    {formik.errors.weight_config && typeof formik.errors.weight_config === 'string' && (
                       <p className="text-[8px] font-black text-red-500 uppercase tracking-widest text-center">{formik.errors.weight_config}</p>
                    )}
                 </div>
              </div>
           </div>

           <div className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-blue/40 transition-colors"></div>
              
              <div className="space-y-2 relative z-10">
                 <h3 className="text-xl font-black italic tracking-tight uppercase">Protocol Summary</h3>
                 <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Verify before deployment</p>
              </div>

              <div className="space-y-4 relative z-10 border-t border-white/5 pt-6">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/50 tracking-widest">
                   <span>Target Role:</span>
                   <span className="text-white">{formik.values.role || 'Undefined'}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/50 tracking-widest">
                   <span>Skills Active:</span>
                   <span className="text-white">{formik.values.skills.length} Nodes</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/50 tracking-widest">
                   <span>Budget Node:</span>
                   <span className="text-white">{formik.values.budget || '---'}</span>
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
                    Protocol Synced Successfully!
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
                    Creating...
                  </>
                ) : (
                  <>
                    Create Job
                    <Layers size={16} />
                  </>
                )}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
