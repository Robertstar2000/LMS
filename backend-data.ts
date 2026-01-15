import { User, UserRole, Course, CourseStatus, Enrollment, Badge, Module, Branch, Category, ForumPost } from './types';

export const INITIAL_USERS: User[] = [
  {
    user_id: 'user_01_hq',
    display_name: 'Richard Tallman',
    email: 'rick.tallman@tallmanequipment.com',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    roles: [UserRole.ADMIN, UserRole.LEARNER],
    points: 1250,
    level: 5,
    branch_id: 'br_addison',
    department: 'Operations',
    last_login: new Date().toISOString(),
    password: 'password123'
  },
  {
    user_id: 'sa_bob_01',
    display_name: 'Robert Star',
    email: 'robertstar@aol.com',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    roles: [UserRole.ADMIN, UserRole.LEARNER],
    points: 9999,
    level: 99,
    branch_id: 'br_mcr',
    password: 'password123'
  }
];

export const INITIAL_BRANCHES: Branch[] = [
  { branch_id: 'br_addison', name: 'Tallman-Addison', primary_color: '#4f46e5', domain: 'addison.tallmanlms.com' },
  { branch_id: 'br_columbus', name: 'Tallman-Columbus', primary_color: '#059669', domain: 'columbus.tallmanlms.com' },
  { branch_id: 'br_lakecity', name: 'Tallman-Lake City', primary_color: '#dc2626', domain: 'lakecity.tallmanlms.com' },
  { branch_id: 'br_mcr', name: 'MCR Core', primary_color: '#7c3aed', domain: 'mcr.tallmanlms.com' },
  { branch_id: 'br_bradley', name: 'Bradley', primary_color: '#ea580c', domain: 'bradley.tallmanlms.com' }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'tech', name: 'Engineering & Tech', icon: '🛠️' },
  { id: 'business', name: 'Strategy & Leadership', icon: '📊' },
  { id: 'safety', name: 'Health & Safety', icon: '🛡️' },
  { id: 'compliance', name: 'Regulatory', icon: '⚖️' }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  { 
    id: 'p1', 
    author_name: 'Richard Tallman', 
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop', 
    title: 'ASTM D120 Updates for 2025', 
    content: 'All dielectric lab technicians should review the revised ozone resistance thresholds for Class 2 sleeves before the next audit.', 
    category: 'Engineering & Tech', 
    replies: 4, 
    is_pinned: true, 
    timestamp: '1h ago' 
  }
];

const generateIndustrialManual = (unit: string) => `
# TECHNICAL MANUAL: ${unit.toUpperCase()}
## TALLMAN ENTERPRISE SOP 2024-T-01

### 1. INDUSTRIAL SCOPE
This technical manual establishes the standard operating procedure for **${unit}**. This SOP is grounded in ANSI, ASTM, and OSHA regulatory frameworks as applied by Tallman Equipment Co.

### 2. PRIMARY SYSTEM INTEGRATION
*   **ERP Core**: All physical asset movements must be logged in **Epicor P21**.
*   **Production**: Custom machined components are verified via **Bradley Machining** tolerances.
*   **Tooling**: Exclusively utilize **DDIN** certified rigging and pulling hardware.

### 3. OPERATIONAL STEPS
1.  **Asset Identification**: Query P21 Item Maintenance for the serialized record.
2.  **Safety Verification**: Audit ASTM/ANSI compliance stickers for expiration.
3.  **Procedure Execution**: Perform the specific technical task for ${unit}.
4.  **Audit**: Perform secondary visual scrutiny for mechanical or dielectric fatigue.
5.  **Certification**: Apply the 'Tested & Ready' serialized tag and update P21.

### 4. SPECIFICATIONS
| METRIC | RATING | TOLERANCE |
| :--- | :--- | :--- |
| Mechanical Load | 5,000 LBS | +/- 0.5% |
| System Latency | < 2 Secs | N/A |
| Material Grade | Bradley CNC | Aerospace |

*Note: Precision is the identity of Tallman Equipment Co.*
`;

