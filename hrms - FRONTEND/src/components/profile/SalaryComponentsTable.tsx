import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';

interface SalaryComponentsTableProps {
  isReadOnly: boolean;
  basicWagePercent: number;
  hraPercent: number;
  standardAllowance: number;
  performanceBonusPercent: number;
  ltaPercent: number;
  
  basicSalary: number;
  hra: number;
  performanceBonus: number;
  lta: number;
  fixedAllowance: number;
  
  setBasicWagePercent: (val: number) => void;
  setHraPercent: (val: number) => void;
  setStandardAllowance: (val: number) => void;
  setPerformanceBonusPercent: (val: number) => void;
  setLtaPercent: (val: number) => void;
}

export const SalaryComponentsTable: React.FC<SalaryComponentsTableProps> = ({
  isReadOnly,
  basicWagePercent,
  hraPercent,
  standardAllowance,
  performanceBonusPercent,
  ltaPercent,
  basicSalary,
  hra,
  performanceBonus,
  lta,
  fixedAllowance,
  setBasicWagePercent,
  setHraPercent,
  setStandardAllowance,
  setPerformanceBonusPercent,
  setLtaPercent,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">Monthly Salary Components</h3>
      <Table className="border border-border/50 rounded-xl overflow-hidden shadow-sm bg-card">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Component</TableHead>
            <TableHead className="w-1/3 text-right">Basis / %</TableHead>
            <TableHead className="w-1/3 text-right">Computed Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Basic Salary */}
          <TableRow>
            <TableCell className="font-semibold">Basic Salary</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Input
                  type="number"
                  value={basicWagePercent}
                  onChange={(e) => setBasicWagePercent(parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                  className="w-16 h-8 text-right px-1.5 rounded-lg text-xs"
                />
                <span className="text-xs text-muted-foreground">% of Wage</span>
              </div>
            </TableCell>
            <TableCell className="text-right font-mono font-bold text-foreground">
              ₹{basicSalary.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </TableCell>
          </TableRow>

          {/* HRA */}
          <TableRow>
            <TableCell className="font-semibold">House Rent Allowance (HRA)</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Input
                  type="number"
                  value={hraPercent}
                  onChange={(e) => setHraPercent(parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                  className="w-16 h-8 text-right px-1.5 rounded-lg text-xs"
                />
                <span className="text-xs text-muted-foreground">% of Basic</span>
              </div>
            </TableCell>
            <TableCell className="text-right font-mono font-bold text-foreground">
              ₹{hra.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </TableCell>
          </TableRow>

          {/* Standard Allowance */}
          <TableRow>
            <TableCell className="font-semibold">Standard Allowance</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs text-muted-foreground">Fixed: ₹</span>
                <Input
                  type="number"
                  value={standardAllowance}
                  onChange={(e) => setStandardAllowance(parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                  className="w-20 h-8 text-right px-1.5 rounded-lg text-xs"
                />
              </div>
            </TableCell>
            <TableCell className="text-right font-mono font-bold text-foreground">
              ₹{standardAllowance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </TableCell>
          </TableRow>

          {/* Performance Bonus */}
          <TableRow>
            <TableCell className="font-semibold">Performance Bonus</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Input
                  type="number"
                  value={performanceBonusPercent}
                  onChange={(e) => setPerformanceBonusPercent(parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                  className="w-16 h-8 text-right px-1.5 rounded-lg text-xs"
                />
                <span className="text-xs text-muted-foreground">% of Basic</span>
              </div>
            </TableCell>
            <TableCell className="text-right font-mono font-bold text-foreground">
              ₹{performanceBonus.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </TableCell>
          </TableRow>

          {/* LTA */}
          <TableRow>
            <TableCell className="font-semibold">Leave Travel Allowance (LTA)</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Input
                  type="number"
                  value={ltaPercent}
                  onChange={(e) => setLtaPercent(parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                  className="w-16 h-8 text-right px-1.5 rounded-lg text-xs"
                />
                <span className="text-xs text-muted-foreground">% of Basic</span>
              </div>
            </TableCell>
            <TableCell className="text-right font-mono font-bold text-foreground">
              ₹{lta.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </TableCell>
          </TableRow>

          {/* Fixed Allowance */}
          <TableRow className="bg-muted/10">
            <TableCell className="font-semibold text-primary">Fixed Allowance</TableCell>
            <TableCell className="text-right text-xs text-muted-foreground italic">
              Remainder amount (Wage - Sum)
            </TableCell>
            <TableCell className="text-right font-mono font-bold text-primary">
              ₹{fixedAllowance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
