import { OnlinePresence } from './onlinePresence.model';

export interface Company {
  companyId: string;
  logo: string;
  name: string;
  city: string;
  speciality: string;
  size: string;
  about: string;
  number: string;
  onlinePresence?: OnlinePresence;
  jobIds: string[];
  recruiterId: string;
  createdAt?: Date;
  updatedAt?: Date;
  isCompletedProfile?: boolean;
}
