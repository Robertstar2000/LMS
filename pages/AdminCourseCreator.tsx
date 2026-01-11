
import React, { useState, useRef } from 'react';
import { generateFullCourseOutline, generateLessonDetails } from '../geminiService';
import { Course, CourseStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import { BOOTSTRAP_TOPICS } from '../data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const AdminCourseCreator: React.FC = () => {
  const navigate = useNavigate();
  
  // UI States
  const [isBusy, setIsBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [currentCourseName, setCurrentCourseName] = useState('');
  const [draftProgress, setDraftProgress] = useState({ current: 0, total: 0 });
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  
  // Control Refs
  const isOperationActive = useRef(false);

  /**
   * Emergency State Reset
   */
  const resetSystemState = () => {
    isOperationActive.current = false;
    setIsBusy(false);
    setStatusMessage('');
    setCurrentCourseName('');
    setDraftProgress({ current: 0, total: 0 });
    setBulkProgress({ current: 0, total: 0 });
  };

  const handleAbort = () => {
    isOperationActive.current = false;
    setStatusMessage('HALTING OPERATIONS...');
    // We don't setIsBusy(false) immediately to allow the loop to catch the ref change
  };

  const saveToStorage = (courseData: any) => {
    try {
      const stored = localStorage.getItem('tallman_lms_courses');
      let courses: any[] = stored ? JSON.parse(stored) : [];
      
      const finalCourse: Course = {
        course_id: courseData.course_id,
        course_name: courseData.title || courseData.course_name,
        short_description: courseData.description || courseData.short_description,
        thumbnail_url: courseData.thumbnail_url,
        category_id: 'tech',
        instructor_id: 'inst_ai',
        status: CourseStatus.PUBLISHED,
        enrolled_count: 0,
        rating: 5.0,
        modules: courseData.modules
      };

      const existingIdx = courses.findIndex(c => c.course_id === finalCourse.course_id);
      if (existingIdx > -1) {
        courses[existingIdx] = finalCourse;
      } else {
        courses.push(finalCourse);
      }
      
      localStorage.setItem('tallman_lms_courses', JSON.stringify(courses));
    } catch (e) {
      console.error("Storage Error:", e);
      setErrorMessage("System quota reached. Some content may not have saved.");
    }
  };

  /**
   * Worker function: Processes a single course. 
   * Does NOT manage its own isBusy state, allowing for bulk wrapping.
   */
  const executeCourseGeneration = async (targetTopic: string) => {
    if (!isOperationActive.current) return;

    setStatusMessage(`ARCHITECTING: ${targetTopic}`);
    setCurrentCourseName(targetTopic);
    
    try {
      const outlineData = await generateFullCourseOutline(targetTopic);
      if (!outlineData || !outlineData.modules) throw new Error("Architect returned malformed structure.");

      const courseId = `c_${targetTopic.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
      let localOutline = {
        ...outlineData,
        course_id: courseId,
        thumbnail_url: `https://picsum.photos/seed/${targetTopic}/1200/600`,
        status: CourseStatus.DRAFT
      };

      const totalLessons = localOutline.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0);
      setDraftProgress({ current: 0, total: totalLessons });

      let processedCount = 0;
      for (let m = 0; m < localOutline.modules.length; m++) {
        if (!isOperationActive.current) break;
        const mod = localOutline.modules[m];
        
        for (let l = 0; l < mod.lessons.length; l++) {
          if (!isOperationActive.current) break;
          const lesson = mod.lessons[l];
          setStatusMessage(`INJECTING: ${lesson.lesson_title}`);

          try {
            const details = await generateLessonDetails(
              localOutline.title,
              mod.module_title,
              lesson.lesson_title,
              lesson.lesson_type
            );

            localOutline.modules[m].lessons[l] = {
              ...lesson,
              ...details,
              lesson_id: `l_${m}_${l}_${courseId}`,
              module_id: `m_${m}_${courseId}`,
              duration_minutes: lesson.duration || 15
            };
          } catch (e) {
            console.warn("Minor injection skip:", e);
          }

          processedCount++;
          setDraftProgress({ current: processedCount, total: totalLessons });
          await sleep(400); 
        }
        
        if (isOperationActive.current) {
          saveToStorage(localOutline);
        }
      }
    } catch (error: any) {
      console.error("Generation Error:", error);
      throw error;
    }
  };

  const startBulkBootstrap = async () => {
    if (isBusy) return;
    setErrorMessage(null);
    setIsBusy(true);
    isOperationActive.current = true;
    setBulkProgress({ current: 0, total: BOOTSTRAP_TOPICS.length });

    try {
      for (let i = 0; i < BOOTSTRAP_TOPICS.length; i++) {
        if (!isOperationActive.current) break;
        setBulkProgress(prev => ({ ...prev, current: i + 1 }));
        await executeCourseGeneration(BOOTSTRAP_TOPICS[i]);
        await sleep(1500); 
      }
      
      if (isOperationActive.current) {
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMessage(`Bulk process failed: ${err.message}`);
    } finally {
      resetSystemState();
    }
  };

  const startSinglePath = async () => {
    if (!topic.trim() || isBusy) return;
    setErrorMessage(null);
    setIsBusy(true);
    isOperationActive.current = true;
    setBulkProgress({ current: 1, total: 1 });

    try {
      await executeCourseGeneration(topic);
      if (isOperationActive.current) {
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMessage(`Generation failed: ${err.message}`);
    } finally {
      resetSystemState();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in duration-500">
      {/* 
          OVERLAY LOGIC: 
          - Managed by 'isBusy'
          - Higher Z-Index (z-[1000])
          - Halt button resets the operation ref to break loops
      */}
      {isBusy && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-10 overflow-hidden text-white">
          <div className="relative mb-12">
            <div className="w-32 h-32 border-8 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 w-32 h-32 border-8 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-4xl">🏗️</div>
          </div>

          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-center mb-2 bg-gradient-to-r from-indigo-400 to-white bg-clip-text text-transparent">
            {bulkProgress.total > 1 ? 'Global Catalog Deployment' : 'Architecting Track'}
          </h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] mb-12">
            Targeting: {currentCourseName || 'System Root'}
          </p>

          <div className="w-full max-w-md space-y-8 text-center">
            <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-3xl text-indigo-400 font-black text-xs uppercase tracking-widest shadow-2xl">
              {statusMessage}
            </div>

            <div className="space-y-4">
              <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_20px_rgba(99,102,241,0.6)]" 
                  style={{ width: `${(draftProgress.current / (draftProgress.total || 1)) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Injecting Unit {draftProgress.current} / {draftProgress.total}</span>
                <span>{Math.round((draftProgress.current / (draftProgress.total || 1)) * 100)}% Path Data</span>
              </div>
            </div>

            {bulkProgress.total > 1 && (
              <div className="pt-8 border-t border-white/5 flex justify-between items-center px-2">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  Progress: {bulkProgress.current} of {bulkProgress.total} Courses
                </p>
                <div className="flex gap-1.5">
                  {Array.from({ length: bulkProgress.total }).map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i < bulkProgress.current ? 'bg-indigo-500' : 'bg-white/10'}`}></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleAbort} 
            className="mt-20 px-12 py-5 bg-rose-600/10 border-2 border-rose-600/20 text-rose-500 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-rose-600 hover:text-white transition-all active:scale-95 shadow-xl"
          >
            Halt Deployment
          </button>
        </div>
      )}

      <header className="text-center space-y-6 flex flex-col items-center">
        <div className="p-4 bg-white rounded-[2rem] shadow-xl mb-2">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfAo_vinwmvZoyER2jOBXcta82wntkUlhiqNCIFFHtJg&s=10" className="w-24 h-auto" alt="Tallman LMS Logo" />
        </div>
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Tallman LMS Architect</h1>
        <p className="text-slate-400 font-bold text-xl max-w-2xl mx-auto">Generate industrial-grade technical tracks with recursive manual generation and validation quizzes.</p>
      </header>

      {errorMessage && (
        <div className="p-10 bg-rose-50 border-4 border-rose-100 text-rose-600 rounded-[3rem] font-black uppercase text-xs tracking-widest flex justify-between items-center animate-shake">
          <div className="flex items-center gap-6">
            <span className="text-4xl">⚠️</span>
            <div>
              <p className="opacity-50 mb-1">Architect Error</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
          <button onClick={() => setErrorMessage(null)} className="px-6 py-3 bg-white border border-rose-200 rounded-2xl hover:bg-rose-100 transition-all">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white p-12 rounded-[4rem] border-2 border-slate-100 shadow-2xl space-y-12">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Architect Custom Topic</label>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                placeholder="e.g. Dielectric Bench Safety" 
                className="flex-1 px-10 py-6 rounded-[2.5rem] bg-slate-50 border-2 border-transparent outline-none focus:border-indigo-600 text-xl font-bold shadow-inner"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isBusy}
              />
              <button 
                onClick={startSinglePath}
                disabled={!topic.trim() || isBusy}
                className="px-12 py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 disabled:opacity-20 hover:bg-slate-900 transition-all active:scale-95"
              >
                Architect Track
              </button>
            </div>
          </div>

          <div className="pt-12 border-t">
            <div className="flex justify-between items-end mb-8 px-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Catalog</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Bootstrap Master Library</h3>
              </div>
              <button 
                onClick={startBulkBootstrap}
                disabled={isBusy}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 shadow-xl transition-all disabled:opacity-20"
              >
                🚀 Launch Global Bootstrap
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BOOTSTRAP_TOPICS.map((t, i) => (
                <div 
                  key={i} 
                  className="p-6 rounded-3xl border-2 border-slate-50 bg-slate-50/20 flex justify-between items-center group hover:border-indigo-100 transition-all"
                >
                  <p className="font-black text-slate-700">{t}</p>
                  <span className="text-xs bg-white px-3 py-1 rounded-lg text-slate-400 font-bold border">20 Units</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="text-center py-10 opacity-30 text-[10px] font-black uppercase tracking-[0.5em]">
        Tallman LMS Industrial Intelligence
      </footer>
    </div>
  );
};

export default AdminCourseCreator;
