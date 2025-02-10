import { Team } from "~/types";

export function generateMatches(
  league_name: string,
  teams: string[],
  gameDays: string[],
  matchesPerPair: string,
  courts: string,
  startTime: string,
  interval: string
) {
  const matches = [];
  const totalTeams = teams.length;
  const matchesPerTeam = parseInt(matchesPerPair) * (totalTeams - 1);
  const totalMatches =
    (parseInt(matchesPerPair) * (totalTeams * (totalTeams - 1))) / 2;
  const matchesPerDay = totalMatches / gameDays.length;
  const timeSlotsPerDay = Math.floor(matchesPerDay / parseInt(courts));

  const startHour = parseInt(startTime.split(":")[0], 10);
  const startMinute = parseInt(startTime.split(":")[1], 10);

  let matchNumber = 1;

  // Helper to get match time
  function calculateTimeSlot(index: number) {
    const totalMinutes =
      startHour * 60 + startMinute + index * parseInt(interval);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  // Generate all pairings
  const pairings = [];
  for (let i = 0; i < totalTeams; i++) {
    for (let j = i + 1; j < totalTeams; j++) {
      for (let k = 0; k < parseInt(matchesPerPair); k++) {
        pairings.push({ team1: teams[i], team2: teams[j] });
      }
    }
  }

  // Shuffle pairings to distribute matches evenly
  pairings.sort(() => Math.random() - 0.5);

  // Assign matches to game days, courts, and time slots
  for (let dayIndex = 0; dayIndex < gameDays.length; dayIndex++) {
    const gameDay = gameDays[dayIndex];
    let slotIndex = 0;

    for (
      let matchIndex = dayIndex * matchesPerDay;
      matchIndex < (dayIndex + 1) * matchesPerDay &&
      matchIndex < pairings.length;
      matchIndex++
    ) {
      const court = (slotIndex % parseInt(courts)) + 1;
      const time = calculateTimeSlot(Math.floor(slotIndex / parseInt(courts)));
      const pairing = pairings[matchIndex];

      let refereeIndex = (matchIndex + slotIndex) % totalTeams;
      let referee = teams[refereeIndex];

      while (referee === pairing.team1 || referee === pairing.team2) {
        refereeIndex = (refereeIndex + 1) % totalTeams;
        referee = teams[refereeIndex];
      }

      const match = {
        league_name: league_name, // Customize as needed
        match_number: matchNumber++,
        court,
        date: `${gameDay} ${time}`,
        referee,
        set1_team1_points: 0,
        set1_team2_points: 0,
        set2_team1_points: 0,
        set2_team2_points: 0,
        set3_team1_points: 0,
        set3_team2_points: 0,
        team1: pairings[matchIndex].team1,
        team2: pairings[matchIndex].team2,
      };
      matches.push(match);
      slotIndex++;
    }
  }

  return matches;
}
