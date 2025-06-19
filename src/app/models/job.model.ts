import { Company } from './company.model';

export interface Job {
  jobId?: string;
  recruiterId?: string;
  title?: string | null;
  jobType?: string | null;
  category?: string | null;
  workplace?: string | null;
  careerLevel?: string | null;
  experience?: string | null;
  descriptions?: string[] | null;
  requirements?: string[] | null;
  skills: string[] | null;
  createDate?: Date | null;
  updateDate?: Date | null;
  company?: Company | null;
  isClosed?: boolean;
}
