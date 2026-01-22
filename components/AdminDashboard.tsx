import React, { useEffect, useState } from 'react';
import { subscribeToData, exportToCSV, exportWaitlistToCSV, WaitlistEntry } from '../utils/db';
import { Submission } from '../types';
import { SURVEY_SECTIONS } from '../constants';
import { Download, Users, Clock, LogOut, Search, Loader2, X, ChevronRight, Activity, Database, Terminal, AlertTriangle, Copy, Check, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'waitlist'>('waitlist');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<{code: string, message: string} | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);

  const SQL_SETUP_SCRIPT = `create table submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  data jsonb not null
);

create table waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  whatsapp text not null
);

-- Enable Realtime
alter publication supabase_realtime add table submissions;
alter publication supabase_realtime add table waitlist;`;

  useEffect(() => {
    setLoading(true);
    setFilter('');
    const unsubscribe = subscribeToData(activeTab, (result) => {
      if (result.error) {
        setDbError(result.error);
      } else {
        if (activeTab === 'submissions') setSubmissions(result.data);
        else setWaitlist(result.data);
        setDbError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredSubmissions = submissions.filter(s => 
    JSON.stringify(s.data).toLowerCase().includes(filter.toLowerCase())
  );

  const filteredWaitlist = waitlist.filter(w => 
    (w.name + w.email + w.whatsapp).toLowerCase().includes(filter.toLowerCase())
  );

  const formatAnswer = (value: string | string[] | undefined) => {
    if (value === undefined || value === null || value === '') return <span className="text-gray-600 italic">No answer</span>;
    if (Array.isArray(value)) return value.join(', ');
    return value;
  };

  if (dbError && dbError.code === 'PGRST205') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-mono">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl glass-card rounded-3xl p-8 border-flash-yellow/20 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-flash-yellow/10 rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-flash-yellow" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">DATABASE_SETUP_REQUIRED</h2>
              <p className="text-gray-500 text-sm">Schema cache mismatch detected.</p>
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Required tables (<span className="text-flash-yellow">submissions</span> & <span className="text-flash-yellow">waitlist</span>) not found. 
            Run the following SQL in your <span className="text-flash-yellow">Supabase SQL Editor</span>:
          </p>

          <div className="relative group mb-8">
            <pre className="bg-black/60 p-6 rounded-xl border border-white/10 text-[10px] text-flash-yellow overflow-x-auto leading-loose">
              {SQL_SETUP_SCRIPT}
            </pre>
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all flex items-center gap-2 text-[10px] font-bold text-white uppercase"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {copied ? 'COPIED' : 'COPY_SQL'}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-flash-yellow text-black font-black py-4 rounded-xl hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" />
              I'VE RUN THE SCRIPT - REFRESH
            </button>
            <button 
              onClick={onLogout}
              className="w-full text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors py-2"
            >
              Return to App
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-20 font-mono">
      {/* Admin Header */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-black text-xl text-white tracking-tighter">
              FLASH<span className="text-flash-yellow">CORE_OS</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex bg-white/5 rounded-lg p-1 gap-1">
              <button 
                onClick={() => setActiveTab('waitlist')}
                className={`px-4 py-1.5 rounded text-[10px] font-bold tracking-widest transition-all ${activeTab === 'waitlist' ? 'bg-flash-yellow text-black' : 'text-gray-500 hover:text-white'}`}
              >
                WAITLIST
              </button>
              <button 
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-1.5 rounded text-[10px] font-bold tracking-widest transition-all ${activeTab === 'submissions' ? 'bg-flash-yellow text-black' : 'text-gray-500 hover:text-white'}`}
              >
                SURVEYS
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => activeTab === 'submissions' ? exportToCSV(submissions) : exportWaitlistToCSV(waitlist)}
              className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 rounded border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors"
            >
              <Download className="w-3 h-3" />
              DUMP_{activeTab.toUpperCase()}
            </button>
            <button 
              onClick={onLogout}
              className="p-2 text-gray-500 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "NODES_DETECTED", value: activeTab === 'submissions' ? submissions.length : waitlist.length, icon: Users, color: "text-white" },
            { label: "STREAM_TYPE", value: activeTab.toUpperCase(), icon: ListChecks, color: "text-flash-yellow" },
            { label: "UPTIME", value: "99.98%", icon: Activity, color: "text-emerald-400" },
            { label: "DB_TARGET", value: "SUPABASE_OBTR", icon: Database, color: "text-orange-400" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-5 rounded-lg group hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-gray-600 tracking-widest">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
              </div>
              <div className="text-2xl font-bold text-white uppercase">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder={`SEARCH_${activeTab.toUpperCase()}...`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-white/5 rounded-lg pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-flash-yellow/30 transition-all font-mono placeholder:text-gray-800"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 w-5 h-5" />
        </div>

        {/* Console Table */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-lg overflow-hidden overflow-x-auto shadow-2xl">
          {activeTab === 'submissions' ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="p-4 font-bold text-gray-600 uppercase tracking-widest">Timestamp</th>
                  <th className="p-4 font-bold text-gray-600 uppercase tracking-widest">Ident</th>
                  <th className="p-4 font-bold text-gray-600 uppercase tracking-widest">WhatsApp</th>
                  <th className="p-4 font-bold text-gray-600 uppercase tracking-widest">Geo</th>
                  <th className="p-4 font-bold text-gray-600 uppercase tracking-widest">XP_Level</th>
                  <th className="p-4 font-bold text-gray-600 uppercase tracking-widest">Interest_Key</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {loading ? (
                  <tr><td colSpan={7} className="p-20 text-center"><Loader2 className="w-8 h-8 text-flash-yellow animate-spin mx-auto mb-4 opacity-50" /><span className="text-gray-700 font-bold uppercase">STREAMING_FROM_ENDPOINT...</span></td></tr>
                ) : (
                  <AnimatePresence>
                    {filteredSubmissions.map((sub) => (
                      <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedSubmission(sub)} className="hover:bg-white/[0.03] transition-colors cursor-pointer group border-l-2 border-l-transparent hover:border-l-flash-yellow">
                        <td className="p-4 text-gray-400">{new Date(sub.submittedAt).toISOString().split('T')[0]}<span className="block text-[10px] text-gray-600">{new Date(sub.submittedAt).toLocaleTimeString()}</span></td>
                        <td className="p-4 font-bold text-white uppercase">{sub.data['q1'] || 'ANON_NODE'}</td>
                        <td className="p-4 text-gray-400">{sub.data['q2'] || '---'}</td>
                        <td className="p-4 text-gray-400">{sub.data['q4'] || '---'}</td>
                        <td className="p-4 text-gray-400">{sub.data['q5'] || '---'}</td>
                        <td className="p-4 text-gray-400 max-w-[200px] truncate uppercase">{sub.data['q18'] || '---'}</td>
                        <td className="p-4 text-right pr-6"><ChevronRight className="w-4 h-4 text-gray-800 group-hover:text-flash-yellow transition-colors inline-block" /></td>
                      </motion.tr>
                    ))}
                    {filteredSubmissions.length === 0 && !loading && <tr><td colSpan={7} className="p-20 text-center text-gray-700 font-bold uppercase">NULL_SET_RETURNED</td></tr>}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="p-4 font-bold text-gray-600 uppercase tracking-widest">Joined At</th>
                  <th className="p-4 font-bold text-gray-600 uppercase tracking-widest">Member Name</th>
                  <th className="p-4 font-bold text-gray-600 uppercase tracking-widest">Email Endpoint</th>
                  <th className="p-4 font-bold text-gray-600 uppercase tracking-widest">WhatsApp ID</th>
                  <th className="p-4 font-bold text-gray-600 uppercase tracking-widest text-right">Node ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="w-8 h-8 text-flash-yellow animate-spin mx-auto mb-4 opacity-50" /><span className="text-gray-700 font-bold uppercase">STREAMING_FROM_ENDPOINT...</span></td></tr>
                ) : (
                  <AnimatePresence>
                    {filteredWaitlist.map((entry) => (
                      <motion.tr key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/[0.03] transition-colors border-l-2 border-l-transparent hover:border-l-flash-yellow">
                        <td className="p-4 text-gray-400">{new Date(entry.created_at).toISOString().split('T')[0]}<span className="block text-[10px] text-gray-600">{new Date(entry.created_at).toLocaleTimeString()}</span></td>
                        <td className="p-4 font-bold text-white uppercase">{entry.name}</td>
                        <td className="p-4 text-gray-400">{entry.email}</td>
                        <td className="p-4 text-gray-400">{entry.whatsapp}</td>
                        <td className="p-4 text-right text-gray-700 font-bold text-[10px] tracking-tighter uppercase">{entry.id.split('-')[0]}</td>
                      </motion.tr>
                    ))}
                    {filteredWaitlist.length === 0 && !loading && <tr><td colSpan={5} className="p-20 text-center text-gray-700 font-bold uppercase">NULL_SET_RETURNED</td></tr>}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSubmission(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="relative bg-[#0A0A0A] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-3 text-xs">
                  <Terminal className="w-4 h-4 text-flash-yellow" />
                  <span className="font-bold text-white tracking-widest uppercase">NODE_INSPECTION: {selectedSubmission.id.slice(0,8)}</span>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="text-gray-500 hover:text-white p-2"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
                {SURVEY_SECTIONS.map((section) => (
                  <div key={section.id}>
                    <h3 className="text-gray-600 font-bold text-[10px] tracking-[0.3em] uppercase mb-6 flex items-center gap-4">{section.title}<div className="flex-1 h-[1px] bg-white/5" /></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {section.questions.map((q) => (
                        <div key={q.id} className="space-y-2">
                          <p className="text-gray-700 text-[10px] font-bold leading-tight uppercase tracking-wider">{q.text}</p>
                          <div className="text-gray-300 text-sm border-l border-white/10 pl-4 py-1 italic bg-white/[0.01]">
                            {formatAnswer(selectedSubmission.data[q.id])}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;