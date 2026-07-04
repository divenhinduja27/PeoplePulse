import { useState, useEffect } from 'react'
import { create } from 'zustand'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts'
import { 
  Calendar as CalendarIcon, PlusCircle, CheckCircle, Clock, 
  Briefcase, BarChart2, Moon, Sun, ShieldAlert, Sparkles
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Initialize TanStack Query client
const queryClient = new QueryClient()

// Leave record type definition
interface LeaveEvent {
  id: string
  title: string
  start: string
  end: string
  type: 'Annual' | 'Sick' | 'Maternity' | 'Unpaid'
  status: 'Approved' | 'Pending'
}

// Zustand store for auth & local UI state
interface AppState {
  user: {
    name: string
    role: string
    avatar: string
    remainingAnnualLeaves: number
    remainingSickLeaves: number
  }
  leaves: LeaveEvent[]
  addLeave: (leave: Omit<LeaveEvent, 'id'>) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const useAppStore = create<AppState>((set) => ({
  user: {
    name: 'Rushil Hinduja',
    role: 'Senior Software Engineer',
    avatar: 'RH',
    remainingAnnualLeaves: 18,
    remainingSickLeaves: 7,
  },
  leaves: [
    {
      id: '1',
      title: 'Annual Leave - Rushil',
      start: '2026-07-06',
      end: '2026-07-09',
      type: 'Annual',
      status: 'Approved',
    },
    {
      id: '2',
      title: 'Sick Leave - Rushil',
      start: '2026-07-15',
      end: '2026-07-16',
      type: 'Sick',
      status: 'Approved',
    },
  ],
  addLeave: (leave) => set((state) => {
    const updatedUser = { ...state.user }
    
    // Simple duration calculations
    const start = new Date(leave.start)
    const end = new Date(leave.end)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    if (leave.type === 'Annual') {
      updatedUser.remainingAnnualLeaves = Math.max(0, updatedUser.remainingAnnualLeaves - diffDays)
    } else if (leave.type === 'Sick') {
      updatedUser.remainingSickLeaves = Math.max(0, updatedUser.remainingSickLeaves - diffDays)
    }

    return {
      leaves: [...state.leaves, { ...leave, id: String(state.leaves.length + 1) }],
      user: updatedUser
    }
  }),
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}))

// Mock API Call to verify TanStack Query integration
const fetchUpcomingHolidays = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    { id: 'h1', date: '2026-07-04', name: 'Foundation Day', type: 'Public' },
    { id: 'h2', date: '2026-08-15', name: 'Independence Day', type: 'National' },
    { id: 'h3', date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National' },
  ]
}

// Zod Validation Schema for Leave Request Form
const leaveFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  type: z.enum(['Annual', 'Sick', 'Maternity', 'Unpaid']),
  startDate: z.string().nonempty({ message: 'Start date is required' }),
  endDate: z.string().nonempty({ message: 'End date is required' }),
})
type LeaveFormValues = z.infer<typeof leaveFormSchema>

