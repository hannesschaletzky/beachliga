import { useState } from "react";
import { useLoaderData, useParams } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getMatches } from "~/api/dynamo";
import { getDateFromDate, getTimeFromDate } from "~/services/date";
import { calculateResult } from "~/services/result";

export async function loader({ params }: LoaderFunctionArgs) {
  const matches = await getMatches();
  return json({ matches });
}

export default function TeamTimetable() {
  const { league } = useParams();
  const data = useLoaderData<typeof loader>();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  if (!data.matches) {
    return <p className="text-white">Keine Spiele verfügbar.</p>;
  }

  const teams = Array.from(
    new Set(
      data.matches.flatMap((match) => [match.team1, match.team2, match.referee]) // Alle relevanten Felder
    )
  );

  const resetSelection = () => setSelectedTeams([]);

  const filteredMatches = data.matches
    .filter((match) => match.league_name === league)
    .filter(
      (match) =>
        selectedTeams.length === 0 ||
        selectedTeams.includes(match.team1) ||
        selectedTeams.includes(match.team2) ||
        selectedTeams.includes(match.referee)
    );

  const matchesByTeam = filteredMatches.reduce(
    (acc: Record<string, typeof filteredMatches>, match) => {
      const relevantTeams = [match.team1, match.team2, match.referee];
      relevantTeams.forEach((team) => {
        if (!acc[team]) acc[team] = [];
        acc[team].push(match);
      });
      return acc;
    },
    {}
  );

  return (
    <div className="mt-4">
      <div className="flex flex-col items-center space-x-2 p-2">
        <div className="flex flex-row items-center justify-between w-full">
          <label
            htmlFor="team-filter"
            className="flex font-semibold ml-5 text-white"
          >
            Wähle Team(s):
          </label>

          <button
            className="flex p-1 bg-red-500 text-white rounded mr-2"
            onClick={resetSelection}
          >
            Reset
          </button>
        </div>
        <select
          id="team-filter"
          className="w-11/12 p-1 m-2 bg-gradient-to-b from-gray-200 to-slate-50 rounded-md focus:outline-none"
          multiple
          value={selectedTeams}
          onChange={(e) =>
            setSelectedTeams(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          {teams.map((team) => (
            <option key={team} value={team} className="active:text-black">
              {team}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(matchesByTeam)
        .filter(
          ([team]) => selectedTeams.length === 0 || selectedTeams.includes(team)
        )
        .map(([team, matches]) => (
          <div key={team} className="p-4 rounded-md m-2">
            <h2 className="text-xl text-white font-bold text-center">{team}</h2>
            <div className="space-y-4">
              {matches.map((match, index) => (
                <a
                  href={`/${league}/matches#${match.match_number}`}
                  key={index}
                  className="flex flex-col justify-between rounded-md w-full bg-gradient-to-b from-gray-200 to-slate-50 p-2"
                >
                  <div className="flex flex-row justify-between border-b-2 border-dashed border-gray-800">
                    <div>#{match.match_number}</div>
                    <div>{getDateFromDate(match.date)}</div>
                    <div>{getTimeFromDate(match.date)}</div>
                    <div>C - {match.court}</div>
                  </div>
                  <div className="flex flex-row my-2">
                    <div className="items-center justify-center space-y-1">
                      {match.referee === team && (
                        <div className="bg-yellow-600 p-1 mt-1 font-medium text-white rounded text-lg flex items-center h-full">
                          REF
                        </div>
                      )}
                      {(match.team1 === team || match.team2 === team) && (
                        <div className="bg-blue-600 p-1 mt-1 font-medium text-white rounded text-lg flex items-center justify-center h-full">
                          VS
                        </div>
                      )}
                    </div>

                    {match.set1_team1_points === 0 &&
                    match.set1_team2_points === 0 &&
                    (match.team1 === team || match.team2 === team) ? (
                      <div className="flex flex-col w-full">
                        <div className="flex flex-row justify-between px-3">
                          {team === match.team1 ? (
                            <>
                              {match.team2.split("/")[0]}
                              <br />
                              {match.team2.split("/")[1]}
                            </>
                          ) : (
                            <>
                              {match.team1.split("/")[0]}
                              <br />
                              {match.team1.split("/")[1]}
                            </>
                          )}
                        </div>
                      </div>
                    ) : team === match.referee ? (
                      <div className="flex flex-col w-full">
                        <div className="flex flex-row justify-between px-3">
                          <div>{match.team1}</div>
                        </div>
                        <div className="flex flex-row justify-between px-3">
                          <div>{match.team2}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-row items-center w-full justify-between px-3">
                        <div className="">
                          {team === match.team1 ? (
                            <>
                              {match.team2.split("/")[0]}
                              <br />
                              {match.team2.split("/")[1]}
                            </>
                          ) : (
                            <>
                              {match.team1.split("/")[0]}
                              <br />
                              {match.team1.split("/")[1]}
                            </>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className=" font-semibold text-right">
                            {calculateResult(match, team).slice(0, 3)}
                          </div>
                          <div>
                            {calculateResult(match, team)
                              .slice(4, 30)
                              .replace("(", "")
                              .replace(")", "")}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
