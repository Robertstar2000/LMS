
import { User, UserRole, Course, CourseStatus, Enrollment, Badge, Module, Lesson, Certificate } from './types';

export const currentUser: User = {
  user_id: '1',
  display_name: 'Rick',
  email: 'rick@tallmanlms.com',
  avatar_url: 'https://picsum.photos/seed/rick/200',
  role: UserRole.LEARNER,
  points: 1250,
  level: 5
};

const technicalTopics: Record<string, string[]> = {
  'c2': ['Team Psychology', 'Strategic Mapping', 'Conflict Resolution', 'Executive Presence', 'Crisis Management', 'Agile Governance', 'Boardroom Dynamics', 'Resource Scaling', 'Performance Frameworks', 'Culture Engineering', 'Succession Planning', 'Global Operations', 'Regulatory Navigation', 'Change Management', 'Data-Driven Leadership', 'Public Relations for Execs', 'FinOps for Leaders', 'Ethics in Scale', 'Venture Partnerships', 'The Legacy Framework'],
  'c4': ['ERP Architecture', 'Order Management Flow', 'Inventory Valuations', 'Rubbertree Analytics', 'CRM Integration', 'Wholesale Pricing Engine', 'Warehouse Automation', 'EDI Protocols', 'Purchasing Logic', 'Accounts Receivable Sync', 'General Ledger Mapping', 'Shipping Manifests', 'Custom Reporting', 'Mobile Sales Access', 'Security Permissions', 'Data Cleansing', 'API Hook Setup', 'Batch Processing', 'End-of-Month Procedures', 'System Disaster Recovery'],
  'c5': ['The Utility Lifecycle', 'IOU vs. Co-op Models', 'Procurement Bidding', 'Tool Rental Economics', 'Fleet Maintenance ROI', 'Storm Response Logistics', 'Contractor Management', 'Dielectric Testing Compliance', 'Inventory Consignment', 'Public Utility Commissions', 'Emergency Sourcing', 'Capital Expenditure Planning', 'Operational Resilience', 'Safety Equipment Sales', 'Green Energy Shifts', 'Transmission Grid Sales', 'Substation Components', 'Regional Hub Strategies', 'Asset Lifecycle Tracking', 'Relationship Retention'],
  'c6': ['Fiber Polymer Science', 'Twist vs. Braid Geometry', 'Tensile Strength Testing', 'Dielectric Properties', 'Eye Splicing Techniques', 'Short Splice Repair', 'Load Rating Standards', 'UV and Chemical Degradation', 'Sheave and Pulley Interaction', 'Dynamic Shock Loading', 'Retirement Criteria', 'Polyester pull lines', 'HMPE High-Strength Lines', 'Double-Braid Stability', 'Friction Coefficients', 'Moisture Absorption', 'Lineman Rigging Geometry', 'Heavy Winch Operations', 'Tension Stringing', 'Splicing Certification'],
  'c7': ['Dielectric Bench Setup', 'AC vs DC Testing Methods', 'ASTM D120 Standards', 'Ozone Cracking Analysis', 'Cleaning and Care Protocols', 'Visual Inspection Mastery', 'Leakage Current Thresholds', 'Sleeve Testing Jigs', 'Hot Stick Insulation', 'Grounding Set Verification', 'Mobile Lab Operations', 'Safety Record Keeping', 'Calibration Schedules', 'Protective Leather Over-gloves', 'Environmental Test Factors', 'High Voltage Safety Zones', 'Emergency Test Failure Protocols', 'Certification Cycles', 'PPE Lifecycle Management', 'Zero Incident Culture']
};

