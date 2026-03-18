'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Plus, 
  Search, 
  Save, 
  X, 
  Loader2, 
  ToggleLeft, 
  ToggleRight,
  Database,
  Lock,
  Globe,
  Cpu,
  Key,
  Trash2,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';

interface Setting {
  id?: number;
  setting_key: string;
  setting_value: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<Setting | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState<Setting>({
    setting_key: '',
    setting_value: '',
    status: 'active'
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/settings/list');
      if (response.data.success) {
        setSettings(response.data.settings || response.data.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load settings configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEdit = (setting: Setting) => {
    setCurrentSetting(setting);
    setFormData({
      setting_key: setting.setting_key,
      setting_value: setting.setting_value,
      status: setting.status
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentSetting(null);
    setFormData({
      setting_key: '',
      setting_value: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const response = await axiosInstance.post('/settings/save', formData);
      if (response.data.success) {
        setIsModalOpen(false);
        fetchSettings();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save configuration.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await axiosInstance.patch(`/settings/${id}/toggle`);
      if (response.data.success) {
        setSettings(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to toggle status.");
    }
  };

  const handleDeleteSetting = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this configuration node? This action cannot be undone.")) return;
    
    try {
      const response = await axiosInstance.delete(`/settings/${id}`);
      if (response.data.success) {
        setSettings(prev => prev.filter(s => s.id !== id));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete setting.");
    }
  };

  const filteredSettings = settings.filter(s => 
    s.setting_key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-blue/10 rounded-xl text-primary-blue">
              <Settings size={20} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Control Center</h1>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-11">Configure Global & Company Specific Parameters</p>
        </div>

        <button 
          onClick={handleAdd}
          className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-blue transition-all shadow-xl shadow-gray-900/10 active:scale-95"
        >
          <Plus size={16} />
          Register New Node
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text"
            placeholder="Search configuration keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-primary-blue focus:bg-white transition-all font-bold text-xs"
          />
        </div>
        <div className="flex items-center gap-6 px-6">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Keys</span>
            <span className="text-sm font-black text-gray-900">{settings.length}</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Active</span>
            <span className="text-sm font-black text-success-green">{settings.filter(s => s.status === 'active').length}</span>
          </div>
        </div>
      </div>

      {/* Settings Table */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Key</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Value</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="animate-spin text-primary-blue" size={40} />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hydrating Config Matrix...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredSettings.length > 0 ? (
                filteredSettings.map((setting) => (
                  <SettingRow 
                    key={setting.id} 
                    setting={setting}
                    onEdit={() => handleEdit(setting)}
                    onToggle={() => setting.id && handleToggleStatus(setting.id)}
                    onDelete={() => setting.id && handleDeleteSetting(setting.id)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Database size={24} className="text-gray-200" />
                    </div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1">No Nodes Found</h3>
                    <p className="text-xs text-gray-400 font-medium">Try adjusting your search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-10 md:p-14">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary-blue/10 rounded-2xl flex items-center justify-center text-primary-blue">
                      <Cpu size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">Configuration Node</h3>
                      <p className="text-[10px] font-black text-primary-blue uppercase tracking-widest mt-1">
                        {currentSetting ? 'Protocol Update' : 'Initialize New Node'}
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Node Key (Identification)</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input 
                        required
                        type="text"
                        value={formData.setting_key}
                        onChange={(e) => setFormData({...formData, setting_key: e.target.value})}
                        placeholder="e.g. system_neural_endpoint"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-sm text-gray-900 outline-none focus:bg-white focus:border-primary-blue transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Neural Value (Data)</label>
                    <div className="relative">
                      <Database className="absolute left-4 top-4 text-gray-300" size={16} />
                      <textarea 
                        required
                        rows={4}
                        value={formData.setting_value}
                        onChange={(e) => setFormData({...formData, setting_value: e.target.value})}
                        placeholder="Assign value to this node..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-sm text-gray-900 outline-none focus:bg-white focus:border-primary-blue transition-all shadow-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div>
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Node Operational Status</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Toggle to activate or hibernate node</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, status: formData.status === 'active' ? 'inactive' : 'active'})}
                      className="transition-all active:scale-90"
                    >
                      {formData.status === 'active' 
                        ? <ToggleRight className="text-success-green" size={40} /> 
                        : <ToggleLeft className="text-gray-300" size={40} />
                      }
                    </button>
                  </div>
                </div>

                <div className="pt-10 flex gap-4">
                  <button 
                    type="submit"
                    disabled={modalLoading}
                    className="flex-grow bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-primary-blue transition-all shadow-xl shadow-gray-900/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {modalLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {currentSetting ? 'Sync Configuration' : 'Deploy Protocol'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 hover:text-gray-900 transition-all border border-gray-100"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingRow({ setting, onEdit, onToggle, onDelete }: { 
  setting: Setting, 
  onEdit: () => void, 
  onToggle: () => void, 
  onDelete: () => void 
}) {
  const isSecret = setting.setting_key.toLowerCase().includes('key') || 
                   setting.setting_key.toLowerCase().includes('secret') || 
                   setting.setting_key.toLowerCase().includes('token');

  return (
    <motion.tr 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group hover:bg-gray-50/80 transition-all border-b border-gray-100 last:border-none"
    >
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${setting.status === 'active' ? 'bg-indigo-50 text-indigo-500' : 'bg-gray-100 text-gray-400'}`}>
            {isSecret ? <Lock size={18} /> : <Key size={18} />}
          </div>
          <div>
            <span className="text-sm font-black text-gray-900 tracking-tight block">{setting.setting_key}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Identification Key</span>
          </div>
        </div>
      </td>
      <td className="px-8 py-6 max-w-md">
        <div className="bg-gray-50 border border-gray-100/50 rounded-xl px-4 py-3 group-hover:bg-white transition-all">
          <p className="font-mono text-[11px] font-bold text-gray-600 line-clamp-1 break-all">
            {isSecret ? "••••••••••••••••••••••••••••" : setting.setting_value}
          </p>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex flex-col items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
            setting.status === 'active' 
            ? 'bg-success-green/10 text-success-green border-success-green/20' 
            : 'bg-red-50 text-red-400 border-red-100'
            }`}>
            {setting.status}
            </span>
            <button 
                onClick={onToggle}
                className="transition-all active:scale-90"
            >
                {setting.status === 'active' 
                ? <ToggleRight className="text-success-green" size={28} /> 
                : <ToggleLeft className="text-gray-300" size={28} />
                }
            </button>
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button 
            onClick={onEdit}
            className="p-2.5 text-gray-400 hover:text-primary-blue hover:bg-primary-blue/5 rounded-xl transition-all"
            title="Edit Parameters"
          >
            <Edit3 size={18} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Delete Node"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
