import { OnlinePresence } from './onlinePresence.model';

export interface Candidate {
  userId: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  jobTitle?: string;
  phone?: string;
  city?: string;
  resume?: Resume;
  profilePicture?: string;
  onlinePresence?: OnlinePresence;
  achievements?: string;
  createdAt?: Date;
  updatedAt?: Date;
  careerInterest?: CareerInterest;
  certifications?: Certification[];
  skills?: Skill[];
  languages?: Language[];
  experience?: Experience;
  education?: AcademicBackground;
  appliedJobs?: AppliedJob[];
  savedJobs?: string[];
  isCompleteProfile?: boolean;
}

export interface AppliedJob {
  jobId: string;
  status: 'Applied' | 'Invited' | 'Offered' | 'Rejected';
  scheduleDate: ScheduleDate;
}

export interface ScheduleDate {
  date: string;
  time: string;
}

export interface Experience {
  totalExperience?: string;
  activities?: Activitie[];
}

export interface Activitie {
  id: string;
  experienceType: string;
  jobTitle: string;
  company: string;
  description: string;
  startDate: Date;
  endDate: Date;
  currentlyWorking: boolean;
}
export interface Skill {
  id: string;
  skillName?: string;
  yearExperience?: string;
}

export interface Language {
  id: string;
  languageName?: string;
  level?: string;
}
export interface Certification {
  id: string;
  name?: string;
  date?: Date;
}

export interface CareerInterest {
  careerLevel?: string;
  jobType?: string;
  workplacePreferred?: string;
}
export interface Resume {
  name: string;
  url: string;
}
export interface AcademicBackground {
  level?: string;
  degrees?: Degree[];
}

export interface Degree {
  id: string;
  level?: string;
  university?: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate: Date;
}
