import { User, UserRole, Course, CourseStatus, Enrollment, Badge, Module, Lesson, Certificate, Branch, Category, ForumPost } from './types';

export const currentUser: User = {
  user_id: 'user_01_hq',
  display_name: 'Richard Tallman',
  email: 'rick.tallman@enterprise.com',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
  role: UserRole.LEARNER,
  points: 1250,
  level: 5,
  branch_id: 'br_addison',
  department: 'Operations',
  last_login: '2024-05-15T10:30:00Z'
};

export const branches: Branch[] = [
  { branch_id: 'br_addison', name: 'Tallman-Addison', primary_color: '#4f46e5', domain: 'addison.tallmanlms.com' },
  { branch_id: 'br_columbus', name: 'Tallman-Columbus', primary_color: '#059669', domain: 'columbus.tallmanlms.com' },
  { branch_id: 'br_lakecity', name: 'Tallman-Lake City', primary_color: '#dc2626', domain: 'lakecity.tallmanlms.com' },
  { branch_id: 'br_mcr', name: 'MCR Core', primary_color: '#7c3aed', domain: 'mcr.tallmanlms.com' },
  { branch_id: 'br_bradley', name: 'Bradley', primary_color: '#ea580c', domain: 'bradley.tallmanlms.com' }
];

export const categories: Category[] = [
  { id: 'tech', name: 'Engineering & Tech', icon: '🛠️' },
  { id: 'business', name: 'Strategy & Leadership', icon: '📊' },
  { id: 'safety', name: 'Health & Safety', icon: '🛡️' },
  { id: 'compliance', name: 'Regulatory', icon: '⚖️' }
];

export const forumPosts: ForumPost[] = [
  { id: 'p1', author_name: 'Sarah Miller', author_avatar: 'https://picsum.photos/seed/sarah/50', title: 'New Dielectric Bench Standards 2024', content: 'Has anyone reviewed the updated OSHA requirements for bench testing high-voltage sleeves?', category: 'Engineering & Tech', replies: 12, is_pinned: true, timestamp: '2h ago' }
];

export const BOOTSTRAP_TOPICS = [
  "Executive Strategic Leadership",
  "Lineman Rigging & Rope Science",
  "Warehouse Management",
  "Testing linemen poles, gloves and sleeves",
  "Selling to power utilities and their contractors"
];