const createModules = (courseId: string, baseTitle: string, count: number): Module[] => {
  const topics = technicalTopics[courseId] || Array(count).fill('General Module');
  return topics.map((topic, i) => ({
    module_id: `m-${courseId}-${i}`,
    course_id: courseId,
    module_title: `${topic}`,
    position: i,
    lessons: [
      {
        lesson_id: `l-${courseId}-${i}-1`,
        module_id: `m-${courseId}-${i}`,
        lesson_title: `${topic}: Deep Dive`,
        lesson_type: 'document',
        duration_minutes: 25,
        content: `Awaiting verbose AI generation for ${topic}. This lesson will cover accurate technical standards and field-relevant application guidelines.`
      },
      {
        lesson_id: `l-${courseId}-${i}-2`,
        module_id: `m-${courseId}-${i}`,
        lesson_title: `${topic}: Assessment`,
        lesson_type: 'quiz',
        duration_minutes: 15,
        quiz_questions: [
          { question: `What is the primary technical consideration for ${topic}?`, options: ["Compliance", "Speed", "Cost", "Aesthetics"], correctIndex: 0 }
        ]
      }
    ]
  }));
};

export const mockCourses: Course[] = [
  { course_id: 'c2', course_name: 'Strategic Leadership 101', short_description: 'High-performing teams and corporate navigation.', thumbnail_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop', category_id: 'business', instructor_id: 'u11', status: CourseStatus.PUBLISHED, enrolled_count: 850, rating: 4.9, modules: createModules('c2', 'Leadership', 20) },
  { course_id: 'c4', course_name: 'Using Epicore P21 and Rubbertree', short_description: 'ERP and sales analytics for distribution.', thumbnail_url: 'https://picsum.photos/seed/erp/600/400', category_id: 'tech', instructor_id: 'u13', status: CourseStatus.PUBLISHED, enrolled_count: 320, rating: 4.6, modules: createModules('c4', 'P21', 20) },
  { course_id: 'c5', course_name: 'Selling and Renting tools to Power Utilities', short_description: 'Specialized sales cycles for the utility sector.', thumbnail_url: 'https://picsum.photos/seed/utility/600/400', category_id: 'business', instructor_id: 'u14', status: CourseStatus.PUBLISHED, enrolled_count: 450, rating: 4.9, modules: createModules('c5', 'Utility Sales', 20) },
  { course_id: 'c6', course_name: 'Everything about ropes used by linemen', short_description: 'Materials, load ratings, and splicing for line work.', thumbnail_url: 'https://picsum.photos/seed/rope/600/400', category_id: 'tech', instructor_id: 'u15', status: CourseStatus.PUBLISHED, enrolled_count: 1500, rating: 5.0, modules: createModules('c6', 'Rigging', 20) },
  { course_id: 'c7', course_name: 'High voltage testing of gloves, sleeves and poles', short_description: 'Safety procedures for dielectric testing.', thumbnail_url: 'https://picsum.photos/seed/voltage/600/400', category_id: 'tech', instructor_id: 'u16', status: CourseStatus.PUBLISHED, enrolled_count: 980, rating: 4.8, modules: createModules('c7', 'HV Testing', 20) }
];

// Added enrolled_at to satisfying Enrollment type constraints (Fixes lines 61, 62, 63)
export const mockEnrollments: Enrollment[] = [
  { enrollment_id: 'e2', user_id: '1', course_id: 'c2', progress_percent: 15, status: 'active', completed_lesson_ids: ['l-c2-0-1', 'l-c2-0-2', 'l-c2-1-1'], enrolled_at: '2024-01-01' },
  { enrollment_id: 'e3', user_id: '1', course_id: 'c6', progress_percent: 5, status: 'active', completed_lesson_ids: ['l-c6-0-1'], enrolled_at: '2024-01-01' },
  { enrollment_id: 'e7', user_id: '1', course_id: 'c7', progress_percent: 100, status: 'completed', completed_lesson_ids: Array.from({length: 40}, (_, i) => `l-c7-${Math.floor(i/2)}-${(i%2)+1}`), enrolled_at: '2024-01-01' }
];

export const mockBadges: Badge[] = [
  { badge_id: 'b1', badge_name: 'Safety Certified', badge_image_url: '⚡', criteria: 'Complete the HV Testing Core' }
];

export const mockCertificates: Certificate[] = [
  {
    certificate_id: 'CERT-7721-X',
    user_id: '1',
    course_id: 'c7',
    course_name: 'High voltage testing of gloves, sleeves and poles',
    completion_date: 'Oct 15, 2023',
    issuer: 'Tallman LMS Training Authority'
  }
];
