type Match = {
  team1: string;
  team2: string;
  referee: string;
  court: number;
};

interface Schedule {
  matches: Match[];
}

export function generateSchedule(
  teams: string[],
  courts: number,
  amountgamedays: number
) {
  if (teams.length % 2 != 0) {
    throw new Error("uneven amount of teams");
  }
}
