import { TrendingUp, Flame, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface TrendingTopic {
  id: string;
  topic: string;
  searchVolume: string;
  description?: string;
}

export default function TrendingCarousel() {
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
  
  const { data: topics = [], isLoading } = useQuery<TrendingTopic[]>({
    queryKey: ['/api/trending/topics'],
  });

  if (isLoading) {
    return (
      <section className="border-y bg-card py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-3 flex items-center gap-2">
            <Flame className="h-5 w-5 text-[#f59e0b]" />
            <h2 className="font-display text-lg font-bold md:text-xl">Trending Football Topics</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <div className="h-10 w-32 animate-pulse rounded-lg bg-muted"></div>
            <div className="h-10 w-32 animate-pulse rounded-lg bg-muted"></div>
            <div className="h-10 w-32 animate-pulse rounded-lg bg-muted"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
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
                onClick={() => setSelectedTopic(topic)}
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

      <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
        <DialogContent data-testid="dialog-trending-topic">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Flame className="h-6 w-6 text-[#f59e0b]" />
              {selectedTopic?.topic}
            </DialogTitle>
            <DialogDescription className="pt-4 text-base leading-relaxed">
              {selectedTopic?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Search Volume: <strong className="text-foreground">{selectedTopic?.searchVolume}</strong>
              </span>
            </div>
            <Badge className="bg-[#f59e0b] text-white">
              Trending
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