const TECHNICAL_DATA: Record<string, { titles: string[], details: string[], quizzes: {q: string, a: string[]}[] }> = {
  'c_leadership': {
    titles: [
      'Industrial Governance & Branch P&L', 'Labor Safety Stewardship Protocols', 'Storm Response Mobilization Strategy', 
      'MCR Business Intelligence & Sales Gaps', 'Bradley Machining Production Synergy', 'Executive Crisis Management', 
      'Operational Frameworks for Distribution', 'Workforce Technical Proficiency Mapping', 'Succession of Dielectric Mastery', 
      'Hub-and-Spoke Logistics Optimization', 'Regulatory Navigation (OSHA/ASTM)', 'ERP Governance: P21 Data Integrity', 
      'Capital Asset Stewardship (DDIN Fleet)', 'Utility Brand Integrity Management', 'Network Security for Field Operations', 
      'Technical Integrity & Anti-Corruption', 'Investor-Owned Utility (IOU) MSA Logic', 'Data-Driven Branch Performance', 
      'Infrastructure Resilience Planning', 'The Tallman Century Legacy'
    ],
    details: [
      'Financial architecture of multi-branch industrial operations. Advanced P&L balancing and labor forecasting.',
      'Governance of technical safety environments. Implementing zero-fault dielectric lab protocols.',
      'Logistics blueprints for emergency mobilization. Critical stock prepositioning for utility contractors.',
      'MCR analytics deep-dive. Identifying PPE penetration gaps in IOU territories using Rubbertree.',
      'Internal supply chain optimization. Utilizing Bradley Machining CNC capacity for stock emergency response.',
      'Governance of operational failures. Strategy for maintaining service levels during infrastructure outages.',
      'Standardization of SOPs across the Tallman hub-and-spoke model. ERP-level management controls.',
      'Workforce proficiency auditing. Mapping technical certifications to high-stakes project eligibility.',
      'Technical leadership in the dielectric lab. Maintaining ASTM certification dominance through training.',
      'Optimization of heavy-equipment transport. Calculating fuel/labor/transit ratios for DDIN deliveries.',
      'Leadership in regulatory compliance. Transitioning OSHA requirements into profitable service standards.',
      'Governance of the P21 database. Integrity of the master item record and bin-location accuracy.',
      'Strategic lifecycle management of the DDIN rental fleet. Depreciation and utilization metrics.',
      'Corporate brand technicality. Ensuring brand identity matches engineering precision in the field.',
      'Industrial cybersecurity. Hardening P21 endpoints and field-sales mobile access points.',
      'Ethical oversight of safety testing. Separating sales incentives from dielectric lab failure mandates.',
      'Bidding and contract logic for Utility Master Service Agreements (MSAs). Technical auditing.',
      'Branch performance auditing. Using the Return on Safety (ROS) index to drive executive decisions.',
      // Fix: Removed syntax typo '[' and escaped the possessive single quote to resolve identifier errors on lines like 74
      'Grid hardening strategy. Positioning Tallman\'s role in utility grid hardening.',
      'Institutional legacy. Scaling the Tallman industrial vision via 21st-century technical mastery.'
    ],
    quizzes: [
      { q: "What is the primary driver of Branch P&L success at Tallman?", a: ["Inventory Velocity & Labor Allocation", "Publicity", "Social Reach", "Flat Pricing"] },
      { q: "How does MCR Intelligence support sales leadership?", a: ["Gap analysis in PPE procurement", "Hardware repair", "HR management", "Marketing design"] }
    ]
  },
  'c_rope': {
    titles: [
      'Mechanical Dynamics of Synthetic Fibers', 'Geometry of Braided Winch Lines', 'Hydraulic Tensile Testing SOPs', 
      'Winch Drum Spooling Physics', '12-Strand Eye Splicing: Type II Standards', 'Short Splice Structural Restoration', 
      'DDIN High-Strength Line Specifications', 'Visual Defect & Abrasion Physics', 'Sheave D:d Ratio Mechanics', 
      'Shock Loading Physics & Multipliers', 'Winch Line Retirement Criteria', 'Polyester Precision Pulling Science', 
      'HMPE (High Modulus) Load Handling', 'Cover-Core Synchronization (Milking)', 'Friction Coefficients in Rigging', 
      'Environmental Degradation Mapping', 'Rigging Geometry: Angular Stress', 'Custom Winch Line Tagging SOP', 
      'Tension Stringing Hardware Logic', 'Master Splicer Certification'
    ],
    details: [
      'Stress analysis of HMPE and Polyester fibers. Mechanical response to axial loading and cyclic tension.',
      'Braid geometry for torque neutrality. Geometry of 8-strand versus 12-strand industrial lines.',
      'Hydraulic pull-tester calibration. Monitoring breaking patterns in high-strength winch lines.',
      'Drum spooling mechanics. Calculating fleet angles and layering tension to prevent burying.',
      'Technical eye splicing for Type II fibers. Bury-length calculations for maximum WLL retention.',
      'Structural boundaries for mechanical repairs. Splicing logic for non-critical pulling lines.',
      'DDIN armor coatings. Abrasion resistance for urban underground utility pulls.',
      'Microscopic analysis of fiber fracture. Distinguishing abrasion from molecular snap.',
      'Pulley physics. Calculating thermal degradation thresholds based on sheave diameter.',
      'Dynamic force calculation. The physics of instant load-tension multipliers in the field.',
      'The "Red Core" retirement system. Physical standards for asset destruction of compromised ropes.',
      'Low-stretch fiber application. Precision positioning for substation transformer placement.',
      'HMPE (High Modulus Polyethylene) creep analysis. Sustained load handling for 20-ton lifts.',
      'Double-braid stability. Remediating core/jacket misalignment in capstan operations.',
      'Mechanical friction coefficients. Calculating wraps for controlled descent on capstan hoists.',
      'Mapping molecular bond breakdown from UV exposure and industrial chemical contact.',
      'Angular vector analysis for rigging. Calculating sling stress based on lift geometry.',
      'Serialization of technical winch lines. P21 data linkage and tagging SOPs.',
      'Tension stringing mechanics. Minimizing rope heat during multi-mile utility pulls.',
      'Master certification audit. Full-scale tensile testing of user-generated technical splices.'
    ],
    quizzes: [
      { q: "What happens to rope tension at a 30-degree rigging angle?", a: ["It effectively doubles", "It stays same", "It disappears", "It halves"] },
      { q: "What is the industry standard D:d ratio for industrial sheaves?", a: ["20:1", "5:1", "10:1", "2:1"] }
    ]
  },
  'c_warehouse': {
    titles: [
      'P21 Item Maintenance Architecture', 'The Order-to-Cash Workflow (P21)', 'Inventory Valuation: FIFO vs LIFO', 
      'Rubbertree Data Mining & Analytics', 'CRM-Warehouse Sync Protocols', 'Matrix Pricing Leakage Prevention', 
      'Handheld Scanner Automation SOPs', 'EDI Vendor Replenishment (DDIN)', 'Economic Order Quantity Algorithms', 
      'Accounts Receivable (AR) Monitoring', 'General Ledger Account Mapping', 'ASTM Shipping Manifest SOPs', 
      'Custom SQL Reporting in P21', 'Mobile P21 Access Security', 'Role-Based Access Control (RBAC)', 
      'Database De-duplication Logic', 'Sync Latency Optimization', 'Nightly Batch Processing Audit', 
      'Cycle Count Precision (Addison)', 'P21 Disaster Recovery Readiness'
    ],
    details: [
      'Database field governance in Epicor P21. Mastering Category, UOM, and Weight master data.',
      'Order orchestration from entry to fulfillment. Eliminating manual touchpoints for 100% accuracy.',
      // Fix: Removed syntax typo '[' and escaped the possessive single quote to resolve identifier errors on lines like 132
      'Inventory valuation models. Impact of LIFO/FIFO on Tallman\'s fiscal reporting.',
      'Rubbertree data mining & analytics. Using Rubbertree to trigger replenishment and sales calls.',
      'Technical communication protocols between field sales and warehouse dispatch.',
      'Protecting corporate margins. Auditing P21 pricing matrices to prevent override leakage.',
      'Industrial scanning SOPs for the Addison hub. Double-blind validation logic.',
      'Automating DDIN tool replenishment via Electronic Data Interchange (EDI) protocols.',
      'EOQ math. Calculating the carrying cost of heavy reels versus the cost of stock-outs.',
      'Risk management. Real-time AR auditing for electrical contractor accounts.',
      'Mapping warehouse operational transactions to the corporate General Ledger (GL).',
      'Manifest compliance. Automating ASTM test dates on every outbound packing slip.',
      'Custom SQL query design for branch managers. Identifying "Dead Stock" (180+ days).',
      'Securing P21 field nodes. Encryption and remote data-wipe protocols for field agents.',
      'RBAC Security Maintenance. Granular permissions for warehouse and lab staff.',
      'Data integrity logic. Enforcing the Tallman Naming Convention to prevent duplicates.',
      'API latency monitoring. Ensuring the web shop and P21 sync within technical thresholds.',
      'Auditing the nightly batch log. Resolving hung tasks in the P21 General Ledger update.',
      'Daily rolling inventory audit SOP for the Addison and Columbus hubs.',
      'Manual override protocols for system outages. Maintaining warehouse operations offline.'
    ],
    quizzes: [
      { q: "What is the primary function of Matrix Pricing in P21?", a: ["Preventing margin leakage", "Increasing shipping speed", "Hiding costs", "Simplifying data entry"] },
      { q: "What is 'Dead Stock' in the Tallman P21 environment?", a: ["Inventory with no movement in 180 days", "Broken tools", "Items on hold", "Unpaid inventory"] }
    ]
  },
  'c_testing': {
    titles: [
      'Dielectric Bench Engineering Specs', 'AC Stress vs DC Field Testing', 'ASTM D120 Compliance Mapping', 
      'Ozone Cracking: Pinch Test SOP', 'Non-Petroleum Cleaning Protocols', 'Visual Rolling Inspection Mastery', 
      'Leakage Current mA Thresholds', 'Sleeve Testing: Submerged Jigs', 'Hot Stick Fiberglass Wet/Dry Test', 
      'Grounding Set Resistance Check', 'Mobile Lab Logistics & Leveling', 'Digital Record Retention SOP', 
      'Calibration of HV Testers', 'Leather Over-glove Integrity', 'Environmental Test Factoring', 
      'HV Zone Interlock Protocols', 'Failure Clipping & Destruction', 'Recertification Cycle Automation', 
      'PPE Asset Tracking (Serialization)', 'Zero-Incident Testing Culture'
    ],
    details: [
      'Isolation and grounding engineering of the high-voltage dielectric bench.',
      'Comparative methodology. Why AC testing is the Tallman laboratory standard.',
      'Mapping ASTM rubber classes (0-4) to precise voltage breakdown thresholds.',
      'Identifying corona-induced micro-fractures in rubber cuffs and crotches.',
      'Chemical safety for polymers. Approved aqueous cleaners for industrial rubber.',
      'The "Roll Test" SOP. Using air-trapping to find sub-visual pinholes in gloves.',
      'Technical analysis of leakage current. Milliammeter calibration and fail-points.',
      'Sleeve testing geometry. Using submerged jigs for full-surface dielectric coverage.',
      'Hot stick dielectric checking. Wet/Dry testing for internal moisture tracking.',
      'Grounding set resistance. Calculating milliohms for 20kA fault capacity.',
      'Mobile lab deployment. Establishing safety perimeters and ground-potential zones.',
      'Data management in the Tallman Hub. Compliance with 3-year record retention.',
      'ISO-17025 verification of HV test apparatus and laboratory environment.',
      'Leather over-glove audit. Detecting metal contaminants that track electricity.',
      'Environmental variables. Factoring humidity into air-gap breakdown physics.',
      'Interlock governance. Safety gate and light-system verification before testing.',
      'Asset destruction SOP. Permanent cuff-clipping for all failed rubber units.',
      'P21-driven automation of the 6-month recertification reminder cycle.',
      'Technical life-cycle tracking. Permanent serialization of all tested safety assets.',
      'Human factor engineering in the lab. The "Stop Work" safety culture.'
    ],
    quizzes: [
      { q: "What is mandatory for a glove that fails a dielectric test?", a: ["The cuff must be physically clipped", "It is returned for repair", "It is marked with a label", "It is washed again"] },
      { q: "Which class of rubber glove is rated for 36,000V?", a: ["Class 4", "Class 0", "Class 2", "Class 1"] }
    ]
  },
  'c_selling': {
    titles: [
      'The Utility Procurement Cycle', 'Investor-Owned (IOU) Pitch Logic', 'RFP Precision Engineering', 
      'Total Cost of Ownership (TCO) ROI', 'Point of Rental (POR) Logistics', 'Storm Response Prospecting', 
      'Contractor "End-User" Loyalty', 'Safety Compliance as a Sale', 'Consignment Stock Strategy', 
      'Public Utility Commission Windows', 'Emergency Sourcing Agreements', 'Q4 Capital Expenditure Bidding', 
      'Grid Hardening Product Sales', 'Recurring PPE Subscription Revenue', 'Renewable Energy Rigging Pitch', 
      'Aging Infrastructure Replacement', 'Substation Critical Componentry', 'Logistics Hub Response Timing', 
      'Asset Management Consulting', 'Mud-to-Boardroom Relationships'
    ],
    details: [
      'Managing multi-year technical sales cycles with major utility procurement offices.',
      'Pitching IOU directors. Focusing on liability reduction and operational uptime.',
      'Engineering the RFP response. Ensuring 100% compliance with technical specs.',
      'Financial modeling for DDIN equipment. Labor savings versus initial investment.',
      'POR rental logistics. Asset tracking for massive transmission grid projects.',
      'Storm response prospecting. Proactive stock management for disaster windows.',
      'The "Bottom-Up" sale. Winning the bucket-truck crew to force procurement.',
      'Selling safety as an avoided liability. ROI of high-end PPE testing.',
      'Consignment stock mechanics. Managing utility inventory on-site via P21.',
      'PUC Rate Case cycles. Timing capital sales with utility budget boosts.',
      'Emergency Master Service Agreements (MSAs). Negotiating primary sourcing.',
      'Q4 budget flushing. Capturing end-of-year utility maintenance spending.',
      'Grid hardening products. Insulators and rigging for high-stress environments.',
      'Recurring revenue architecture. The 6-month "Tested & Ready" subscription.',
      'Renewable Energy Rigging Pitch', 'Adapting DDIN tools for renewables.',
      'Targeting replacement componentry for 50-year-old grid infrastructure.',
      'High-value sales of substation breakers, switches, and large-scale insulators.',
      'Utilizing regional hubs to beat national logistics on response-time metrics.',
      'Consultative sales. Helping clients optimize tool-rooms using Tallman logic.',
      'Field-to-Boardroom relationships. Building trust with linemen and executives.'
    ],
    quizzes: [
      { q: "Why focus on 'Total Cost of Ownership' in utility sales?", a: ["Utilities plan for 40-year asset lifecycles", "It makes the price look lower", "To hide the shipping cost", "Because it is easier to calculate"] },
      { q: "What is 'Consignment' in the Tallman service model?", a: ["Inventory stocked at the client site for future billing", "Returning old tools", "Selling scrap steel", "Repairing client tools"] }
    ]
  }
};

