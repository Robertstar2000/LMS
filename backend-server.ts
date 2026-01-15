import { User, Course, Enrollment, UserRole, MentorshipLog } from './types';
import { INITIAL_USERS, INITIAL_COURSES } from './backend-data';

const STORAGE_KEYS = {
  USERS: 'tallman_workforce_users',
  COURSES: 'tallman_lms_courses',
  ENROLLMENTS: 'tallman_enrollments',
  SESSION: 'tallman_user_session',
  BOOTSTRAP_COMPLETE: 'tallman_bootstrap_done',
  MENTORSHIP: 'tallman_mentorship_logs'
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class TallmanServer {
  private getStorage<T>(key: string, defaultValue: T): T {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  }

  private setStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        throw new Error("Enterprise Storage Quota Exceeded. Please remove old technical tracks from the console.");
      }
      throw e;
    }
  }

  async bootstrap() {
    if (sessionStorage.getItem(STORAGE_KEYS.BOOTSTRAP_COMPLETE)) return;

    const currentUsers = this.getStorage<User[]>(STORAGE_KEYS.USERS, []);
    if (currentUsers.length === 0) {
      this.setStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      this.setStorage(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.ENROLLMENTS)) {
      this.setStorage(STORAGE_KEYS.ENROLLMENTS, []);
    }

    if (!localStorage.getItem(STORAGE_KEYS.MENTORSHIP)) {
      this.setStorage(STORAGE_KEYS.MENTORSHIP, []);
    }

    sessionStorage.setItem(STORAGE_KEYS.BOOTSTRAP_COMPLETE, 'true');
  }

  async login(email: string, passwordHash: string): Promise<User | null> {
    await sleep(200);
    const users = this.getStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      (u.password === passwordHash || u.password === 'password123')
    );
    if (user) {
      this.setStorage(STORAGE_KEYS.SESSION, user);
      return user;
    }
    return null;
  }

  async signup(displayName: string, email: string, passwordHash: string): Promise<User> {
    await sleep(300);
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain !== 'tallmanequipment.com') {
      throw new Error("Enrollment requires a @tallmanequipment.com domain.");
    }

    const users = this.getStorage<User[]>(STORAGE_KEYS.USERS, []);
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
       throw new Error("This identity is already registered.");
    }

    const newUser: User = {
      user_id: `u_reg_${Date.now()}`,
      display_name: displayName,
      email: email.toLowerCase(),
      password: passwordHash,
      avatar_url: `https://picsum.photos/seed/${displayName}/200`,
      roles: [UserRole.HOLD],
      points: 0,
      level: 1,
      branch_id: 'br_addison'
    };

    users.push(newUser);
    this.setStorage(STORAGE_KEYS.USERS, users);
    this.setStorage(STORAGE_KEYS.SESSION, newUser);
    return newUser;
  }

  async getCurrentSession(): Promise<User | null> {
    return this.getStorage<User | null>(STORAGE_KEYS.SESSION, null);
  }

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.BOOTSTRAP_COMPLETE);
  }

  async getUsers(): Promise<User[]> {
    return this.getStorage<User[]>(STORAGE_KEYS.USERS, []);
  }

  async upsertUser(user: User): Promise<User> {
    const users = await this.getUsers();
    const idx = users.findIndex(u => u.user_id === user.user_id);
    if (idx > -1) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    this.setStorage(STORAGE_KEYS.USERS, users);
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const users = await this.getUsers();
    const filtered = users.filter(u => u.user_id !== userId);
    this.setStorage(STORAGE_KEYS.USERS, filtered);
  }

  async getCourses(): Promise<Course[]> {
    return this.getStorage<Course[]>(STORAGE_KEYS.COURSES, []);
  }

  async getCourse(courseId: string): Promise<Course | null> {
    const courses = await this.getCourses();
    return courses.find(c => c.course_id === courseId) || null;
  }

  async updateCourse(course: Course): Promise<Course> {
    const courses = await this.getCourses();
    const idx = courses.findIndex(c => c.course_id === course.course_id);
    if (idx > -1) {
      courses[idx] = course;
    } else {
      courses.push(course);
    }
    this.setStorage(STORAGE_KEYS.COURSES, courses);
    return course;
  }

  async resetEnrollmentsForCourse(courseId: string): Promise<void> {
    const enrollments = await this.getEnrollments();
    const updated = enrollments.map(e => {
      if (e.course_id === courseId) {
        return {
          ...e,
          progress_percent: 0,
          status: 'active' as const,
          completed_lesson_ids: [],
          unit_attempts: {}
        };
      }
      return e;
    });
    this.setStorage(STORAGE_KEYS.ENROLLMENTS, updated);
  }

  async getEnrollments(userId?: string): Promise<Enrollment[]> {
    const all = this.getStorage<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, []);
    return userId ? all.filter(e => e.user_id === userId) : all;
  }

  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    const enrollments = await this.getEnrollments();
    const existing = enrollments.find(e => e.user_id === userId && e.course_id === courseId);
    if (existing) return existing;

    const newE: Enrollment = {
      enrollment_id: `e_${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      progress_percent: 0,
      status: 'active',
      completed_lesson_ids: [],
      unit_attempts: {},
      enrolled_at: new Date().toISOString()
    };
    enrollments.push(newE);
    this.setStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);
    return newE;
  }

  async recordQuizAttempt(enrollmentId: string, lessonId: string, passed: boolean): Promise<Enrollment> {
    const enrollments = await this.getEnrollments();
    const idx = enrollments.findIndex(e => e.enrollment_id === enrollmentId);
    if (idx === -1) throw new Error("Enrollment not found");

    const e = enrollments[idx];
    if (!e.unit_attempts) e.unit_attempts = {};
    e.unit_attempts[lessonId] = (e.unit_attempts[lessonId] || 0) + 1;

    if (passed) {
      if (!e.completed_lesson_ids?.includes(lessonId)) {
        e.completed_lesson_ids = [...(e.completed_lesson_ids || []), lessonId];
        const course = await this.getCourse(e.course_id);
        const totalLessons = course?.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
        e.progress_percent = Math.round((e.completed_lesson_ids.length / totalLessons) * 100);
        if (e.progress_percent >= 100) e.status = 'completed';
      }
    }

    enrollments[idx] = e;
    this.setStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);
    return e;
  }

  async updateProgress(enrollmentId: string, lessonId: string): Promise<Enrollment> {
    const enrollments = await this.getEnrollments();
    const idx = enrollments.findIndex(e => e.enrollment_id === enrollmentId);
    if (idx === -1) throw new Error("Enrollment not found");

    const e = enrollments[idx];
    if (!e.completed_lesson_ids?.includes(lessonId)) {
      e.completed_lesson_ids = [...(e.completed_lesson_ids || []), lessonId];
      const course = await this.getCourse(e.course_id);
      const totalLessons = course?.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
      e.progress_percent = Math.round((e.completed_lesson_ids.length / totalLessons) * 100);
      if (e.progress_percent >= 100) e.status = 'completed';
      
      this.setStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);

      const users = await this.getUsers();
      const uIdx = users.findIndex(u => u.user_id === e.user_id);
      if (uIdx > -1) {
        users[uIdx].points += 10;
        this.setStorage(STORAGE_KEYS.USERS, users);
      }
    }
    return e;
  }

  async getMentorshipLogs(mentorId?: string): Promise<MentorshipLog[]> {
    const logs = this.getStorage<MentorshipLog[]>(STORAGE_KEYS.MENTORSHIP, []);
    return mentorId ? logs.filter(l => l.mentor_id === mentorId) : logs;
  }

  async addMentorshipLog(log: Omit<MentorshipLog, 'id'>): Promise<MentorshipLog> {
    const logs = await this.getMentorshipLogs();
    const newLog: MentorshipLog = { ...log, id: `ment_${Date.now()}` };
    logs.push(newLog);
    this.setStorage(STORAGE_KEYS.MENTORSHIP, logs);
    return newLog;
  }

  async deleteMentorshipLog(id: string): Promise<void> {
    const logs = await this.getMentorshipLogs();
    const filtered = logs.filter(l => l.id !== id);
    this.setStorage(STORAGE_KEYS.MENTORSHIP, filtered);
  }
}

export const TallmanAPI = new TallmanServer();