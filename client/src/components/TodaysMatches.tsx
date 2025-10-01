import { BarChart3 } from "lucide-react";
import MatchCard from "./MatchCard";
import { useQuery } from "@tanstack/react-query";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  isLive: boolean;
  odds: {
    home: string;
    draw: string;
    away: string;
  };
}

export default function TodaysMatches() {
  const { data: matches = [], isLoading } = useQuery<Match[]>({
    queryKey: ['/api/matches/today'],
  });

  if (isLoading) {
    return (
      <section className="w-full">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-chart-2" />
          <h2 className="font-display text-2xl font-bold md:text-3xl">Today's Matches</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-48 w-full animate-pulse rounded-lg bg-muted"></div>
          <div className="h-48 w-full animate-pulse rounded-lg bg-muted"></div>
          <div className="h-48 w-full animate-pulse rounded-lg bg-muted"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-chart-2" />
        <h2 className="font-display text-2xl font-bold md:text-3xl">Today's Matches</h2>
      </div>

      <div className="mb-4 flex items-center justify-center rounded-md bg-card p-2">
        <span className="text-xs text-muted-foreground">Stats powered by Oddspedia.</span>
        <button
          onClick={() => console.log("View Terms clicked")}
          className="ml-1 text-xs text-chart-2 hover:underline"
          data-testid="link-view-terms"
        >
          View Terms
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
