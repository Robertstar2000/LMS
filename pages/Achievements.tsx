
import React from 'react';
import { badges, currentUser } from '../data';

const Achievements: React.FC = () => {
  const ranking = [
    { rank: 1, name: 'Richard Tallman', points: 1250, avatar: currentUser.avatar_url },
    { rank: 2, name: 'Elena Vance', points: 1120, avatar: 'https://picsum.photos/seed/elena/50' },
    { rank: 3, name: 'Marcus Fenix', points: 980, avatar: 'https://picsum.photos/seed/marcus/50' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Wall of Mastery</h1>
          <p className="text-slate-500 text-lg">Your progress toward enterprise technical excellence.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border text-center min-w-[150px]">
              <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Global Rank</p>
              <p className="text-4xl font-black text-indigo-600">#1</p>
           </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
              <h2 className="text-2xl font-black mb-8">Earned Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {badges.map(b => (
                   <div key={b.badge_id} className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 group hover:border-indigo-600 transition-all">
                      <div className="text-5xl group-hover:scale-110 transition-transform">{b.badge_image_url}</div>
                      <div>
                         <h3 className="font-black text-slate-900">{b.badge_name}</h3>
                         <p className="text-xs text-slate-400 font-bold uppercase">{b.criteria}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-indigo-900 p-12 rounded-[4rem] text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 text-9xl font-black translate-x-10 translate-y-[-20px]">XP</div>
              <h3 className="text-3xl font-black mb-4">Milestone Progress</h3>
              <p className="text-indigo-200 mb-10 max-w-md">You are only 150 XP away from reaching Level 6 and unlocking the Expert Rigging module.</p>
              <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden mb-4">
                 <div className="bg-indigo-400 h-full w-[85%] rounded-full shadow-[0_0_20px_rgba(129,140,248,0.5)]"></div>
              </div>
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-indigo-300">
                 <span>Level 5 (1250)</span>
                 <span>Level 6 (1400)</span>
              </div>
           </div>
        </div>

        <aside className="bg-white p-10 rounded-[3rem] border shadow-sm">
           <h2 className="text-2xl font-black mb-8">Leaderboard</h2>
           <div className="space-y-6">
              {ranking.map(r => (
                <div key={r.rank} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${r.rank === 1 ? 'bg-indigo-50 border border-indigo-100' : ''}`}>
                   <span className={`w-6 text-sm font-black ${r.rank === 1 ? 'text-indigo-600' : 'text-slate-300'}`}>0{r.rank}</span>
                   <img src={r.avatar} className="w-10 h-10 rounded-xl object-cover border" alt="" />
                   <div className="flex-1">
                      <p className="text-sm font-black text-slate-900">{r.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{r.points} PTS</p>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">View All Rankings</button>
        </aside>
      </section>
    </div>
  );
};

export default Achievements;
