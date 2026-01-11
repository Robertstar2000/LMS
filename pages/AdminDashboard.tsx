
import React, { useMemo, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { courses as baseCourses } from '../data';
import { Course, User, UserRole, Module, Lesson, QuizQuestion } from '../types';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [customCourses, setCustomCourses] = useState<Course[]>([]);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const loadData = () => {
    const storedUsers = localStorage.getItem('tallman_workforce_users');
    if (storedUsers) setUsers(JSON.parse(storedUsers));

    const storedCourses = localStorage.getItem('tallman_lms_courses');
    if (storedCourses) {
      setCustomCourses(JSON.parse(storedCourses));
    }
  };

  const handleWipeStorage = () => {
    if (window.confirm("DANGER: This will permanently erase ALL generated courses and workforce data. This is used for system resets only. Proceed?")) {
      localStorage.removeItem('tallman_lms_courses');
      localStorage.removeItem('tallman_last_created_id');
      setCustomCourses([]);
      alert("System library purged.");
      window.location.reload();
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('focus', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('focus', loadData);
    };
  }, []);

  const allCourses = useMemo(() => {
    const courseMap = new Map<string, Course>();
    baseCourses.forEach(c => courseMap.set(c.course_id, c));
    customCourses.forEach(c => courseMap.set(c.course_id, c));
    return Array.from(courseMap.values());
  }, [customCourses]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    if (editId) {
      const courseToEdit = allCourses.find(c => c.course_id === editId);
      if (courseToEdit) {
        setEditingCourse(courseToEdit);
      }
    }
  }, [location.search, allCourses]);

  const stats = [
    { id: 'users', label: 'Total Users', value: users.length.toLocaleString(), icon: '👥' },
    { id: 'active', label: 'Active Learners', value: '1,240', icon: '🔥' },
    { id: 'completions', label: 'Course Completions', value: '432', icon: '🎓' },
    { id: 'revenue', label: 'Credits Issued', value: '12,500', icon: '💎' },
  ];

  const handleSaveCourse = (updatedCourse: Course) => {
    const storedCourses = localStorage.getItem('tallman_lms_courses');
    let courses: Course[] = storedCourses ? JSON.parse(storedCourses) : [];
    
    const existingIdx = courses.findIndex(c => c.course_id === updatedCourse.course_id);
    if (existingIdx > -1) {
      courses[existingIdx] = updatedCourse;
    } else {
      courses.push(updatedCourse);
    }
    
    localStorage.setItem('tallman_lms_courses', JSON.stringify(courses));
    setCustomCourses(courses);
    setEditingCourse(null);
    navigate('/admin', { replace: true });
  };

  const handleDeleteCourse = (courseId: string) => {
    const isBase = baseCourses.some(c => c.course_id === courseId);
    if (isBase) {
      alert("Base curriculum cannot be deleted.");
      return;
    }

    if (window.confirm("Are you sure you want to permanently discard this curriculum?")) {
      const storedCourses = localStorage.getItem('tallman_lms_courses');
      if (storedCourses) {
        const courses: Course[] = JSON.parse(storedCourses);
        const filtered = courses.filter(c => c.course_id !== courseId);
        localStorage.setItem('tallman_lms_courses', JSON.stringify(filtered));
        setCustomCourses(filtered);
      }
      setEditingCourse(null);
      navigate('/admin', { replace: true });
    }
  };

  const closeEditor = () => {
    setEditingCourse(null);
    navigate('/admin', { replace: true });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 relative pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight underline decoration-indigo-200 decoration-4 underline-offset-4">Tallman Console</h1>
          <p className="text-slate-500">Corporate Governance & Content Mastering.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleWipeStorage}
            className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95"
          >
            Reset System
          </button>
          <Link to="/admin/courses" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
            New AI Curriculum
          </Link>
        </div>
      </header>

      <section className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl overflow-hidden text-slate-900">
        <div className="p-8 border-b flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">⚙️</div>
             <div>
               <h2 className="text-xl font-black text-slate-900">Curriculum Mastering Lab</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Edit AI generated tracks</p>
             </div>
          </div>
          <button onClick={loadData} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 px-4 py-2 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors">
             Sync Library ({allCourses.length})
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b">
              <tr>
                <th className="px-10 py-6">Course Path</th>
                <th className="px-10 py-6">Identity Key</th>
                <th className="px-10 py-6 text-right">Engineering</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allCourses.map((course) => (
                <tr key={course.course_id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                       <img src={course.thumbnail_url} className="w-16 h-10 rounded-xl object-cover border shadow-sm" alt="" />
                       <span className="font-black text-slate-900 text-lg">{course.course_name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-mono bg-slate-100 px-3 py-1 rounded-lg text-slate-500 uppercase">{course.course_id}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => setEditingCourse(course)}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md active:scale-95"
                    >
                      Master Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <button 
            key={stat.id} 
            onClick={() => setSelectedStat(selectedStat === stat.id ? null : stat.id)}
            className={`text-left p-6 rounded-[2.5rem] border-2 transition-all ${
              selectedStat === stat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-slate-100 hover:border-indigo-200'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${selectedStat === stat.id ? 'text-indigo-100' : 'text-slate-400'}`}>{stat.label}</p>
            <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
          </button>
        ))}
      </div>

      {selectedStat && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 bg-white rounded-[3rem] border-2 border-indigo-100 p-10 shadow-2xl">
           {selectedStat === 'users' && <UserList users={users} />}
           {selectedStat === 'active' && <ActiveLearnersList users={users} courses={allCourses} />}
           {selectedStat === 'completions' && <CompletionMetrics courses={allCourses} users={users} />}
        </div>
      )}

      {editingCourse && (
        <CourseEditor 
          key={editingCourse.course_id} 
          course={editingCourse} 
          onSave={handleSaveCourse} 
          onDelete={handleDeleteCourse}
          onCancel={closeEditor} 
        />
      )}
    </div>
  );
};