function Dashboard() {
  const { user, leaves, addLeave, isDarkMode, toggleDarkMode } = useAppStore()
  const [successMsg, setSuccessMsg] = useState('')

  // Sync dark class with document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // TanStack Query for Holiday Data
  const { data: holidays, isLoading: isHolidaysLoading } = useQuery({
    queryKey: ['holidays'],
    queryFn: fetchUpcomingHolidays,
  })

  // React Hook Form + Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      title: '',
      type: 'Annual',
      startDate: '',
      endDate: '',
    }
  })

  const onSubmit = (data: LeaveFormValues) => {
    addLeave({
      title: `${data.type} Leave: ${data.title}`,
      start: data.startDate,
      end: data.endDate,
      type: data.type,
      status: 'Approved',
    })
    setSuccessMsg('Leave submitted & approved successfully!')
    reset()
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  // Formatting Leave Events for FullCalendar
  const calendarEvents = [
    ...leaves.map((leave) => ({
      id: leave.id,
      title: leave.title,
      start: leave.start,
      end: leave.end,
      backgroundColor: leave.type === 'Annual' ? '#3b82f6' : leave.type === 'Sick' ? '#ef4444' : '#10b981',
      borderColor: 'transparent',
    })),
    ...(holidays || []).map((h) => ({
      id: h.id,
      title: `🎉 ${h.name}`,
      start: h.date,
      allDay: true,
      backgroundColor: '#f59e0b',
      borderColor: 'transparent',
    }))
  ]

  // Recharts Chart Data (Aggregating Leaves by Type)
  const chartData = [
    { name: 'Used Annual', value: 18 - user.remainingAnnualLeaves },
    { name: 'Remaining Annual', value: user.remainingAnnualLeaves },
    { name: 'Used Sick', value: 7 - user.remainingSickLeaves },
    { name: 'Remaining Sick', value: user.remainingSickLeaves },
  ]

  const pieData = [
    { name: 'Annual', value: leaves.filter(l => l.type === 'Annual').length, color: '#3b82f6' },
    { name: 'Sick', value: leaves.filter(l => l.type === 'Sick').length, color: '#ef4444' },
    { name: 'Maternity', value: leaves.filter(l => l.type === 'Maternity').length, color: '#10b981' },
    { name: 'Unpaid', value: leaves.filter(l => l.type === 'Unpaid').length, color: '#6b7280' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              PeoplePulse
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise HR Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleDarkMode}
            className="rounded-xl hover:scale-105 transition-transform"
          >
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>

          {/* User Profile widget */}
          <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold h-8 w-8 rounded-full flex items-center justify-center text-sm shadow-md">
              {user.avatar}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{user.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Row 1: Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Annual Leave Balance</p>
                  <h3 className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{user.remainingAnnualLeaves} Days</h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <CalendarIcon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sick Leave Balance</p>
                  <h3 className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{user.remainingSickLeaves} Days</h3>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl">
                  <ShieldAlert className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Booked Leaves</p>
                  <h3 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{leaves.length} Recorded</h3>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Holiday Data API Status</p>
                  <h3 className="text-lg font-bold mt-2 text-amber-600 dark:text-amber-400">
                    {isHolidaysLoading ? 'Syncing...' : 'Connected'}
                  </h3>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Clock className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Row 2: Form & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Request Form (Framer Motion enabled) */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="h-full border border-slate-200 dark:border-slate-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PlusCircle className="text-blue-500" /> Apply for Leave
                </CardTitle>
                <CardDescription>
                  File a leave request. Validation checks are computed on-the-fly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <AnimatePresence>
                  {successMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-xl"
                    >
                      {successMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Reason / Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g. Family Trip, Medical Checkup" 
                      {...register('title')}
                      className="rounded-xl border-slate-200 dark:border-slate-700"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-0.5">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Leave Type</Label>
                    <select 
                      id="type"
                      {...register('type')}
                      className="flex h-9 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900"
                    >
                      <option value="Annual">Annual</option>
                      <option value="Sick">Sick</option>
                      <option value="Maternity">Maternity</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        {...register('startDate')}
                        className="rounded-xl border-slate-200 dark:border-slate-700"
                      />
                      {errors.startDate && (
                        <p className="text-red-500 text-xs mt-0.5">{errors.startDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input 
                        id="endDate" 
                        type="date" 
                        {...register('endDate')}
                        className="rounded-xl border-slate-200 dark:border-slate-700"
                      />
                      {errors.endDate && (
                        <p className="text-red-500 text-xs mt-0.5">{errors.endDate.message}</p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-colors mt-2">
                    Submit Request
                  </Button>
                </form>

              </CardContent>
            </Card>
          </motion.div>

          {/* Visual Analytics / Recharts Area */}
          <motion.div 
            className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            {/* Bar Chart */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart2 className="text-indigo-500" /> Leave Balance Analysis
                </CardTitle>
                <CardDescription>Visual distribution of remaining vs used days.</CardDescription>
              </CardHeader>
              <CardContent className="h-60 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="text-emerald-500" /> Distribution by Category
                </CardTitle>
                <CardDescription>Ratio of leaves submitted in this profile.</CardDescription>
              </CardHeader>
              <CardContent className="h-60 pt-4 flex flex-col justify-between">
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-xs font-medium">
                  {pieData.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span>{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </motion.div>
        </div>

        {/* Row 3: Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <CardHeader className="bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="text-blue-500" /> Interactive Vacation & Holiday Calendar
              </CardTitle>
              <CardDescription>
                Live scheduling engine. Select slots to verify React calendar interactions. Includes fetched public holidays.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 calendar-container">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-inner border border-slate-200/60 dark:border-slate-800/60">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={calendarEvents}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth'
                  }}
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  height="auto"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-12 bg-white dark:bg-slate-900">
        <p>© 2026 PeoplePulse HRMS. Built with Tailwind CSS v4, Framer Motion, Zustand & shadcn/ui.</p>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  )
}