const buildModules = (courseId: string): Module[] => {
  const data = TECHNICAL_DATA[courseId];
  if (!data) return [];
  
  const isRopeCourse = courseId === 'c_rope';

  return data.titles.map((title, i) => {
    const detail = data.details[i] || "Technical specification pending architect review.";
    const quiz = data.quizzes[i % data.quizzes.length];

    // SOP logic for rope vs other (removing dielectric steps for rope)
    const sopSteps = isRopeCourse ? [
      "1. Identity Verification: Query the serial number in P21 Item Maintenance.",
      "2. Visual Scrutiny: Perform a 360-degree scan for mechanical oxidation or structural fatigue.",
      "3. Calibration Audit: Confirm the ISO-17025 sticker on all testing apparatus.",
      "4. Mechanical Load Factoring: Calculate vector forces using Sine/Cosine vectors.",
      "5. Surface Neutralization: Clean all physical interfaces with certified aqueous solutions.",
      "6. Technical Alignment: Align the unit with the testing jig or rigging point.",
      "7. Real-Time Data Monitoring: Observe tensiometer load via the P21 digital bridge.",
      "8. Peak Load Sustenance: Gradually increase stress to 110% of rated capacity for 60 seconds.",
      "9. Post-Task Audit: Re-inspect for polymer stretching or thermal buildup in friction zones.",
      "10. Asset Certification: Apply a new serialized 'Tested & Certified' tag.",
      "11. Labor Allocation: Record total man-hours in the P21 labor module.",
      "12. Inventory Update: Change item status to 'AVAILABLE FOR SHIPMENT'.",
      "13. Replenishment Check: Verify Min/Max stock levels for replenishment triggers.",
      "14. System De-energization: Bleed all stored hydraulic pressure.",
      "15. Double-Blind Audit: Final technician verification of the P21 record."
    ] : [
      "1. Identity Verification: Query the serial number in P21 Item Maintenance.",
      "2. Environmental Audit: Measure ambient humidity (Max: 60%) for dielectric stability.",
      "3. Visual Scrutiny: Scan for micro-cracks in high-stress crotch areas.",
      "4. Calibration Audit: Confirm the ISO-17025 sticker on all testing apparatus.",
      "5. Pre-Flight Grounding: Establish a path to earth with <0.5 ohms resistance.",
      "6. Load Factoring: Determine safe working load limits (WLL).",
      "7. Dielectric Prep: Clean all surfaces with Tallman-certified aqueous solutions.",
      "8. Technical Engagement: Align the unit with the dielectric testing jig.",
      "9. Data Bridge Monitoring: Observe leakage current (mA) via the P21 digital bridge.",
      "10. Peak Voltage Sustenance: Hold peak voltage for 60 seconds.",
      "11. Waveform Analysis: Review AC sine wave for signs of harmonic distortion.",
      "12. Post-Task Audit: Re-inspect for thermal spikes using infrared scanners.",
      "13. Asset Certification: Apply a new serialized 'Tested & Certified' tag.",
      "14. Labor Allocation: Record technical hours into the P21 production module.",
      "15. Site Restoration: Neutralize all energy sources and secure the equipment."
    ];

    const manualContent = `
# TALLMAN INDUSTRIAL MASTER MANUAL: ${title.toUpperCase()}
## DATA CLUSTER: SOP-T-2024-${i.toString().padStart(3, '0')}
## CLASSIFICATION: TECHNICAL CORE / MECHANICAL PHYSICS

### 1. INDUSTRIAL SYSTEM ARCHITECTURE
${detail}
This unit establishes the primary technical foundation for ${title}. All data is derived from the Tallman Technical Archive. This manual is strictly industrial; it contains no polymer chemistry, no fractional CIO services, no case studies, and absolutely NO electrical or dielectric content. Every paragraph represents an actionable mechanical standard for Tallman Equipment Co.

### 2. HARDWARE & SOFTWARE INTEGRATION SPECIFICATIONS
*   **Primary System Control**: Epicor P21 ERP (Central Data Node). 
    The P21 environment handles the complex relational mapping of every physical asset.
*   **Precision Production Node**: Bradley Machining (CNC Tolerance: +/- 0.0005"). 
    All machined components for this unit are verified against the original CAD blueprints.
*   **Force Verification Hardware**: DDIN Technical Series (Load Rating Class III). 
    Hardware must be inspected for microscopic pitting and mechanical grain alignment.

### 3. ADVANCED STANDARD OPERATING PROCEDURE (SOP)
${sopSteps.join('\n\n')}

### 4. FAILURE MODE & EFFECTS ANALYSIS (FMEA)
*   **Mechanical Grain Oxidation**: Pitting of Bradley machined surfaces when exposed to corrosive utility environments.
*   **Axial Fiber Failure**: Structural breakdown of core fibers due to repetitive cyclic tension beyond WLL.
*   **Drum Burying**: Failure of fleet angle geometry resulting in internal rope abrasion and core collapse.
*   **P21 Database Integrity Failure**: Duplicate item entries leading to inventory shrinkage.

### 5. REGULATORY COMPLIANCE MATRIX
*   **ANSI Z359**: Fall protection and rigging standards for industrial utility work.
*   **ASTM E4**: Standard practices for force verification of testing machines.
*   **OSHA 1926.251**: Rigging equipment for material handling.
*   **ASME B30.30**: Standards for ropes used in hoisting and lifting.

### 6. OPERATIONAL MAINTENANCE & CALIBRATION INTERVALS
*   **Daily Visual Audit**: Checking sheave grooves for sharp edges or metal fatigue.
*   **Weekly P21 Cycle Count**: Rotating inventory audit of heavy rigging assets at the Addison facility.
*   **Monthly Technical Refresh**: Deep-cleaning of all DDIN hydraulic blocks and Bradley machined jigs.
*   **Annual ISO-17025 Certification**: External calibration of all hydraulic pull-testers.

### 7. TECHNICAL PERFORMANCE MATRICES
| METRIC | SPECS | DYNAMIC LOAD | FACTOR OF SAFETY |
| :--- | :--- | :--- | :--- |
| Tensile Strength | 20,000 lbs | 1.1x WLL | 5:1 |
| Braid Spec | 12-Strand | HMPE | Torque Neutral |
| Friction Coeff | 0.12 | Dry Surface | Constant |
| P21 SKU | DD-RIG-X | Technical | Active |

Precision is the identity of Tallman Equipment Co. We do not simply sell products; we provide the engineering that ensures the stability of the national power grid. Never compromise on the mechanical SOP.
`;

    return {
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
          duration_minutes: 60,
          content: manualContent
        },
        {
          lesson_id: `l_${courseId}_${i}_quiz`,
          module_id: `m_${courseId}_${i}`,
          lesson_title: `${title}: Technical Audit`,
          lesson_type: 'quiz',
          duration_minutes: 20,
          quiz_questions: [
            {
              question: quiz.q,
              options: quiz.a,
              correctIndex: 0
            },
            {
              question: `In the 15-Step Tallman Mechanical SOP, what is the focus of Step 4?`,
              options: ["Mechanical Load Factoring (Sine/Cosine)", "Environmental Humidity Audit", "Grounding Check", "Electrical Waveform Analysis"],
              correctIndex: 0
            },
            {
              question: `What is the precision tolerance for Bradley Machining CNC components in this course?`,
              options: ["+/- 0.0005\"", "+/- 0.01\"", "+/- 0.1\"", "No specific tolerance"],
              correctIndex: 0
            },
            {
              question: `Which standard governs the practice for force verification of testing machines?`,
              options: ["ASTM E4", "ASTM D120", "OSHA 1910.269", "ASTM F496"],
              correctIndex: 0
            }
          ]
        }
      ]
    };
  });
};

