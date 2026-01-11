
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, Certificate, Course, Enrollment } from '../types';
import { courses as baseCourses, enrollments as baseEnrollments, badges, certificates } from '../data';

const CertificatePreview: React.FC<{ cert: Certificate; onClose: () => void }> = ({ cert, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden print:p-0 print:m-0 print:shadow-none print:w-full print:h-full">
        <div className="flex justify-between items-center p-4 bg-slate-50 border-b print:hidden">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all group"
              title="Return to Dashboard"
            >
              <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <h3 className="font-bold text-slate-800 border-l pl-3">Certificate of Completion</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2">
              Print / Save PDF
            </button>
          </div>
        </div>

        <div className="p-12 md:p-20 text-center border-[20px] border-double border-indigo-100 m-8 bg-white relative">
          <div className="space-y-8">
            <div className="flex flex-col items-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfAo_vinwmvZoyER2jOBXcta82wntkUlhiqNCIFFHtJg&s=10" className="h-16 w-auto mb-4" alt="Tallman Logo" />
              <h2 className="text-indigo-600 font-black text-xl tracking-[0.3em] uppercase">Tallman LMS</h2>
            </div>
            <div className="py-8">
              <p className="text-slate-500 font-medium italic text-lg">This certificate is awarded to</p>
              <h1 className="text-5xl font-black text-slate-900 mt-4 underline decoration-indigo-200 underline-offset-8">Rick</h1>
            </div>
            <div className="py-4">
              <p className="text-slate-500 font-medium">for successful completion of</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{cert.course_name}</h3>
            </div>
            <div className="pt-12 grid grid-cols-2 gap-12 text-left border-t border-slate-100">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Date</p>
                <p className="text-lg font-bold text-slate-800">{cert.completion_date}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400">Cert ID</p>
                <p className="text-lg font-bold text-slate-800 font-mono">{cert.certificate_id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LearnerDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const allCourses = useMemo(() => {
    const stored = localStorage.getItem('tallman_lms_courses');
    const customCourses: Course[] = stored ? JSON.parse(stored) : [];
    
    const courseMap = new Map<string, Course>();
    baseCourses.forEach(c => courseMap.set(c.course_id, c));
    customCourses.forEach(c => courseMap.set(c.course_id, c));
    
    return Array.from(courseMap.values());
  }, []);
  
  const userEnrollments = baseEnrollments.filter(e => e.user_id === user.user_id && e.status !== 'completed');
  
  const enrolledCourses = useMemo(() => {
    const list = userEnrollments.map(e => {
      const c = allCourses.find(course => course.course_id === e.course_id);
      return c ? { ...c, progress: e.progress_percent } : null;
    }).filter(c => c !== null) as (Course & { progress: number })[];

    allCourses.forEach(c => {
      if (!list.find(ec => ec.course_id === c.course_id)) {
        list.push({ ...c, progress: 0 });
      }
    });

    return list;
  }, [allCourses, userEnrollments]);

  const userCertificates = certificates.filter(c => c.user_id === user.user_id);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Hello, {user.display_name}</h1>
          <p className="text-slate-500 mt-3 font-medium text-lg">Resuming your path to professional mastery.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center min-w-[120px]">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">XP Points</p>
            <p className="text-3xl font-black text-indigo-600">{user.points}</p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center min-w-[120px]">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Rank Level</p>
            <p className="text-3xl font-black text-amber-500">{user.level}</p>
          </div>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900">Active Learning</h2>
          <Link to="/catalog" className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline">Full Catalog</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
            <Link key={course.course_id} to={`/player/${course.course_id}`} className="group block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-50 transition-all transform hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden">
                <img src={course.thumbnail_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.course_name} />
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-slate-900 shadow-xl">
                  {course.progress || 0}%
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-black text-xl mb-4 text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{course.course_name}</h3>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${course.progress || 0}%` }}></div>
                </div>
                <button className="mt-8 w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  Continue Mastery
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section className="bg-white p-10 rounded-[3rem] border shadow-sm">
          <h2 className="text-2xl font-black mb-8">Credentials</h2>
          <div className="space-y-4">
            {userCertificates.map(cert => (
              <button 
                key={cert.certificate_id} 
                onClick={() => setSelectedCert(cert)}
                className="w-full text-left p-6 border rounded-[2rem] hover:border-indigo-600 transition-all bg-slate-50/50 group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">📜</div>
                  <div className="overflow-hidden">
                    <p className="font-black text-slate-900 text-sm line-clamp-1">{cert.course_name}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest">{cert.certificate_id}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="lg:col-span-2 bg-white p-10 rounded-[3rem] border shadow-sm">
           <h2 className="text-2xl font-black mb-8">Recent Milestones</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {badges.map(badge => (
                <div key={badge.badge_id} className="text-center group">
                   <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 flex items-center justify-center text-4xl mb-4 shadow-inner group-hover:scale-110 transition-transform">
                     {badge.badge_image_url}
                   </div>
                   <p className="font-black text-slate-900 text-xs">{badge.badge_name}</p>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{badge.criteria}</p>
                </div>
              ))}
           </div>
        </section>
      </div>

      {selectedCert && (
        <CertificatePreview cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </div>
  );
};

export default LearnerDashboard;
