
import React from 'react';
import { forumPosts } from '../data';

const Community: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Knowledge Exchange</h1>
          <p className="text-slate-500">Connect with fellow technicians and experts.</p>
        </div>
        <button className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
           New Topic
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-6">
           <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Channels</h3>
              <div className="space-y-2">
                 {['General', 'Lineman Rigging', 'HV Testing', 'Management', 'Epicor P21'].map(c => (
                   <button key={c} className="w-full text-left px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                      # {c}
                   </button>
                 ))}
              </div>
           </div>
        </aside>

        <div className="lg:col-span-3 space-y-4">
           {forumPosts.map(post => (
             <div key={post.id} className={`bg-white p-8 rounded-[2.5rem] border hover:border-indigo-600 transition-all shadow-sm ${post.is_pinned ? 'ring-2 ring-indigo-50 border-indigo-100' : 'border-slate-100'}`}>
                <div className="flex gap-4 items-start mb-4">
                   <img src={post.author_avatar} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="font-black text-slate-900">{post.title}</span>
                         {post.is_pinned && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Pinned</span>}
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{post.content}</p>
                   </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4">
                   <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{post.category}</span>
                      <span className="text-[10px] font-bold text-slate-400">By {post.author_name} • {post.timestamp}</span>
                   </div>
                   <div className="flex items-center gap-4 text-slate-400 font-bold text-xs">
                      <span className="flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> {post.replies}</span>
                      <button className="text-indigo-600 hover:underline">Join Discussion</button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
