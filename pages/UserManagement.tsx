
import React, { useState, useEffect, useMemo } from 'react';
import { branches } from '../data';
import { UserRole, User } from '../types';

/**
 * Standard SHA-256 hashing for client-side demonstration of "secure" storage.
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const UserManagement: React.FC = () => {
  const [activeBranchFilter, setActiveBranchFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('tallman_workforce_users');
    if (stored) {
      setUsers(JSON.parse(stored));
    }
  }, []);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: UserRole.LEARNER,
    branchId: branches[0].branch_id,
    password: 'password123'
  });

  const saveUsers = (updated: User[]) => {
    setUsers(updated);
    localStorage.setItem('tallman_workforce_users', JSON.stringify(updated));
  };

  const handleDeleteUser = (user: User) => {
    const confirmation = window.confirm(
      `CRITICAL DELETION WARNING:\n\nYou are about to permanently purge the profile for "${user.display_name}".\n\nThis will instantly revoke all enterprise access and erase all training certifications. This action cannot be undone. Do you wish to proceed?`
    );
    
    if (confirmation) {
      const updated = users.filter(u => u.user_id !== user.user_id);
      saveUsers(updated);
    }
  };

  const handleUpdateRole = (id: string, newRole: UserRole) => {
    const updated = users.map(u => u.user_id === id ? { ...u, role: newRole } : u);
    saveUsers(updated);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const hashedPw = await hashPassword(newUser.password);

    const user: User = {
      user_id: `u_${Date.now()}`,
      display_name: newUser.name,
      email: newUser.email,
      password: hashedPw,
      role: newUser.role,
      branch_id: newUser.branchId,
      avatar_url: `https://picsum.photos/seed/${newUser.name}/200`,
      points: 0,
      level: 1
    };

    saveUsers([...users, user]);
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', role: UserRole.LEARNER, branchId: branches[0].branch_id, password: 'password123' });
  };

  const filteredUsers = useMemo(() => {
    return activeBranchFilter === 'all' 
      ? users 
      : users.filter(u => u.branch_id === activeBranchFilter);
  }, [users, activeBranchFilter]);

  const getBranchName = (id: string) => branches.find(b => b.branch_id === id)?.name || 'Central HQ';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Workforce Directory</h1>
          <p className="text-slate-500 font-medium mt-2">Manage employee credentials and access control.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          + Provision New User
        </button>
      </header>

      <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-slate-50/50 flex flex-wrap gap-4 items-center">
           <select 
             className="px-6 py-4 rounded-2xl border bg-white text-sm font-black uppercase tracking-widest outline-none cursor-pointer"
             value={activeBranchFilter}
             onChange={(e) => setActiveBranchFilter(e.target.value)}
           >
              <option value="all">Global Roster</option>
              {branches.map(b => (
                <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
              ))}
           </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                <tr>
                   <th className="px-10 py-6">Identity</th>
                   <th className="px-10 py-6">Security Access</th>
                   <th className="px-10 py-6">Branch</th>
                   <th className="px-10 py-6 text-right">Engineering</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.user_id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                           <img src={u.avatar_url} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md" alt="" />
                           <div>
                              <p className="font-black text-slate-900">{u.display_name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{u.email}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-10 py-8">
                        <select 
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all outline-none ${
                            u.role === UserRole.SUPER_ADMIN ? 'bg-indigo-900 border-indigo-900 text-white' : 
                            u.role === UserRole.ADMIN ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600'
                          }`}
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.user_id, e.target.value as UserRole)}
                        >
                          {Object.values(UserRole).map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                     </td>
                     <td className="px-10 py-8 font-black text-slate-500 text-xs uppercase">
                        {getBranchName(u.branch_id || '')}
                     </td>
                     <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => handleDeleteUser(u)}
                          className="px-5 py-2 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 hover:bg-rose-600 hover:text-white transition-all"
                        >
                          Purge
                        </button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border-4 border-indigo-500/10">
            <div className="p-10 border-b bg-slate-50 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900 uppercase italic">Provision User</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input required type="text" className="w-full px-6 py-4 rounded-2xl border bg-slate-50 outline-none focus:border-indigo-600 font-bold" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Workforce Email</label>
                <input required type="email" className="w-full px-6 py-4 rounded-2xl border bg-slate-50 outline-none focus:border-indigo-600 font-bold" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch</label>
                  <select className="w-full px-4 py-4 rounded-2xl border bg-slate-50 outline-none font-black text-[10px] uppercase" value={newUser.branchId} onChange={e => setNewUser({...newUser, branchId: e.target.value})}>
                    {branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Role</label>
                  <select className="w-full px-4 py-4 rounded-2xl border bg-slate-50 outline-none font-black text-[10px] uppercase" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
                    {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px]">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg">Confirm Provisioning</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
