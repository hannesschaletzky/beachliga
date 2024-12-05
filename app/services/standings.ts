import { Match } from "~/types";

export default function calculateStandings(matches: Match[]) {
  const teamStats: Record<
    string,
    {
      games: number;
      wins: number;
      ties: number;
      losses: number;
      setsWon: number;
      setsLost: number;
      pointsWon: number;
      pointsLost: number;
    }
  > = {};

  matches.forEach((match) => {
    const {
      team1,
      team2,
      set1_team1_points,
      set1_team2_points,
      set2_team1_points,
      set2_team2_points,
      set3_team1_points,
      set3_team2_points,
    } = match;

    if (!teamStats[team1]) {
      teamStats[team1] = {
        games: 0,
        wins: 0,
        ties: 0,
        losses: 0,
        setsWon: 0,
        setsLost: 0,
        pointsWon: 0,
        pointsLost: 0,
      };
    }
    if (!teamStats[team2]) {
      teamStats[team2] = {
        games: 0,
        wins: 0,
        ties: 0,
        losses: 0,
        setsWon: 0,
        setsLost: 0,
        pointsWon: 0,
        pointsLost: 0,
      };
    }

    const sets = [
      { team1: set1_team1_points, team2: set1_team2_points },
      { team1: set2_team1_points, team2: set2_team2_points },
      { team1: set3_team1_points, team2: set3_team2_points },
    ];

    let team1SetsWon = 0,
      team2SetsWon = 0;

    sets.forEach(({ team1: t1Points, team2: t2Points }) => {
      if (t1Points !== undefined && t2Points !== undefined) {
        if (t1Points > t2Points) team1SetsWon++;
        else if (t1Points < t2Points) team2SetsWon++;

        teamStats[team1].pointsWon += t1Points;
        teamStats[team1].pointsLost += t2Points;
        teamStats[team2].pointsWon += t2Points;
        teamStats[team2].pointsLost += t1Points;
      }
    });

    teamStats[team1].games++;
    teamStats[team2].games++;
    teamStats[team1].setsWon += team1SetsWon;
    teamStats[team1].setsLost += team2SetsWon;
    teamStats[team2].setsWon += team2SetsWon;
    teamStats[team2].setsLost += team1SetsWon;

    if (team1SetsWon > team2SetsWon) {
      teamStats[team1].wins++;
      teamStats[team2].losses++;
    } else if (team2SetsWon > team1SetsWon) {
      teamStats[team2].wins++;
      teamStats[team1].losses++;
    } else {
      teamStats[team1].ties++;
      teamStats[team2].ties++;
    }
  });

  const standings = Object.entries(teamStats).map(([team, stats]) => ({
    team,
    games: stats.games,
    wins: stats.wins,
    ties: stats.ties,
    losses: stats.losses,
    setsWon: stats.setsWon,
    setsLost: stats.setsLost,
    setRatio: stats.setsWon - stats.setsLost,
    pointsWon: stats.pointsWon,
    pointsLost: stats.pointsLost,
    pointRatio: stats.pointsWon - stats.pointsLost,
    pointKoe: stats.pointsWon / stats.pointsLost,
  }));

  standings.sort(
    (a, b) =>
      b.wins - a.wins || b.setRatio - a.setRatio || b.pointRatio - a.pointRatio
  );

  return standings;
}
