import React from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { AnnualCalendarGrid } from './AnnualCalendarGrid';
import { TimeOffRequestModal } from './TimeOffRequestModal';

const mockLeaveEvents = [
  // Approved
  { date: '2026-05-13', type: 'approved' as const },
  { date: '2026-05-14', type: 'approved' as const },
  // Pending
  { date: '2026-07-08', type: 'pending' as const },
  // Holidays (matching the legend)
  { date: '2026-01-14', type: 'holiday' as const },
  { date: '2026-01-26', type: 'holiday' as const },
  { date: '2026-03-04', type: 'holiday' as const },
  { date: '2026-08-15', type: 'holiday' as const },
  { date: '2026-08-19', type: 'holiday' as const },
  { date: '2026-10-02', type: 'holiday' as const },
  { date: '2026-11-08', type: 'holiday' as const },
  { date: '2026-11-10', type: 'holiday' as const },
];

export const EmployeeTimeOffView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <TimeOffRequestModal>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md rounded-xl flex items-center gap-2">
            <Plus className="h-4 w-4" />
            NEW
          </Button>
        </TimeOffRequestModal>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm text-center flex flex-col items-center justify-center">
          <h3 className="text-primary font-semibold">Paid time Off</h3>
          <p className="text-xl font-bold mt-2">24 Days Available</p>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm text-center flex flex-col items-center justify-center">
          <h3 className="text-secondary-foreground font-semibold">Sick time off</h3>
          <p className="text-xl font-bold mt-2">07 Days Available</p>
        </div>
      </div>

      {/* Annual Calendar View */}
      <AnnualCalendarGrid year={2026} events={mockLeaveEvents} />
    </div>
  );
};
