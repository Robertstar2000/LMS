
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { courses as baseCourses, categories } from '../data';
import { Course } from '../types';

const CourseCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const allCourses = useMemo(() => {
    const stored = localStorage.getItem('tallman_lms_courses');
    const customCourses: Course[] = stored ? JSON.parse(stored) : [];
    return [...baseCourses, ...customCourses];
  }, []);

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category_id === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Curriculum Explorer</h1>
          <p className="text-slate-500 text-lg italic">Find the right path for your technical mastery.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Course Categories</h3>
              <div className="space-y-2">
                 <button onClick={() => setSelectedCategory('all')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${selectedCategory === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}>All Skills</button>
                 {categories.map(cat => (
                   <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}>
                      <span className="mr-2">{cat.icon}</span> {cat.name}
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Expertise Level</h3>
              <div className="space-y-2">
                 {['all', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                   <button key={lvl} onClick={() => setSelectedDifficulty(lvl)} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${selectedDifficulty === lvl ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}>
                      {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                   </button>
                 ))}
              </div>
           </div>
        </aside>

        <div className="lg:col-span-3 space-y-8">
           <div className="relative">
              <input
                type="text"
                placeholder="Search the technical library..."
                className="w-full pl-14 pr-4 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-indigo-600 outline-none transition-all shadow-sm text-lg font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-6 h-6 absolute left-5 top-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
              {filteredCourses.map(course => (
                <div key={course.course_id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:border-indigo-100 transition-all hover:-translate-y-2">
                  <div className="relative h-56">
                    <img src={course.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                    <div className="absolute top-6 left-6 flex gap-2">
                       <span className="bg-indigo-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-xl">{course.difficulty || 'Expert'}</span>
                       <span className="bg-white/95 text-slate-900 text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-xl">20 Modules</span>
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                       {[1,2,3,4,5].map(i => <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{course.rating} ({course.enrolled_count} Learners)</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{course.course_name}</h3>
                    <p className="text-slate-500 line-clamp-2 mb-8 leading-relaxed">{course.short_description}</p>
                    <Link
                      to={`/player/${course.course_id}`}
                      className="w-full text-center py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 shadow-xl transition-all active:scale-[0.98]"
                    >
                      Begin Path
                    </Link>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;
