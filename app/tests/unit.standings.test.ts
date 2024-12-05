import calculateStandings from "~/services/standings";
import { MOCK_MATCHES } from "./mock.matches";

/*
  GIVEN 
    -> prepare testing data

  WHEN
    -> call function that we want to test

  THEN
    -> assert result to certain conditions 
*/

describe("standings", () => {
  it("should correctly calculate standings with all properties with 2 teams and 1 match and Team A winning", () => {
    // GIVEN
    const matches = MOCK_MATCHES;

    // WHEN
    const standings = calculateStandings(matches);

    // THEN
    expect(standings[0]).toStrictEqual({
      team: "Team A",
      games: 1,
      wins: 1,
      ties: 0,
      losses: 0,
      setsWon: 2,
      setsLost: 1,
      setRatio: 1,
      pointsWon: 54,
      pointsLost: 56,
      pointRatio: -2,
      pointKoe: 0.9642857142857143,
    });

    expect(standings[1]).toStrictEqual({
      team: "Team B",
      games: 1,
      wins: 0,
      ties: 0,
      losses: 1,
      setsWon: 1,
      setsLost: 2,
      setRatio: -1,
      pointsWon: 56,
      pointsLost: 54,
      pointRatio: 2,
      pointKoe: 1.037037037037037,
    });
  });
});
