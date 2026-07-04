import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { AvatarMenu } from './AvatarMenu';
import { Sparkles, Calendar, Clock, Users, BrainCircuit, AlertTriangle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { currentUser, isCheckedIn, checkInTime, toggleCheckIn } = useUser();
  const location = useLocation();
  const [timerText, setTimerText] = useState<string>('');
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
          {currentUser?.role === 'admin' && (
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
          )}
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
              onClick={handleCheckInClick}
              disabled={isLocating}
              className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border transition-all duration-200 flex items-center gap-1 ${isCheckedIn
                  ? 'bg-success/15 text-success border-success/30 hover:bg-success/25'
                  : 'bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/25'
                }`}
            >
              {isLocating && <span className="h-2 w-2 rounded-full border border-primary border-t-transparent animate-spin mr-0.5" />}
              {isCheckedIn ? 'Check Out' : isLocating ? 'Locating...' : 'Check In'}
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
