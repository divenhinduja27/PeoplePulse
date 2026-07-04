import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role, Employee } from '../types';

import { mockEmployees } from '../data/mockEmployees';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, pass: string) => { success: boolean; isFirstTimeEmployee?: boolean; employeeId?: string };
  logout: () => void;
  toggleRole: () => void;
  isCheckedIn: boolean;
  checkInTime: string | null;
  toggleCheckIn: () => void;
  completeFirstTimeReset: (employeeId: string, newPass: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultAdminEmployee: Employee = {
  id: "PPDH20220001",
  name: "Divya Hinduja",
  email: "divya@peoplepulse.com",
  phone: "+91 99999 88888",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120",
  status: "present",
  manager: "Board of Directors",
  location: "Mumbai, India",
  about: "HR Administrator & Operations Lead.",
  skills: ["HR Administration", "Resource Planning"],
  interests: [],
  certifications: [],
  resume: [],
  privateInfo: {
    dob: "1990-05-18",
    address: "Mumbai, India",
    nationality: "Indian",
    personalEmail: "divya@peoplepulse.com",
    gender: "Female",
    maritalStatus: "Married",
    dateOfJoining: "2022-06-01",
    accountNumber: "912010087654321",
    bankName: "HDFC Bank",
    ifscCode: "HDFC0000004",
    panNo: "DIPHA9876C",
    uanId: "100999888777",
    empCode: "DIR2022001"
  },
  password: "password123",
  role: "admin",
  salary: {
    monthlyWage: 150000,
    workingDaysPerWeek: 5,
    breakTimeMinutes: 60,
    components: {
      basicWagePercent: 50,
      hraPercent: 50,
      standardAllowance: 10000,
      performanceBonusPercent: 20,
      ltaPercent: 10
    },
    pfRatePercent: 12,
    professionalTax: 200
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize localStorage database with mock data if not existing
  useEffect(() => {
    const saved = localStorage.getItem('pp_employees');
    if (!saved) {
      localStorage.setItem('pp_employees', JSON.stringify([defaultAdminEmployee, ...mockEmployees]));
    }
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('pp_checked_in');
    return saved === 'true';
  });

  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pp_user', JSON.stringify(currentUser));
      localStorage.setItem(`pp_checked_in_${currentUser.id}`, String(isCheckedIn));
    } else {
      localStorage.removeItem('pp_user');
    }
  }, [currentUser, isCheckedIn]);

  // Sync checked-in state when user changes
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`pp_checked_in_${currentUser.id}`);
      setIsCheckedIn(saved === 'true');
      const time = localStorage.getItem(`pp_check_in_time_${currentUser.id}`);
      setCheckInTime(time);
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  }, [currentUser]);

  const toggleCheckIn = () => {
    if (!currentUser) return;
    setIsCheckedIn((prev) => {
      const next = !prev;
      if (next) {
        const timeStr = new Date().toISOString();
        localStorage.setItem(`pp_check_in_time_${currentUser.id}`, timeStr);
        setCheckInTime(timeStr);
      } else {
        const savedTime = localStorage.getItem(`pp_check_in_time_${currentUser.id}`);
        if (savedTime) {
          const checkInDate = new Date(savedTime);
          const checkOutDate = new Date();
          
          const pad = (num: number) => String(num).padStart(2, '0');
          
          const day = pad(checkOutDate.getDate());
          const month = pad(checkOutDate.getMonth() + 1);
          const year = checkOutDate.getFullYear();
          const dateStr = `${day}/${month}/${year}`;
          
          const checkInStr = `${pad(checkInDate.getHours())}:${pad(checkInDate.getMinutes())}`;
          const checkOutStr = `${pad(checkOutDate.getHours())}:${pad(checkOutDate.getMinutes())}`;
          
          const diffMs = checkOutDate.getTime() - checkInDate.getTime();
          const diffMins = Math.floor(diffMs / (1000 * 60));
          const hours = Math.floor(diffMins / 60);
          const mins = diffMins % 60;
          const workHoursStr = `${pad(hours)}:${pad(mins)}`;
          
          const standardWorkMins = 8 * 60;
          const extraMins = Math.max(0, diffMins - standardWorkMins);
          const extraHours = Math.floor(extraMins / 60);
          const extraMinsRemain = extraMins % 60;
          const extraHoursStr = `${pad(extraHours)}:${pad(extraMinsRemain)}`;
          
          const newRecord = {
            date: dateStr,
            checkIn: checkInStr,
            checkOut: checkOutStr,
            workHours: workHoursStr,
            extraHours: extraHoursStr
          };
          
          const key = `pp_attendance_${currentUser.id}`;
          const existingSaved = localStorage.getItem(key);
          const list = existingSaved ? JSON.parse(existingSaved) : [
            { date: '28/10/2025', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
            { date: '29/10/2025', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
            { date: '30/10/2025', checkIn: '09:45', checkOut: '18:45', workHours: '09:00', extraHours: '00:00' },
            { date: '31/10/2025', checkIn: '10:15', checkOut: '19:30', workHours: '09:15', extraHours: '01:15' },
            { date: '01/11/2025', checkIn: '10:00', checkOut: '18:00', workHours: '08:00', extraHours: '00:00' },
          ];
          
          list.push(newRecord);
          localStorage.setItem(key, JSON.stringify(list));
        }
        localStorage.removeItem(`pp_check_in_time_${currentUser.id}`);
        setCheckInTime(null);
      }
      return next;
    });
  };

  const login = (email: string, pass: string): { success: boolean; isFirstTimeEmployee?: boolean; employeeId?: string } => {
    const trimmedEmail = email.trim();
    const trimmedPass = pass.trim();
    if (trimmedEmail && trimmedPass) {
      const saved = localStorage.getItem('pp_employees');
      let employees: Employee[] = [];
      if (saved) {
        employees = JSON.parse(saved);
      }

      const foundEmployee = employees.find(
        (emp) => emp.email.toLowerCase() === trimmedEmail.toLowerCase() || emp.id.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (foundEmployee) {
        const storedPassword = foundEmployee.password || "password123";
        if (storedPassword === trimmedPass) {
          // Detect first time employee login (default pass or starts with PP-)
          const isTempPass = storedPassword === "password123" || storedPassword.startsWith("PP-");
          if (foundEmployee.role === 'employee' && isTempPass) {
            return { success: true, isFirstTimeEmployee: true, employeeId: foundEmployee.id };
          }

          setCurrentUser({
            id: foundEmployee.id,
            name: foundEmployee.name,
            email: foundEmployee.email,
            role: foundEmployee.role, // Use registered role!
            avatarUrl: foundEmployee.avatarUrl,
            companyName: "PeoplePulse Corp"
          });
          return { success: true, isFirstTimeEmployee: false };
        } else {
          return { success: false };
        }
      }
    }
    return { success: false };
  };

  const completeFirstTimeReset = (employeeId: string, newPass: string) => {
    const saved = localStorage.getItem('pp_employees');
    if (saved) {
      const employees = JSON.parse(saved);
      const index = employees.findIndex((emp: any) => emp.id === employeeId);
      if (index !== -1) {
        const emp = employees[index];
        employees[index] = {
          ...emp,
          password: newPass
        };
        localStorage.setItem('pp_employees', JSON.stringify(employees));

        // Log in immediately as registered role
        setCurrentUser({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          role: emp.role,
          avatarUrl: emp.avatarUrl,
          companyName: "PeoplePulse Corp"
        });
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleRole = () => {
    if (currentUser) {
      const nextRole: Role = currentUser.role === 'admin' ? 'employee' : 'admin';
      setCurrentUser({
        ...currentUser,
        role: nextRole
      });
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, login, logout, toggleRole, isCheckedIn, checkInTime, toggleCheckIn, completeFirstTimeReset }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
