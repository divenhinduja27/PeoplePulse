import React, { useState } from 'react';
import type { Employee } from '../../types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, X, Award, Briefcase, Compass } from 'lucide-react';

interface MyProfileTabProps {
  employee: Employee;
  isReadOnly: boolean;
  onSave?: (updatedEmployee: Employee) => void;
}

export const MyProfileTab: React.FC<MyProfileTabProps> = ({ employee, isReadOnly, onSave }) => {
  const [formData, setFormData] = useState<Employee>({ ...employee });
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      const updated = {
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      };
      setFormData(updated);
      setNewSkill('');
      onSave?.(updated);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    if (isReadOnly) return;
    const updated = {
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    };
    setFormData(updated);
    onSave?.(updated);
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCert.trim() && !formData.certifications.includes(newCert.trim())) {
      const updated = {
        ...formData,
        certifications: [...formData.certifications, newCert.trim()],
      };
      setFormData(updated);
      setNewCert('');
      onSave?.(updated);
    }
  };

  const handleRemoveCert = (cert: string) => {
    if (isReadOnly) return;
    const updated = {
      ...formData,
      certifications: formData.certifications.filter((c) => c !== cert),
    };
    setFormData(updated);
    onSave?.(updated);
  };

  const triggerSave = () => {
    onSave?.(formData);
  };

  return (
    <div className="space-y-6">

      {/* Basic Contact Grid */}
      <Card className="border border-border/50 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            General Information
          </CardTitle>
          <CardDescription>View or update general workplace and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isReadOnly}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="id">Login ID (System Generated)</Label>
              <Input
                id="id"
                value={formData.id}
                disabled
                className="rounded-xl bg-muted/50 font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isReadOnly}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isReadOnly}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="manager">Reporting Manager</Label>
              <Input
                id="manager"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                disabled={isReadOnly}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Work Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isReadOnly}
                className="rounded-xl"
              />
            </div>

          </div>

          <div className="space-y-1.5">
            <Label htmlFor="about">About / Summary</Label>
            <textarea
              id="about"
              name="about"
              rows={3}
              value={formData.about}
              onChange={handleChange}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell us about yourself..."
            />
          </div>

          {!isReadOnly && (
            <div className="flex justify-end pt-2">
              <Button onClick={triggerSave} className="rounded-xl bg-primary text-primary-foreground font-semibold px-5">
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills & Certifications Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Skills */}
        <Card className="border border-border/50 shadow-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Compass className="h-5 w-5 text-accent" />
                Skills & Tech Stack
              </CardTitle>
              <CardDescription>Core competencies and technologies</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tag List */}
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="pl-3 pr-2 py-1 rounded-lg flex items-center gap-1.5 border border-border/40">
                    <span>{skill}</span>
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-muted-foreground hover:text-destructive transition-colors focus:outline-none"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.skills.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No skills added yet.</p>
                )}
              </div>
            </CardContent>
          </div>

          {!isReadOnly && (
            <div className="px-6 pb-6 pt-2 border-t border-border/40 bg-muted/10 rounded-b-2xl">
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g. Docker)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="rounded-xl"
                />
                <Button type="submit" size="sm" className="rounded-xl bg-accent text-accent-foreground font-bold px-3">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </Card>

        {/* Certifications */}
        <Card className="border border-border/50 shadow-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Certifications
              </CardTitle>
              <CardDescription>Official accreditations and credentials</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Cert List */}
              <ul className="space-y-2 mb-4">
                {formData.certifications.map((cert) => (
                  <li key={cert} className="flex items-center justify-between text-xs bg-muted/50 p-2.5 rounded-xl border border-border/40">
                    <span className="font-semibold text-foreground">{cert}</span>
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCert(cert)}
                        className="text-muted-foreground hover:text-destructive transition-colors focus:outline-none"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                ))}
                {formData.certifications.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No certifications added yet.</p>
                )}
              </ul>
            </CardContent>
          </div>

          {!isReadOnly && (
            <div className="px-6 pb-6 pt-2 border-t border-border/40 bg-muted/10 rounded-b-2xl">
              <form onSubmit={handleAddCert} className="flex gap-2">
                <Input
                  placeholder="Add certification (e.g. AWS)..."
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  className="rounded-xl"
                />
                <Button type="submit" size="sm" className="rounded-xl bg-primary text-primary-foreground font-bold px-3">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </Card>

      </div>

    </div>
  );
};
