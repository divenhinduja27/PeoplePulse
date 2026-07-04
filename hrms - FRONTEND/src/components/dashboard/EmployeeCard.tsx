import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Employee } from '../../types';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { StatusDot } from '../shared/StatusDot';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmployeeCardProps {
  employee: Employee;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const navigate = useNavigate();

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  const handleCardClick = () => {
    // Navigate to that employee's profile in view-only mode
    navigate(`/profile/${employee.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={handleCardClick}
      className="cursor-pointer h-full"
    >
      <Card className="card-premium-hover h-full flex flex-col justify-between group p-5">

        {/* Status Dot in top right */}
        <div className="absolute top-4 right-4">
          <StatusDot status={employee.status} />
        </div>

        <div className="flex flex-col items-center text-center mt-3 flex-grow">
          {/* Avatar with dynamic glowing circular ring wrapper */}
          <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-border/50 to-border/80 group-hover:from-primary group-hover:to-accent transition-all duration-300 shadow-md">
            <Avatar className="h-16 w-16 border-2 border-card">
              <AvatarImage src={employee.avatarUrl} alt={employee.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>

          {/* Name & ID */}
          <h3 className="font-bold text-base text-foreground mt-3 group-hover:text-primary transition-colors">
            {employee.name}
          </h3>
          <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/40 mt-1 select-all">
            {employee.id}
          </span>

          <p className="text-xs text-accent font-semibold mt-2 px-2.5 py-0.5 rounded-full bg-accent/10">
            {employee.privateInfo.empCode || 'Employee'}
          </p>

          {/* Bio snippet */}
          <p className="text-xs text-muted-foreground mt-3 line-clamp-2 px-1">
            {employee.about || 'No description provided.'}
          </p>
        </div>

        {/* Quick Contact Info */}
        <div className="border-t border-border/40 pt-3.5 mt-4 text-xs text-muted-foreground space-y-1.5 w-full">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-muted-foreground/75" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-muted-foreground/75" />
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground/75" />
            <span className="truncate">{employee.location}</span>
          </div>
        </div>

      </Card>
    </motion.div>
  );
};
