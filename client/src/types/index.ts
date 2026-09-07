export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceRequired: string;
  minExperienceYears: number;
  salaryRange?: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements: string;
  responsibilities?: string;
  interviewCriteria?: string;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  createdAt: string;
  _count?: {
    applications: number;
    screeningResults: number;
    interviews: number;
  };
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  cvFileUrl?: string;
  cvFileName: string;
  parsedData: ParsedCvData;
  totalExperienceYears: number;
  status:
    | 'UPLOADED'
    | 'PARSING'
    | 'SCREENING'
    | 'SCREENED'
    | 'STRONG_MATCH'
    | 'POTENTIAL_MATCH'
    | 'WEAK_MATCH'
    | 'REJECTED'
    | 'INTERVIEW_RECOMMENDED'
    | 'INTERVIEW_SCHEDULED'
    | 'INTERVIEW_COMPLETED';
  createdAt: string;
  latestScreening?: ScreeningResult | null;
  latestInterview?: Interview | null;
  screeningResults?: ScreeningResult[];
  interviews?: Interview[];
}

export interface ParsedCvData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  education?: Array<{
    degree: string;
    institution: string;
    graduationYear?: string;
  }>;
  experience?: Array<{
    company: string;
    jobTitle: string;
    startDate?: string;
    endDate?: string;
    responsibilities?: string[];
    technologies?: string[];
  }>;
  skills?: {
    technical?: string[];
    programmingLanguages?: string[];
    frameworks?: string[];
    databases?: string[];
    cloud?: string[];
    tools?: string[];
    softSkills?: string[];
  };
  certifications?: Array<{
    name: string;
    organization?: string;
    date?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies?: string[];
  }>;
  totalExperienceYears?: number;
}

export interface ScreeningResult {
  id: string;
  candidateId: string;
  jobId: string;
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  qualificationScore: number;
  recommendation: 'STRONG_MATCH' | 'POTENTIAL_MATCH' | 'WEAK_MATCH' | 'REJECT';
  strengths: string[];
  missingRequirements: string[];
  matchingSkills: string[];
  riskFlags: string[];
  summary: string;
  interviewRecommended: boolean;
  createdAt: string;
  job?: Job;
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  interviewer: string;
  date: string;
  startTime: string;
  duration: string;
  type: string;
  meetingLink?: string;
  additionalMessage?: string;
  status: string;
  createdAt: string;
  candidate?: Candidate;
  job?: Job;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalCandidates: number;
  candidatesScreened: number;
  strongMatches: number;
  interviewsScheduled: number;
  averageScore: number;
  distribution: Array<{ category: string; count: number; color: string }>;
  pipeline: Array<{ stage: string; count: number }>;
}

export interface HealthCheckResponse {
  status: string;
  appName: string;
  version: string;
  timestamp: string;
  aiMode: string;
  providers: {
    gemini: boolean;
    openai: boolean;
    clerk: boolean;
  };
}
