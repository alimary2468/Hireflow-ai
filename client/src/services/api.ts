import axios from 'axios';
import { Job, Candidate, ScreeningResult, Interview, NotificationItem, DashboardStats, HealthCheckResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Jobs
export const getJobs = () => api.get<Job[]>('/jobs').then((res) => res.data);
export const getJobById = (id: string) => api.get<Job>(`/jobs/${id}`).then((res) => res.data);
export const createJob = (data: Partial<Job>) => api.post<Job>('/jobs', data).then((res) => res.data);
export const updateJob = (id: string, data: Partial<Job>) => api.put<Job>(`/jobs/${id}`, data).then((res) => res.data);
export const deleteJob = (id: string) => api.delete(`/jobs/${id}`).then((res) => res.data);

// Candidates
export const getCandidates = (params?: { jobId?: string; status?: string; search?: string; sortBy?: string }) =>
  api.get<Candidate[]>('/candidates', { params }).then((res) => res.data);

export const getCandidateById = (id: string) => api.get<Candidate>(`/candidates/${id}`).then((res) => res.data);

export const uploadAndScreenCV = (file: File, jobId: string) => {
  const formData = new FormData();
  formData.append('cv', file);
  formData.append('jobId', jobId);

  return api.post<{ candidate: Candidate; screeningResult: ScreeningResult }>('/candidates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const updateCandidateStatus = (id: string, status: string) =>
  api.put<Candidate>(`/candidates/${id}/status`, { status }).then((res) => res.data);

// Screening
export const triggerScreening = (candidateId: string, jobId?: string) =>
  api.post<ScreeningResult>(`/screening/${candidateId}`, { jobId }).then((res) => res.data);

export const getJobRankings = (jobId: string) =>
  api.get<any[]>(`/screening/jobs/${jobId}/rankings`).then((res) => res.data);

// Interviews
export const scheduleInterview = (data: {
  candidateId: string;
  jobId: string;
  interviewer: string;
  date: string;
  startTime: string;
  duration?: string;
  type?: string;
  meetingLink?: string;
  additionalMessage?: string;
}) => api.post<{ interview: Interview; emailSent: boolean; emailMessage: string }>('/interviews', data).then((res) => res.data);

export const getInterviews = () => api.get<Interview[]>('/interviews').then((res) => res.data);
export const updateInterviewStatus = (id: string, status: string) =>
  api.put<Interview>(`/interviews/${id}`, { status }).then((res) => res.data);

// Notifications
export const getNotifications = () => api.get<NotificationItem[]>('/notifications').then((res) => res.data);
export const markNotificationAsRead = (id: string) => api.put(`/notifications/${id}/read`).then((res) => res.data);
export const markAllNotificationsAsRead = () => api.put('/notifications/read-all').then((res) => res.data);

// Stats & Health
export const getDashboardStats = () => api.get<DashboardStats>('/stats').then((res) => res.data);
export const getHealthCheck = () => api.get<HealthCheckResponse>('/health').then((res) => res.data);
export const resetDemoData = () => api.post<{ message: string }>('/demo/seed').then((res) => res.data);

export default api;
