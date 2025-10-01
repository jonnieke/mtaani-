import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <Card
      className="hover-elevate cursor-pointer overflow-hidden"
      onClick={() => console.log(`Clicked match: ${match.homeTeam} vs ${match.awayTeam}`)}
      data-testid={`match-${match.id}`}
    >
      <div className="p-4">
        {match.isLive && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-3 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-3"></span>
            </div>
            <Badge className="bg-chart-3 text-white hover:bg-chart-3">LIVE</Badge>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex-1">
            <div className="text-base font-semibold md:text-lg">{match.homeTeam}</div>
          </div>
          <div className="mx-4 font-mono text-2xl font-black md:text-3xl">
            {match.homeScore || "0"} - {match.awayScore || "0"}
          </div>
          <div className="flex-1 text-right">
            <div className="text-base font-semibold md:text-lg">{match.awayTeam}</div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Home</div>
            <div className="font-mono text-sm font-semibold text-chart-2">{match.odds.home}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Draw</div>
            <div className="font-mono text-sm font-semibold text-chart-2">{match.odds.draw}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Away</div>
            <div className="font-mono text-sm font-semibold text-chart-2">{match.odds.away}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
