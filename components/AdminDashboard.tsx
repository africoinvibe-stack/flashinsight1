import React, { useEffect, useState } from 'react';
import { subscribeToSubmissions, exportToCSV } from '../utils/db';
import { Submission } from '../types';
import { SURVEY_SECTIONS } from '../constants';
import { Download, Users, Clock, LogOut, Search, Loader2, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    setLoading(true);
    // Subscribe to real-time updates
    const unsubscribe = subscribeToSubmissions((data) => {
      setSubmissions(data);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const filteredSubmissions = submissions.filter(s => 
    JSON.stringify(s.data).toLowerCase().includes(filter.toLowerCase())
  );

  const formatAnswer = (value: string | string[] | undefined) => {
    if (value === undefined || value === null || value === '') return <span className="text-gray-600 italic">No answer</span>;
    if (Array.isArray(value)) return value.join(', ');
    return value;
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Admin Header */}
      <div className="bg-flash-gray border-b border-gray-800 sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-bold text-xl text-white">Flash<span className="text-flash-yellow">Admin</span></div>
            {!loading && (
              <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-bold text-green-500 uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => exportToCSV(submissions)}
              disabled={loading || submissions.length === 0}
              className="flex items-center gap-2 bg-flash-yellow/10 text-flash-yellow px-4 py-2 rounded-lg text-sm font-medium hover:bg-flash-yellow/20 transition-colors border border-flash-yellow/20 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={onLogout}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-flash-gray border border-gray-800 p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-16 h-16 text-white" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">Total Responses</h3>
              <Users className="w-5 h-5 text-flash-yellow" />
            </div>
            {loading ? (
              <div className="h-9 w-24 bg-gray-800 rounded animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold text-white">{submissions.length}</p>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-flash-gray border border-gray-800 p-6 rounded-2xl relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock className="w-16 h-16 text-blue-400" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">Last Submission</h3>
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            {loading ? (
               <div className="h-7 w-32 bg-gray-800 rounded animate-pulse"></div>
            ) : (
              <p className="text-lg font-medium text-white truncate">
                {submissions.length > 0 
                  ? new Date(submissions[0].submittedAt).toLocaleString() 
                  : 'No data'}
              </p>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-flash-gray border border-gray-800 p-6 rounded-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">Target Progress</h3>
              <div className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                {Math.round((submissions.length / 100) * 100)}%
              </div>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((submissions.length / 100) * 100, 100)}%` }}
                transition={{ duration: 1, type: "spring" }}
                className="bg-emerald-500 h-full rounded-full" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Target: 100 Users</p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search responses..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-flash-gray border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-flash-yellow/50 transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        {/* Data Table */}
        <div className="bg-flash-gray border border-gray-800 rounded-2xl overflow-hidden overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-black/30 border-b border-gray-800">
                <th className="p-4 font-medium text-gray-400 whitespace-nowrap">Date</th>
                <th className="p-4 font-medium text-gray-400 whitespace-nowrap">Name</th>
                <th className="p-4 font-medium text-gray-400 whitespace-nowrap">Phone</th>
                <th className="p-4 font-medium text-gray-400 whitespace-nowrap">Location</th>
                <th className="p-4 font-medium text-gray-400 whitespace-nowrap">Crypto Exp</th>
                <th className="p-4 font-medium text-gray-400 whitespace-nowrap">Interest</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 text-flash-yellow animate-spin mx-auto mb-2" />
                    <span className="text-gray-500">Connecting to live database...</span>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((sub) => (
                      <motion.tr 
                        key={sub.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedSubmission(sub)}
                        className="hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <td className="p-4 text-gray-300 whitespace-nowrap">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                          <span className="block text-xs text-gray-500">{new Date(sub.submittedAt).toLocaleTimeString()}</span>
                        </td>
                        <td className="p-4 font-medium text-white">{sub.data['q1'] || 'Anonymous'}</td>
                        <td className="p-4 text-gray-300">{sub.data['q2'] || '-'}</td>
                        <td className="p-4 text-gray-300">{sub.data['q4'] || '-'}</td>
                        <td className="p-4 text-gray-300">{sub.data['q5'] || '-'}</td>
                        <td className="p-4 text-gray-300 max-w-xs truncate">{sub.data['q18'] || '-'}</td>
                        <td className="p-4 text-gray-600 group-hover:text-flash-yellow transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        No responses found.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-flash-gray border border-gray-800 w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-black/20">
                <div>
                  <h2 className="text-xl font-bold text-white">Submission Details</h2>
                  <p className="text-sm text-gray-400 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {SURVEY_SECTIONS.map((section) => (
                  <div key={section.id} className="bg-black/20 rounded-xl p-5 border border-gray-800/50">
                    <h3 className="text-flash-yellow font-bold uppercase text-xs tracking-wider mb-4 pb-2 border-b border-gray-800/50">
                      {section.title}
                    </h3>
                    <div className="space-y-6">
                      {section.questions.map((q) => (
                        <div key={q.id} className="grid grid-cols-1 gap-2">
                          <p className="text-gray-400 text-sm font-medium">{q.text}</p>
                          <div className="text-white text-base pl-3 border-l-2 border-flash-yellow/30">
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