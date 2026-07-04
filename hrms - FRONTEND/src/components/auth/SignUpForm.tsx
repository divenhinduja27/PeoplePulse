import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Sparkles, Upload, FileImage, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Employee } from '../../types';
import { mockEmployees } from '../../data/mockEmployees';

const signUpSchema = z
  .object({
    companyName: z.string().min(2, { message: 'Company Name must be at least 2 characters' }),
    adminName: z.string().min(2, { message: 'Admin Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm password must be at least 6 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { companyName: '', adminName: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setLogoPreview(null);
  };

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    // Save registered admin account to local storage employee directory
    const saved = localStorage.getItem('pp_employees');
    let list: Employee[] = saved ? JSON.parse(saved) : [...mockEmployees];

    // Extract company initials
    const words = data.companyName.trim().split(/\s+/);
    const companyInitials = words.map(w => w[0]).join('').toUpperCase().substring(0, 3) || 'PP';

    const adminId = `${companyInitials}ADM20260001`;

    const newAdmin: Employee = {
      id: adminId,
      name: data.adminName,
      email: data.email,
      phone: data.phone,
      avatarUrl: logoPreview || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120",
      status: "present",
      manager: "Board of Directors",
      location: "Mumbai, India",
      about: `Company Administrator at ${data.companyName}.`,
      skills: ["Management", "Administration"],
      interests: [],
      certifications: [],
      resume: [],
      privateInfo: {
        dob: "1990-01-01",
        address: "Company Head Office",
        nationality: "Indian",
        personalEmail: data.email,
        gender: "Male",
        maritalStatus: "Single",
        dateOfJoining: "2026-07-04",
        accountNumber: "9120100" + Math.floor(100000 + Math.random() * 900000),
        bankName: "HDFC Bank",
        ifscCode: "HDFC0000004",
        panNo: "ABCD" + Math.floor(1000 + Math.random() * 9000) + "E",
        uanId: "100" + Math.floor(100000000 + Math.random() * 900000000),
        empCode: "ADM-001",
      },
      password: data.password, // Save their password!
      role: "admin",
      salary: {
        monthlyWage: 150000,
        workingDaysPerWeek: 5,
        breakTimeMinutes: 60,
        components: {
          basicWagePercent: 50,
          hraPercent: 50,
          standardAllowance: 10000,
          performanceBonusPercent: 20,
          ltaPercent: 10,
        },
        pfRatePercent: 12,
        professionalTax: 200,
      }
    };

    // Check if user already exists, if so update their password
    const existingIndex = list.findIndex(emp => emp.email.toLowerCase() === data.email.toLowerCase());
    if (existingIndex !== -1) {
      list[existingIndex] = {
        ...list[existingIndex],
        password: data.password,
        role: "admin"
      };
    } else {
      list.push(newAdmin);
    }

    localStorage.setItem('pp_employees', JSON.stringify(list));

    setSuccessMsg('Account created successfully! Redirecting...');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <Card className="w-full max-w-lg border border-border shadow-xl rounded-2xl bg-card overflow-hidden">
      <CardHeader className="space-y-1 text-center bg-muted/20 border-b border-border/50 py-5">
        <div className="flex justify-center mb-2">
          <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-md">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Onboard Company</CardTitle>
        <CardDescription>Register your company and configure administrative access</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {successMsg && (
            <div className="p-3 text-xs bg-success/15 text-success border border-success/30 rounded-xl font-medium animate-in fade-in">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="e.g. Acme Corp"
                {...register('companyName')}
                className="rounded-xl border-border focus-visible:ring-primary/20"
              />
              {errors.companyName && (
                <p className="text-destructive text-xs mt-0.5">{errors.companyName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adminName">Administrator Full Name</Label>
              <Input
                id="adminName"
                type="text"
                placeholder="e.g. John Doe"
                {...register('adminName')}
                className="rounded-xl border-border focus-visible:ring-primary/20"
              />
              {errors.adminName && (
                <p className="text-destructive text-xs mt-0.5">{errors.adminName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. admin@acmecorp.com"
                {...register('email')}
                className="rounded-xl border-border focus-visible:ring-primary/20"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-0.5">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. +91 9876543210"
                {...register('phone')}
                className="rounded-xl border-border focus-visible:ring-primary/20"
              />
              {errors.phone && (
                <p className="text-destructive text-xs mt-0.5">{errors.phone.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="rounded-xl border-border focus-visible:ring-primary/20"
              />
              {errors.password && (
                <p className="text-destructive text-xs mt-0.5">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className="rounded-xl border-border focus-visible:ring-primary/20"
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs mt-0.5">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          {/* Logo Upload with Preview */}
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-border rounded-2xl bg-muted/10">
              {logoPreview ? (
                <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-border shadow-sm bg-card group">
                  <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain p-1" />
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white rounded-xl"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground">
                  <FileImage className="h-8 w-8" />
                </div>
              )}

              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-semibold text-foreground">Upload your brand logo</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG up to 2MB</p>
                <label className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-bold hover:bg-muted cursor-pointer transition-all shadow-sm">
                  <Upload className="h-3.5 w-3.5" />
                  Select File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
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
                  <span>Onboarding...</span>
                </>
              ) : (
                'Sign Up Company'
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center bg-muted/10 border-t border-border/30 py-4 text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-bold hover:underline ml-1">
          Sign In
        </Link>
      </CardFooter>
    </Card>
  );
};
