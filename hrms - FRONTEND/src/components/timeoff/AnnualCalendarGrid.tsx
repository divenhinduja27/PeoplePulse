import React from 'react';
import { cn } from '../../lib/utils';

interface LeaveEvent {
  date: string; // ISO format or 'YYYY-MM-DD'
  type: 'approved' | 'pending' | 'holiday';
}

interface AnnualCalendarGridProps {
  year: number;
  events: LeaveEvent[];
}

export const AnnualCalendarGrid: React.FC<AnnualCalendarGridProps> = ({ year, events }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Helper to get color for a date if an event exists
  const getEventClass = (dateStr: string) => {
    const event = events.find(e => e.date === dateStr);
    if (!event) return '';
    switch(event.type) {
      case 'approved': return 'bg-success text-success-foreground font-bold shadow-md';
      case 'pending': return 'bg-orange-500 text-white font-bold shadow-md';
      case 'holiday': return 'bg-destructive/10 text-destructive font-bold';
      default: return '';
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm overflow-x-auto">
      <div className="flex flex-col xl:flex-row gap-8 min-w-[800px]">
        {/* Calendar Grid - 12 Months */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 flex-1">
          {months.map((month, monthIndex) => {
            const firstDay = new Date(year, monthIndex, 1).getDay();
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            
            return (
              <div key={month} className="flex flex-col">
                <h4 className="font-bold text-sm mb-3">
                  {month} {year}
                </h4>
                
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {daysOfWeek.map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-muted-foreground">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-6" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const eventClass = getEventClass(dateStr);
                    const isToday = new Date().toISOString().split('T')[0] === dateStr;

                    return (
                      <div 
                        key={day} 
                        className={cn(
                          "h-6 w-full flex items-center justify-center text-[11px] rounded-md",
                          eventClass ? eventClass : isToday ? "border border-primary font-bold text-primary" : "text-foreground"
                        )}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend Sidebar */}
        <div className="w-full xl:w-64 border-l border-border/50 pl-0 xl:pl-8 pt-8 xl:pt-0 shrink-0">
          <div className="sticky top-4">
            <h4 className="font-bold text-sm mb-4">Legend</h4>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-md bg-success shadow-sm" />
                <span className="text-xs font-medium">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-md bg-orange-500 shadow-sm" />
                <span className="text-xs font-medium">To Approve (Pending)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-md bg-destructive/10 border border-destructive/20" />
                <span className="text-xs font-medium">Public Holiday</span>
              </div>
            </div>

            <h4 className="font-bold text-sm mb-3">Public holidays</h4>
            <div className="space-y-2.5">
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Jan 14, 2026 : Kite Festival</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Jan 26, 2026 : Republic Day</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Mar 4, 2026 : Dhuleti</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Aug 15, 2026 : Independence Day</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Aug 19, 2026 : Rakhi</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Oct 2, 2026 : Gandhi Jayanti</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Nov 8, 2026 : Diwali</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Nov 10, 2026 : New Year</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
