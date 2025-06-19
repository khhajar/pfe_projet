export interface JobApplication {
  id: string;
  candidateId: string;
  jobId: string;
  status: 'Pending' | 'Shortlisted' | 'Rejected' | 'Hired';
  appliedAt: Date;
  updatedAt: Date;
}
