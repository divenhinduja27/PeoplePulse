import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { AdminTimeOffView } from '../components/timeoff/AdminTimeOffView';
import { EmployeeTimeOffView } from '../components/timeoff/EmployeeTimeOffView';
import { AllocationTab } from '../components/timeoff/AllocationTab';

const TimeOffPage: React.FC = () => {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('timeoff');

  if (!currentUser) return null;

  return (
    <div className="w-full space-y-6">
      {/* Header and Sub-Tabs */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Time Off</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-card border-border/50 justify-start h-auto p-1">
            <TabsTrigger value="timeoff" className="px-6 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              Time Off
            </TabsTrigger>
            <TabsTrigger value="allocation" className="px-6 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              Allocation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeoff" className="mt-6">
            {currentUser.role === 'admin' ? (
              <AdminTimeOffView />
            ) : (
              <EmployeeTimeOffView />
            )}
          </TabsContent>

          <TabsContent value="allocation" className="mt-6">
            <AllocationTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TimeOffPage;
