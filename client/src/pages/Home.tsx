import Header from "@/components/Header";
import TrendingTopics from "@/components/TrendingTopics";
import TodaysMatches from "@/components/TodaysMatches";
import MemeCarousel from "@/components/MemeCarousel";
import SideChat from "@/components/SideChat";
import AIAssistant from "@/components/AIAssistant";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="space-y-12">
          <TrendingTopics />
          <TodaysMatches />
          <MemeCarousel />
          
          <div className="grid gap-8 lg:grid-cols-2">
            <SideChat />
            <AIAssistant />
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground md:px-6">
          <p className="mb-2">
            Gambling can be addictive. Play responsibly. 18+
          </p>
          <p>Ball Mtaani &copy; 2025 - Your home for football banter, memes, stats & AI vibes</p>
        </div>
      </footer>
    </div>
  );
}
