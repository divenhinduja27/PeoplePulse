import React from 'react';
import type { Employee } from '../../types';
import { EmployeeCard } from './EmployeeCard';
import { useEmployeeSearch } from '../../hooks/useEmployeeSearch';
import { Input } from '../ui/input';
import { Search, UserX } from 'lucide-react';

interface EmployeeGridProps {
  employees: Employee[];
}

export const EmployeeGrid: React.FC<EmployeeGridProps> = ({ employees }) => {
  const { searchQuery, setSearchQuery, filteredEmployees } = useEmployeeSearch(employees);

  return (
    <div className="space-y-6">

      {/* Header and Live Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl border-border focus-visible:ring-primary/20 bg-background/50"
          />
        </div>
        <div className="text-xs text-muted-foreground font-semibold px-3 py-1.5 bg-muted rounded-lg border border-border/30">
          Showing <span className="text-foreground font-bold">{filteredEmployees.length}</span> of {employees.length} employees
        </div>
      </div>

      {/* Grid List */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="empty-state-card">
          <div className="empty-state-icon-wrap bg-destructive/10 text-destructive border border-destructive/20 shadow-inner">
            <UserX className="h-6 w-6" />
          </div>
          <h3 className="empty-state-title">No employees found</h3>
          <p className="empty-state-text">
            We couldn't find any employees matching "{searchQuery}". Double-check your spelling or query ID.
          </p>
        </div>
      )}

    </div>
  );
};
