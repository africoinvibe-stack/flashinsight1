import React, { useEffect, useState } from 'react';
import { subscribeToSubmissions, exportToCSV } from '../utils/db';
import { Submission } from '../types';
import { Download, Users, Clock, LogOut, Search, Loader2, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
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
                        className="hover:bg-white/5 transition-colors"
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
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
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
    </div>
  );
};

export default AdminDashboard;