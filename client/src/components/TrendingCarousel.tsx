import { TrendingUp, Flame } from "lucide-react";

interface TrendingTopic {
  id: string;
  topic: string;
  searchVolume: string;
}

export default function TrendingCarousel() {
  //todo: remove mock functionality
  const topics: TrendingTopic[] = [
    { id: "1", topic: "Messi Transfer", searchVolume: "500K" },
    { id: "2", topic: "Arsenal vs Chelsea", searchVolume: "350K" },
    { id: "3", topic: "CAF Champions League", searchVolume: "280K" },
    { id: "4", topic: "Salah Injury Update", searchVolume: "220K" },
    { id: "5", topic: "Real Madrid Rumors", searchVolume: "180K" },
    { id: "6", topic: "VAR Controversy", searchVolume: "160K" },
    { id: "7", topic: "Haaland Form", searchVolume: "140K" },
  ];

  return (
    <section className="border-y bg-card py-4">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-5 w-5 text-[#f59e0b]" />
          <h2 className="font-display text-lg font-bold md:text-xl">Trending Football Topics</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {topics.map((topic, index) => (
            <button
              key={topic.id}
              onClick={() => console.log(`Clicked topic: ${topic.topic}`)}
              className={`group relative flex-shrink-0 snap-start rounded-lg border px-4 py-2 text-sm font-medium transition-all hover-elevate ${
                index === 0
                  ? "border-[#f59e0b] bg-[#f59e0b]/10 text-foreground"
                  : "border-border bg-card text-foreground hover:border-[#3b82f6]"
              }`}
              data-testid={`trending-topic-${topic.id}`}
            >
              <div className="flex items-center gap-2">
                <span>{topic.topic}</span>
                <span className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3" />
                  {topic.searchVolume}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
