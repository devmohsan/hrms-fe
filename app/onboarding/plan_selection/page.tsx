'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Shield, Rocket, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

interface Plan {
  id: string | number;
  name: string;
  price: string | number;
  description: string;
  features: string[];
  recommended?: boolean;
}

export default function OnboardingPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectingPlanId, setSelectingPlanId] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/onboarding/plans');
        const rawPlans = response.data?.data || [];
        
        // Map backend structure to frontend interface
        const mappedPlans = rawPlans.map((p: any) => {
          let parsedFeatures: string[] = [];
          try {
            const featObj = typeof p.features === 'string' ? JSON.parse(p.features) : p.features;
            parsedFeatures = [
              `Up to ${featObj.max_employees} Employees`,
              featObj.ai_features ? "AI-Powered Intelligence" : "Standard Management",
              "24/7 Priority Support",
              "Enterprise Security"
            ];
          } catch (e) {
            parsedFeatures = ["Standard Features"];
          }

          return {
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.name === 'Basic' ? 'Start your journey' : p.name === 'Standard' ? 'Scale your business' : 'Ultimate control',
            features: parsedFeatures,
            recommended: p.name === 'Standard'
          };
        });

        // Deduplicate by name
        const uniquePlans = mappedPlans.filter((plan: any, index: number, self: any[]) =>
          index === self.findIndex((t) => t.name === plan.name)
        );

        setPlans(uniquePlans);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to initialize commerce module. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (planId: string | number) => {
    try {
      setSelectingPlanId(planId);
      setError(null);
      
      const response = await axiosInstance.post('/onboarding/select-plan', {
        plan_id: planId
      });

      // Debug log (optional)
      console.log('Response:', response.data);

      if (response.status === 200 || response.status === 201) {
        const step = response.data?.data?.onboarding_step;
        if (step) {
          // Redirect to the specific onboarding step page
          router.push(`/onboarding/${step}`);
        } else {
          // Fallback to dashboard if no step provided
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to activate the selected protocol. Please try again.');
      setSelectingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-primary-blue/20 rounded-full blur-2xl animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-primary-blue animate-spin relative z-10" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Synchronizing Plans...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6 md:p-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-primary-blue/5 rounded-full blur-[100px] md:blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-success-green/5 rounded-full blur-[80px] md:blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-20 gap-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-blue/5 text-primary-blue text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-4 md:mb-6">
              Step 02: Selection
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-[0.95] md:leading-[0.85]">
              Activate Your <br className="hidden sm:block" />
              <span className="text-primary-blue">Intelligence Unit.</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg md:text-xl mt-4 md:mt-6 max-w-xl">
              Choose the operational scale that fits your workforce dynamics.
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-xl border border-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl w-full lg:w-auto">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-blue rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-blue/30">
                      <Shield size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                      <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-900">Secure Protocol</h4>
                      <p className="text-[9px] md:text-[10px] font-bold text-gray-400">All data is encrypted end-to-end.</p>
                  </div>
              </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-red-100 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-center shadow-xl"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw size={28} className="md:w-8 md:h-8" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Sync Interrupted</h2>
              <p className="text-gray-500 font-medium mb-8 text-sm md:text-base">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gray-900 text-white w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-primary-blue transition-all"
              >
                Retry Synchronization
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {plans.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative bg-white/80 backdrop-blur-xl border ${plan.recommended ? 'border-primary-blue border-2' : 'border-white'} p-7 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] flex flex-col h-full group transition-all hover:translate-y-[-8px] md:hover:translate-y-[-10px] hover:shadow-2xl`}
                >
                  {plan.recommended && (
                    <div className="absolute top-[-12px] md:top-[-15px] left-1/2 -translate-x-1/2 bg-primary-blue text-white text-[8px] md:text-[9px] font-black px-4 md:px-6 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-primary-blue/30 whitespace-nowrap">
                      Top Choice
                    </div>
                  )}

                  <div className="mb-8 md:mb-10">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl mb-5 md:mb-6 flex items-center justify-center ${plan.recommended ? 'bg-primary-blue text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {plan.name === 'Basic' ? <Zap size={22} className="md:w-6 md:h-6" /> : plan.name === 'Standard' ? <Rocket size={22} className="md:w-6 md:h-6" /> : <Shield size={22} className="md:w-6 md:h-6" />}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">{plan.name}</h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{plan.description}</p>
                  </div>

                  <div className="mb-8 md:mb-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">${plan.price}</span>
                      <span className="text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">/ month</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10 md:mb-12 flex-grow">
                    {plan.features?.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <div className="w-5 h-5 mt-0.5 rounded-full bg-success-green/10 flex-shrink-0 flex items-center justify-center text-success-green">
                          <Check size={10} className="md:w-3 md:h-3" strokeWidth={4} />
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-600 leading-tight md:leading-normal">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={!!selectingPlanId}
                    className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group/btn ${plan.recommended ? 'bg-primary-blue text-white shadow-xl shadow-primary-blue/20 hover:scale-[1.02]' : 'bg-gray-900 text-white hover:bg-primary-blue'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {selectingPlanId === plan.id ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Activating...
                      </>
                    ) : (
                      <>
                        Select Protocol
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="mt-16 md:mt-20 text-center px-4">
            <p className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] leading-loose">
                Need a custom enterprise solution? <br className="sm:hidden" /> <a href="#" className="text-primary-blue hover:underline underline-offset-4">Contact Logic Command</a>
            </p>
        </div>
      </div>
    </div>
  );
}
