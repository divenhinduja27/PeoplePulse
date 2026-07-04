import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LogOut, User as UserIcon } from 'lucide-react';

export const AvatarMenu: React.FC = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full ring-offset-background transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2">
          <Avatar className="h-9 w-9 border border-border shadow-sm">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
            <AvatarFallback>{initials || 'U'}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="right" className="w-56 mt-2">
        <div className="flex flex-col px-3 py-2 text-xs">
          <span className="font-semibold text-foreground text-sm">{currentUser.name}</span>
          <span className="text-muted-foreground mt-0.5 truncate">{currentUser.email}</span>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate('/profile/me')} className="flex items-center gap-2 text-sm">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <span>My Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-2 text-sm text-destructive hover:bg-destructive/10">
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
