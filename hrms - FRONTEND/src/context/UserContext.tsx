import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role, Employee } from '../types';

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

const defaultAdminUser: User = {
  id: "PPDH20220001",
  name: "Divya Hinduja",
  email: "divya@peoplepulse.com",
  role: "admin",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120",
  companyName: "PeoplePulse Corp"
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pp_user');
    return saved ? JSON.parse(saved) : defaultAdminUser;
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

      // Fallback: login as default mock admin
      setCurrentUser({
        ...defaultAdminUser,
        email: trimmedEmail,
      });
      return { success: true, isFirstTimeEmployee: false };
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
