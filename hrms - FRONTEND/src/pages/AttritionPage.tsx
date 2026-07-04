import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, CheckCircle, HelpCircle, BrainCircuit, Sparkles, MapPin, Calendar, CircleDollarSign } from 'lucide-react';
import { usePredictAttrition } from '../hooks/usePredictAttrition';
import type { Employee } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectItem } from '../components/ui/select';
import { Button } from '../components/ui/button';

// Zod Schema matching request format
const attritionFormSchema = z.object({
  employee_name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  overtime_flag: z.number().min(0).max(1),
  years_at_company: z.number().min(0, { message: 'Years must be 0 or greater' }),
  distance_from_home: z.number().min(0, { message: 'Distance must be 0 or greater' }),
  monthly_income: z.number().min(0, { message: 'Monthly income must be 0 or greater' }),
});

type AttritionFormValues = z.infer<typeof attritionFormSchema>;

export const AttritionPage: React.FC = () => {
  const { mutate, data: result, isPending, error } = usePredictAttrition();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('custom');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<AttritionFormValues>({
    resolver: zodResolver(attritionFormSchema),
    defaultValues: {
      employee_name: '',
      overtime_flag: 0,
      years_at_company: 0,
      distance_from_home: 0,
      monthly_income: 0,
    },
  });

  const overtimeVal = watch('overtime_flag');

  // Load existing employees to support pre-filling values
  useEffect(() => {
    const saved = localStorage.getItem('pp_employees');
    if (saved) {
      setEmployees(JSON.parse(saved));
    }
  }, []);

  const handleEmployeeSelect = (empId: string) => {
    setSelectedEmpId(empId);
    if (empId === 'custom') {
      reset({
        employee_name: '',
        overtime_flag: 0,
        years_at_company: 0,
        distance_from_home: 0,
        monthly_income: 0,
      });
      return;
    }

    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      // Calculate tenure years
      let tenure = 0;
      if (emp.privateInfo?.dateOfJoining) {
        const diffTime = Math.abs(new Date().getTime() - new Date(emp.privateInfo.dateOfJoining).getTime());
        tenure = parseFloat((diffTime / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));
      }

      // Estimate mock distance (e.g. based on address/location or default 10)
      const mockDistance = Math.floor(2 + (emp.name.charCodeAt(0) % 15)); // pseudo-random stable commute distance

      // Default overtime: mock based on employee status
      const mockOvertime = emp.status === 'leave' ? 0 : (emp.name.charCodeAt(1) % 2 === 0 ? 1 : 0);

      setValue('employee_name', emp.name);
      setValue('years_at_company', tenure);
      setValue('distance_from_home', mockDistance);
      setValue('monthly_income', emp.salary?.monthlyWage || 40000);
      setValue('overtime_flag', mockOvertime);
    }
  };

  const onSubmit = (values: AttritionFormValues) => {
    mutate(values);
  };

  return (
    <div className="space-y-6">
      
      {/* Title section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 text-foreground">
          <BrainCircuit className="h-6 w-6 text-primary" />
          AI Attrition Risk Predictor
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Utilize a Random Forest Classifier and Google Gemini to evaluate employee attrition probabilities and retrieve advisory insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Side: Onboarding/Predictor Form */}
        <Card className="border border-border/50 shadow-sm rounded-2xl bg-card">
          <CardHeader className="pb-4 border-b border-border/40">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              Employee Metrics
            </CardTitle>
            <CardDescription>
              Select an existing record or manually enter custom parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            
            {/* Quick Fill Dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor="quickFill">Quick Fill from Employee Profile</Label>
              <Select
                id="quickFill"
                value={selectedEmpId}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
                className="rounded-xl h-9.5"
              >
                <SelectItem value="custom">-- Custom Free Text Entry --</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.id})
                  </SelectItem>
                ))}
              </Select>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
              
              <div className="space-y-1.5">
                <Label htmlFor="employee_name">Employee Name</Label>
                <Input
                  id="employee_name"
                  placeholder="e.g. John Doe"
                  {...register('employee_name')}
                  className="rounded-xl h-9.5"
                  disabled={selectedEmpId !== 'custom'}
                  required
                />
                {errors.employee_name && (
                  <p className="text-destructive text-xs mt-0.5">{errors.employee_name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="years_at_company" className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Years at Company
                  </Label>
                  <Input
                    id="years_at_company"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 3.5"
                    {...register('years_at_company', { valueAsNumber: true })}
                    className="rounded-xl h-9.5 text-sm"
                    required
                  />
                  {errors.years_at_company && (
                    <p className="text-destructive text-xs mt-0.5">{errors.years_at_company.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="distance_from_home" className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Commute Distance (Miles)
                  </Label>
                  <Input
                    id="distance_from_home"
                    type="number"
                    placeholder="e.g. 12"
                    {...register('distance_from_home', { valueAsNumber: true })}
                    className="rounded-xl h-9.5 text-sm"
                    required
                  />
                  {errors.distance_from_home && (
                    <p className="text-destructive text-xs mt-0.5">{errors.distance_from_home.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="monthly_income" className="flex items-center gap-1">
                    <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    Monthly Income (₹)
                  </Label>
                  <Input
                    id="monthly_income"
                    type="number"
                    placeholder="e.g. 60000"
                    {...register('monthly_income', { valueAsNumber: true })}
                    className="rounded-xl h-9.5 text-sm"
                    required
                  />
                  {errors.monthly_income && (
                    <p className="text-destructive text-xs mt-0.5">{errors.monthly_income.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="overtime_flag">Works Overtime?</Label>
                  <Select
                    id="overtime_flag"
                    value={String(overtimeVal)}
                    onChange={(e) => setValue('overtime_flag', parseInt(e.target.value, 10))}
                    className="rounded-xl h-9.5 text-sm"
                  >
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-10 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing features...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="h-4.5 w-4.5" />
                    <span>Run Attrition Prediction</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Side: Prediction Result Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {isPending ? (
              /* Loading view */
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border/50 rounded-2xl shadow-sm min-h-[400px]"
              >
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <h4 className="text-sm font-bold text-foreground">Calculating exit probabilities...</h4>
                <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">
                  Feeding factors to Random Forest Classifier and invoking Gemini API advisory...
                </p>
              </motion.div>
            ) : error ? (
              /* Error view */
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 text-center space-y-4 bg-destructive/10 border border-destructive/20 rounded-2xl shadow-sm min-h-[400px] flex flex-col justify-center items-center"
              >
                <div className="bg-destructive/15 p-3 rounded-full text-destructive">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Failed to reach AI service</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    Ensure the FastAPI microservice is running locally at <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">http://localhost:8000</code>.
                  </p>
                  <p className="text-[10px] text-destructive/80 mt-2 font-mono">{error.message}</p>
                </div>
              </motion.div>
            ) : result ? (
              /* Prediction Success Panel */
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col"
              >
                {/* Result header */}
                <div className="p-5 border-b border-border/40 bg-muted/20 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Prediction Assessment</h3>
                    <p className="text-[10px] text-muted-foreground leading-none mt-1">Based on random forest classification</p>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm ${
                      result.risk_category === 'HIGH'
                        ? 'bg-destructive/15 text-destructive border border-destructive/30'
                        : result.risk_category === 'MEDIUM'
                        ? 'bg-warning/15 text-warning border border-warning/30'
                        : 'bg-success/15 text-success border border-success/30'
                    }`}
                  >
                    {result.risk_category} RISK
                  </span>
                </div>

                <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                  {/* Gauge indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-semibold text-muted-foreground">Exit Probability</span>
                      <span className="text-xl font-extrabold font-mono text-primary leading-none">{result.risk_score}%</span>
                    </div>
                    
                    <div className="h-3 rounded-full bg-muted border border-border/40 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          result.risk_category === 'HIGH'
                            ? 'bg-destructive'
                            : result.risk_category === 'MEDIUM'
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{ width: `${result.risk_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Primary Drivers */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-extrabold tracking-wider text-muted-foreground uppercase block">Primary Attrition Drivers</span>
                    <div className="flex flex-wrap gap-2">
                      {result.top_factors && result.top_factors.length > 0 ? (
                        result.top_factors.map((factor) => (
                          <span
                            key={factor}
                            className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-accent/10 text-accent border border-accent/25"
                          >
                            {factor === 'OverTime'
                              ? 'Frequent Overtime'
                              : factor === 'MonthlyIncome'
                              ? 'Compensation Level'
                              : factor === 'DistanceFromHome'
                              ? 'Long Commute Distance'
                              : factor === 'YearsAtCompany'
                              ? 'Company Tenure'
                              : factor}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No extreme drivers identified.</span>
                      )}
                    </div>
                  </div>

                  {/* Advisory Box */}
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/30 flex gap-3.5">
                    <div className="shrink-0 mt-0.5">
                      {result.risk_category === 'HIGH' ? (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      ) : result.risk_category === 'MEDIUM' ? (
                        <HelpCircle className="h-5 w-5 text-warning" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-foreground">HR Advisory & AI Insights</h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {result.ai_insight}
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              /* Empty state */
              <motion.div
                key="empty"
                className="flex flex-col items-center justify-center p-8 py-20 text-center bg-card border-2 border-dashed border-border/50 rounded-2xl shadow-sm min-h-[400px] relative overflow-hidden"
              >
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10" />
                <div className="bg-primary/10 p-4 rounded-full text-primary mb-4 shadow-inner">
                  <BrainCircuit className="h-8 w-8 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-foreground">No calculations executed yet</h4>
                <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">
                  Fill out the parameters on the left or load statistics from an employee profile to compute their exit probability.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
export default AttritionPage;
