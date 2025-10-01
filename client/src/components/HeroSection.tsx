import { Flame, TrendingUp, Zap, Users, MessageCircle, Laugh, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
  size: "sm" | "md" | "lg" | "xl";
}

export default function HeroSection() {
  const [selectedSearch, setSelectedSearch] = useState<HotSearch | null>(null);

  const { data: hotSearches = [] } = useQuery<HotSearch[]>({
    queryKey: ['/api/trending/searches'],
  });


  const sizeClasses = {
    sm: "text-sm md:text-base",
    md: "text-base md:text-lg",
    lg: "text-xl md:text-2xl",
    xl: "text-2xl md:text-4xl",
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[#0a1628]">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        
        {/* Solid color blocks */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[#1e40af]/10"></div>
        
        {/* Glow effects - solid colors no gradients */}
        <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-[#3b82f6]/10 blur-[120px]"></div>
        <div className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-[#60a5fa]/10 blur-[120px]"></div>

        <div className="container relative mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Left column - Main content */}
            <div className="space-y-6">
              {/* Live badge */}
              <div className="flex items-center gap-3">
                <div className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3b82f6] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3b82f6]"></span>
                </div>
                <Badge className="bg-[#1e3a8a] text-[#60a5fa] border border-[#3b82f6]/50">
                  <Zap className="mr-1 h-3 w-3" />
                  LIVE NOW
                </Badge>
                <Badge variant="secondary" className="bg-[#1e293b] text-white border-[#475569]">
                  <Users className="mr-1 h-3 w-3" />
                  12.4K Online
                </Badge>
              </div>

              {/* Main headline */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Flame className="h-10 w-10 text-[#f59e0b] md:h-12 md:w-12" />
                  <h1 className="font-display text-5xl font-black leading-none text-white md:text-7xl lg:text-8xl">
                    Ball
                    <br />
                    <span className="text-[#3b82f6]">
                      Mtaani
                    </span>
                  </h1>
                </div>
                <p className="max-w-xl text-lg text-gray-300 md:text-xl">
                  Your home for football <span className="font-bold text-[#3b82f6]">banter</span>, 
                  epic <span className="font-bold text-[#f59e0b]">memes</span>, 
                  live <span className="font-bold text-[#60a5fa]">stats</span> & 
                  AI <span className="font-bold text-[#3b82f6]">vibes</span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  size="lg" 
                  className="bg-[#3b82f6] text-white text-lg font-bold hover:bg-[#2563eb]"
                  data-testid="button-join-chat"
                  onClick={() => console.log("Join chat clicked")}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Join the Banter
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-[#3b82f6] bg-transparent text-[#3b82f6] hover:bg-[#3b82f6]/10"
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

            {/* Right column - Word Cloud */}
            <div className="relative hidden lg:block">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Search className="h-5 w-5 text-[#3b82f6]" />
                <h3 className="font-display text-lg font-bold text-white">Hot Searches</h3>
              </div>
              <div className="relative min-h-[400px]">
                {/* Word cloud layout */}
                <div className="flex flex-wrap items-center justify-center gap-4 p-8">
                  {hotSearches.length > 0 ? hotSearches.map((search, index) => (
                    <button
                      key={search.id}
                      onClick={() => setSelectedSearch(search)}
                      className={`${sizeClasses[search.size]} font-display font-bold text-white transition-all hover:text-[#3b82f6] hover:scale-110 cursor-pointer`}
                      style={{
                        transform: `rotate(${(index % 3) * 5 - 5}deg)`,
                      }}
                      data-testid={`hot-search-${search.id}`}
                    >
                      {search.keyword}
                    </button>
                  )) : (
                    <div className="text-muted-foreground">Loading hot searches...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
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
