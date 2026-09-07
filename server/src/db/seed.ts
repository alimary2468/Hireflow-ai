import { prisma } from './prisma';

export async function seedDemoData() {
  console.log('Seeding HireFlow AI demo data...');

  // 1. Clean existing records
  await prisma.notification.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.screeningResult.deleteMany();
  await prisma.application.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Default HR User
  const hrUser = await prisma.user.create({
    data: {
      clerkUserId: 'user_demo_hr_karachi',
      name: 'Sarah Jenkins (HR Lead)',
      email: 'recruitment@hireflow.ai',
      role: 'HR_RECRUITER',
    },
  });

  // 3. Create Target Jobs
  const jobFrontend = await prisma.job.create({
    data: {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Karachi, Pakistan (Hybrid)',
      employmentType: 'Full-Time',
      experienceRequired: '2+ years',
      minExperienceYears: 2.0,
      salaryRange: 'PKR 250,000 - 380,000 / month',
      description: 'We are seeking an experienced Frontend Developer to build high-performance React & TypeScript web applications. You will collaborate closely with UI designers and backend engineers to create seamless user experiences.',
      requiredSkills: JSON.stringify(['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'REST APIs']),
      preferredSkills: JSON.stringify(['Next.js', 'Tailwind CSS', 'Git', 'PostgreSQL']),
      educationRequirements: "Bachelor's Degree in Computer Science or Software Engineering",
      responsibilities: 'Build scalable web components, optimize client-side performance, implement responsive layouts, collaborate in Agile sprints.',
      interviewCriteria: 'Phase 1: Resume Screening | Phase 2: Live React/TS Technical Coding | Phase 3: Culture & Team Fit',
      createdBy: hrUser.id,
    },
  });

  const jobFullStack = await prisma.job.create({
    data: {
      title: 'Senior Full Stack Engineer',
      department: 'Product Architecture',
      location: 'Remote',
      employmentType: 'Full-Time',
      experienceRequired: '4+ years',
      minExperienceYears: 4.0,
      salaryRange: 'PKR 450,000 - 650,000 / month',
      description: 'Looking for a Senior Full Stack Engineer proficient in React, Node.js, Express, PostgreSQL, and Cloud Architectures.',
      requiredSkills: JSON.stringify(['React', 'Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'REST APIs']),
      preferredSkills: JSON.stringify(['Docker', 'AWS', 'GraphQL', 'Next.js']),
      educationRequirements: "BS/MS in Computer Science",
      responsibilities: 'Architect backend REST APIs, design database schemas, optimize database queries, build React dashboards.',
      interviewCriteria: 'System Design + Node.js/PostgreSQL Deep Dive',
      createdBy: hrUser.id,
    },
  });

  // 4. Candidate 1: Ahmed Khan (92 - STRONG MATCH)
  const candidateAhmed = await prisma.candidate.create({
    data: {
      name: 'Ahmed Khan',
      email: 'ahmed.khan.dev@gmail.com',
      phone: '+92 300 9876543',
      location: 'Karachi, Pakistan',
      linkedin: 'https://linkedin.com/in/ahmed-khan-frontend',
      github: 'https://github.com/ahmedkhan-dev',
      portfolio: 'https://ahmedkhan.dev',
      cvFileName: 'Ahmed_Khan_CV.pdf',
      cvFileUrl: '/uploads/demo_ahmed_khan_cv.pdf',
      totalExperienceYears: 4.0,
      status: 'INTERVIEW_RECOMMENDED',
      parsedData: JSON.stringify({
        name: 'Ahmed Khan',
        email: 'ahmed.khan.dev@gmail.com',
        phone: '+92 300 9876543',
        location: 'Karachi, Pakistan',
        education: [{ degree: 'BS Computer Science', institution: 'FAST-NUCES Karachi', graduationYear: '2022' }],
        experience: [
          { company: 'Systems Limited', jobTitle: 'Senior Frontend Developer', startDate: '2023', endDate: 'Present', responsibilities: ['Architected React micro-frontends with TypeScript', 'Integrated complex REST APIs and state management'] },
          { company: 'Folio3 Software', jobTitle: 'Frontend Engineer', startDate: '2022', endDate: '2023', responsibilities: ['Built responsive SaaS web dashboards using React and Tailwind CSS'] },
        ],
        skills: {
          technical: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'REST APIs', 'Next.js', 'Tailwind CSS', 'Redux Toolkit'],
          programmingLanguages: ['TypeScript', 'JavaScript'],
          frameworks: ['React', 'Next.js'],
          databases: ['PostgreSQL'],
          cloud: ['AWS Vercel'],
          tools: ['Git', 'Figma', 'Webpack'],
          softSkills: ['Team Leadership', 'Agile Collaboration', 'Code Review'],
        },
        projects: [
          { name: 'HireFlow Dashboard', description: 'Enterprise AI Candidate Evaluation Platform using React & TypeScript', technologies: ['React', 'TypeScript', 'Tailwind CSS'] },
        ],
        certifications: [{ name: 'Meta Senior Front-End Developer Certificate', organization: 'Coursera', date: '2023' }],
      }),
    },
  });

  await prisma.application.create({ data: { candidateId: candidateAhmed.id, jobId: jobFrontend.id } });

  await prisma.screeningResult.create({
    data: {
      candidateId: candidateAhmed.id,
      jobId: jobFrontend.id,
      overallScore: 92,
      skillsScore: 38,
      experienceScore: 23,
      educationScore: 9,
      projectScore: 14,
      qualificationScore: 8,
      recommendation: 'STRONG_MATCH',
      strengths: JSON.stringify([
        '4 years of dedicated frontend engineering experience exceeding the 2 year requirement',
        'Direct mastery of all mandatory skills: React, TypeScript, JavaScript, HTML, CSS, REST APIs',
        'Strong bonus points for Next.js and Tailwind CSS preferred stack',
        'Holds Meta Senior Front-End Developer certification',
      ]),
      missingRequirements: JSON.stringify(['No major missing requirements identified in CV']),
      matchingSkills: JSON.stringify(['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'REST APIs', 'Next.js', 'Tailwind CSS']),
      riskFlags: JSON.stringify([]),
      summary: 'Ahmed Khan is an outstanding candidate with 4 years of frontend development experience. He matches 100% of required technical skills (React, TypeScript, JavaScript, REST APIs) and preferred frameworks (Next.js, Tailwind CSS). Highly recommended for technical interview.',
      interviewRecommended: true,
    },
  });

  // 5. Candidate 2: Sara Ali (87 - STRONG MATCH)
  const candidateSara = await prisma.candidate.create({
    data: {
      name: 'Sara Ali',
      email: 'sara.ali.tech@gmail.com',
      phone: '+92 321 4567890',
      location: 'Lahore, Pakistan',
      linkedin: 'https://linkedin.com/in/sara-ali-dev',
      github: 'https://github.com/saraali-code',
      portfolio: 'https://saraali.io',
      cvFileName: 'Sara_Ali_Resume.pdf',
      cvFileUrl: '/uploads/demo_sara_ali_resume.pdf',
      totalExperienceYears: 3.5,
      status: 'STRONG_MATCH',
      parsedData: JSON.stringify({
        name: 'Sara Ali',
        email: 'sara.ali.tech@gmail.com',
        phone: '+92 321 4567890',
        location: 'Lahore, Pakistan',
        education: [{ degree: 'BS Software Engineering', institution: 'NUST Islamabad', graduationYear: '2021' }],
        experience: [
          { company: 'Contour Software', jobTitle: 'Frontend Engineer', startDate: '2022', endDate: 'Present', responsibilities: ['Developed React applications using TypeScript and Redux'] },
        ],
        skills: {
          technical: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'REST APIs', 'Git', 'Bootstrap'],
          programmingLanguages: ['TypeScript', 'JavaScript'],
          frameworks: ['React'],
          databases: ['MongoDB'],
          cloud: ['Firebase'],
          tools: ['Git', 'Jira'],
          softSkills: ['Problem Solving', 'Communication'],
        },
        projects: [{ name: 'E-Commerce React Portal', description: 'High volume online store front with React & Redux', technologies: ['React', 'TypeScript'] }],
        certifications: [],
      }),
    },
  });

  await prisma.application.create({ data: { candidateId: candidateSara.id, jobId: jobFrontend.id } });

  await prisma.screeningResult.create({
    data: {
      candidateId: candidateSara.id,
      jobId: jobFrontend.id,
      overallScore: 87,
      skillsScore: 36,
      experienceScore: 22,
      educationScore: 9,
      projectScore: 13,
      qualificationScore: 7,
      recommendation: 'STRONG_MATCH',
      strengths: JSON.stringify([
        '3.5 years of industry experience matching target role',
        'Strong expertise in React, TypeScript, and REST APIs',
        'Degree in Software Engineering from top-tier university (NUST)',
      ]),
      missingRequirements: JSON.stringify(['Limited explicit Next.js experience documented in CV']),
      matchingSkills: JSON.stringify(['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'REST APIs', 'Git']),
      riskFlags: JSON.stringify([]),
      summary: 'Sara Ali strongly meets all essential requirements for Frontend Developer. She possesses 3.5 years of experience building React/TypeScript applications with clean state management.',
      interviewRecommended: true,
    },
  });

  // 6. Candidate 3: Hamza Ahmed (76 - POTENTIAL MATCH)
  const candidateHamza = await prisma.candidate.create({
    data: {
      name: 'Hamza Ahmed',
      email: 'hamza.ahmed@outlook.com',
      phone: '+92 333 1122334',
      location: 'Karachi, Pakistan',
      linkedin: 'https://linkedin.com/in/hamza-ahmed',
      github: 'https://github.com/hamza-dev',
      cvFileName: 'Hamza_Ahmed_CV.pdf',
      cvFileUrl: '/uploads/demo_hamza_ahmed_cv.pdf',
      totalExperienceYears: 2.0,
      status: 'POTENTIAL_MATCH',
      parsedData: JSON.stringify({
        name: 'Hamza Ahmed',
        email: 'hamza.ahmed@outlook.com',
        phone: '+92 333 1122334',
        location: 'Karachi, Pakistan',
        education: [{ degree: 'BS Computer Science', institution: 'NED University Karachi', graduationYear: '2023' }],
        experience: [{ company: 'Techlogix', jobTitle: 'Associate Web Developer', startDate: '2023', endDate: 'Present', responsibilities: ['Built user interface components in JavaScript and React'] }],
        skills: {
          technical: ['JavaScript', 'React', 'HTML5', 'CSS3', 'REST APIs', 'Git'],
          programmingLanguages: ['JavaScript'],
          frameworks: ['React'],
          databases: ['MySQL'],
          cloud: [],
          tools: ['Git'],
          softSkills: ['Enthusiastic Learner'],
        },
        projects: [{ name: 'Task Tracker Web App', description: 'React todo application with REST backend', technologies: ['React', 'JavaScript'] }],
        certifications: [],
      }),
    },
  });

  await prisma.application.create({ data: { candidateId: candidateHamza.id, jobId: jobFrontend.id } });

  await prisma.screeningResult.create({
    data: {
      candidateId: candidateHamza.id,
      jobId: jobFrontend.id,
      overallScore: 76,
      skillsScore: 30,
      experienceScore: 19,
      educationScore: 9,
      projectScore: 12,
      qualificationScore: 6,
      recommendation: 'POTENTIAL_MATCH',
      strengths: JSON.stringify([
        'Meets 2-year minimum experience threshold',
        'Good foundation in React, JavaScript, and HTML/CSS',
      ]),
      missingRequirements: JSON.stringify(['TypeScript experience not explicitly listed in CV']),
      matchingSkills: JSON.stringify(['React', 'JavaScript', 'HTML', 'CSS', 'REST APIs', 'Git']),
      riskFlags: JSON.stringify(['Needs onboarding/upskilling on TypeScript strict typing']),
      summary: 'Hamza Ahmed is a solid potential match. He has 2 years experience with React and JavaScript, though he will require brief upskilling on TypeScript.',
      interviewRecommended: true,
    },
  });

  // 7. Candidate 4: Bilal Khan (58 - WEAK MATCH)
  const candidateBilal = await prisma.candidate.create({
    data: {
      name: 'Bilal Khan',
      email: 'bilal.khan99@gmail.com',
      phone: '+92 301 7788990',
      location: 'Karachi, Pakistan',
      cvFileName: 'Bilal_Khan_CV.docx',
      cvFileUrl: '/uploads/demo_bilal_khan_cv.docx',
      totalExperienceYears: 1.0,
      status: 'WEAK_MATCH',
      parsedData: JSON.stringify({
        name: 'Bilal Khan',
        email: 'bilal.khan99@gmail.com',
        phone: '+92 301 7788990',
        education: [{ degree: 'BS Computer Science', institution: 'University of Karachi', graduationYear: '2024' }],
        experience: [{ company: 'WebAgency PK', jobTitle: 'Junior HTML/CSS Developer', startDate: '2024', endDate: 'Present', responsibilities: ['Created landing pages using HTML, CSS, and jQuery'] }],
        skills: {
          technical: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'WordPress'],
          programmingLanguages: ['JavaScript'],
          frameworks: [],
          databases: [],
          cloud: [],
          tools: ['FileZilla'],
          softSkills: [],
        },
        projects: [],
        certifications: [],
      }),
    },
  });

  await prisma.application.create({ data: { candidateId: candidateBilal.id, jobId: jobFrontend.id } });

  await prisma.screeningResult.create({
    data: {
      candidateId: candidateBilal.id,
      jobId: jobFrontend.id,
      overallScore: 58,
      skillsScore: 20,
      experienceScore: 13,
      educationScore: 8,
      projectScore: 11,
      qualificationScore: 6,
      recommendation: 'WEAK_MATCH',
      strengths: JSON.stringify(['Proficient in basic web fundamentals (HTML/CSS/JS)']),
      missingRequirements: JSON.stringify([
        'Required skill React not found in CV',
        'Required skill TypeScript not found in CV',
        'Requires 2 years experience; candidate has 1 year',
      ]),
      matchingSkills: JSON.stringify(['JavaScript', 'HTML', 'CSS']),
      riskFlags: JSON.stringify(['Lacks core modern framework requirement (React & TypeScript)']),
      summary: 'Bilal Khan is a weak match for Senior Frontend position due to lack of React and TypeScript experience and insufficient years of experience.',
      interviewRecommended: false,
    },
  });

  // 8. Candidate 5: Usman Ali (42 - REJECT)
  const candidateUsman = await prisma.candidate.create({
    data: {
      name: 'Usman Ali',
      email: 'usman.ali.py@gmail.com',
      phone: '+92 345 6677889',
      cvFileName: 'Usman_Ali_CV.pdf',
      cvFileUrl: '/uploads/demo_usman_ali_cv.pdf',
      totalExperienceYears: 0.5,
      status: 'REJECTED',
      parsedData: JSON.stringify({
        name: 'Usman Ali',
        email: 'usman.ali.py@gmail.com',
        education: [{ degree: 'Intermediate FSc Pre-Engineering', institution: 'Government College Karachi', graduationYear: '2023' }],
        experience: [],
        skills: {
          technical: ['Python', 'Basic HTML'],
          programmingLanguages: ['Python'],
          frameworks: [],
          databases: [],
          cloud: [],
          tools: [],
          softSkills: [],
        },
        projects: [],
        certifications: [],
      }),
    },
  });

  await prisma.application.create({ data: { candidateId: candidateUsman.id, jobId: jobFrontend.id } });

  await prisma.screeningResult.create({
    data: {
      candidateId: candidateUsman.id,
      jobId: jobFrontend.id,
      overallScore: 42,
      skillsScore: 12,
      experienceScore: 8,
      educationScore: 5,
      projectScore: 11,
      qualificationScore: 6,
      recommendation: 'REJECT',
      strengths: JSON.stringify(['Basic Python scripting interest']),
      missingRequirements: JSON.stringify([
        'Required skill React not found in CV',
        'Required skill TypeScript not found in CV',
        'Required skill REST APIs not found in CV',
        'Requires Bachelor degree; candidate has High School degree',
      ]),
      matchingSkills: JSON.stringify(['HTML']),
      riskFlags: JSON.stringify(['Does not satisfy minimum education or technical skill prerequisites']),
      summary: 'Usman Ali does not meet the basic prerequisites for the Frontend Developer role.',
      interviewRecommended: false,
    },
  });

  // 9. Create Scheduled Interview for Ahmed Khan
  await prisma.interview.create({
    data: {
      candidateId: candidateAhmed.id,
      jobId: jobFrontend.id,
      interviewer: 'Sarah Jenkins (Engineering Manager)',
      date: '2026-09-10',
      startTime: '02:00 PM',
      duration: '45 mins',
      type: 'Video',
      meetingLink: 'https://meet.google.com/hfl-hire-flow-ahmed',
      additionalMessage: 'Please have a working React/TypeScript IDE ready for a live pair-programming component.',
      status: 'SCHEDULED',
    },
  });

  await prisma.candidate.update({
    where: { id: candidateAhmed.id },
    data: { status: 'INTERVIEW_SCHEDULED' },
  });

  // 10. Initial Notifications
  await prisma.notification.createMany({
    data: [
      {
        type: 'STRONG_MATCH',
        title: 'Strong Match Detected: Ahmed Khan (92/100)',
        message: 'Ahmed Khan scored 92/100 for Frontend Developer. Interview recommended.',
        read: false,
      },
      {
        type: 'INTERVIEW_SCHEDULED',
        title: 'Interview Scheduled for Ahmed Khan',
        message: 'Interview set for September 10, 2026 at 2:00 PM (Google Meet). Invitation email sent.',
        read: true,
      },
      {
        type: 'CANDIDATE_SCREENED',
        title: 'AI Screening Complete for 5 Candidates',
        message: 'Screening pipeline completed for Frontend Developer position.',
        read: true,
      },
    ],
  });

  console.log('HireFlow AI demo data seeded successfully!');
}

if (require.main === module) {
  seedDemoData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