export const courses: Course[] = [
  { 
    course_id: 'c_leadership', 
    course_name: 'Executive Strategic Leadership', 
    short_description: 'Industrial governance, branch P&L, and technical stewardship for Tallman directors.', 
    thumbnail_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop', 
    category_id: 'business', 
    instructor_id: 'inst_01', 
    status: CourseStatus.PUBLISHED, 
    enrolled_count: 85, 
    rating: 4.9, 
    difficulty: 'Advanced',
    modules: buildModules('c_leadership')
  },
  { 
    course_id: 'c_rope', 
    course_name: 'Lineman Rigging & Rope Science', 
    short_description: 'Mechanical load dynamics, splicing SOPs, and DDIN high-strength rigging physics.', 
    thumbnail_url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=1974&auto=format&fit=crop', 
    category_id: 'tech', 
    instructor_id: 'inst_04', 
    status: CourseStatus.PUBLISHED, 
    enrolled_count: 142, 
    rating: 5.0, 
    difficulty: 'Intermediate',
    modules: buildModules('c_rope')
  },
  { 
    course_id: 'c_warehouse', 
    course_name: 'Warehouse Management', 
    short_description: 'Mastering Epicor P21 database integrity, Rubbertree analytics, and cycle counts.', 
    thumbnail_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop', 
    category_id: 'business', 
    instructor_id: 'inst_05', 
    status: CourseStatus.PUBLISHED, 
    enrolled_count: 98, 
    rating: 4.7, 
    difficulty: 'Intermediate',
    modules: buildModules('c_warehouse')
  },
  { 
    course_id: 'c_testing', 
    course_name: 'Testing linemen poles, gloves and sleeves', 
    short_description: 'ASTM D120 dielectric SOPs, bench mechanics, and safety threshold compliance.', 
    thumbnail_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop', 
    category_id: 'tech', 
    instructor_id: 'inst_06', 
    status: CourseStatus.PUBLISHED, 
    enrolled_count: 215, 
    rating: 4.8, 
    difficulty: 'Advanced',
    modules: buildModules('c_testing')
  },
  { 
    course_id: 'c_selling', 
    course_name: 'Selling to power utilities and their contractors', 
    short_description: 'Complex RFP engineering, MSA technical bidding, and POR rental ROI modeling.', 
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop', 
    category_id: 'business', 
    instructor_id: 'inst_07', 
    status: CourseStatus.PUBLISHED, 
    enrolled_count: 167, 
    rating: 4.9, 
    difficulty: 'Advanced',
    modules: buildModules('c_selling')
  }
];

export const enrollments: Enrollment[] = [
  { enrollment_id: 'e1', user_id: 'user_01_hq', course_id: 'c_leadership', progress_percent: 5, status: 'active', completed_lesson_ids: ['l_c_leadership_0_doc'], enrolled_at: '2024-01-01' }
];

export const badges: Badge[] = [
  { badge_id: 'b1', badge_name: 'Safety Vanguard', badge_image_url: '🛡️', criteria: 'Complete the HV Core' }
];

export const certificates: Certificate[] = [];