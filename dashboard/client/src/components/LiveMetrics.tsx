import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { GracefulBlip } from "./GracefulBlip";

interface Agent {
  id: number;
  name: string;
  llm: string;
  followers: number;
  change: number;
  lastUpdate: number;
}

const initialAgents: Agent[] = [
  { id: 1, name: "CryptoGPT", llm: "GPT-4o", followers: 1234, change: 0, lastUpdate: Date.now() },
  { id: 2, name: "GeminiCrypto", llm: "Gemini 2.5 Pro", followers: 987, change: 0, lastUpdate: Date.now() },
  { id: 3, name: "QwenCoin", llm: "Qwen 2.5", followers: 1567, change: 0, lastUpdate: Date.now() },
  { id: 4, name: "GrokCrypto", llm: "Grok 4", followers: 845, change: 0, lastUpdate: Date.now() },
];

export function LiveMetrics() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [blips, setBlips] = useState<{ [key: number]: { type: "gain" | "loss"; timestamp: number } }>({});

  // Simulate real-time follower changes
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAgentIndex = Math.floor(Math.random() * agents.length);
      const change = Math.random() > 0.6 ? 1 : -1; // 60% chance of gaining follower

      setAgents((prev) =>
        prev.map((agent, index) =>
          index === randomAgentIndex
            ? {
                ...agent,
                followers: agent.followers + change,
                change: change,
                lastUpdate: Date.now(),
              }
            : agent
        )
      );

      // Trigger blip animation
      setBlips((prev) => ({
        ...prev,
        [randomAgentIndex]: {
          type: change > 0 ? "gain" : "loss",
          timestamp: Date.now(),
        },
      }));

      // Clear blip after animation
      setTimeout(() => {
        setBlips((prev) => {
          const newBlips = { ...prev };
          delete newBlips[randomAgentIndex];
          return newBlips;
        });
      }, 1500);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [agents.length]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {agents.map((agent, index) => (
        <div
          key={agent.id}
          className="relative glass rounded-xl p-6 overflow-hidden transition-all hover:border-primary/30 group"
        >
          {/* Blip Animation */}
          <AnimatePresence>
            {blips[index] && (
              <GracefulBlip type={blips[index].type} />
            )}
          </AnimatePresence>

          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Content */}
          <div className="relative z-10 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground">{agent.name}</h3>
              <p className="text-xs text-muted-foreground font-mono">{agent.llm}</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground metric-value">
                {agent.followers.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                {agent.change > 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 font-medium">+{agent.change}</span>
                  </>
                ) : agent.change < 0 ? (
                  <>
                    <TrendingDown className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 font-medium">{agent.change}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
                <span className="text-muted-foreground ml-1">followers</span>
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      ))}
    </div>
  );
}