const createIndustrialTrack = (courseId: string, courseName: string, units: string[]): Module[] => {
  return units.map((title, i) => ({
    module_id: `m_${courseId}_${i}`,
    course_id: courseId,
    module_title: title,
    position: i,
    lessons: [
      {
        lesson_id: `l_${courseId}_${i}_doc`,
        module_id: `m_${courseId}_${i}`,
        lesson_title: `${title}: Technical Manual`,
        lesson_type: 'document',
        duration_minutes: 45,
        content: generateIndustrialManual(title)
      },
      {
        lesson_id: `l_${courseId}_${i}_quiz`,
        module_id: `m_${courseId}_${i}`,
        lesson_title: `${title}: Safety Audit`,
        lesson_type: 'quiz',
        duration_minutes: 15,
        quiz_questions: [
          { question: `Which ERP system is the record of truth for ${title}?`, options: ["Epicor P21", "Excel", "Legacy Paper", "Oracle"], correctIndex: 0 },
          { question: `What is the mandated brand for utility pulling hardware?`, options: ["DDIN", "Generic", "Imported", "Local"], correctIndex: 0 },
          { question: `Who is our primary CNC manufacturing partner?`, options: ["Bradley Machining", "Addison Fab", "Global Steel", "Internal"], correctIndex: 0 }
        ]
      }
    ]
  }));
};

export const INITIAL_COURSES: Course[] = [
  {
    course_id: 'c_leadership',
    course_name: 'Executive Strategic Leadership',
    short_description: 'Industrial governance, P&L architecture, and technical stewardship for Tallman directors.',
    thumbnail_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
    category_id: 'business',
    instructor_id: 'inst_01',
    status: CourseStatus.PUBLISHED,
    enrolled_count: 85,
    rating: 4.9,
    difficulty: 'Advanced',
    modules: createIndustrialTrack('c_leadership', 'Leadership', [
      "Stewardship of Employee Ownership", "P21 ERP Financial Oversight", "Branch P&L Architecture", "NFPA 70E Safety Governance"
    ])
  },
  {
    course_id: 'c_sales_rental',
    course_name: 'Power Utility Sales & Rental Techniques',
    short_description: 'Advanced methodologies for selling and renting tools to Power Utilities and their contractors.',
    thumbnail_url: 'https://images.unsplash.com/photo-1590483734724-383b85ad0590?q=80&w=2070&auto=format&fit=crop',
    category_id: 'business',
    instructor_id: 'inst_01',
    status: CourseStatus.PUBLISHED,
    enrolled_count: 42,
    rating: 5.0,
    difficulty: 'Advanced',
    modules: createIndustrialTrack('c_sales_rental', 'Sales/Rental', [
      "Contractor Procurement Logic", "Utility Equipment Rental Cycles", "DDIN Value Proposition", "Epicor P21 Sales Flow"
    ])
  },
  {
    course_id: 'c_logistics',
    course_name: 'Distribution Warehouse Management',
    short_description: 'Mastery of industrial inventory management, shipping/receiving logistics, and hub operations.',
    thumbnail_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop',
    category_id: 'tech',
    instructor_id: 'inst_01',
    status: CourseStatus.PUBLISHED,
    enrolled_count: 56,
    rating: 4.7,
    difficulty: 'Intermediate',
    modules: createIndustrialTrack('c_logistics', 'Warehouse', [
      "Serialized Asset Control", "P21 Inventory Adjustment SOP", "Hazardous Materials Logistics", "Branch Transfer Workflows"
    ])
  },
  {
    course_id: 'c_rope',
    course_name: 'Lineman Rigging & Rope Science',
    short_description: 'Mechanical load dynamics, splicing SOPs, and DDIN high-strength rigging physics.',
    thumbnail_url: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798156?q=80&w=2088&auto=format&fit=crop',
    category_id: 'tech',
    instructor_id: 'inst_01',
    status: CourseStatus.PUBLISHED,
    enrolled_count: 142,
    rating: 5.0,
    difficulty: 'Advanced',
    modules: createIndustrialTrack('c_rope', 'Rigging', [
      "Synthetic Fiber Physics", "HMPE vs Polyester Dynamics", "12-Strand Eye Splicing SOP"
    ])
  },
  {
    course_id: 'c_testing',
    course_name: 'High Voltage Dielectric Testing',
    short_description: 'ASTM D120 compliance, bench mechanics, and safety threshold auditing for rubber goods.',
    thumbnail_url: 'https://images.unsplash.com/photo-1533560271397-6a56f082e666?q=80&w=2070&auto=format&fit=crop',
    category_id: 'tech',
    instructor_id: 'inst_01',
    status: CourseStatus.PUBLISHED,
    enrolled_count: 215,
    rating: 4.8,
    difficulty: 'Advanced',
    modules: createIndustrialTrack('c_testing', 'Testing', [
      "Dielectric Bench Isolation", "ASTM D120 Class Standards", "Ozone Cracking Pinch Test"
    ])
  }
];

export const INITIAL_BADGES: Badge[] = [
  { badge_id: 'b1', badge_name: 'Safety Vanguard', badge_image_url: '🛡️', criteria: 'Complete the HV Core' }
];