import { BarChart3 } from "lucide-react";
import MatchCard from "./MatchCard";

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
  //todo: remove mock functionality
  const matches: Match[] = [
    {
      id: "1",
      homeTeam: "Brighton",
      awayTeam: "Leicester",
      homeScore: "4",
      awayScore: "3",
      isLive: false,
      odds: { home: "4.30", draw: "3.75", away: "1.95" },
    },
    {
      id: "2",
      homeTeam: "Liverpool",
      awayTeam: "Everton",
      homeScore: "1",
      awayScore: "0",
      isLive: true,
      odds: { home: "2.05", draw: "3.50", away: "2.60" },
    },
    {
      id: "3",
      homeTeam: "Man Utd",
      awayTeam: "Fulham",
      homeScore: "4",
      awayScore: "2",
      isLive: false,
      odds: { home: "2.05", draw: "3.50", away: "1.73" },
    },
  ];

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
