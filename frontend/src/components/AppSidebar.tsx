// File: AppSidebar.tsx
import {
  Bot,
  MessageSquare,
  Zap,
  MessageSquarePlus,
  Search,
  Star,
  Archive,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Badge } from "@/components/ui/badge";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import {
  getSevenDaysChats,
  getTodaysChats,
  getYesterdaysChats,
  deleteChat,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

interface IChat {
  id: string;
  title: string;
  created: string;
  isFavorite?: boolean;
  folder?: string;
  isArchived?: boolean;
}

export function AppSidebar() {
  const [recentChats, setRecentChats] = useState<IChat[]>([]);
  const [yesterdaysChats, setYesterdaysChat] = useState<IChat[]>([]);
  const [sevenDaysChats, setSevenDaysChat] = useState<IChat[]>([]);
  const { user, refreshTrigger } = useAuth();
  const { addToast } = useToast();
  const token = localStorage.getItem("access_token") || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    chatId: string | null;
    chatTitle: string;
  }>({
    isOpen: false,
    chatId: null,
    chatTitle: "",
  });

  // ⏰ IST Clock
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      };
      setTime(new Intl.DateTimeFormat("en-IN", options).format(now));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchChatsData = async () => {
    if (!token) {
      setRecentChats([]);
      setYesterdaysChat([]);
      setSevenDaysChat([]);
      return;
    }
    try {
      const today = await getTodaysChats(token);
      setRecentChats(today || []);
      const yesterday = await getYesterdaysChats(token);
      setYesterdaysChat(yesterday || []);
      const seven = await getSevenDaysChats(token);
      setSevenDaysChat(seven || []);
    } catch {
      setRecentChats([]);
      setYesterdaysChat([]);
      setSevenDaysChat([]);
    }
  };

  useEffect(() => {
    fetchChatsData();
  }, [token, user, refreshTrigger]);

  useEffect(() => {
    const handleFocus = () => {
      fetchChatsData();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [token]);

  const toggleFavorite = (chatId: string) => {
    const updateChats = (chats: IChat[]) =>
      chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, isFavorite: !chat.isFavorite }
          : chat
      );

    setRecentChats(updateChats(recentChats));
    setYesterdaysChat(updateChats(yesterdaysChats));
    setSevenDaysChat(updateChats(sevenDaysChats));
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      // Call API to delete chat from database
      await deleteChat(chatId, token);

      // Remove from UI state across all arrays
      setRecentChats(recentChats.filter((c) => c.id !== chatId));
      setYesterdaysChat(yesterdaysChats.filter((c) => c.id !== chatId));
      setSevenDaysChat(sevenDaysChats.filter((c) => c.id !== chatId));

      // Show success toast
      addToast({
        type: "success",
        message: "Chat deleted successfully",
        duration: 2000,
      });

      // Close dialog
      setDeleteDialog({ isOpen: false, chatId: null, chatTitle: "" });
    } catch (error) {
      console.error("Error deleting chat:", error);
      addToast({
        type: "error",
        message: "Failed to delete chat. Please try again.",
        duration: 3000,
      });
    }
  };

  const filterChats = (chats: IChat[]) => {
    return chats.filter((chat) => {
      const matchesSearch = chat.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesArchived = showArchived ? chat.isArchived : !chat.isArchived;
      return matchesSearch && matchesArchived;
    });
  };

  const truncateTitle = (title: string, maxLength: number = 18) => {
    // Remove quotes if present
    let cleanTitle = title[0] === "'" || title[0] === '"' ? title.slice(1, -1) : title;
    
    // Truncate to max length and add ellipsis if needed
    if (cleanTitle.length > maxLength) {
      return cleanTitle.slice(0, maxLength) + "...";
    }
    return cleanTitle;
  };

  const allChats = [...recentChats, ...yesterdaysChats, ...sevenDaysChats];
  const favorites = allChats.filter((c) => c.isFavorite);
  const filteredRecent = filterChats(recentChats);
  const filteredYesterday = filterChats(yesterdaysChats);
  const filteredSevenDays = filterChats(sevenDaysChats);

  const renderChatItem = (chat: IChat) => (
    <SidebarMenuItem key={chat.id}>
      <div className="flex justify-between items-center group">
        <NavLink to={`chats/${chat.id}`} className="flex-1">
          {({ isActive }) => (
            <SidebarMenuButton
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md transition cursor-pointer text-sm",
                isActive ? "bg-primary/20 text-primary" : "hover:bg-muted"
              )}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate" title={chat.title}>
                {truncateTitle(chat.title)}
              </span>
            </SidebarMenuButton>
          )}
        </NavLink>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setDeleteDialog({
                isOpen: true,
                chatId: chat.id,
                chatTitle: chat.title,
              });
            }}
            className="p-1 hover:bg-destructive/20 rounded text-destructive hover:text-destructive transition-colors"
            title="Delete chat"
            aria-label="Delete chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Favorite/Star Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(chat.id);
            }}
            className="p-1 hover:bg-primary/20 rounded transition-colors"
            title={chat.isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={
              chat.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Star
              className={cn(
                "w-3.5 h-3.5",
                chat.isFavorite
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              )}
            />
          </button>
        </div>
      </div>
    </SidebarMenuItem>
  );

  return (
    <Sidebar className="bg-background text-foreground border-r border-border">
      <SidebarContent className="flex flex-col justify-between h-full">
        <div className="space-y-4">
          {/* ⏰ IST Clock */}
          <div className="px-4 pt-4 pb-2 text-center">
            <div className="text-sm font-bold text-primary flex items-center justify-center gap-1">
              <span className="animate-pulse">🕒</span>
              {time} IST
            </div>
          </div>

          {/* New Chat Button */}
          <div className="px-4">
            <Button
              variant="default"
              className="w-full justify-start cursor-pointer gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all"
              asChild
            >
              <Link to="/chats/new">
                <MessageSquarePlus className="w-4 h-4" />
                New Chat
              </Link>
            </Button>
          </div>

          {/* Search Bar */}
          <div className="px-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm"
                aria-label="Search chats"
              />
            </div>
          </div>

          {/* Favorites Section */}
          {favorites.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs text-muted-foreground uppercase flex items-center gap-2 px-4">
                <Star className="w-3.5 h-3.5" />
                Favorites
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {favorites.map(renderChatItem)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Recent Chats */}
          {filteredRecent.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs text-muted-foreground uppercase px-4 pb-2">
                Recent
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {filteredRecent.map(renderChatItem)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Yesterday */}
          {filteredYesterday.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs text-muted-foreground uppercase px-4 pb-2">
                Yesterday
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {filteredYesterday.map(renderChatItem)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Last 7 Days */}
          {filteredSevenDays.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs text-muted-foreground uppercase px-4 pb-2">
                Last 7 Days
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {filteredSevenDays.map(renderChatItem)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* About */}
          <SidebarGroup className="mt-auto">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/about"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-muted rounded-md transition"
                  >
                    <Bot className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-semibold">About</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 border-t border-border space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-xs"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="h-4 w-4" />
            {showArchived ? "Hide" : "Show"} Archived
          </Button>
          <a
            href="https://sujaykumarmondal.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 px-3 py-2 rounded-md transition text-xs font-medium border border-primary/20"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Developer
            </span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
              Check
            </Badge>
          </a>
        </div>
      </SidebarContent>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-fadeIn">
          <div className="bg-background border border-border rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 animate-scaleIn">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h2 className="font-semibold text-foreground">Delete Chat</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Are you sure you want to delete "{deleteDialog.chatTitle}"?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setDeleteDialog({ isOpen: false, chatId: null, chatTitle: "" })
                }
                className="px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition border border-border"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  deleteDialog.chatId &&
                  handleDeleteChat(deleteDialog.chatId)
                }
                className="px-4 py-2 rounded-md text-sm font-medium bg-destructive/90 hover:bg-destructive text-destructive-foreground transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
