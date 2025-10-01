import { Flame, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrendingTopic {
  id: string;
  topic: string;
  searchVolume: string;
  trend: "up" | "down" | "stable";
}

export default function TrendingTopics() {
  //todo: remove mock functionality
  const topics: TrendingTopic[] = [
    { id: "1", topic: "Messi Transfer", searchVolume: "500K", trend: "up" },
    { id: "2", topic: "Arsenal vs Chelsea", searchVolume: "350K", trend: "up" },
    { id: "3", topic: "CAF Champions League", searchVolume: "280K", trend: "up" },
    { id: "4", topic: "Salah Injury Update", searchVolume: "220K", trend: "stable" },
    { id: "5", topic: "Real Madrid Rumors", searchVolume: "180K", trend: "up" },
  ];

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <Flame className="h-6 w-6 text-chart-3" />
        <h2 className="font-display text-2xl font-bold md:text-3xl">Trending Football Topics</h2>
      </div>

      <Card className="overflow-hidden p-4">
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <button
              key={topic.id}
              onClick={() => console.log(`Clicked topic: ${topic.topic}`)}
              className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover-elevate ${
                index === 0 ? "border-l-4 border-chart-3 bg-chart-3/10" : ""
              }`}
              data-testid={`topic-${topic.id}`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-semibold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-medium md:text-lg">{topic.topic}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {topic.searchVolume}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </section>
  );
}
