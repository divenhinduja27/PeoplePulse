import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectItem } from '../ui/select';
import { Input } from '../ui/input';
import { UploadCloud, Calendar, User, FileText, PhoneCall, Users2, HelpCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface TimeOffRequestModalProps {
  children: React.ReactElement;
  onRequestSubmitted?: () => void;
}

export const TimeOffRequestModal: React.FC<TimeOffRequestModalProps> = ({ children, onRequestSubmitted }) => {
  const { currentUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  // Form Fields State
  const [leaveCategory, setLeaveCategory] = useState('Paid Time Off');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [delegatedTo, setDelegatedTo] = useState('None');
  const [fileName, setFileName] = useState('');

  // Auto calculate duration in days
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
    if (!startDate || !endDate) return;

    // Save request to localStorage
    const saved = localStorage.getItem('pp_leave_requests');
    let requests = [];
    if (saved) {
      requests = JSON.parse(saved);
    } else {
      requests = [
        {
          id: 'req1',
          employeeName: currentUser?.name || 'Gaurav Manwani',
          avatarUrl: currentUser?.avatarUrl || '',
          startDate: '2026-05-13',
          endDate: '2026-05-14',
          type: 'Paid Time Off',
          status: 'Approved',
        }
      ];
    }

    const newRequest = {
      id: 'req_' + Date.now(),
      employeeName: currentUser?.name || 'Gaurav Manwani',
      avatarUrl: currentUser?.avatarUrl || '',
      startDate,
      endDate,
      type: leaveCategory,
      status: 'Pending',
      meta: {
        reason,
        emergencyPhone,
        delegatedTo,
        fileName
      }
    };

    requests.push(newRequest);
    localStorage.setItem('pp_leave_requests', JSON.stringify(requests));

    setIsOpen(false);
    
    // Reset form
    setLeaveCategory('Paid Time Off');
    setStartDate('');
    setEndDate('');
    setReason('');
    setEmergencyPhone('');
    setDelegatedTo('None');
    setFileName('');

    if (onRequestSubmitted) {
      onRequestSubmitted();
    } else {
      window.location.reload();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setLeaveCategory('Paid Time Off');
      setStartDate('');
      setEndDate('');
      setReason('');
      setEmergencyPhone('');
      setDelegatedTo('None');
      setFileName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children} />
      <DialogContent className="max-w-lg w-[calc(100%-2rem)] rounded-2xl p-0 bg-card border border-border/50 shadow-2xl overflow-hidden font-sans">
        
        {/* Glow Header Accent */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-purple-600" />
        
        <div className="p-6 space-y-5">
          <DialogHeader className="pb-3 border-b border-border/30">
            <DialogTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-primary" />
              Application for Leave of Absence
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
            
            {/* Applicant Profile Bar */}
            <div className="p-3 bg-white/[0.03] rounded-xl border border-border/40 flex items-center gap-3">
              <div className="h-8.5 w-8.5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-muted-foreground uppercase font-extrabold tracking-wider leading-none">Employee Applicant</span>
                <span className="text-xs font-bold text-foreground mt-1.5">{currentUser?.name || 'Gaurav Manwani'}</span>
              </div>
            </div>

            {/* Leave Category Selector */}
            <div className="space-y-1.5 text-left">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground/80" />
                Leave Category
              </Label>
              <Select value={leaveCategory} onChange={(e) => setLeaveCategory(e.target.value)} className="w-full">
                <SelectItem value="Paid Time Off">Paid Time Off (PTO)</SelectItem>
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
              </Select>
            </div>

            {/* Validity Dates Period */}
            <div className="space-y-1.5 text-left">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
                Validity Period
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2">
                <Input
                  type="date"
                  className="h-10 rounded-xl bg-card border-border/50 w-full text-xs font-semibold"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <span className="text-muted-foreground text-xs font-bold px-1 text-center">To</span>
                <Input
                  type="date"
                  className="h-10 rounded-xl bg-card border-border/50 w-full text-xs font-semibold"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Allocation Days Computed Info Banner */}
            <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/15 rounded-xl select-none">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Requested Duration</span>
              <div className="flex items-center gap-1 font-black text-primary text-xs">
                <span className="text-sm font-black">{allocationDays.toFixed(1)}</span>
                <span>Days</span>
              </div>
            </div>

            {/* Delegated task person & Emergency contact grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Emergency Contact Number */}
              <div className="space-y-1.5 text-left">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <PhoneCall className="h-3.5 w-3.5 text-muted-foreground/80" />
                  Emergency Contact
                </Label>
                <Input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="h-10 rounded-xl bg-card border-border/50 w-full text-xs font-semibold"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                />
              </div>

              {/* Task Delegate Dropdown */}
              <div className="space-y-1.5 text-left">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Users2 className="h-3.5 w-3.5 text-muted-foreground/80" />
                  Task Handover To
                </Label>
                <Select value={delegatedTo} onChange={(e) => setDelegatedTo(e.target.value)} className="w-full">
                  <SelectItem value="None">None (No handover)</SelectItem>
                  <SelectItem value="Aarav Hegde">Aarav Hegde</SelectItem>
                  <SelectItem value="Sanya Sharma">Sanya Sharma</SelectItem>
                  <SelectItem value="Rohan Patel">Rohan Patel</SelectItem>
                  <SelectItem value="Neha Gupta">Neha Gupta</SelectItem>
                </Select>
              </div>
            </div>

            {/* Textarea Reason for Leave Request */}
            <div className="space-y-1.5 text-left">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/80" />
                Reason for Leave
              </Label>
              <textarea
                placeholder="Brief description explaining why you require this leave..."
                className="form-control h-20 rounded-xl bg-card border border-border/50 w-full p-2.5 text-xs placeholder:text-muted-foreground/60 resize-none outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {/* Supporting documents attachment area */}
            <div className="space-y-1.5 text-left">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Support Documents (Optional)
              </Label>
              <div className="flex items-center gap-3 p-3 border border-dashed border-border/60 rounded-xl bg-muted/10">
                <label className="cursor-pointer shrink-0">
                  <input type="file" className="hidden" onChange={handleFileChange} />
                  <div className="bg-primary hover:bg-primary/95 text-white p-2.5 rounded-lg shadow-sm transition-colors">
                    <UploadCloud className="h-4 w-4" />
                  </div>
                </label>
                <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                  {fileName ? fileName : "Upload slip (PDF, JPG, PNG)"}
                </span>
              </div>
            </div>

            {/* Actions Form Footer */}
            <DialogFooter className="mt-6 pt-4 border-t border-border/30 flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
              <DialogClose render={
                <Button type="button" variant="outline" className="w-full sm:w-28 rounded-xl font-bold bg-secondary/40 border-border/50 hover:bg-secondary/70">
                  Discard
                </Button>
              } />
              <Button type="submit" className="w-full sm:w-28 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-sm transition-all duration-200">
                Apply Leave
              </Button>
            </DialogFooter>

          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