const UserList: React.FC<{ users: User[] }> = ({ users }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-black mb-6">Workforce Roster</h3>
    <table className="w-full text-left">
      <thead>
        <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400 border-b">
          <th className="pb-4">Name</th>
          <th className="pb-4">Role</th>
          <th className="pb-4 text-right">Points</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {users.map(u => (
          <tr key={u.user_id} className="hover:bg-slate-50">
            <td className="py-4 font-bold text-slate-800">{u.display_name}</td>
            <td className="py-4 text-[10px] font-black text-slate-400 uppercase">{u.role}</td>
            <td className="py-4 text-right font-mono font-bold text-indigo-600">{u.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ActiveLearnersList: React.FC<{ users: User[]; courses: Course[] }> = ({ users, courses }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-black mb-6">Real-time Enrollment Monitoring</h3>
    {users.slice(0, 8).map((u, i) => (
      <div key={u.user_id} className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between border">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black">👤</div>
          <div>
            <p className="font-black text-slate-900">{u.display_name}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase">Path: {courses[i % courses.length]?.course_name}</p>
          </div>
        </div>
        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full" style={{ width: `${30 + (i * 10)}%` }}></div>
        </div>
      </div>
    ))}
  </div>
);

const CompletionMetrics: React.FC<{ courses: Course[]; users: User[] }> = ({ courses, users }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <h3 className="col-span-full text-xl font-black mb-2">Graduation Audit</h3>
    {courses.map(c => (
      <div key={c.course_id} className="p-8 border rounded-[2rem] bg-white hover:border-indigo-600 transition-all">
        <h4 className="font-black text-slate-900 mb-4">{c.course_name}</h4>
        <div className="flex flex-wrap gap-2">
          {users.slice(0, 5).map((u, i) => (
            <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase">Certified: {u.display_name}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const CourseEditor: React.FC<{ course: Course; onSave: (c: Course) => void; onDelete: (id: string) => void; onCancel: () => void }> = ({ course, onSave, onDelete, onCancel }) => {
  const [edited, setEdited] = useState<Course>({ 
    ...course, 
    modules: course.modules || [] 
  });
  const [activeIdx, setActiveIdx] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateModule = (idx: number, updated: Module) => {
    const mods = [...(edited.modules || [])];
    mods[idx] = updated;
    setEdited({ ...edited, modules: mods });
    setHasUnsavedChanges(true);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm("You have unsaved edits. Discard changes?")) return;
    onCancel();
  };

  const addLesson = (mIdx: number) => {
    const mod = edited.modules![mIdx];
    const newLesson: Lesson = {
      lesson_id: `l_${Date.now()}`,
      module_id: mod.module_id,
      lesson_title: 'New Technical Insight',
      lesson_type: 'document',
      duration_minutes: 10,
      content: 'Enter professional content...'
    };
    updateModule(mIdx, { ...mod, lessons: [...mod.lessons, newLesson] });
  };

  const addQuizQuestion = (mIdx: number, lIdx: number) => {
    const mod = edited.modules![mIdx];
    const lesson = mod.lessons[lIdx];
    const newQuestion: QuizQuestion = {
      question: 'New Audit Question',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0
    };
    const updatedLessons = [...mod.lessons];
    updatedLessons[lIdx] = {
      ...lesson,
      quiz_questions: [...(lesson.quiz_questions || []), newQuestion]
    };
    updateModule(mIdx, { ...mod, lessons: updatedLessons });
  };

  const removeQuizQuestion = (mIdx: number, lIdx: number, qIdx: number) => {
    const mod = edited.modules![mIdx];
    const lesson = mod.lessons[lIdx];
    const updatedQuestions = [...(lesson.quiz_questions || [])];
    updatedQuestions.splice(qIdx, 1);
    const updatedLessons = [...mod.lessons];
    updatedLessons[lIdx] = {
      ...lesson,
      quiz_questions: updatedQuestions
    };
    updateModule(mIdx, { ...mod, lessons: updatedLessons });
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-7xl h-[90vh] bg-white rounded-[4rem] shadow-2xl flex flex-col overflow-hidden border-4 border-indigo-500/10">
        <header className="p-8 border-b bg-slate-50 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleCancel} 
              className="w-12 h-12 flex items-center justify-center bg-white border-2 border-slate-100 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all hover:bg-slate-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div className="flex flex-col border-l pl-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Master Content Architect</h2>
              {hasUnsavedChanges && <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-0.5">● Unsaved Edits Present</span>}
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => onDelete(edited.course_id)} 
              className="px-6 py-4 text-rose-500 font-black uppercase text-[10px] hover:bg-rose-50 rounded-2xl transition-all"
            >
              Discard Track
            </button>
            <button 
              onClick={() => onSave(edited)} 
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Publish Content
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-80 border-r p-6 bg-slate-50/50 overflow-y-auto space-y-2 custom-scrollbar">
            <h3 className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Module Selection</h3>
            {edited.modules?.map((m, i) => (
              <button 
                key={m.module_id}
                onClick={() => setActiveIdx(i)}
                className={`w-full text-left p-4 rounded-2xl font-black text-xs transition-all flex items-center gap-3 ${
                  activeIdx === i ? 'bg-indigo-600 text-white shadow-lg translate-x-1' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] ${activeIdx === i ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {i + 1}
                </span>
                <span className="truncate">{m.module_title}</span>
              </button>
            ))}
          </aside>

          <main className="flex-1 p-10 overflow-y-auto bg-white custom-scrollbar">
            {edited.modules?.[activeIdx] ? (
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex items-center justify-between border-b-2 border-slate-50 pb-8">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Unit {activeIdx + 1} Workbench</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">Configure lessons and assessments for this module.</p>
                  </div>
                  <button onClick={() => addLesson(activeIdx)} className="px-5 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] hover:bg-indigo-100 transition-all uppercase tracking-widest">+ Add Lesson Unit</button>
                </div>

                <div className="space-y-10">
                  {edited.modules[activeIdx].lessons.map((lesson, lIdx) => (
                    <div key={lesson.lesson_id} className="p-10 bg-slate-50 border-2 border-slate-100 rounded-[3rem] space-y-6 shadow-sm hover:border-indigo-100 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                           <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${lesson.lesson_type === 'quiz' ? 'bg-amber-100 text-amber-700 shadow-sm' : 'bg-indigo-100 text-indigo-700 shadow-sm'}`}>
                             {lesson.lesson_type}
                           </span>
                           <input 
                            className="flex-1 font-black text-xl text-slate-900 bg-transparent outline-none focus:border-b-2 border-indigo-600 min-w-[300px] placeholder:text-slate-300"
                            placeholder="Unit Title..."
                            value={lesson.lesson_title}
                            onChange={e => {
                              const mod = edited.modules![activeIdx];
                              const lns = [...mod.lessons];
                              lns[lIdx] = { ...lesson, lesson_title: e.target.value };
                              updateModule(activeIdx, { ...mod, lessons: lns });
                            }}
                          />
                        </div>
                        <button 
                          onClick={() => {
                            if (!window.confirm("Remove this lesson unit?")) return;
                            const mod = edited.modules![activeIdx];
                            const lns = mod.lessons.filter((_, i) => i !== lIdx);
                            updateModule(activeIdx, { ...mod, lessons: lns });
                          }}
                          className="text-[10px] font-black text-rose-500 uppercase hover:text-rose-700 px-4 py-2"
                        >
                          Remove Unit
                        </button>
                      </div>

                      {lesson.lesson_type === 'document' && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manual Content (Markdown Supported)</label>
                          <textarea 
                            className="w-full p-8 bg-white border-2 border-slate-100 rounded-3xl h-80 text-sm font-medium focus:ring-4 focus:ring-indigo-50 outline-none focus:border-indigo-400 transition-all leading-relaxed"
                            value={lesson.content}
                            onChange={e => {
                              const mod = edited.modules![activeIdx];
                              const lns = [...mod.lessons];
                              lns[lIdx] = { ...lesson, content: e.target.value };
                              updateModule(activeIdx, { ...mod, lessons: lns });
                            }}
                          />
                        </div>
                      )}

                      {lesson.lesson_type === 'quiz' && (
                        <div className="space-y-8 pt-4">
                          <div className="flex items-center justify-between border-b pb-4">
                             <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Assessment Engineering</h4>
                             <button 
                               onClick={() => addQuizQuestion(activeIdx, lIdx)}
                               className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-[9px] font-black uppercase hover:bg-slate-50 hover:border-indigo-300 transition-all"
                             >
                               + New Test Question
                             </button>
                          </div>
                          <div className="space-y-6">
                            {lesson.quiz_questions?.map((q, qIndex) => (
                              <div key={qIndex} className="bg-white p-8 border-2 border-slate-100 rounded-[2.5rem] space-y-6 shadow-sm relative group animate-in slide-in-from-top-2">
                                <button 
                                  onClick={() => removeQuizQuestion(activeIdx, lIdx, qIndex)}
                                  className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"
                                  title="Remove Question"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                                
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Question {qIndex + 1}</label>
                                  <input 
                                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-md font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all"
                                    placeholder="Enter the technical question..."
                                    value={q.question}
                                    onChange={e => {
                                      const mod = edited.modules![activeIdx];
                                      const lns = [...mod.lessons];
                                      const qs = [...(lns[lIdx].quiz_questions || [])];
                                      qs[qIndex] = { ...q, question: e.target.value };
                                      lns[lIdx] = { ...lns[lIdx], quiz_questions: qs };
                                      updateModule(activeIdx, { ...mod, lessons: lns });
                                    }}
                                  />
                                </div>

                                <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Choices (Select the correct answer)</label>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((opt, oIdx) => (
                                      <div key={oIdx} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${q.correctIndex === oIdx ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                                        <input 
                                          type="radio" 
                                          name={`correct-${lesson.lesson_id}-${qIndex}`}
                                          checked={q.correctIndex === oIdx}
                                          onChange={() => {
                                            const mod = edited.modules![activeIdx];
                                            const lns = [...mod.lessons];
                                            const qs = [...(lns[lIdx].quiz_questions || [])];
                                            qs[qIndex] = { ...q, correctIndex: oIdx };
                                            lns[lIdx] = { ...lns[lIdx], quiz_questions: qs };
                                            updateModule(activeIdx, { ...mod, lessons: lns });
                                          }}
                                          className="w-5 h-5 accent-emerald-600 cursor-pointer"
                                        />
                                        <input 
                                          className="flex-1 bg-transparent border-none text-sm font-bold outline-none placeholder:text-slate-300"
                                          placeholder={`Choice ${oIdx + 1}`}
                                          value={opt}
                                          onChange={e => {
                                            const mod = edited.modules![activeIdx];
                                            const lns = [...mod.lessons];
                                            const qs = [...(lns[lIdx].quiz_questions || [])];
                                            const opts = [...q.options];
                                            opts[oIdx] = e.target.value;
                                            qs[qIndex] = { ...q, options: opts };
                                            lns[lIdx] = { ...lns[lIdx], quiz_questions: qs };
                                            updateModule(activeIdx, { ...mod, lessons: lns });
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <div className="text-6xl">🧭</div>
                <p className="font-black uppercase tracking-widest text-xs">Select a unit module to begin mastering content.</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
