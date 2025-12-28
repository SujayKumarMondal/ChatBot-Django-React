import { useState, useEffect } from "react";
import { MessageSquare, Clock, Zap, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DashboardStats {
  totalChats: number;
  totalMessages: number;
  avgResponseTime: number;
  streakDays: number;
  weeklyActivity: { day: string; count: number }[];
  topicBreakdown: { topic: string; count: number }[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard stats
    const mockStats: DashboardStats = {
      totalChats: 42,
      totalMessages: 287,
      avgResponseTime: 1.2,
      streakDays: 7,
      weeklyActivity: [
        { day: "Mon", count: 12 },
        { day: "Tue", count: 19 },
        { day: "Wed", count: 15 },
        { day: "Thu", count: 25 },
        { day: "Fri", count: 31 },
        { day: "Sat", count: 18 },
        { day: "Sun", count: 14 },
      ],
      topicBreakdown: [
        { topic: "Development", count: 85 },
        { topic: "Design", count: 45 },
        { topic: "Writing", count: 72 },
        { topic: "Other", count: 85 },
      ],
    };

    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 500);
  }, [user]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
    return <div className="p-8 text-center text-muted-foreground">Failed to load dashboard</div>;
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.username}!</h1>
        <p className="text-muted-foreground mt-2">Here's your activity overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<MessageSquare className="h-6 w-6 text-primary" />}
          label="Total Chats"
          value={stats.totalChats}
          subtext="All conversations"
        />
        <StatsCard
          icon={<Zap className="h-6 w-6 text-accent" />}
          label="Total Messages"
          value={stats.totalMessages}
          subtext="In all chats"
        />
        <StatsCard
          icon={<Clock className="h-6 w-6 text-blue-500" />}
          label="Avg Response"
          value={`${stats.avgResponseTime}s`}
          subtext="Response time"
        />
        <StatsCard
          icon={<TrendingUp className="h-6 w-6 text-green-500" />}
          label="Current Streak"
          value={`${stats.streakDays} days`}
          subtext="Keep it going!"
        />
      </div>

      {/* Charts Section - Requires recharts 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Weekly Activity</h3>
          <p className="text-muted-foreground">Charts require additional setup</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Topic Breakdown</h3>
          <p className="text-muted-foreground">Charts require additional setup</p>
        </div>
      </div>
      */}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction label="New Chat" icon="+" color="bg-primary/20" />
          <QuickAction label="View History" icon="📜" color="bg-blue-500/20" />
          <QuickAction label="Export Chats" icon="📥" color="bg-green-500/20" />
          <QuickAction label="Settings" icon="⚙️" color="bg-purple-500/20" />
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, subtext }: any) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow animate-slideIn">
      <div className="flex items-start justify-between mb-4">
        <div>{icon}</div>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      </div>
    </div>
  );
}

function QuickAction({ label, icon, color }: any) {
  return (
    <button
      className={`${color} rounded-lg p-4 text-center hover:shadow-md transition-all transform hover:scale-105`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs font-medium text-foreground">{label}</p>
    </button>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-8">
      <div className="h-10 bg-muted rounded-lg w-48 animate-shimmer" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-6 h-32 animate-shimmer" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-6 h-64 animate-shimmer" />
        ))}
      </div>
    </div>
  );
}
