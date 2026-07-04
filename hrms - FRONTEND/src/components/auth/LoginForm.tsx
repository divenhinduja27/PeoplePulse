import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '../../context/UserContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Sparkles, Eye, EyeOff, Loader2, KeyRound, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  emailOrId: z.string().min(1, { message: 'Login ID or Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login, completeFirstTimeReset } = useUser();
  const navigate = useNavigate();

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password Reset Flow for First-time Employee
  const [resetState, setResetState] = useState<{ active: boolean; employeeId: string } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrId: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg('');

    // Simulate minor network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const res = login(data.emailOrId, data.password);
    setIsLoading(false);

    if (res.success) {
      if (res.isFirstTimeEmployee && res.employeeId) {
        setResetState({ active: true, employeeId: res.employeeId });
      } else {
        navigate('/');
      }
    } else {
      setErrorMsg('Invalid login details. Please check and try again.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (newPassword.length < 6) {
      setResetError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    completeFirstTimeReset(resetState!.employeeId, newPassword);
    setResetSuccess(true);

    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md border border-border shadow-xl rounded-2xl bg-card overflow-hidden">
      {resetState?.active ? (
        /* FIRST-TIME PASSWORD RESET VIEW */
        <>
          <CardHeader className="space-y-1 text-center bg-muted/20 border-b border-border/50 py-6">
            <div className="flex justify-center mb-2">
              <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-md">
                <KeyRound className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
            <CardDescription>This is your first login. Please choose a secure password.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {resetSuccess ? (
              <div className="p-4 text-center space-y-2">
                <div className="flex justify-center">
                  <CheckCircle className="h-10 w-10 text-success animate-bounce" />
                </div>
                <h4 className="text-sm font-bold text-foreground">Password Set Successfully!</h4>
                <p className="text-xs text-muted-foreground">Logging you in to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                {resetError && (
                  <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-medium">
                    {resetError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-xl border-border focus-visible:ring-primary/20"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="rounded-xl border-border focus-visible:ring-primary/20"
                    required
                  />
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      'Reset & Sign In'
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </CardContent>
        </>
      ) : (
        /* NORMAL LOGIN VIEW */
        <>
          <CardHeader className="space-y-1 text-center bg-muted/20 border-b border-border/50 py-6">
            <div className="flex justify-center mb-2">
              <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-md">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription>Enter your HR credentials to log in to the portal</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-medium animate-in fade-in">
                  {errorMsg}
                </div>
              )}



              <div className="space-y-1.5">
                <Label htmlFor="emailOrId">Login ID / Email</Label>
                <Input
                  id="emailOrId"
                  type="text"
                  placeholder="e.g. PPAHHE20240001 or admin@company.com"
                  {...register('emailOrId')}
                  className="rounded-xl border-border focus-visible:ring-primary/20"
                />
                {errors.emailOrId && (
                  <p className="text-destructive text-xs mt-0.5">{errors.emailOrId.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className="rounded-xl border-border pr-10 focus-visible:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs mt-0.5">{errors.password.message}</p>
                )}
              </div>

              <div className="text-right">
                <a href="#" className="text-xs text-primary font-semibold hover:underline">
                  Forgot Password?
                </a>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center bg-muted/10 border-t border-border/30 py-4 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline ml-1">
              Sign Up
            </Link>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
