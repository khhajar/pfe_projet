export interface User {
  email: string;
  password: string;
  role: 'candidate' | 'recruiter';
  uid: string;
}
