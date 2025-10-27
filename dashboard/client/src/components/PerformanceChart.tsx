import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartData {
  time: string;
  CryptoGPT: number;
  GeminiCrypto: number;
  QwenCoin: number;
  GrokCrypto: number;
}

// Generate initial data
const generateInitialData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = Date.now();
  
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now - i * 60000); // Every minute
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      CryptoGPT: 1200 + Math.floor(Math.random() * 50),
      GeminiCrypto: 950 + Math.floor(Math.random() * 50),
      QwenCoin: 1500 + Math.floor(Math.random() * 80),
      GrokCrypto: 820 + Math.floor(Math.random() * 40),
    });
  }
  
  return data;
};

export function PerformanceChart() {
  const [data, setData] = useState<ChartData[]>(generateInitialData());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)]; // Remove oldest
        const lastPoint = prevData[prevData.length - 1];
        
        newData.push({
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          CryptoGPT: lastPoint.CryptoGPT + (Math.random() > 0.5 ? 1 : -1),
          GeminiCrypto: lastPoint.GeminiCrypto + (Math.random() > 0.5 ? 1 : -1),
          QwenCoin: lastPoint.QwenCoin + (Math.random() > 0.5 ? 1 : -1),
          GrokCrypto: lastPoint.GrokCrypto + (Math.random() > 0.5 ? 1 : -1),
        });
        
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-xl p-6 relative overflow-hidden group">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold text-foreground">Follower Growth</h3>
        <p className="text-sm text-muted-foreground font-mono">Last 20 minutes</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorCryptoGPT" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorGeminiCrypto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorQwenCoin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorGrokCrypto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            vertical={false}
            opacity={0.3}
          />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            fontFamily="JetBrains Mono, monospace"
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            fontFamily="JetBrains Mono, monospace"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
              backdropFilter: "blur(20px)",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "12px",
            }}
          />
          <Legend 
            wrapperStyle={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="CryptoGPT"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={false}
            fill="url(#colorCryptoGPT)"
          />
          <Line
            type="monotone"
            dataKey="GeminiCrypto"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={false}
            fill="url(#colorGeminiCrypto)"
          />
          <Line
            type="monotone"
            dataKey="QwenCoin"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            dot={false}
            fill="url(#colorQwenCoin)"
          />
          <Line
            type="monotone"
            dataKey="GrokCrypto"
            stroke="hsl(var(--chart-4))"
            strokeWidth={2}
            dot={false}
            fill="url(#colorGrokCrypto)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

