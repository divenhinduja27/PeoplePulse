import { useState, useMemo } from 'react';
import type { Employee } from '../types';

export interface SalaryStates {
  monthlyWage: number;
  workingDaysPerWeek: number;
  breakTimeMinutes: number;
  basicWagePercent: number;
  hraPercent: number;
  standardAllowance: number;
  performanceBonusPercent: number;
  ltaPercent: number;
  pfRatePercent: number;
  professionalTax: number;
}

export function useSalaryCalculator(initialSalary: Employee['salary']) {
  const [monthlyWage, setMonthlyWage] = useState<number>(initialSalary.monthlyWage);
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState<number>(initialSalary.workingDaysPerWeek);
  const [breakTimeMinutes, setBreakTimeMinutes] = useState<number>(initialSalary.breakTimeMinutes);
  
  const [basicWagePercent, setBasicWagePercent] = useState<number>(initialSalary.components.basicWagePercent);
  const [hraPercent, setHraPercent] = useState<number>(initialSalary.components.hraPercent);
  const [standardAllowance, setStandardAllowance] = useState<number>(initialSalary.components.standardAllowance);
  const [performanceBonusPercent, setPerformanceBonusPercent] = useState<number>(initialSalary.components.performanceBonusPercent);
  const [ltaPercent, setLtaPercent] = useState<number>(initialSalary.components.ltaPercent);
  
  const [pfRatePercent, setPfRatePercent] = useState<number>(initialSalary.pfRatePercent);
  const [professionalTax, setProfessionalTax] = useState<number>(initialSalary.professionalTax);

  const calculations = useMemo(() => {
    const yearlyWage = monthlyWage * 12;
    const basicSalary = monthlyWage * (basicWagePercent / 100);
    const hra = basicSalary * (hraPercent / 100);
    const performanceBonus = basicSalary * (performanceBonusPercent / 100);
    const lta = basicSalary * (ltaPercent / 100);
    
    const sumOtherComponents = basicSalary + hra + standardAllowance + performanceBonus + lta;
    const fixedAllowance = monthlyWage - sumOtherComponents;

    const pfAmount = basicSalary * (pfRatePercent / 100);

    return {
      yearlyWage,
      basicSalary,
      hra,
      performanceBonus,
      lta,
      fixedAllowance,
      pfAmount,
      totalDeductions: professionalTax + pfAmount
    };
  }, [
    monthlyWage,
    basicWagePercent,
    hraPercent,
    standardAllowance,
    performanceBonusPercent,
    ltaPercent,
    pfRatePercent,
    professionalTax
  ]);

  return {
    // States
    monthlyWage,
    workingDaysPerWeek,
    breakTimeMinutes,
    basicWagePercent,
    hraPercent,
    standardAllowance,
    performanceBonusPercent,
    ltaPercent,
    pfRatePercent,
    professionalTax,
    
    // Setters
    setMonthlyWage,
    setWorkingDaysPerWeek,
    setBreakTimeMinutes,
    setBasicWagePercent,
    setHraPercent,
    setStandardAllowance,
    setPerformanceBonusPercent,
    setLtaPercent,
    setPfRatePercent,
    setProfessionalTax,
    
    // Computed Values
    ...calculations
  };
}
export type UseSalaryCalculatorType = ReturnType<typeof useSalaryCalculator>;
