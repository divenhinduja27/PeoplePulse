import React, { useState } from 'react';
import type { Employee, PrivateInfo } from '../../types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ShieldCheck, Landmark } from 'lucide-react';

interface PrivateInfoTabProps {
  employee: Employee;
  isReadOnly: boolean;
  onSave?: (updatedEmployee: Employee) => void;
}

export const PrivateInfoTab: React.FC<PrivateInfoTabProps> = ({ employee, isReadOnly, onSave }) => {
  const [formData, setFormData] = useState<PrivateInfo>({ ...employee.privateInfo });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.({
      ...employee,
      privateInfo: formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: Personal Details */}
        <Card className="border border-border/50 shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Confidential Info
            </CardTitle>
            <CardDescription>Protected personal documentation and attributes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                disabled={isReadOnly}
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Residing Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isReadOnly}
                className="rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="personalEmail">Personal Email</Label>
                <Input
                  id="personalEmail"
                  name="personalEmail"
                  type="email"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Input
                  id="maritalStatus"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dateOfJoining">Date of Joining</Label>
              <Input
                id="dateOfJoining"
                name="dateOfJoining"
                type="date"
                value={formData.dateOfJoining}
                onChange={handleChange}
                disabled={isReadOnly}
                className="rounded-xl text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Column 2: Bank Details */}
        <Card className="border border-border/50 shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5 text-accent" />
              Bank & Payroll Accounts
            </CardTitle>
            <CardDescription>Official transaction accounts and payroll mappings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="rounded-xl text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="rounded-xl text-sm font-mono uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="panNo">PAN Number</Label>
                <Input
                  id="panNo"
                  name="panNo"
                  value={formData.panNo}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="rounded-xl text-sm font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="uanId">UAN Number</Label>
                <Input
                  id="uanId"
                  name="uanId"
                  value={formData.uanId}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="rounded-xl text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="empCode">Employee Code</Label>
                <Input
                  id="empCode"
                  name="empCode"
                  value={formData.empCode}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="rounded-xl text-sm font-mono uppercase"
                />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {!isReadOnly && (
        <div className="flex justify-end mt-4">
          <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold px-6 shadow-sm">
            Save Security & Bank Info
          </Button>
        </div>
      )}
    </form>
  );
};
