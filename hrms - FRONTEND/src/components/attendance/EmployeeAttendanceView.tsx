import React, { useState } from 'react';
import { Button } from '../ui/button';
import { DatePicker } from '../ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export const EmployeeAttendanceView: React.FC = () => {
  const { currentUser, isCheckedIn, checkInTime } = useUser();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  if (!currentUser) return null;

  // Fetch attendance history for the logged-in employee from localStorage
  const attendanceHistory = (() => {
    const key = `pp_attendance_${currentUser.id}`;
    const saved = localStorage.getItem(key);
    const list = saved ? JSON.parse(saved) : [
      { date: '28/10/2025', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
      { date: '29/10/2025', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extraHours: '01:00' },
      { date: '30/10/2025', checkIn: '09:45', checkOut: '18:45', workHours: '09:00', extraHours: '00:00' },
      { date: '31/10/2025', checkIn: '10:15', checkOut: '19:30', workHours: '09:15', extraHours: '01:15' },
      { date: '01/11/2025', checkIn: '10:00', checkOut: '18:00', workHours: '08:00', extraHours: '00:00' },
    ];

    if (isCheckedIn && checkInTime) {
      const checkInDate = new Date(checkInTime);
      const pad = (num: number) => String(num).padStart(2, '0');
      const day = pad(checkInDate.getDate());
      const month = pad(checkInDate.getMonth() + 1);
      const year = checkInDate.getFullYear();
      const dateStr = `${day}/${month}/${year}`;
      const checkInStr = `${pad(checkInDate.getHours())}:${pad(checkInDate.getMinutes())}`;
      
      list.push({
        date: dateStr,
        checkIn: checkInStr,
        checkOut: 'Active',
        workHours: 'Active',
        extraHours: '--:--'
      });
    }
    return list;
  })();

  const presentDays = attendanceHistory.length;
  const leavesCount = 2;
  const totalWorkingDays = presentDays + leavesCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Attendance</h2>
      </div>

      {/* Filters and Summary Row */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-card border border-border/50 rounded-xl p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-auto">
            <DatePicker date={currentDate} onChange={setCurrentDate} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-card border border-border/50 rounded-xl px-4 py-2 flex flex-col justify-center items-center shadow-sm">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Count of days present</span>
            <span className="text-lg font-bold">{presentDays}</span>
          </div>
          <div className="bg-card border border-border/50 rounded-xl px-4 py-2 flex flex-col justify-center items-center shadow-sm">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Leaves count</span>
            <span className="text-lg font-bold">{leavesCount}</span>
          </div>
          <div className="bg-card border border-border/50 rounded-xl px-4 py-2 flex flex-col justify-center items-center shadow-sm">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total working days</span>
            <span className="text-lg font-bold">{totalWorkingDays}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/50 bg-muted/10">
          <h3 className="font-semibold text-sm">
            {currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Work Hours</TableHead>
              <TableHead>Extra hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceHistory.map((record: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{record.date}</TableCell>
                <TableCell>{record.checkIn}</TableCell>
                <TableCell>{record.checkOut}</TableCell>
                <TableCell>{record.workHours}</TableCell>
                <TableCell>{record.extraHours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
