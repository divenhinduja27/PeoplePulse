import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { mockEmployees } from '../../data/mockEmployees';

export const AllocationTab: React.FC = () => {
  // Mock allocation data mapped to employees
  const allocations = mockEmployees.map((emp, index) => ({
    id: emp.id,
    name: emp.name,
    avatarUrl: emp.avatarUrl,
    paidLeave: 24,
    sickLeave: 12,
    usedLeave: index % 3 === 0 ? 5 : index % 2 === 0 ? 2 : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Employee</TableHead>
              <TableHead>Total Paid Leave</TableHead>
              <TableHead>Total Sick Leave</TableHead>
              <TableHead>Used Leave</TableHead>
              <TableHead>Remaining (Paid)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map((alloc) => (
              <TableRow key={alloc.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <img 
                      src={alloc.avatarUrl} 
                      alt={alloc.name} 
                      className="h-8 w-8 rounded-full object-cover border border-border/50"
                    />
                    <span>{alloc.name}</span>
                  </div>
                </TableCell>
                <TableCell>{alloc.paidLeave} Days</TableCell>
                <TableCell>{alloc.sickLeave} Days</TableCell>
                <TableCell>
                  <span className={alloc.usedLeave > 0 ? "text-orange-500 font-semibold" : "text-muted-foreground"}>
                    {alloc.usedLeave} Days
                  </span>
                </TableCell>
                <TableCell className="font-bold text-success">
                  {alloc.paidLeave - alloc.usedLeave} Days
                </TableCell>
              </TableRow>
            ))}
            {allocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No allocation data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
