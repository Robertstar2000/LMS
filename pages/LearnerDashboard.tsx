
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Course, Enrollment } from '../types';
import { TallmanAPI } from '../backend-server';

const LearnerDashboard: React.FC<{ user: User }> = ({ user: initialUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(initialUser);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const refreshData = async () => {
      const [u, c, e] = await Promise.all([
        TallmanAPI.getCurrentSession(),
        TallmanAPI.getCourses(),
        TallmanAPI.getEnrollments(initialUser.user_id)
      ]);
      if (u) setUser(u);
      setCourses(c);
      setEnrollments(e);
      setHasLoaded(true);
    };
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [initialUser.user_id]);

  const activeCourses = useMemo(() => {
    return enrollments
      .filter(e => e.status !== 'completed' && e.progress_percent < 100)
      .map(e => {
        const course = courses.find(c => c.course_id === e.course_id);
        return course ? { ...course, progress: e.progress_percent } : null;
      })
      .filter(Boolean) as (Course & { progress: number })[];
  }, [courses, enrollments]);

  // Redirect to Catalog if no active tracks are found after initial load
  useEffect(() => {
    if (hasLoaded && activeCourses.length === 0) {
      navigate('/catalog', { replace: true });
    }
  }, [hasLoaded, activeCourses, navigate]);

  if (!hasLoaded) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full mb-4"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Synchronizing Path Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Hello, {user.display_name}</h1>
          <p className="text-slate-500 mt-3 font-medium text-lg">Resuming your path to professional mastery.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-3xl shadow-sm border text-center min-w-[120px]">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">XP Points</p>
            <p className="text-3xl font-black text-indigo-600">{user.points}</p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border text-center min-w-[120px]">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Rank Level</p>
            <p className="text-3xl font-black text-amber-500">{user.level}</p>
          </div>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900">Active Learning</h2>
          <Link to="/catalog" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-slate-900 transition-colors">Browse All Tracks →</Link>
        </div>
        
        {activeCourses.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 border-2 border-dashed border-slate-200 text-center">
            <h3 className="text-xl font-black text-slate-900 uppercase italic">No Active Tracks</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2 mb-6">Redirecting to Curriculum Explorer...</p>
            <Link to="/catalog" className="inline-block px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Explore Catalog</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCourses.map((course) => (
              <Link key={course.course_id} to={`/player/${course.course_id}`} className="group block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all">
                <div className="relative h-56">
                  <img src={course.thumbnail_url} className="w-full h-full object-cover" alt="" />
                  <div className="absolute top-6 right-6 bg-white/95 px-4 py-2 rounded-2xl text-[10px] font-black">{course.progress}%</div>
                </div>
                <div className="p-8">
                  <h3 className="font-black text-xl mb-4 text-slate-900 truncate">{course.course_name}</h3>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LearnerDashboard;
