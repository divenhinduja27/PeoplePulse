import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Landmark, ShieldAlert } from 'lucide-react';

interface PFContributionCardProps {
  isReadOnly: boolean;
  pfRatePercent: number;
  professionalTax: number;
  pfAmount: number;
  totalDeductions: number;
  
  setPfRatePercent: (val: number) => void;
  setProfessionalTax: (val: number) => void;
}

export const PFContributionCard: React.FC<PFContributionCardProps> = ({
  isReadOnly,
  pfRatePercent,
  professionalTax,
  pfAmount,
  totalDeductions,
  setPfRatePercent,
  setProfessionalTax,
}) => {
  return (
    <div className="space-y-6">
      
      {/* PF Card */}
      <Card className="border border-border/50 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Landmark className="h-4.5 w-4.5 text-accent" />
            Provident Fund (PF) Contribution
          </CardTitle>
          <CardDescription>Configure Employee & Employer PF contributions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-grow space-y-1">
              <Label htmlFor="pfRatePercent" className="text-xs">PF Rate (% of Basic)</Label>
              <Input
                id="pfRatePercent"
                type="number"
                value={pfRatePercent}
                onChange={(e) => setPfRatePercent(parseFloat(e.target.value) || 0)}
                disabled={isReadOnly}
                className="rounded-xl h-9"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4 text-xs">
            <div className="bg-muted/30 p-3 rounded-xl border border-border/30">
              <span className="text-muted-foreground block font-medium">Employee Contribution</span>
              <span className="text-base font-bold font-mono mt-1 block">
                ₹{pfAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">({pfRatePercent}% of Basic)</span>
            </div>
            <div className="bg-muted/30 p-3 rounded-xl border border-border/30">
              <span className="text-muted-foreground block font-medium">Employer Contribution</span>
              <span className="text-base font-bold font-mono mt-1 block">
                ₹{pfAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">({pfRatePercent}% of Basic)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Deductions Card */}
      <Card className="border border-border/50 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldAlert className="h-4.5 w-4.5 text-destructive" />
            Tax Deductions
          </CardTitle>
          <CardDescription>Adjust professional tax thresholds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="professionalTax" className="text-xs">Professional Tax (Monthly)</Label>
            <Input
              id="professionalTax"
              type="number"
              value={professionalTax}
              onChange={(e) => setProfessionalTax(parseFloat(e.target.value) || 0)}
              disabled={isReadOnly}
              className="rounded-xl h-9"
            />
          </div>

          <div className="border-t border-border/40 pt-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Deductions:</span>
            <span className="text-base font-bold font-mono text-destructive">
              ₹{totalDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
