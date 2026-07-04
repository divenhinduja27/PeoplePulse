import React, { useState } from 'react';
import type { Employee, ResumeItem } from '../../types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Briefcase, Calendar, Trash2, Plus } from 'lucide-react';

interface ResumeTabProps {
  employee: Employee;
  isReadOnly: boolean;
  onSave?: (updatedEmployee: Employee) => void;
}

export const ResumeTab: React.FC<ResumeTabProps> = ({ employee, isReadOnly, onSave }) => {
  const [resumeList, setResumeList] = useState<ResumeItem[]>(employee.resume || []);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newCompany.trim() && newDuration.trim()) {
      const newItem: ResumeItem = {
        id: String(Date.now()),
        title: newTitle.trim(),
        company: newCompany.trim(),
        duration: newDuration.trim(),
        description: newDescription.trim(),
      };
      const updatedList = [...resumeList, newItem];
      setResumeList(updatedList);
      
      // Reset form
      setNewTitle('');
      setNewCompany('');
      setNewDuration('');
      setNewDescription('');

      // Propagate update
      onSave?.({
        ...employee,
        resume: updatedList,
      });
    }
  };

  const handleRemoveItem = (id: string) => {
    if (isReadOnly) return;
    const updatedList = resumeList.filter((item) => item.id !== id);
    setResumeList(updatedList);
    onSave?.({
      ...employee,
      resume: updatedList,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Work History Timeline (Left / Col-Span-2) */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="border border-border/50 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Employment History
            </CardTitle>
            <CardDescription>Chronological timeline of professional experience</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {resumeList.length > 0 ? (
              <div className="relative border-l-2 border-border/60 pl-6 ml-3 space-y-6">
                {resumeList.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Timeline Node */}
                    <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-primary group-hover:bg-primary transition-all duration-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-transparent group-hover:bg-background" />
                    </span>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                          <span className="text-foreground">{item.company}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-[10px] bg-muted border border-border/30 text-muted-foreground px-2 py-0.5 rounded-full font-semibold">
                          <Calendar className="h-3 w-3" />
                          {item.duration}
                        </span>
                        
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground italic text-xs">
                No work history documented.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Work History Form (Right / Col-Span-1) */}
      {!isReadOnly && (
        <div className="lg:col-span-1">
          <Card className="border border-border/50 shadow-sm rounded-2xl sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4.5 w-4.5 text-accent" />
                Add Experience
              </CardTitle>
              <CardDescription>Enter details of previous employment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddItem} className="space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="roleTitle" className="text-xs">Job Title / Role</Label>
                  <Input
                    id="roleTitle"
                    placeholder="e.g. Lead Frontend Engineer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="rounded-xl h-8.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="company" className="text-xs">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="e.g. TechCorp Inc."
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    required
                    className="rounded-xl h-8.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="duration" className="text-xs">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g. 2021 - 2023 or Present"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    required
                    className="rounded-xl h-8.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="description" className="text-xs">Role Description</Label>
                  <textarea
                    id="description"
                    placeholder="Describe achievements or tech used..."
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
                <Button type="submit" className="w-full h-8.5 rounded-xl bg-accent text-accent-foreground font-bold text-xs mt-1 shadow-sm">
                  Add Item
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
};
