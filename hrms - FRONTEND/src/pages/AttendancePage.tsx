import React from 'react';
import { useUser } from '../context/UserContext';
import { AdminAttendanceView } from '../components/attendance/AdminAttendanceView';
import { EmployeeAttendanceView } from '../components/attendance/EmployeeAttendanceView';

const AttendancePage: React.FC = () => {
  const { currentUser } = useUser();

  if (!currentUser) return null;

  return (
    <div className="w-full">
      {currentUser.role === 'admin' ? (
        <AdminAttendanceView />
      ) : (
        <EmployeeAttendanceView />
      )}
    </div>
  );
};

export default AttendancePage;
