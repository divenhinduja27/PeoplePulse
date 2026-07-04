import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectItem } from '../ui/select';
import { Input } from '../ui/input';
import { UploadCloud } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface TimeOffRequestModalProps {
  children: React.ReactNode;
}

export const TimeOffRequestModal: React.FC<TimeOffRequestModalProps> = ({ children }) => {
  const { currentUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [leaveType, setLeaveType] = useState('Paid Time Off');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fileName, setFileName] = useState('');

  // Auto calculate mock allocation days
  let allocationDays = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end >= start) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      allocationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally would send to API here
    setIsOpen(false);

    // Reset form
    setStartDate('');
    setEndDate('');
    setFileName('');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setStartDate('');
      setEndDate('');
      setFileName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Time off Type Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label className="text-right text-muted-foreground font-semibold">Employee</Label>
            <div className="font-semibold text-primary">
              [{currentUser?.name}]
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label className="text-right text-muted-foreground font-semibold">Time off Type</Label>
            <Select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
              <SelectItem value="Paid Time Off">Paid time off</SelectItem>
              <SelectItem value="Sick Leave">Sick Leave</SelectItem>
              <SelectItem value="Unpaid Leave">Unpaid Leaves</SelectItem>
            </Select>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label className="text-right text-muted-foreground font-semibold">Validity Period</Label>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                className="h-9 rounded-xl"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <span className="text-muted-foreground text-sm font-semibold">To</span>
              <Input
                type="date"
                className="h-9 rounded-xl"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label className="text-right text-muted-foreground font-semibold">Allocation</Label>
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-primary text-lg">{allocationDays.toFixed(2).padStart(5, '0')}</span>
              <span className="text-primary">Days</span>
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label className="text-right text-muted-foreground font-semibold">Attachment:</Label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input type="file" className="hidden" onChange={handleFileChange} />
                <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-md hover:bg-primary/90 transition-colors">
                  <UploadCloud className="h-5 w-5" />
                </div>
              </label>
              <span className="text-sm text-muted-foreground">
                {fileName ? fileName : "(For sick leave certificate)"}
              </span>
            </div>
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            <Button type="submit" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold w-24">
              Submit
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-xl bg-secondary hover:bg-secondary/80 font-bold w-24">
                Discard
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
