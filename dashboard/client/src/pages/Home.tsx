import { Link } from "wouter";
import { LiveMetrics } from "@/components/LiveMetrics";
import { PerformanceChart } from "@/components/PerformanceChart";
import { LiveFeed } from "@/components/LiveFeed";
import { Leaderboard } from "@/components/Leaderboard";
import { Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background grid-pattern relative">
      {/* Scan line effect */}
      <div className="scan-line" />
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="relative border-b border-border/50 glass">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Crypto AI KOL Arena
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5 font-mono">
                  Real-time performance dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/blip-demo">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono">
                  Blip Styles
                </a>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping" />
                </div>
                <span className="text-primary">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container py-8">
        <div className="grid gap-6">
          {/* Live Metrics */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Agent Metrics
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>
            <LiveMetrics />
          </div>

          {/* Charts and Leaderboard */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Performance Analytics
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>
              <PerformanceChart />
            </div>
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Rankings
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>
              <Leaderboard />
            </div>
          </div>

          {/* Live Feed */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Live Activity Feed
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>
            <LiveFeed />
          </div>
        </div>
      </main>

      {/* Footer accent */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none" />
    </div>
  );
}

