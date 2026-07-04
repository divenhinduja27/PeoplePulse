import React from 'react';
import type { Employee, Role } from '../../types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { MyProfileTab } from './MyProfileTab';
import { ResumeTab } from './ResumeTab';
import { PrivateInfoTab } from './PrivateInfoTab';
import { SalaryInfoTab } from './SalaryInfoTab';
import { SecurityTab } from './SecurityTab';
import { useUser } from '../../context/UserContext';

interface ProfileTabsProps {
  employee: Employee;
  isReadOnly: boolean;
  userRole: Role;
  onSave?: (updatedEmployee: Employee) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  employee,
  isReadOnly,
  userRole,
  onSave,
}) => {
  const { currentUser } = useUser();
  const canViewSalary = userRole === 'admin' || currentUser?.id === employee.id;

  return (
    <Tabs defaultValue="profile" className="w-full">
      <div className="w-full overflow-x-auto pb-2 mb-4">
        <TabsList className="flex w-max md:w-full md:justify-start gap-1 p-1 bg-muted/60 rounded-xl border border-border/40">
          <TabsTrigger value="profile" className="rounded-lg px-4 py-1.5 text-xs md:text-sm">
            My Profile
          </TabsTrigger>
          <TabsTrigger value="resume" className="rounded-lg px-4 py-1.5 text-xs md:text-sm">
            Resume
          </TabsTrigger>
          <TabsTrigger value="private" className="rounded-lg px-4 py-1.5 text-xs md:text-sm">
            Private Info
          </TabsTrigger>
          {canViewSalary && (
            <TabsTrigger value="salary" className="rounded-lg px-4 py-1.5 text-xs md:text-sm">
              Salary Info
            </TabsTrigger>
          )}
          <TabsTrigger value="security" className="rounded-lg px-4 py-1.5 text-xs md:text-sm">
            Security
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="mt-4">
        <TabsContent value="profile">
          <MyProfileTab employee={employee} isReadOnly={isReadOnly} onSave={onSave} />
        </TabsContent>
        <TabsContent value="resume">
          <ResumeTab employee={employee} isReadOnly={isReadOnly} onSave={onSave} />
        </TabsContent>
        <TabsContent value="private">
          <PrivateInfoTab employee={employee} isReadOnly={isReadOnly} onSave={onSave} />
        </TabsContent>
        {canViewSalary && (
          <TabsContent value="salary">
            <SalaryInfoTab employee={employee} isReadOnly={userRole !== 'admin'} onSave={onSave} />
          </TabsContent>
        )}
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};
