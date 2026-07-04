import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Check, X, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { mockEmployees } from '../../data/mockEmployees';

interface LeaveRequest {
  id: string;
  employeeName: string;
  avatarUrl: string;
  startDate: string;
  endDate: string;
  type: 'Paid Time Off' | 'Sick Leave' | 'Unpaid Leave';
  status: 'Pending' | 'Approved' | 'Rejected';
}

const mockRequests: LeaveRequest[] = [
  {
    id: 'req1',
    employeeName: mockEmployees[0].name,
    avatarUrl: mockEmployees[0].avatarUrl,
    startDate: '28/10/2025',
    endDate: '30/10/2025',
    type: 'Paid Time Off',
    status: 'Pending',
  },
  {
    id: 'req2',
    employeeName: mockEmployees[1].name,
    avatarUrl: mockEmployees[1].avatarUrl,
    startDate: '12/11/2025',
    endDate: '14/11/2025',
    type: 'Sick Leave',
    status: 'Approved',
  },
  {
    id: 'req3',
    employeeName: mockEmployees[2].name,
    avatarUrl: mockEmployees[2].avatarUrl,
    startDate: '01/12/2025',
    endDate: '05/12/2025',
    type: 'Unpaid Leave',
    status: 'Rejected',
  },
  {
    id: 'req4',
    employeeName: mockEmployees[3].name,
    avatarUrl: mockEmployees[3].avatarUrl,
    startDate: '10/10/2025',
    endDate: '12/10/2025',
    type: 'Paid Time Off',
    status: 'Pending',
  },
];

export const AdminTimeOffView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<LeaveRequest[]>(mockRequests);

  const filteredRequests = requests.filter(req =>
    req.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: action } : req
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md rounded-xl flex items-center gap-2">
          <Plus className="h-4 w-4" />
          NEW
        </Button>
        <div className="relative w-full sm:max-w-md flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Searchbar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-card border-border/50"
          />
        </div>
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

      {/* Leave Requests Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Time off Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.avatarUrl}
                      alt={req.employeeName}
                      className="h-8 w-8 rounded-full object-cover border border-border/50"
                    />
                    <span>{req.employeeName}</span>
                  </div>
                </TableCell>
                <TableCell>{req.startDate}</TableCell>
                <TableCell>{req.endDate}</TableCell>
                <TableCell>
                  <span className={cn(
                    "font-semibold",
                    req.type === 'Paid Time Off' ? "text-primary" :
                      req.type === 'Sick Leave' ? "text-blue-500" : "text-orange-500"
                  )}>
                    {req.type}
                  </span>
                </TableCell>
                <TableCell>
                  {req.status === 'Pending' ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 rounded border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
                        onClick={() => handleAction(req.id, 'Rejected')}
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 rounded border-success/30 text-success hover:bg-success hover:text-white"
                        onClick={() => handleAction(req.id, 'Approved')}
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide",
                      req.status === 'Approved' ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                    )}>
                      {req.status}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No leave requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
