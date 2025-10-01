import { Flame, TrendingUp, Zap, Users, MessageCircle, Laugh } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState } from "react";

interface HotSearch {
  id: string;
  keyword: string;
  brief: string;
  details: string;
}

export default function HeroSection() {
  const [selectedSearch, setSelectedSearch] = useState<HotSearch | null>(null);

  //todo: remove mock functionality
  const hotSearches: HotSearch[] = [
    {
      id: "1",
      keyword: "Messi Transfer Drama",
      brief: "Breaking: Messi's Next Move",
      details: "Inter Miami star Lionel Messi is rumored to be considering options for next season. Fans worldwide are speculating about potential destinations including a return to Barcelona or a move to Saudi Arabia.",
    },
    {
      id: "2",
      keyword: "Champions League Upset",
      brief: "UCL Drama Unfolds",
      details: "The Champions League knockout stages are heating up with unexpected results. Underdog teams are making waves while traditional powerhouses face elimination threats.",
    },
    {
      id: "3",
      keyword: "EPL Title Race",
      brief: "Premier League Thriller",
      details: "The Premier League title race is the tightest in years with three teams separated by just 2 points. Every match could determine who lifts the trophy.",
    },
    {
      id: "4",
      keyword: "Salah Record Breaking",
      brief: "Salah's Stunning Strike",
      details: "Mohamed Salah scored a spectacular goal in Liverpool's latest match, continuing his incredible form this season with 25 goals in all competitions.",
    },
    {
      id: "5",
      keyword: "VAR Controversy",
      brief: "VAR Sparks Debate",
      details: "Another controversial VAR decision has football fans divided. The technology continues to generate heated discussions across social media.",
    },
    {
      id: "6",
      keyword: "Haaland Hat-trick",
      brief: "Haaland's Record Pace",
      details: "Erling Haaland scored another hat-trick, breaking multiple Premier League records. His goal-scoring rate is unprecedented.",
    },
    {
      id: "7",
      keyword: "AFCON Showdown",
      brief: "AFCON Drama",
      details: "African football fans are buzzing about the latest AFCON matches. Star players are delivering unforgettable performances.",
    },
    {
      id: "8",
      keyword: "Arsenal's Form",
      brief: "Gunners On Fire",
      details: "Arsenal are showing championship form with impressive performances. They're proving to be serious title contenders.",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0f0a] via-[#0d1a0d] to-[#000000]">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMmM1NWUiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        
        {/* Diagonal stripes */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-3/10"></div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/20 to-transparent"></div>
        
        {/* Glow effects */}
        <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-chart-3/20 blur-[120px]"></div>

        <div className="container relative mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Left column - Main content */}
            <div className="space-y-6">
              {/* Live badge */}
              <div className="flex items-center gap-3">
                <div className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-3 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-3"></span>
                </div>
                <Badge className="bg-chart-3/20 text-chart-3 border border-chart-3/50 backdrop-blur-sm">
                  <Zap className="mr-1 h-3 w-3" />
                  LIVE NOW
                </Badge>
                <Badge variant="secondary" className="backdrop-blur-sm">
                  <Users className="mr-1 h-3 w-3" />
                  12.4K Online
                </Badge>
              </div>

              {/* Main headline */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Flame className="h-10 w-10 text-chart-3 md:h-12 md:w-12" />
                  <h1 className="font-display text-5xl font-black leading-none text-white md:text-7xl lg:text-8xl">
                    Ball
                    <br />
                    <span className="bg-gradient-to-r from-primary via-green-400 to-chart-3 bg-clip-text text-transparent">
                      Mtaani
                    </span>
                  </h1>
                </div>
                <p className="max-w-xl text-lg text-gray-300 md:text-xl">
                  Your home for football <span className="font-bold text-chart-3">banter</span>, 
                  epic <span className="font-bold text-chart-5">memes</span>, 
                  live <span className="font-bold text-chart-2">stats</span> & 
                  AI <span className="font-bold text-primary">vibes</span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-green-600 text-lg font-bold shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60"
                  data-testid="button-join-chat"
                  onClick={() => console.log("Join chat clicked")}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Join the Banter
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
                  data-testid="button-view-memes"
                  onClick={() => console.log("View memes clicked")}
                >
                  <Laugh className="mr-2 h-5 w-5" />
                  Browse Memes
                </Button>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div>
                  <div className="font-mono text-3xl font-black text-white">250K+</div>
                  <div className="text-sm text-gray-400">Active Fans</div>
                </div>
                <div>
                  <div className="font-mono text-3xl font-black text-white">50K+</div>
                  <div className="text-sm text-gray-400">Daily Memes</div>
                </div>
                <div>
                  <div className="font-mono text-3xl font-black text-white">24/7</div>
                  <div className="text-sm text-gray-400">Live Chat</div>
                </div>
              </div>
            </div>

            {/* Right column - Visual element */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Large decorative circle */}
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary/20 bg-gradient-to-br from-primary/10 to-chart-3/10 backdrop-blur-xl"></div>
                
                {/* Floating elements */}
                <div className="absolute left-1/4 top-1/4 animate-bounce">
                  <div className="rounded-full bg-chart-3/20 p-4 backdrop-blur-sm border border-chart-3/30">
                    <Flame className="h-8 w-8 text-chart-3" />
                  </div>
                </div>
                <div className="absolute right-1/4 top-1/3 animate-bounce delay-150">
                  <div className="rounded-full bg-chart-2/20 p-4 backdrop-blur-sm border border-chart-2/30">
                    <TrendingUp className="h-8 w-8 text-chart-2" />
                  </div>
                </div>
                <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-300">
                  <div className="rounded-full bg-primary/20 p-4 backdrop-blur-sm border border-primary/30">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Trending carousel - compact horizontal */}
      <section className="border-y bg-card/50 py-4 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-chart-3" />
              <span className="font-display font-bold text-sm md:text-base whitespace-nowrap">
                Hot Searches:
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory flex-1">
              {hotSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => setSelectedSearch(search)}
                  className="group relative flex-shrink-0 snap-start rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-chart-3/10 px-4 py-2 text-sm font-medium transition-all hover-elevate hover:border-primary/60 hover:from-primary/20 hover:to-chart-3/20"
                  data-testid={`trending-${search.id}`}
                >
                  <span className="relative z-10">{search.keyword}</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 to-chart-3/0 opacity-0 transition-opacity group-hover:opacity-20"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Sheet open={!!selectedSearch} onOpenChange={() => setSelectedSearch(null)}>
        <SheetContent side="right" data-testid="sheet-search-details">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-2xl">
              <Flame className="h-6 w-6 text-chart-3" />
              {selectedSearch?.brief}
            </SheetTitle>
            <SheetDescription className="pt-4 text-base">
              {selectedSearch?.details}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted p-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Trending: <strong>{selectedSearch?.keyword}</strong>
            </span>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
