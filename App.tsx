
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useParams } from 'react-router-dom';
import { UserRole, User } from './types';
import LearnerDashboard from './pages/LearnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseCatalog from './pages/CourseCatalog';
import CoursePlayer from './pages/CoursePlayer';
import AdminCourseCreator from './pages/AdminCourseCreator';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import Achievements from './pages/Achievements';
import Community from './pages/Community';
import Auth from './pages/Auth';

const Layout: React.FC<{ 
  children: React.ReactNode; 
  user: User; 
  onLogout: () => void;
  isLearnerMode: boolean;
  setIsLearnerMode: (val: boolean) => void;
}> = ({ children, user, onLogout, isLearnerMode, setIsLearnerMode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
  const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;

  const navigation = useMemo(() => {
    if (isAdmin && !isLearnerMode) {
      return [
        { name: 'Admin Console', path: '/admin', icon: '🏢', highlight: true },
        { name: 'Course Architect', path: '/admin/courses', icon: '🤖' },
        { name: 'Audit Reports', path: '/admin/reports', icon: '📊' },
        { name: 'Workforce', path: '/admin/users', icon: '👥' },
      ];
    }
    return [
      { name: 'My Track', path: '/', icon: '🏠' },
      { name: 'Course Catalog', path: '/catalog', icon: '🔍' },
      { name: 'My Achievements', path: '/achievements', icon: '🏆' },
      { name: 'Team Hub', path: '/community', icon: '💬' },
    ];
  }, [isAdmin, isLearnerMode]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 bg-slate-900 text-white z-50">
        <div className="p-6 flex flex-col space-y-3 mb-4">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfAo_vinwmvZoyER2jOBXcta82wntkUlhiqNCIFFHtJg&s=10" className="h-12 w-auto object-contain bg-white rounded-lg p-1" alt="Tallman Equipment Co Logo" />
          <span className="text-xl font-black tracking-tighter uppercase italic">Tallman LMS</span>
        </div>

        {isSuperAdmin && (
          <div className="px-4 mb-8">
            <button
              onClick={() => setIsLearnerMode(!isLearnerMode)}
              className={`w-full py-4 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                isLearnerMode 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' 
                  : 'bg-indigo-600/10 border-indigo-600/30 text-indigo-400 hover:bg-indigo-600 hover:text-white'
              }`}
            >
              <span>{isLearnerMode ? '🛡️ EXIT SIMULATION' : '🎓 TEST AS LEARNER'}</span>
              <span className="text-[8px] opacity-60 font-medium">SUPER ADMIN ACCESS</span>
            </button>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${
                location.pathname === item.path ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </div>
              {item.highlight && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-2xl border border-slate-800 mb-4">
            <img src={user.avatar_url} className="w-10 h-10 rounded-xl border border-slate-700 object-cover" alt="Avatar" />
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate">{user.display_name}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                {isLearnerMode ? 'SIMULATED STUDENT' : user.role}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 text-rose-500 hover:text-white rounded-xl text-[10px] font-black transition-all uppercase tracking-widest"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-10 min-h-screen">
        <header className="md:hidden flex items-center justify-between fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b px-6 h-16 z-40">
          <div className="flex items-center space-x-2">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfAo_vinwmvZoyER2jOBXcta82wntkUlhiqNCIFFHtJg&s=10" className="h-8 w-auto object-contain" alt="Tallman LMS Logo" />
            <span className="font-black uppercase tracking-tighter">Tallman LMS</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b z-40 p-6 animate-in slide-in-from-top">
             <nav className="space-y-4">
              {isSuperAdmin && (
                <button
                  onClick={() => { setIsLearnerMode(!isLearnerMode); setIsMobileMenuOpen(false); }}
                  className="w-full text-left flex items-center gap-4 text-lg font-black text-indigo-600 p-3 bg-indigo-50 rounded-2xl"
                >
                  <span>{isLearnerMode ? '🛡️' : '🎓'}</span>
                  {isLearnerMode ? 'Exit Learner Simulation' : 'Test as Student'}
                </button>
              )}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-lg font-black text-slate-700 p-2"
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              <button onClick={onLogout} className="w-full text-center py-4 bg-rose-600 text-white rounded-2xl font-black mt-4">
                Sign Out
              </button>
            </nav>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

/**
 * Ensures CoursePlayer resets state when switching between courses
 */
const CoursePlayerWrapper = () => {
  const { courseId } = useParams();
  return <CoursePlayer key={courseId} />;
};

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tallman_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLearnerMode, setIsLearnerMode] = useState(false);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('tallman_user_session', JSON.stringify(newUser));
    setIsLearnerMode(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tallman_user_session');
    setIsLearnerMode(false);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
  const effectiveIsAdmin = isAdmin && !isLearnerMode;

  return (
    <HashRouter>
      <Layout 
        user={user} 
        onLogout={handleLogout} 
        isLearnerMode={isLearnerMode} 
        setIsLearnerMode={setIsLearnerMode}
      >
        <Routes>
          <Route path="/" element={<LearnerDashboard user={user} />} />
          <Route path="/catalog" element={<CourseCatalog />} />
          <Route path="/player/:courseId" element={<CoursePlayerWrapper />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/community" element={<Community />} />
          
          <Route 
            path="/admin" 
            element={effectiveIsAdmin ? <AdminDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/courses" 
            element={effectiveIsAdmin ? <AdminCourseCreator /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/users" 
            element={effectiveIsAdmin ? <UserManagement /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/reports" 
            element={effectiveIsAdmin ? <Reports /> : <Navigate to="/" />} 
          />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
