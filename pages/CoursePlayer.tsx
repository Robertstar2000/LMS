
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courses as baseCourses, enrollments as baseEnrollments } from '../data';
import { Lesson, Enrollment, Course } from '../types';

const CoursePlayer: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // 1. Prioritized Data Source - Prefers Local Edits over Base Curriculum
  const allCourses = useMemo(() => {
    const stored = localStorage.getItem('tallman_lms_courses');
    const customCourses: Course[] = stored ? JSON.parse(stored) : [];
    
    // Create a map to resolve ID conflicts, preferring custom versions
    const courseMap = new Map<string, Course>();
    
    // Fill with base courses first
    baseCourses.forEach(c => courseMap.set(c.course_id, c));
    
    // Overwrite with custom edits (including edited base courses)
    customCourses.forEach(c => courseMap.set(c.course_id, c));
    
    return Array.from(courseMap.values());
  }, []);

  const course = useMemo(() => allCourses.find(c => c.course_id === courseId), [courseId, allCourses]);
  const modules = useMemo(() => course?.modules || [], [course]);
  
  // Stable flat list of all lessons in the current course
  const flatLessons = useMemo(() => modules.flatMap(m => m.lessons), [modules]);

  // 2. Persistent State Tracking
  const [enrollment, setEnrollment] = useState<Enrollment>(() => {
    const existing = baseEnrollments.find(e => e.course_id === courseId);
    if (existing) return existing;
    return {
      enrollment_id: `e-temp-${Date.now()}`,
      user_id: 'user_01_hq',
      course_id: courseId || '',
      progress_percent: 0,
      status: 'active',
      completed_lesson_ids: [],
      enrolled_at: new Date().toISOString().split('T')[0]
    };
  });

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  // 3. Smart Resume Logic
  useEffect(() => {
    if (flatLessons.length > 0 && !activeLessonId) {
      const completedIds = enrollment?.completed_lesson_ids || [];
      const nextToComplete = flatLessons.find(l => !completedIds.includes(l.lesson_id));
      setActiveLessonId(nextToComplete ? nextToComplete.lesson_id : flatLessons[0].lesson_id);
    }
  }, [flatLessons, enrollment, activeLessonId]);

  // 4. Content Lookups
  const currentLesson = useMemo(() => 
    flatLessons.find(l => l.lesson_id === activeLessonId) || null
  , [flatLessons, activeLessonId]);

  const activeLessonIdx = useMemo(() => 
    flatLessons.findIndex(l => l.lesson_id === activeLessonId)
  , [flatLessons, activeLessonId]);

  const isLastLesson = activeLessonIdx !== -1 && activeLessonIdx === flatLessons.length - 1;

  useEffect(() => {
    setQuizScore(null);
    setUserAnswers([]);
    setShowCompletion(false);
    const container = document.getElementById('lesson-content-area');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeLessonId]);

  const markLessonComplete = useCallback((lessonId: string) => {
    const currentCompleted = enrollment.completed_lesson_ids || [];
    if (!currentCompleted.includes(lessonId)) {
      const updatedCompleted = [...currentCompleted, lessonId];
      const newProgress = Math.round((updatedCompleted.length / flatLessons.length) * 100);
      setEnrollment(prev => ({
        ...prev,
        completed_lesson_ids: updatedCompleted,
        progress_percent: newProgress
      }));
    }
  }, [enrollment.completed_lesson_ids, flatLessons.length]);

  const handleProceed = useCallback(() => {
    if (activeLessonIdx === -1) return;
    
    if (isLastLesson) {
      setShowCompletion(true);
    } else {
      const nextLesson = flatLessons[activeLessonIdx + 1];
      if (nextLesson) {
        setQuizScore(null);
        setUserAnswers([]);
        setActiveLessonId(nextLesson.lesson_id);
      }
    }
  }, [activeLessonIdx, isLastLesson, flatLessons]);

  const handleQuizSubmit = () => {
    if (!currentLesson?.quiz_questions) return;
    const score = userAnswers.reduce((acc, ans, idx) => {
      return ans === currentLesson.quiz_questions![idx].correctIndex ? acc + 1 : acc;
    }, 0);
    
    setQuizScore(score);

    const pass = score >= Math.ceil(currentLesson.quiz_questions.length * 0.7);
    if (pass) {
      markLessonComplete(currentLesson.lesson_id);
    }
  };

  const isQuizFullyAnswered = useMemo(() => {
    if (!currentLesson?.quiz_questions) return false;
    return currentLesson.quiz_questions.every((_, idx) => userAnswers[idx] !== undefined);
  }, [currentLesson, userAnswers]);

  if (!course) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Path Not Found</h2>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700">Back to Hub</button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-sm border overflow-hidden text-slate-900 relative">
        <div id="lesson-content-area" className="p-8 md:p-12 flex-1 overflow-y-auto custom-scrollbar">
          {showCompletion ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
               <div className="text-9xl mb-6 drop-shadow-2xl">🎖️</div>
               <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter italic uppercase">Certification Achieved</h1>
               <p className="text-slate-500 text-lg mb-10 max-w-sm font-medium">Technical mastery confirmed for <span className="text-indigo-600 font-black">"{course.course_name}"</span>.</p>
               <Link to="/" className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Return to Hub</Link>
            </div>
          ) : !currentLesson ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
               <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
               <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Synchronizing Path Modules...</p>
            </div>
          ) : (
            <div key={currentLesson.lesson_id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-12 border-b-2 border-slate-50 pb-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
                    {currentLesson.lesson_type}
                  </span>
                  <div className="h-4 w-px bg-slate-200"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Study Time: {currentLesson.duration_minutes} Min
                  </span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  {currentLesson.lesson_title}
                </h1>
              </header>

              <main>
                {currentLesson.lesson_type === 'document' ? (
                  <div className="space-y-12">
                    <div className="bg-white text-slate-800 leading-[1.8] text-xl font-medium whitespace-pre-wrap selection:bg-indigo-100 italic font-serif prose prose-slate max-w-none">
                       {currentLesson.content || "Technical specifications are being updated by the supervisor..."}
                    </div>
                    <div className="pt-8 border-t flex justify-end">
                      <button 
                        onClick={() => {
                          markLessonComplete(currentLesson.lesson_id);
                          handleProceed();
                        }}
                        className="px-12 py-6 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all flex items-center gap-4 active:scale-95"
                      >
                        Complete & Continue
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 pb-32">
                    <div className="p-10 bg-indigo-50/30 border-2 border-indigo-100 rounded-[3rem] mb-12">
                       <h2 className="text-2xl font-black text-indigo-900 tracking-tighter uppercase italic">Technical Verification</h2>
                       <p className="text-indigo-600 font-bold mt-2">Pass threshold: 70% accuracy required.</p>
                    </div>
                    
                    {currentLesson.quiz_questions?.length ? currentLesson.quiz_questions.map((q, qIdx) => (
                      <div key={qIdx} className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] shadow-sm hover:border-indigo-200 transition-all">
                        <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter">{qIdx + 1}. {q.question}</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = userAnswers[qIdx] === oIdx;
                            const isCorrect = quizScore !== null && oIdx === q.correctIndex;
                            const isWrong = quizScore !== null && isSelected && oIdx !== q.correctIndex;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => quizScore === null && setUserAnswers(prev => {
                                  const n = [...prev];
                                  n[qIdx] = oIdx;
                                  return n;
                                })}
                                className={`p-6 text-left rounded-3xl border-3 font-bold text-lg transition-all flex items-center justify-between ${
                                  isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl translate-x-2' : 'bg-slate-50 border-slate-100 hover:border-indigo-100 text-slate-600'
                                } ${isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-900 !translate-x-0' : ''} ${isWrong ? 'border-red-500 bg-red-50 text-red-900 !translate-x-0' : ''}`}
                              >
                                <span>{opt}</span>
                                {isCorrect && <span className="text-2xl">✓</span>}
                                {isWrong && <span className="text-2xl">×</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )) : (
                      <div className="p-20 text-center text-slate-400 font-black uppercase italic">Assessment data pending...</div>
                    )}
                    
                    {quizScore === null ? (
                      <button 
                        onClick={handleQuizSubmit}
                        disabled={!isQuizFullyAnswered}
                        className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl disabled:opacity-30 hover:bg-indigo-700 transition-all active:scale-95"
                      >
                        Submit Technical Verification
                      </button>
                    ) : (
                      <div className="p-16 text-center bg-white rounded-[4rem] border-4 border-indigo-100 shadow-[0_40px_80px_rgba(0,0,0,0.1)] animate-in zoom-in">
                        <div className="text-8xl mb-8">{quizScore >= Math.ceil(currentLesson.quiz_questions!.length * 0.7) ? '✅' : '❌'}</div>
                        <h2 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">{Math.round((quizScore / currentLesson.quiz_questions!.length) * 100)}% Proficiency</h2>
                        <div className="flex gap-4 max-w-md mx-auto">
                           <button 
                             onClick={() => { setQuizScore(null); setUserAnswers([]); }}
                             className="flex-1 py-6 bg-white border-3 border-indigo-600 text-indigo-600 rounded-3xl font-black text-xl hover:bg-indigo-50 transition-all"
                           >
                             Retry
                           </button>
                           <button 
                             onClick={handleProceed}
                             className="flex-1 py-6 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-all"
                           >
                             Continue to Next Unit
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          )}
        </div>
      </div>

      <aside className="w-full lg:w-[400px] flex flex-col gap-4">
        <div className="bg-white rounded-[3rem] p-10 border shadow-sm flex-1 flex flex-col overflow-hidden text-slate-900">
          <header className="mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
               <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center not-italic">📖</span>
               Path Content
            </h2>
            <div className="mt-8 space-y-2">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${enrollment.progress_percent}%` }}></div>
              </div>
              <div className="flex justify-between items-center px-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{enrollment.progress_percent}% MASTERED</p>
                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{enrollment.completed_lesson_ids?.length}/{flatLessons.length} UNITS</p>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-10">
             {modules.map((mod, mIdx) => (
               <div key={mod.module_id}>
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-500">{mIdx + 1}</span>
                   {mod.module_title}
                 </h3>
                 <div className="space-y-3">
                   {mod.lessons.map((l) => {
                     const active = activeLessonId === l.lesson_id;
                     const done = enrollment.completed_lesson_ids?.includes(l.lesson_id);
                     return (
                       <button
                         key={l.lesson_id}
                         onClick={() => {
                           setActiveLessonId(l.lesson_id);
                           setShowCompletion(false);
                         }}
                         className={`w-full text-left p-5 rounded-[2rem] border-2 transition-all flex items-center gap-5 group ${
                           active ? 'bg-indigo-600 border-indigo-600 shadow-2xl scale-[1.02]' : done ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-transparent hover:bg-slate-50'
                         }`}
                       >
                         <div className={`shrink-0 text-xl ${active ? 'text-white' : done ? 'text-emerald-500' : 'text-slate-300'}`}>
                           {done ? '✅' : l.lesson_type === 'quiz' ? '❓' : '📄'}
                         </div>
                         <div className="flex-1 overflow-hidden">
                           <p className={`text-sm font-black truncate ${active ? 'text-white' : 'text-slate-800'}`}>{l.lesson_title}</p>
                           <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${active ? 'text-indigo-200' : 'text-slate-400'}`}>
                             {l.duration_minutes}m • {l.lesson_type}
                           </p>
                         </div>
                       </button>
                     );
                   })}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </aside>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default CoursePlayer;
