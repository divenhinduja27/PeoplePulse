import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { mockEmployees } from '../data/mockEmployees';
import type { Employee } from '../types';
import { ProfileTabs } from '../components/profile/ProfileTabs';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { StatusDot } from '../components/shared/StatusDot';
import { ArrowLeft, ShieldAlert, UserCheck } from 'lucide-react';

const getRelativeDateStr = (daysOffset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);

  // Determine target ID and edit permissions
  const targetId = id === 'me' ? currentUser?.id : id;
  const isOwnProfile = targetId === currentUser?.id;
  const isReadOnly = !isOwnProfile;

  useEffect(() => {
    const saved = localStorage.getItem('pp_employees');
    let list: Employee[] = [];
    if (saved) {
      list = JSON.parse(saved);
    } else {
      list = mockEmployees;
      localStorage.setItem('pp_employees', JSON.stringify(mockEmployees));
    }
    setEmployees(list);

    // Look for employee in directory
    let found = list.find((emp) => emp.id === targetId);

    // If not found and it's own profile, create the default admin profile for Divya Hinduja
    if (!found && isOwnProfile && currentUser) {
      found = {
        id: currentUser.id || "PPDH20260001",
        name: currentUser.name || "Divya Hinduja",
        email: currentUser.email || "divya@peoplepulse.com",
        phone: "+91 99999 88888",
        avatarUrl: currentUser.avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120",
        status: "present",
        manager: "Board of Directors",
        location: "Mumbai, India",
        about: "HR Administrator & Operations Lead. Managing company-wide resource allocations, onboarding structures, and organizational compliance.",
        skills: ["HR Administration", "Resource Planning", "Payroll Management", "Operations"],
        interests: ["Reading", "Networking", "Mentorship"],
        certifications: ["Senior Professional in Human Resources (SPHR)"],
        resume: [
          {
            id: "r_own_1",
            title: "HR Director",
            company: "PeoplePulse Corp",
            duration: "2022 - Present",
            description: "Managing corporate recruitment, salary structures, and policy implementations."
          }
        ],
        privateInfo: {
          dob: "1990-05-18",
          address: "Bungalow 12, Pali Hill, Bandra West, Mumbai - 400050",
          nationality: "Indian",
          personalEmail: "divya.hinduja.personal@gmail.com",
          gender: "Female",
          maritalStatus: "Married",
          dateOfJoining: getRelativeDateStr(-28),
          accountNumber: "912010087654321",
          bankName: "HDFC Bank",
          ifscCode: "HDFC0000004",
          panNo: "DIPHA9876C",
          uanId: "100999888777",
          empCode: "DIR2026001"
        },
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

      // Save it back to storage
      const newList = [...list, found as Employee];
      localStorage.setItem('pp_employees', JSON.stringify(newList));
      setEmployees(newList);
    }

    setEmployee(found || null);
  }, [targetId, isOwnProfile, currentUser]);

  const handleSave = (updatedEmp: Employee) => {
    const updatedList = employees.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp));
    localStorage.setItem('pp_employees', JSON.stringify(updatedList));
    setEmployees(updatedList);
    setEmployee(updatedEmp);
  };

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-lg font-bold text-foreground">Employee Profile Not Found</h3>
        <p className="text-sm text-muted-foreground mt-2">The requested profile does not exist.</p>
        <Link to="/" className="inline-flex items-center gap-1.5 mt-4 text-primary font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <div className="space-y-6">

      {/* Back button and View banner */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back</span>
        </button>

        {isReadOnly ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border/40">
            <UserCheck className="h-3.5 w-3.5" />
            View-Only Mode (Viewing Other Profile)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/30">
            <ShieldAlert className="h-3.5 w-3.5" />
            Edit Mode (Viewing Own Profile)
          </span>
        )}
      </div>

      {/* Grid Layout: Left sidebar, Right main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

        {/* Left Column (Identity & Contact Card) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-border/50 shadow-sm rounded-2xl p-5 bg-card relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-accent" />

            <div className="flex flex-col items-center text-center pt-3">
              <Avatar className="h-20 w-20 border-2 border-border shadow-sm">
                <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <h3 className="font-extrabold text-lg text-foreground mt-4">{employee.name}</h3>

              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/40 mt-1.5 select-all">
                {employee.id}
              </span>

              <div className="mt-3">
                <StatusDot status={employee.status} showText />
              </div>
            </div>

            <div className="border-t border-border/40 pt-4 mt-5 space-y-3 text-xs text-muted-foreground">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/75 tracking-wider block">Manager</span>
                <span className="text-foreground font-semibold">{employee.manager}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/75 tracking-wider block">Location</span>
                <span className="text-foreground font-semibold">{employee.location}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/75 tracking-wider block">Email</span>
                <span className="text-foreground font-semibold truncate block">{employee.email}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/75 tracking-wider block">Phone</span>
                <span className="text-foreground font-semibold">{employee.phone}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (Tabs Panel) */}
        <div className="lg:col-span-3">
          <ProfileTabs
            employee={employee}
            isReadOnly={isReadOnly}
            userRole={currentUser?.role || 'admin'}
            onSave={handleSave}
          />
        </div>

      </div>

    </div>
  );
};
export default EmployeeProfilePage;
