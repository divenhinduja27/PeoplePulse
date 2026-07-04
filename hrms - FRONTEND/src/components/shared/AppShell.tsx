import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { AvatarMenu } from './AvatarMenu';
import { Sparkles, Calendar, Clock, Users, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { currentUser, isCheckedIn, checkInTime, toggleCheckIn } = useUser();
  const location = useLocation();
  const [timerText, setTimerText] = useState<string>('');

  useEffect(() => {
    if (!isCheckedIn || !checkInTime) {
      setTimerText('');
      return;
    }

    const updateTimer = () => {
      const checkInDate = new Date(checkInTime);
      const now = new Date();
      const diffMs = Math.abs(now.getTime() - checkInDate.getTime());

      const secs = Math.floor((diffMs / 1000) % 60);
      const mins = Math.floor((diffMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

      const pad = (num: number) => String(num).padStart(2, '0');

      const formattedInTime = checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setTimerText(`In: ${formattedInTime} (${pad(hours)}:${pad(mins)}:${pad(secs)})`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);

  if (!currentUser) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-md group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PeoplePulse
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium leading-none">Enterprise HRMS</p>
            </div>
          </Link>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/50">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all select-none ${isActive
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Users className="h-4 w-4" />
            <span>Employees</span>
          </NavLink>
          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all select-none ${isActive
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Clock className="h-4 w-4" />
            <span>Attendance</span>
          </NavLink>
          <NavLink
            to="/timeoff"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all select-none ${isActive
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Calendar className="h-4 w-4" />
            <span>Time Off</span>
          </NavLink>
          <NavLink
            to="/attrition"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all select-none ${isActive
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <BrainCircuit className="h-4 w-4" />
            <span>AI Attrition</span>
          </NavLink>
        </nav>

        {/* User Info and Dropdown */}
        <div className="flex items-center gap-3">

          {/* Check In / Check Out System indicator dot + button */}
          <div className="flex items-center gap-2.5 px-3 py-1 bg-muted/60 rounded-xl border border-border/40 shadow-inner mr-1.5 select-none transition-all">
            {/* Red / Green dot indicating check-in status */}
            <span className={`h-2.5 w-2.5 rounded-full ring-4 transition-all duration-300 ${isCheckedIn ? 'bg-success ring-success/20 animate-pulse' : 'bg-destructive ring-destructive/20'}`} />

            {isCheckedIn && timerText && (
              <span className="text-[10px] font-bold font-mono text-muted-foreground mr-1">
                {timerText}
              </span>
            )}

            <button
              onClick={toggleCheckIn}
              className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border transition-all duration-200 ${isCheckedIn
                  ? 'bg-success/15 text-success border-success/30 hover:bg-success/25'
                  : 'bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/25'
                }`}
            >
              {isCheckedIn ? 'Check Out' : 'Check In'}
            </button>
          </div>

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold leading-tight">{currentUser.name}</span>
            <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5 mt-0.5 self-end capitalize font-semibold tracking-wider">
              {currentUser.role} View
            </span>
          </div>
          <AvatarMenu />
        </div>
      </header>

      {/* Page Content wrapper with Framer Motion tab/page transition animations */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground bg-card">
        <p>© 2026 PeoplePulse HRMS. All rights reserved.</p>
      </footer>
    </div>
  );
};
