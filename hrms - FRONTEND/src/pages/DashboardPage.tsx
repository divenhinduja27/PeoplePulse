import React, { useState, useEffect } from 'react';
import { EmployeeGrid } from '../components/dashboard/EmployeeGrid';
import { mockEmployees } from '../data/mockEmployees';
import type { Employee, Role } from '../types';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectItem } from '../components/ui/select';
import { generateLoginId } from '../lib/generateLoginId';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '../components/ui/dialog';
import { Users, Plus, Copy, Check } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useUser();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form Fields State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('employee');
  const [manager, setManager] = useState('');
  const [location, setLocation] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [empCode, setEmpCode] = useState('');
  const [status, setStatus] = useState<'present' | 'leave' | 'absent'>('present');

  // Success Results State
  const [successData, setSuccessData] = useState<{ loginId: string; tempPass: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadEmployees = () => {
    const saved = localStorage.getItem('pp_employees');
    if (saved) {
      setEmployees(JSON.parse(saved));
    } else {
      setEmployees(mockEmployees);
      localStorage.setItem('pp_employees', JSON.stringify(mockEmployees));
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Clear form when closing
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setRole('employee');
      setManager('');
      setLocation('');
      setDateOfJoining('');
      setEmpCode('');
      setStatus('present');
      setSuccessData(null);
      setIsCopied(false);
      setErrorMsg('');
    }
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName || !lastName || !email || !phone) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    // 1. Calculate next serial number for this year
    const joinYear = dateOfJoining ? new Date(dateOfJoining).getFullYear() : 2026;
    const employeesInYear = employees.filter((emp) => emp.id.includes(String(joinYear)));
    const nextSerial = employeesInYear.length + 1;

    // 2. Generate Login ID
    const loginId = generateLoginId('PP', firstName, lastName, joinYear, nextSerial);

    // 3. Auto-generate temporary password
    const randomChars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let tempPass = 'PP-';
    for (let i = 0; i < 6; i++) {
      tempPass += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    // 4. Create Employee record
    const newEmployee: Employee = {
      id: loginId,
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      phone: phone.trim(),
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=120&h=120`,
      status: status,
      manager: manager.trim() || 'Divya Hinduja',
      location: location.trim() || 'Mumbai, India',
      about: 'Newly onboarded team member. Ready to configure profile details.',
      skills: ['React', 'JavaScript', 'HTML5'],
      interests: ['Tech', 'Networking'],
      certifications: [],
      resume: [],
      privateInfo: {
        dob: '1998-01-01',
        address: 'Default Resident Address',
        nationality: 'Indian',
        personalEmail: email.trim(),
        gender: 'Male',
        maritalStatus: 'Single',
        dateOfJoining: dateOfJoining || '2026-07-04',
        accountNumber: '9120100' + Math.floor(100000 + Math.random() * 900000),
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0000004',
        panNo: 'ABCDE' + Math.floor(1000 + Math.random() * 9000) + 'F',
        uanId: '100' + Math.floor(100000000 + Math.random() * 900000000),
        empCode: empCode.trim() || `EMP${joinYear}${String(nextSerial).padStart(3, '0')}`,
      },
      password: tempPass,
      role: role,
      salary: {
        monthlyWage: 50000,
        workingDaysPerWeek: 5,
        breakTimeMinutes: 60,
        components: {
          basicWagePercent: 50,
          hraPercent: 50,
          standardAllowance: 5000,
          performanceBonusPercent: 10,
          ltaPercent: 5,
        },
        pfRatePercent: 12,
        professionalTax: 200,
      },
    };

    // 5. Save back to Local Storage
    const updatedEmployees = [...employees, newEmployee];
    localStorage.setItem('pp_employees', JSON.stringify(updatedEmployees));
    setEmployees(updatedEmployees);

    // 6. Set success screen info
    setSuccessData({ loginId, tempPass });
  };

  const handleCopyCredentials = () => {
    if (successData) {
      const textToCopy = `Login ID: ${successData.loginId}\nPassword: ${successData.tempPass}`;
      navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="space-y-6">
      
      {/* Title and Top Actions bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 text-foreground">
            <Users className="h-6 w-6 text-primary" />
            Employee Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor attendance status, search records, and manage employee profiles.
          </p>
        </div>

        {/* Render "New" button ONLY if logged-in user is an Admin */}
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger
              render={
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs shadow-md transition-all">
                  <Plus className="h-4 w-4" />
                  New Employee
                </button>
              }
            />
            <DialogContent className="max-w-xl rounded-2xl sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Onboard New Employee
                </DialogTitle>
                <DialogDescription>
                  Enter base credentials. System will generate a Login ID and temporary password.
                </DialogDescription>
              </DialogHeader>

              {successData ? (
                /* Success Screen displaying Generated Credentials */
                <div className="space-y-5 py-4">
                  <div className="p-4 bg-success/10 border border-success/30 rounded-2xl text-center">
                    <span className="text-xs font-bold text-success uppercase tracking-wider block">Employee Registered Successfully!</span>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Share the credentials below with the employee. They can sign in and change their password.
                    </p>
                  </div>

                  <div className="space-y-3 bg-muted/40 p-4 rounded-2xl border border-border/50 font-mono text-sm">
                    <div className="flex items-center justify-between border-b border-border/30 pb-2">
                      <span className="text-xs text-muted-foreground font-sans">Generated Login ID:</span>
                      <span className="font-bold text-foreground text-right">{successData.loginId}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground font-sans">Temporary Password:</span>
                      <span className="font-bold text-accent text-right">{successData.tempPass}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopyCredentials}
                      variant="outline"
                      className="flex-1 rounded-xl flex items-center justify-center gap-2 h-10 font-bold"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-4 w-4 text-success" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy Credentials</span>
                        </>
                      )}
                    </Button>
                    <DialogClose
                      render={
                        <Button className="flex-1 rounded-xl bg-primary h-10 font-bold">
                          Done
                        </Button>
                      }
                    />
                  </div>
                </div>
              ) : (
                /* Onboarding Form */
                <form onSubmit={handleCreateEmployee} className="space-y-4 pt-2">
                  {errorMsg && (
                    <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="e.g. John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="rounded-xl h-9"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="e.g. Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="rounded-xl h-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="newEmail">Email Address *</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        placeholder="john.doe@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-xl h-9"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="newPhone">Phone Number *</Label>
                      <Input
                        id="newPhone"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="rounded-xl h-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="newRole">System Access Role</Label>
                      <Select
                        id="newRole"
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="rounded-xl h-9"
                      >
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="newStatus">Attendance Status</Label>
                      <Select
                        id="newStatus"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="rounded-xl h-9"
                      >
                        <SelectItem value="present">Present (🟢)</SelectItem>
                        <SelectItem value="leave">On Leave (✈️)</SelectItem>
                        <SelectItem value="absent">Absent (🟡)</SelectItem>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="newManager">Reporting Manager</Label>
                      <Input
                        id="newManager"
                        placeholder="Divya Hinduja"
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                        className="rounded-xl h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="newLocation">Work Location</Label>
                      <Input
                        id="newLocation"
                        placeholder="Mumbai, India"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="rounded-xl h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="newEmpCode">Emp Code Override</Label>
                      <Input
                        id="newEmpCode"
                        placeholder="EMP2026007"
                        value={empCode}
                        onChange={(e) => setEmpCode(e.target.value)}
                        className="rounded-xl h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="newDoj">Date of Joining</Label>
                    <Input
                      id="newDoj"
                      type="date"
                      value={dateOfJoining}
                      onChange={(e) => setDateOfJoining(e.target.value)}
                      className="rounded-xl h-9"
                    />
                  </div>

                  <DialogFooter className="mt-4">
                    <DialogClose
                      render={
                        <Button variant="outline" className="rounded-xl">
                          Cancel
                        </Button>
                      }
                    />
                    <Button type="submit" className="rounded-xl bg-primary font-bold">
                      Add Employee
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Employee List Grid */}
      <EmployeeGrid employees={employees} />

    </div>
  );
};
export default DashboardPage;
