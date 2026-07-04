import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { AvatarMenu } from './AvatarMenu';
import logoImg from '../../assets/logo.png';
import { Calendar, Clock, Users, BrainCircuit, ChevronLeft, ChevronRight, Menu, X, Bell, Sun, Moon, AlertTriangle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { currentUser, isCheckedIn, checkInTime, toggleCheckIn } = useUser();
  const location = useLocation();
  const [timerText, setTimerText] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Theme Toggling State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('pp_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Default premium dark
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Notifications State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Seed notification data based on user role
  useEffect(() => {
    const isAdmin = currentUser?.role === 'admin';
    const seed = isAdmin ? [
      {
        id: 'notif1',
        title: 'New Leave Request',
        description: 'Amit Patel applied for Sick Leave on July 8th.',
        time: '10m ago',
        read: false,
        type: 'leave'
      },
      {
        id: 'notif2',
        title: 'AI Attrition Retrained',
        description: 'Random forest models successfully updated in cloud.',
        time: '1h ago',
        read: false,
        type: 'system'
      },
      {
        id: 'notif3',
        title: 'New Directory Log',
        description: 'Aarav Hegde completed profile onboarding files.',
        time: '3h ago',
        read: true,
        type: 'profile'
      }
    ] : [
      {
        id: 'notif1',
        title: 'Leave Approved',
        description: 'Your leave application for May 13-14 was Approved.',
        time: '5m ago',
        read: false,
        type: 'leave'
      },
      {
        id: 'notif2',
        title: 'Daily Attendance Reminder',
        description: 'Please check in to record your attendance parameters.',
        time: '1h ago',
        read: false,
        type: 'system'
      },
      {
        id: 'notif3',
        title: 'Gemini Exit Probability',
        description: 'Exit risk evaluated at 12% (Category: LOW).',
        time: '1d ago',
        read: true,
        type: 'ai'
      }
    ];
    setNotifications(seed);
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  // Geofence / Check-In Logic
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geofenceError, setGeofenceError] = useState<string | null>(null);
  const [showGeofenceModal, setShowGeofenceModal] = useState<boolean>(false);
  const [modalDetails, setModalDetails] = useState<{ distance: number; radius: number } | null>(null);

  // Initialize default office location in localStorage if not set
  useEffect(() => {
    if (!localStorage.getItem('pp_office_lat')) {
      // Default: Noida / Delhi Office coordinates
      localStorage.setItem('pp_office_lat', '28.5355');
      localStorage.setItem('pp_office_lng', '77.3910');
      localStorage.setItem('pp_office_radius', '200'); // 200 meters
    }
  }, []);

  const handleCheckInClick = () => {
    if (isCheckedIn) {
      // Checking out - allowed from anywhere!
      toggleCheckIn();
      return;
    }

    // Checking in - verify geolocation
    if (!navigator.geolocation) {
      setGeofenceError('Geolocation is not supported by your browser.');
      setShowGeofenceModal(true);
      return;
    }

    setIsLocating(true);
    setGeofenceError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const officeLat = parseFloat(localStorage.getItem('pp_office_lat') || '28.5355');
        const officeLng = parseFloat(localStorage.getItem('pp_office_lng') || '77.3910');
        const radius = parseFloat(localStorage.getItem('pp_office_radius') || '200');

        // Haversine formula
        const R = 6371e3; // meters
        const dLat = ((officeLat - userLat) * Math.PI) / 180;
        const dLng = ((officeLng - userLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((officeLat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // in meters

        if (distance <= radius) {
          toggleCheckIn();
        } else {
          setModalDetails({ distance: Math.round(distance), radius });
          setGeofenceError(`Out of Range: You are ${Math.round(distance)}m away from the office. Allowed check-in radius is ${radius}m.`);
          setShowGeofenceModal(true);
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Failed to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location access denied. Please enable location permissions to check in.';
        }
        setGeofenceError(errorMsg);
        setShowGeofenceModal(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSetMockOfficeLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem('pp_office_lat', String(position.coords.latitude));
        localStorage.setItem('pp_office_lng', String(position.coords.longitude));
        // Reset and check in immediately
        setShowGeofenceModal(false);
        toggleCheckIn();
      },
      () => {
        alert('Could not retrieve current position to set as office.');
      }
    );
  };

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

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  if (!currentUser) {
    return <>{children}</>;
  }

  // Sidebar navigation items
  const menuItems = [
    { to: '/', label: 'Employees', icon: Users },
    { to: '/attendance', label: 'Attendance', icon: Clock },
    { to: '/timeoff', label: 'Time Off', icon: Calendar },
    ...(currentUser?.role === 'admin' ? [{ to: '/attrition', label: 'AI Attrition', icon: BrainCircuit }] : []),
  ];

  // Helper to determine active page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Employee Directory';
      case '/attendance':
        return 'Attendance Management';
      case '/timeoff':
        return 'Time Off & Leaves';
      case '/attrition':
        return 'AI Attrition Predictor';
      default:
        if (location.pathname.startsWith('/profile/')) {
          return 'Employee Profile';
        }
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300 relative overflow-hidden">
      
      {/* Absolute Ambient Pulsing Gradients in Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F8FAFC] dark:bg-[#070913] transition-colors duration-300">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/4 dark:bg-primary/8 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-accent/4 dark:bg-accent/8 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[35%] right-[15%] w-[35%] h-[35%] rounded-full bg-success/2 dark:bg-success/4 blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      {/* 1. SIDEBAR: Desktop Collapsible Drawer (Frosted) */}
      <aside 
        className={`hidden md:flex flex-col border-r border-border/50 bg-card/45 backdrop-blur-lg select-none transition-all duration-300 ease-in-out relative z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-[78px]' : 'w-64'
        }`}
      >
        {/* Sidebar Header Brand Area */}
        <div className="h-20 flex items-center px-4.5 border-b border-border/50 justify-between">
          <Link to="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="overflow-hidden h-11 w-11 rounded-xl border border-primary/20 bg-[#070913]/30 shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
              <img src={logoImg} alt="PeoplePulse Logo" className="h-full w-full object-cover" />
            </div>
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col animate-in fade-in duration-300"
              >
                <span className="text-[17px] font-black tracking-tight bg-gradient-to-r from-[#818CF8] via-[#6366F1] to-[#4F46E5] bg-clip-text text-transparent leading-none">
                  PeoplePulse
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold mt-1">Enterprise HRMS</span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/10'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-primary' : 'text-muted-foreground/80'}`} />
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
                {/* Active side indicator */}
                {isActive && (
                  <motion.span 
                    layoutId="activeSidebarIndicator"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer User Mode Indicator */}
        <div className="p-4 border-t border-border/50">
          {!isSidebarCollapsed ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 border border-border/30 p-3 rounded-xl flex items-center gap-2.5"
            >
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider leading-none">Access Level</span>
                <span className="text-xs font-bold text-foreground capitalize mt-0.5">{currentUser.role} Account</span>
              </div>
            </motion.div>
          ) : (
            <div className="flex justify-center">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse border border-background shadow-sm" />
            </div>
          )}
        </div>

        {/* Sidebar Toggle Button (Floating) */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3.5 top-[18px] z-50 bg-card border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground h-7 w-7 rounded-full shadow-sm flex items-center justify-center transition-all duration-200"
        >
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* 2. MOBILE SIDEBAR: Drawer on Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-64 bg-card/90 backdrop-blur-lg border-r border-border md:hidden flex flex-col"
            >
              <div className="h-20 flex items-center px-4.5 border-b border-border justify-between">
                <div className="flex items-center gap-3">
                  <div className="overflow-hidden h-11 w-11 rounded-xl border border-primary/20 bg-[#070913]/30 shadow-xs shrink-0">
                    <img src={logoImg} alt="PeoplePulse Logo" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[17px] font-black tracking-tight bg-gradient-to-r from-[#818CF8] via-[#6366F1] to-[#4F46E5] bg-clip-text text-transparent leading-none">
                      PeoplePulse
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold mt-1">Enterprise HRMS</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/10'
                          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-border bg-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider leading-none">Access Level</span>
                    <span className="text-xs font-bold text-foreground capitalize mt-0.5">{currentUser.role} Account</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN CONTAINER: Header + Page Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        
        {/* Sticky Top Navbar (Frosted) */}
        <header className="sticky top-0 z-20 border-b border-border/40 bg-card/45 backdrop-blur-lg px-4 md:px-6 py-3.5 flex items-center justify-between shadow-md">
          {/* Hamburger Menu & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:bg-white/5 hover:text-foreground md:hidden transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-base md:text-lg font-bold tracking-tight text-foreground hidden sm:block">
              {getPageTitle()}
            </h2>
            <Link to="/" className="flex items-center gap-2.5 sm:hidden group">
              <div className="h-9 w-9 rounded-xl overflow-hidden border border-primary/20 bg-[#070913]/30 shadow-xs">
                <img src={logoImg} alt="PeoplePulse Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-base font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                PeoplePulse
              </span>
            </Link>
          </div>

          {/* Right Area: Check In System, Notifications, User Menu */}
          <div className="flex items-center gap-3">
            
            {/* Elegant Check In / Check Out Glowing Pill */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/5 rounded-xl border border-border/40 select-none shadow-sm hover:border-border/80 transition-all duration-200">
              <span className={`h-2 w-2 rounded-full ring-3 transition-all duration-300 ${
                isCheckedIn ? 'bg-success ring-success/20 animate-pulse shadow-[0_0_8px_var(--success)]' : 'bg-destructive ring-destructive/20'
              }`} />
              
              {isCheckedIn && timerText && (
                <span className="text-[10px] font-bold font-mono text-muted-foreground mr-1 hidden lg:inline-block">
                  {timerText}
                </span>
              )}

              <button
                onClick={handleCheckInClick}
                disabled={isLocating}
                className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md border transition-all duration-200 flex items-center gap-1 ${
                  isCheckedIn
                    ? 'bg-success/10 text-success border-success/20 hover:bg-success/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20'
                }`}
              >
                {isLocating && <span className="h-2 w-2 rounded-full border border-primary border-t-transparent animate-spin mr-0.5" />}
                {isCheckedIn ? 'Check Out' : isLocating ? 'Locating...' : 'Check In'}
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-xl border border-border/40 hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all duration-200"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Notification Bell Icon & Dropdown Container */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative p-1.5 rounded-xl border border-border/40 hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all duration-200 ${
                  isNotificationsOpen ? 'bg-white/5 text-foreground' : ''
                }`}
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-destructive rounded-full shadow-[0_0_4px_var(--destructive)] animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    {/* Click outside overlay */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-border/50 bg-card/95 backdrop-blur-lg shadow-xl z-50 overflow-hidden text-left font-sans"
                    >
                      <div className="p-3.5 border-b border-border/40 flex items-center justify-between bg-white/5">
                        <span className="text-xs font-extrabold text-foreground">Notifications</span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-[10px] text-primary hover:underline font-bold bg-transparent border-0 cursor-pointer"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-[300px] overflow-y-auto divide-y divide-border/30">
                        {notifications.map((n) => (
                          <div 
                            key={n.id}
                            onClick={() => toggleNotification(n.id)}
                            className={`p-3.5 hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3 relative ${
                              !n.read ? 'bg-primary/5' : ''
                            }`}
                          >
                            {!n.read && (
                              <span className="absolute top-[18px] right-3.5 h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                            )}
                            <div className="flex-1 space-y-1 pr-4">
                              <div className="flex items-center justify-between">
                                <h4 className={`text-xs font-bold ${!n.read ? 'text-foreground font-extrabold' : 'text-muted-foreground'}`}>
                                  {n.title}
                                </h4>
                                <span className="text-[9px] text-muted-foreground font-medium shrink-0">{n.time}</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-normal">
                                {n.description}
                              </p>
                            </div>
                          </div>
                        ))}
                        {notifications.length === 0 && (
                          <div className="p-8 text-center text-xs text-muted-foreground italic">
                            No notifications to display.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="h-6 w-[1px] bg-border/50" />

            {/* Profile Dropdown & Name */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold leading-tight text-foreground">{currentUser.name}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5 capitalize font-semibold">
                  {currentUser.role} View
                </span>
              </div>
              <AvatarMenu />
            </div>

          </div>
        </header>

        {/* 4. MAIN PAGE CONTENT WITH ROUTE TRANSITIONS */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 py-4.5 text-center text-xs text-muted-foreground bg-card/10">
          <p>© {new Date().getFullYear()} PeoplePulse HRMS. Built for operational excellence.</p>
        </footer>
      </div>

      {/* Geofence Modal */}
      <AnimatePresence>
        {showGeofenceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card border border-border/80 rounded-2xl p-6 shadow-xl max-w-sm w-full space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 text-destructive">
                <AlertTriangle className="h-6 w-6 shrink-0 animate-bounce" />
                <h3 className="font-bold text-foreground text-base">Check-In Denied</h3>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>{geofenceError}</p>
                {modalDetails && (
                  <div className="p-3 bg-muted/40 rounded-xl border border-border/50 space-y-1">
                    <div className="flex justify-between">
                      <span>Office Coordinates:</span>
                      <span className="font-mono">
                        {parseFloat(localStorage.getItem('pp_office_lat') || '0').toFixed(4)},{' '}
                        {parseFloat(localStorage.getItem('pp_office_lng') || '0').toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Office Radius Limit:</span>
                      <span>{modalDetails.radius}m</span>
                    </div>
                    <div className="flex justify-between text-destructive font-semibold">
                      <span>Your Commute Distance:</span>
                      <span>{modalDetails.distance}m</span>
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground italic">
                  Tip: For local testing, click the button below to set your current position as the office geofence center.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleSetMockOfficeLocation}
                  className="w-full text-xs h-9.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/95 transition-colors shadow cursor-pointer"
                >
                  <MapPin className="h-4 w-4" />
                  Set Current Position as Office
                </button>
                <button
                  onClick={() => setShowGeofenceModal(false)}
                  className="w-full text-xs h-9.5 rounded-xl border border-border bg-transparent text-foreground hover:bg-muted font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
