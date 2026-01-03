import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Settings, Bell, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { currentTheme, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [unreadNotifications] = useState(0);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const isDark = currentTheme === "dark" || currentTheme !== "light";

  const handleSignOutConfirm = () => {
    setShowSignOutDialog(false);
    signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-gradient-to-r from-background via-background to-primary/5 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Sidebar + Brand */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Zap className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ChatPaat
              </span>
            </div>
          </div>
          <span className="text-xs md:text-sm font-medium text-muted-foreground hidden md:block">
            Your AI Assistant
          </span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Notification Bell */}
          {user && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted transition-colors relative"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="hover:bg-muted transition-colors"
            title="Toggle theme"
            aria-label="Toggle dark/light mode"
          >
            {isDark ? (
              <Sun className="h-5 w-5 transition-transform" />
            ) : (
              <Moon className="h-5 w-5 transition-transform" />
            )}
          </Button>

          {/* Settings Button */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              className="hover:bg-muted transition-colors"
              title="Settings"
              aria-label="Open settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}

          {/* Auth Controls */}
          {!user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hover:shadow-sm transition-shadow"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="hover:shadow-sm transition-shadow"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <span className="hidden sm:block text-sm font-medium truncate max-w-[100px]">
                {user.first_name ? user.first_name.split(' ')[0] : user.username}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
<<<<<<< HEAD
                  className="hover:bg-destructive/20 transition-colors text-xs"
=======
                  className="hover:bg-destructive/20 transition-colors text-xs border-2 border-white hover:border-white"
>>>>>>> 2946afa (Synced code of uat)
                  onClick={() => setShowSignOutDialog(true)}
                >
                  Sign Out
                </Button>
                <Avatar 
                  className="h-8 w-8 ring-2 ring-primary/30 hover:ring-primary/60 transition-all cursor-pointer"
                  onClick={() => navigate("/profile")}
                  role="button"
                  tabIndex={0}
                  aria-label="Open profile"
                >
                  <AvatarImage src={user.image} alt={user.username} />
                  <AvatarFallback className="bg-primary/20 font-semibold">
                    {user.first_name ? user.first_name[0]?.toUpperCase() : user.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sign Out Confirmation Dialog */}
      {showSignOutDialog && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]"
          onClick={() => setShowSignOutDialog(false)}
        >
          <div 
            className="bg-background border border-border rounded-lg shadow-xl p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">Sign Out?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSignOutDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSignOutConfirm}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
