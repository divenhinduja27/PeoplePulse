import React from 'react';
import { Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusType = 'present' | 'leave' | 'absent';

interface StatusDotProps {
  status: StatusType;
  className?: string;
  showText?: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, className, showText = false }) => {
  let indicator: React.ReactNode;
  let text = '';
  let colorClass = '';

  switch (status) {
    case 'present':
      indicator = <span className="h-3 w-3 rounded-full bg-success ring-4 ring-success/20 animate-pulse" />;
      text = 'Present';
      colorClass = 'text-success';
      break;
    case 'leave':
      indicator = (
        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-accent/20 text-accent ring-2 ring-accent/10">
          <Plane className="h-3.5 w-3.5" />
        </span>
      );
      text = 'On Leave';
      colorClass = 'text-accent';
      break;
    case 'absent':
      indicator = <span className="h-3 w-3 rounded-full bg-warning ring-4 ring-warning/20" />;
      text = 'Absent';
      colorClass = 'text-warning';
      break;
  }

  return (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      {indicator}
      {showText && (
        <span className={cn("text-xs font-semibold uppercase tracking-wider", colorClass)}>
          {text}
        </span>
      )}
    </div>
  );
};
