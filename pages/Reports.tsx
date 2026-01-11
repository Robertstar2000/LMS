
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Reports: React.FC = () => {
  const performanceData = [
    { name: 'Jan', compliance: 85, active: 400 },
    { name: 'Feb', compliance: 88, active: 450 },
    { name: 'Mar', compliance: 92, active: 510 },
    { name: 'Apr', compliance: 90, active: 490 },
    { name: 'May', compliance: 95, active: 580 },
  ];

  const summary = [
    { label: 'Avg Completion Rate', value: '78.4%', trend: '+4.2%', icon: '📈' },
    { label: 'Certifications Issued', value: '1,420', trend: '+12%', icon: '📜' },
    { label: 'Compliance Gap', value: '2.1%', trend: '-0.5%', icon: '⚠️' },
    { label: 'Total Training ROI', value: '$240k', trend: '+$40k', icon: '💰' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Intelligence Console</h1>
          <p className="text-slate-500">Audit-ready technical training analytics.</p>
        </div>
        <button className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-600 transition-all flex items-center gap-2">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
           Export XLSX
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map(s => (
          <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <span className="text-2xl">{s.icon}</span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${s.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                   {s.trend}
                </span>
             </div>
             <h3 className="text-2xl font-black text-slate-900">{s.value}</h3>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h3 className="font-black text-lg mb-6">Compliance Trending</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Line type="monotone" dataKey="compliance" stroke="#4f46e5" strokeWidth={4} dot={{r: 6}} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h3 className="font-black text-lg mb-6">Active Learner Velocity</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                    <Bar dataKey="active" fill="#6366f1" radius={[4,4,0,0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
