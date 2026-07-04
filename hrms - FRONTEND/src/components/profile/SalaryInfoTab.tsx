import React from 'react';
import type { Employee } from '../../types';
import { useSalaryCalculator } from '../../hooks/useSalaryCalculator';
import { SalaryComponentsTable } from './SalaryComponentsTable';
import { PFContributionCard } from './PFContributionCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Coins } from 'lucide-react';

interface SalaryInfoTabProps {
  employee: Employee;
  isReadOnly: boolean;
  onSave?: (updatedEmployee: Employee) => void;
}

export const SalaryInfoTab: React.FC<SalaryInfoTabProps> = ({ employee, isReadOnly, onSave }) => {
  const calc = useSalaryCalculator(employee.salary);

  const triggerSave = () => {
    onSave?.({
      ...employee,
      salary: {
        monthlyWage: calc.monthlyWage,
        workingDaysPerWeek: calc.workingDaysPerWeek,
        breakTimeMinutes: calc.breakTimeMinutes,
        components: {
          basicWagePercent: calc.basicWagePercent,
          hraPercent: calc.hraPercent,
          standardAllowance: calc.standardAllowance,
          performanceBonusPercent: calc.performanceBonusPercent,
          ltaPercent: calc.ltaPercent,
        },
        pfRatePercent: calc.pfRatePercent,
        professionalTax: calc.professionalTax,
      },
    });
  };

  return (
    <div className="space-y-6">

      {/* Top Level Configuration */}
      <Card className="border border-border/50 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Wage & Scheduling Configuration
          </CardTitle>
          <CardDescription>Configure core salary rates and workplace durations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

            <div className="space-y-1.5">
              <Label htmlFor="monthlyWage">Monthly Wage (₹)</Label>
              <Input
                id="monthlyWage"
                type="number"
                value={calc.monthlyWage}
                onChange={(e) => calc.setMonthlyWage(parseFloat(e.target.value) || 0)}
                disabled={isReadOnly}
                className="rounded-xl h-9.5 text-sm font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="yearlyWage">Yearly Wage (₹)</Label>
              <Input
                id="yearlyWage"
                type="text"
                value={`₹${calc.yearlyWage.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                disabled
                className="rounded-xl h-9.5 text-sm bg-muted/50 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="workingDaysPerWeek">Working Days / Week</Label>
              <Input
                id="workingDaysPerWeek"
                type="number"
                value={calc.workingDaysPerWeek}
                onChange={(e) => calc.setWorkingDaysPerWeek(parseInt(e.target.value) || 0)}
                disabled={isReadOnly}
                className="rounded-xl h-9.5 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="breakTimeMinutes">Daily Break (Minutes)</Label>
              <Input
                id="breakTimeMinutes"
                type="number"
                value={calc.breakTimeMinutes}
                onChange={(e) => calc.setBreakTimeMinutes(parseInt(e.target.value) || 0)}
                disabled={isReadOnly}
                className="rounded-xl h-9.5 text-sm"
              />
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Side-by-side components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Components Table */}
        <div className="lg:col-span-2">
          <SalaryComponentsTable
            isReadOnly={isReadOnly}
            basicWagePercent={calc.basicWagePercent}
            hraPercent={calc.hraPercent}
            standardAllowance={calc.standardAllowance}
            performanceBonusPercent={calc.performanceBonusPercent}
            ltaPercent={calc.ltaPercent}
            basicSalary={calc.basicSalary}
            hra={calc.hra}
            performanceBonus={calc.performanceBonus}
            lta={calc.lta}
            fixedAllowance={calc.fixedAllowance}
            setBasicWagePercent={calc.setBasicWagePercent}
            setHraPercent={calc.setHraPercent}
            setStandardAllowance={calc.setStandardAllowance}
            setPerformanceBonusPercent={calc.setPerformanceBonusPercent}
            setLtaPercent={calc.setLtaPercent}
          />
        </div>

        {/* PF and Deductions Cards */}
        <div className="lg:col-span-1">
          <PFContributionCard
            isReadOnly={isReadOnly}
            pfRatePercent={calc.pfRatePercent}
            professionalTax={calc.professionalTax}
            pfAmount={calc.pfAmount}
            totalDeductions={calc.totalDeductions}
            setPfRatePercent={calc.setPfRatePercent}
            setProfessionalTax={calc.setProfessionalTax}
          />
        </div>
      </div>

      {/* Save Button for Admin edits */}
      {!isReadOnly && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={triggerSave}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-sm shadow-md transition-all"
          >
            Save Salary Structure
          </button>
        </div>
      )}

    </div>
  );
};
