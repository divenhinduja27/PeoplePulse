import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectItem } from '../ui/select';
import { DatePicker } from '../ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { mockEmployees } from '../../data/mockEmployees';
import type { Employee } from '../../types';

export const AdminAttendanceView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const [employeesList] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('pp_employees');
    return saved ? JSON.parse(saved) : mockEmployees;
  });

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const getAttendanceForDate = (empId: string) => {
    const pad = (num: number) => String(num).padStart(2, '0');
    const selectedDateStr = `${pad(currentDate.getDate())}/${pad(currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`;

    const key = `pp_attendance_${empId}`;
    const saved = localStorage.getItem(key);
    const getMockAttendanceDates = () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      monday.setDate(diff);

      const pad = (num: number) => String(num).padStart(2, '0');
      const formatDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

      const dates = [];
      for (let i = 0; i < 5; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        dates.push(formatDate(day));
      }
      return dates;
    };

    const mockDates = getMockAttendanceDates();
    const list = saved ? JSON.parse(saved) : [
      { date: mockDates[0], checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
      { date: mockDates[1], checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
      { date: mockDates[2], checkIn: '09:45', checkOut: '18:45', workHours: '09:00', extraHours: '00:00' },
      { date: mockDates[3], checkIn: '10:15', checkOut: '19:30', workHours: '09:15', extraHours: '01:15' },
      { date: mockDates[4], checkIn: '10:00', checkOut: '18:00', workHours: '08:00', extraHours: '00:00' },
    ];
    const record = list.find((r: any) => r.date === selectedDateStr);
    if (record) {
      return record;
    }
    // Check if the user is currently checked-in today:
    const isToday = new Date().toDateString() === currentDate.toDateString();
    const isCheckedInNow = localStorage.getItem(`pp_checked_in_${empId}`) === 'true';
    if (isToday && isCheckedInNow) {
      const checkInTimeStr = localStorage.getItem(`pp_check_in_time_${empId}`);
      if (checkInTimeStr) {
        const time = new Date(checkInTimeStr);
        return {
          checkIn: `${pad(time.getHours())}:${pad(time.getMinutes())}`,
          checkOut: '--:--',
          workHours: 'Active',
          extraHours: '--:--'
        };
      }
    }
    return {
      checkIn: '--:--',
      checkOut: '--:--',
      workHours: 'Absent',
      extraHours: '--:--'
    };
  };

  const filteredEmployees = employeesList.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Attendance</h2>
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-card border-border/50"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-card border border-border/50 rounded-xl p-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-auto">
          <DatePicker date={currentDate} onChange={setCurrentDate} />
        </div>
        <div className="w-32">
          <Select defaultValue="all">
            <SelectItem value="all">Day</SelectItem>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Emp</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Work Hours</TableHead>
              <TableHead>Extra hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((emp) => {
              const record = getAttendanceForDate(emp.id);
              return (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img 
                        src={emp.avatarUrl} 
                        alt={emp.name} 
                        className="h-8 w-8 rounded-full object-cover border border-border/50"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-xs">{emp.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{emp.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>{record.workHours}</TableCell>
                  <TableCell>{record.extraHours}</TableCell>
                </TableRow>
              );
            })}
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
