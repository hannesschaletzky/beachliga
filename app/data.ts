import fs from "fs/promises";

const leaguesFilePath = "leagues.json";

export type LeagueRecord = {
  id: string;
  leagueName: string;
  numberOfTeams: number;
  numberOfGamedays: number;
  numberOfCourts: number;
  adress: string;
  createdAt: string;
};

export async function getStoredLeagues(): Promise<LeagueRecord[]> {
  try {
    const data = await fs.readFile(leaguesFilePath, "utf-8");
    const leagues = JSON.parse(data);
    return leagues || [];
  } catch (error) {
    console.error(
      "Error reading leagues file, returning an empty array:",
      error
    );
    return [];
  }
}

export function storeLeagues(leagues: LeagueRecord[] = []) {
  return fs.writeFile("leagues.json", JSON.stringify(leagues, null, 2));
}

export async function getLeague(id: string) {
  const leagues = await getStoredLeagues();
  return leagues.find((league) => league.id === id) || null;
}

export async function updateLeague(id: string, updates: LeagueRecord) {
  const leagues = await getStoredLeagues();
  const updatedLeagues = leagues.map((league) =>
    league.id === id ? { ...league, ...updates } : league
  );
  await storeLeagues(updatedLeagues);
}

export async function deleteLeague(id: string) {
  const leagues = await getStoredLeagues();
  const updatedLeagues = leagues.filter((league) => league.id !== id);
  await storeLeagues(updatedLeagues);
}
