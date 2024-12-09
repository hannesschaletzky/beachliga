import { Match } from "~/types";

export function calculateResult(dynamoMatch: Match, firstTeam: string): string {
  const team1 = dynamoMatch.team1;
  const team2 = dynamoMatch.team2;
  const set1_team1_points = dynamoMatch.set1_team1_points;
  const set1_team2_points = dynamoMatch.set1_team2_points;
  const set2_team1_points = dynamoMatch.set2_team1_points;
  const set2_team2_points = dynamoMatch.set2_team2_points;
  const set3_team1_points = dynamoMatch.set3_team1_points;
  const set3_team2_points = dynamoMatch.set3_team2_points;

  if (set1_team1_points == set1_team2_points) {
    return "";
  }

  const setsWonByTeam1 =
    (set1_team1_points > set1_team2_points ? 1 : 0) +
    (set2_team1_points > set2_team2_points ? 1 : 0) +
    (set3_team1_points > set3_team2_points ? 1 : 0);
  const setsWonByTeam2 =
    (set1_team1_points < set1_team2_points ? 1 : 0) +
    (set2_team1_points < set2_team2_points ? 1 : 0) +
    (set3_team1_points < set3_team2_points ? 1 : 0);

  if (set3_team1_points == set3_team2_points && firstTeam == team1) {
    const twoSetW20 = `${setsWonByTeam1}:${setsWonByTeam2} (${set1_team1_points}:${set1_team2_points}, ${set2_team1_points}:${set2_team2_points})`;
    return twoSetW20;
  }

  if (set3_team1_points == set3_team2_points && firstTeam == team2) {
    const twoSetW02 = `${setsWonByTeam2}:${setsWonByTeam1} (${set1_team2_points}:${set1_team1_points}, ${set2_team2_points}:${set2_team1_points})`;
    return twoSetW02;
  }
  if (set3_team1_points != set3_team2_points && firstTeam == team1) {
    const threeSetW = `${setsWonByTeam1}:${setsWonByTeam2} (${set1_team1_points}:${set1_team2_points}, ${set2_team1_points}:${set2_team2_points}, ${set3_team1_points}:${set3_team2_points})`;
    return threeSetW;
  }

  const threeSetW = `${setsWonByTeam2}:${setsWonByTeam1} (${set1_team2_points}:${set1_team1_points}, ${set2_team2_points}:${set2_team1_points}, ${set3_team2_points}:${set3_team1_points})`;
  return threeSetW;
}
