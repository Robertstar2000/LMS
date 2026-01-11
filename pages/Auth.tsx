
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

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

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);

  // Sync users on mount to ensure Bob and Admin exist
  useEffect(() => {
    const syncSecurity = async () => {
      const stored = localStorage.getItem('tallman_workforce_users');
      let users: User[] = stored ? JSON.parse(stored) : [];
      
      const bobEmail = 'robertstar@aol.com';
      const bobPasswordHash = await hashPassword('Rm2214ri#');
      
      const bobIndex = users.findIndex(u => u.email.toLowerCase() === bobEmail);
      
      if (bobIndex === -1) {
        users.push({
          user_id: 'sa_bob_01',
          display_name: 'Bob',
          email: bobEmail,
          password: bobPasswordHash,
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
          role: UserRole.SUPER_ADMIN,
          points: 9999,
          level: 99,
          branch_id: 'br_mcr'
        });
      } else {
        users[bobIndex].role = UserRole.SUPER_ADMIN;
        users[bobIndex].display_name = 'Bob';
        users[bobIndex].password = bobPasswordHash;
      }

      // Add default admin
      if (!users.find(u => u.email === 'admin@tallman.com')) {
        users.push({
          user_id: 'admin_01',
          display_name: 'System Admin',
          email: 'admin@tallman.com',
          password: await hashPassword('admin'),
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
          role: UserRole.ADMIN,
          points: 0,
          level: 10,
          branch_id: 'br_addison'
        });
      }

      localStorage.setItem('tallman_workforce_users', JSON.stringify(users));
      setIsSyncing(false);
    };

    syncSecurity();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const stored = localStorage.getItem('tallman_workforce_users');
    const users: User[] = stored ? JSON.parse(stored) : [];
    
    const inputHash = await hashPassword(password);
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      (u.password === inputHash || u.password === password)
    );
    
    if (user) {
      if (user.password === password) {
        user.password = inputHash;
        localStorage.setItem('tallman_workforce_users', JSON.stringify(users));
      }
      onLogin(user);
    } else {
      setError('Invalid enterprise credentials.');
    }
  };

  const handleBackdoor = async () => {
    const bobEmail = 'robertstar@aol.com';
    const stored = localStorage.getItem('tallman_workforce_users');
    const users: User[] = stored ? JSON.parse(stored) : [];
    const bob = users.find(u => u.email.toLowerCase() === bobEmail);
    if (bob) onLogin(bob);
  };

  if (isSyncing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white font-black animate-pulse tracking-widest uppercase text-xs">
          Authenticating Master Directory...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="p-4 bg-white rounded-[2rem] shadow-2xl mb-6">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfAo_vinwmvZoyER2jOBXcta82wntkUlhiqNCIFFHtJg&s=10" className="h-20 w-auto object-contain" alt="Tallman Equipment Co Logo" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Tallman LMS</h1>
          <p className="text-slate-400 mt-2 font-medium tracking-widest uppercase text-[10px]">Enterprise Content Hub</p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-8 text-center">
            {isLoginView ? 'System Access' : 'Register Identity'}
          </h2>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Workforce Email</label>
              <input 
                required
                type="email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all font-bold"
                placeholder="rick@tallman.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                required
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all font-bold"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-rose-200 text-xs font-bold text-center">{error}</div>}

            <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all">
              Sign In
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4">
             <button onClick={handleBackdoor} className="w-full py-4 border-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                🔓 Master Backdoor (Bob)
             </button>
             <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
               Corporate Security Enforcement Active
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
