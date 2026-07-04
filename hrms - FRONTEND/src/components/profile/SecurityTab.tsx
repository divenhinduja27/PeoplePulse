import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { KeyRound, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: z.string().min(6, { message: 'New password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm password must be at least 6 characters' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ['confirmPassword'],
  });

type SecurityFormValues = z.infer<typeof securitySchema>;

export const SecurityTab: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const { currentUser } = useUser();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data: SecurityFormValues) => {
    setIsLoading(true);
    setErrorMsg('');
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    if (!currentUser) {
      setErrorMsg('Session not found.');
      return;
    }

    const saved = localStorage.getItem('pp_employees');
    if (saved) {
      const employees = JSON.parse(saved);
      const index = employees.findIndex((emp: any) => emp.id === currentUser.id);
      if (index !== -1) {
        const emp = employees[index];
        const currentPass = emp.password || "password123";
        if (currentPass !== data.currentPassword) {
          setErrorMsg('Current password is incorrect.');
          return;
        }
        employees[index] = {
          ...emp,
          password: data.newPassword
        };
        localStorage.setItem('pp_employees', JSON.stringify(employees));
      }
    }

    setSuccessMsg('Password updated successfully!');
    reset();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <Card className="max-w-md border border-border/50 shadow-sm rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          Password Credentials
        </CardTitle>
        <CardDescription>Update your portal security key</CardDescription>
      </CardHeader>
      <CardContent>
        {successMsg && (
          <div className="mb-4 p-3 text-xs bg-success/15 text-success border border-success/30 rounded-xl font-medium flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle className="h-4 w-4" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-medium flex items-center gap-1.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              {...register('currentPassword')}
              className="rounded-xl h-9.5 text-sm"
            />
            {errors.currentPassword && (
              <p className="text-destructive text-xs mt-0.5">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...register('newPassword')}
              className="rounded-xl h-9.5 text-sm"
            />
            {errors.newPassword && (
              <p className="text-destructive text-xs mt-0.5">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className="rounded-xl h-9.5 text-sm"
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs mt-0.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
};
