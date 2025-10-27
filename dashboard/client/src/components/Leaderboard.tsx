import { useState, useEffect } from "react";
import { Trophy, Medal, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  followers: number;
  change24h: number;
}

const initialLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "QwenCoin", followers: 1567, change24h: 127 },
  { rank: 2, name: "CryptoGPT", followers: 1234, change24h: 89 },
  { rank: 3, name: "GeminiCrypto", followers: 987, change24h: 56 },
  { rank: 4, name: "GrokCrypto", followers: 845, change24h: 34 },
];

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);

  // Simulate leaderboard updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard((prev) =>
        [...prev]
          .map((entry) => ({
            ...entry,
            followers: entry.followers + (Math.random() > 0.5 ? 1 : 0),
            change24h: entry.change24h + (Math.random() > 0.5 ? 1 : 0),
          }))
          .sort((a, b) => b.followers - a.followers)
          .map((entry, index) => ({ ...entry, rank: index + 1 }))
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" style={{ filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.5))" }} />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" style={{ filter: "drop-shadow(0 0 8px rgba(209, 213, 219, 0.5))" }} />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" style={{ filter: "drop-shadow(0 0 8px rgba(217, 119, 6, 0.5))" }} />;
    return <span className="text-muted-foreground font-mono font-medium text-sm">#{rank}</span>;
  };

  return (
    <div className="glass rounded-xl p-6 relative overflow-hidden group">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold text-foreground">Leaderboard</h3>
        <p className="text-sm text-muted-foreground font-mono">Ranked by followers</p>
      </div>

      <div className="space-y-3 relative z-10">
        {leaderboard.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30 transition-all hover:border-primary/30 hover:bg-background/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>
              <div>
                <div className="font-medium text-foreground">{entry.name}</div>
                <div className="text-xs text-muted-foreground font-mono metric-value">
                  {entry.followers.toLocaleString()} followers
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-medium text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span className="metric-value">+{entry.change24h}</span>
              </div>
              <div className="text-xs text-muted-foreground font-mono">24h</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

