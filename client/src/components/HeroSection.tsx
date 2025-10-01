import { Flame, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

interface HotSearch {
  id: string;
  keyword: string;
  size: "sm" | "md" | "lg" | "xl";
  color: string;
  brief: string;
  details: string;
}

export default function HeroSection() {
  const [selectedSearch, setSelectedSearch] = useState<HotSearch | null>(null);

  //todo: remove mock functionality
  const hotSearches: HotSearch[] = [
    {
      id: "1",
      keyword: "Messi Transfer",
      size: "xl",
      color: "text-chart-3",
      brief: "Breaking: Messi's Next Move",
      details: "Inter Miami star Lionel Messi is rumored to be considering options for next season. Fans worldwide are speculating about potential destinations including a return to Barcelona or a move to Saudi Arabia.",
    },
    {
      id: "2",
      keyword: "Champions League",
      size: "lg",
      color: "text-chart-2",
      brief: "UCL Drama Unfolds",
      details: "The Champions League knockout stages are heating up with unexpected results. Underdog teams are making waves while traditional powerhouses face elimination threats.",
    },
    {
      id: "3",
      keyword: "Premier League",
      size: "lg",
      color: "text-primary",
      brief: "EPL Title Race",
      details: "The Premier League title race is the tightest in years with three teams separated by just 2 points. Every match could determine who lifts the trophy at the end of the season.",
    },
    {
      id: "4",
      keyword: "Salah Goal",
      size: "md",
      color: "text-chart-4",
      brief: "Salah's Stunning Strike",
      details: "Mohamed Salah scored a spectacular goal in Liverpool's latest match, continuing his incredible form this season. The Egyptian King now has 25 goals in all competitions.",
    },
    {
      id: "5",
      keyword: "VAR Controversy",
      size: "md",
      color: "text-destructive",
      brief: "VAR Decision Sparks Debate",
      details: "Another controversial VAR decision has football fans divided. The technology designed to improve accuracy continues to generate heated discussions across social media.",
    },
    {
      id: "6",
      keyword: "Haaland",
      size: "lg",
      color: "text-chart-2",
      brief: "Haaland's Record Pace",
      details: "Erling Haaland is on track to break multiple Premier League records this season. His goal-scoring rate is unprecedented in modern football.",
    },
    {
      id: "7",
      keyword: "AFCON 2025",
      size: "md",
      color: "text-chart-3",
      brief: "AFCON Updates",
      details: "African football fans are gearing up for AFCON 2025. Star players from across the continent will represent their nations in this prestigious tournament.",
    },
    {
      id: "8",
      keyword: "Arsenal Form",
      size: "md",
      color: "text-chart-4",
      brief: "Arsenal's Title Push",
      details: "Arsenal are showing championship form with a string of impressive performances. The Gunners are proving they're serious title contenders this season.",
    },
    {
      id: "9",
      keyword: "Ronaldo",
      size: "lg",
      color: "text-chart-5",
      brief: "CR7 Legacy Continues",
      details: "Cristiano Ronaldo continues to defy age with outstanding performances. At 39, he's still scoring goals and breaking records in the Saudi Pro League.",
    },
    {
      id: "10",
      keyword: "Transfer Window",
      size: "sm",
      color: "text-accent-foreground",
      brief: "Transfer News",
      details: "Clubs are preparing for the next transfer window with big-money moves expected. Scouts are watching potential signings closely.",
    },
    {
      id: "11",
      keyword: "El Clasico",
      size: "md",
      color: "text-chart-3",
      brief: "El Clasico Preview",
      details: "The biggest match in club football is approaching. Real Madrid vs Barcelona always delivers drama, skill, and unforgettable moments.",
    },
    {
      id: "12",
      keyword: "Mbappe",
      size: "md",
      color: "text-primary",
      brief: "Mbappe Watch",
      details: "Kylian Mbappe's future remains the hottest topic in football. Every performance adds to speculation about his next career move.",
    },
  ];

  const sizeClasses = {
    sm: "text-sm md:text-base",
    md: "text-base md:text-xl",
    lg: "text-xl md:text-3xl",
    xl: "text-2xl md:text-5xl",
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-green-600 to-green-700 py-12 md:py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6TTIyIDM2YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Flame className="h-10 w-10 text-white md:h-12 md:w-12" />
              <h1 className="font-display text-4xl font-black text-white md:text-6xl lg:text-7xl">
                Ball Mtaani
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
              Your home for football banter, memes, stats & AI vibes
            </p>
          </div>

          <div className="mb-6 flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5 text-white" />
            <h2 className="font-display text-xl font-bold text-white md:text-2xl">
              Hot Fan Searches Right Now
            </h2>
          </div>

          <div className="relative mx-auto min-h-[300px] max-w-5xl rounded-2xl bg-white/10 p-6 backdrop-blur-md md:min-h-[400px] md:p-12">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
              {hotSearches.map((search) => (
                <Button
                  key={search.id}
                  variant="ghost"
                  onClick={() => setSelectedSearch(search)}
                  className={`${sizeClasses[search.size]} ${search.color} hover-elevate font-display font-bold text-white transition-all hover:scale-110 hover:bg-white/20`}
                  data-testid={`search-${search.id}`}
                >
                  {search.keyword}
                </Button>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-white/70">
              Click any search to see what fans are talking about
            </p>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedSearch} onOpenChange={() => setSelectedSearch(null)}>
        <DialogContent data-testid="dialog-search-details">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Flame className="h-6 w-6 text-chart-3" />
              {selectedSearch?.brief}
            </DialogTitle>
            <DialogDescription className="pt-4 text-base">
              {selectedSearch?.details}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted p-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Search trending: <strong>{selectedSearch?.keyword}</strong>
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
