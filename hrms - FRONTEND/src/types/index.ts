export type Role = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  companyName?: string;
}

export interface ResumeItem {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface PrivateInfo {
  dob: string;
  address: string;
  nationality: string;
  personalEmail: string;
  gender: string;
  maritalStatus: string;
  dateOfJoining: string;
  // Bank Details
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  panNo: string;
  uanId: string;
  empCode: string;
}

export interface SalaryComponents {
  basicWagePercent: number; // e.g. 50% of Monthly Wage
  hraPercent: number;        // e.g. 50% of Basic
  standardAllowance: number;  // fixed amount
  performanceBonusPercent: number; // % of Basic
  ltaPercent: number;         // % of Basic
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  status: 'present' | 'leave' | 'absent';
  manager: string;
  location: string;
  about: string;
  skills: string[];
  interests: string[];
  certifications: string[];
  resume: ResumeItem[];
  privateInfo: PrivateInfo;
  password?: string;
  role: Role;
  salary: {
    monthlyWage: number;
    workingDaysPerWeek: number;
    breakTimeMinutes: number;
    components: SalaryComponents;
    pfRatePercent: number; // default 12%
    professionalTax: number; // default 200
  };
}
