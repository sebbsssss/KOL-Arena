import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BlipStyle1,
  BlipStyle2,
  BlipStyle3,
  BlipStyle4,
  BlipStyle5,
  BlipStyle6,
} from "@/components/BlipAnimations";

const styles = [
  { id: 1, name: "Expanding Ring + Float", component: BlipStyle1, description: "Current style - expanding rings with floating number" },
  { id: 2, name: "Confetti Burst", component: BlipStyle2, description: "Celebratory particle explosion effect" },
  { id: 3, name: "Corner Badge", component: BlipStyle3, description: "Subtle badge with card glow" },
  { id: 4, name: "Ripple Wave", component: BlipStyle4, description: "Smooth ripple waves with arrow icon" },
  { id: 5, name: "Neon Flash", component: BlipStyle5, description: "Bold neon glow with border flash" },
  { id: 6, name: "Minimal Pulse", component: BlipStyle6, description: "Clean, professional pulse effect" },
];

export default function BlipDemo() {
  const [activeBlips, setActiveBlips] = useState<{ [key: number]: "gain" | "loss" | null }>({});

  const triggerBlip = (styleId: number, type: "gain" | "loss") => {
    setActiveBlips((prev) => ({ ...prev, [styleId]: type }));
    setTimeout(() => {
      setActiveBlips((prev) => ({ ...prev, [styleId]: null }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Blip Animation Styles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose your preferred animation style for follower changes
          </p>
        </div>
      </header>

      {/* Demo Grid */}
      <main className="container py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {styles.map((style) => {
            const BlipComponent = style.component;
            return (
              <div key={style.id} className="space-y-4">
                {/* Card with animation */}
                <div className="relative bg-card rounded-lg border border-border p-6 h-48 overflow-hidden">
                  <AnimatePresence>
                    {activeBlips[style.id] && (
                      <BlipComponent type={activeBlips[style.id]!} />
                    )}
                  </AnimatePresence>

                  <div className="relative z-10">
                    <h3 className="font-semibold text-foreground mb-1">
                      Style {style.id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {style.name}
                    </p>
                    <div className="mt-4">
                      <div className="text-3xl font-bold text-foreground">
                        1,234
                      </div>
                      <div className="text-xs text-muted-foreground">
                        followers
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {style.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => triggerBlip(style.id, "gain")}
                      className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                    >
                      Test Gain (+1)
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => triggerBlip(style.id, "loss")}
                      className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                    >
                      Test Loss (-1)
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Implementation Note */}
        <div className="mt-12 p-6 bg-accent rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">
            How to Change the Style
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            To use a different blip style in your dashboard, edit{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              client/src/components/LiveMetrics.tsx
            </code>
          </p>
          <div className="bg-card p-4 rounded border border-border">
            <pre className="text-xs text-foreground overflow-x-auto">
              <code>{`// Import the style you want
import { BlipStyle2 } from "@/components/BlipAnimations";

// Replace the blip animation section with:
<AnimatePresence>
  {blips[index] && (
    <BlipStyle2 type={blips[index].type} />
  )}
</AnimatePresence>`}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}

