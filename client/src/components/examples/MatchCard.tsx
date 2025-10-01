import MatchCard from '../MatchCard';

export default function MatchCardExample() {
  const match = {
    id: "1",
    homeTeam: "Liverpool",
    awayTeam: "Man City",
    homeScore: "2",
    awayScore: "1",
    isLive: true,
    odds: {
      home: "2.05",
      draw: "3.50",
      away: "2.80"
    }
  };

  return <MatchCard match={match} />;
}
