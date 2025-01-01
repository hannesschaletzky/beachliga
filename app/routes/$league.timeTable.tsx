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
  const [selectedTeams, setSelectedTeams] = useState<string[]>(["alle"]);

  if (!data.matches) {
    return <p className="text-white">Keine Spiele verfügbar.</p>;
  }

  const teams = Array.from(
    new Set(data.matches.map((match) => [match.team1, match.team2]).flat())
  );

  const filteredMatches = data.matches.filter(
    (match) =>
      selectedTeams.includes("alle") ||
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
    <div>
      <div className="flex flex-col items-center space-x-2 p-2">
        <label htmlFor="team-filter" className="font-bold text-white">
          Wähle Team(s):
        </label>
        <select
          id="team-filter"
          className="p-2  bg-slate-300 rounded"
          multiple
          value={selectedTeams}
          onChange={(e) =>
            setSelectedTeams(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          <option value="alle">Alle</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(matchesByTeam)
        .filter(
          ([team]) =>
            selectedTeams.includes("alle") || selectedTeams.includes(team)
        )
        .map(([team, matches]) => (
          <div key={team} className="p-4 rounded-md m-2">
            <h2 className="text-xl text-white font-bold text-center">{team}</h2>
            <div className="space-y-2">
              {matches.map((match, index) => (
                <a
                  href={`/${league}/matches#${match.match_number}`}
                  key={index}
                  className="mb-4 flex rounded bg-slate-300 hover:border-2"
                >
                  <div className="flex flex-col items-start justify-center w-[40px]">
                    {match.referee === team && (
                      <div className="bg-yellow-600 ml-2 p-1 py-1 font-medium text-white rounded">
                        REF.
                      </div>
                    )}
                    {(match.team1 === team || match.team2 === team) && (
                      <div className="bg-blue-600 ml-2 p-1 px-2 py-1 font-medium text-white rounded">
                        VS.
                      </div>
                    )}
                  </div>

                  {team === match.referee ? (
                    <div className="flex flex-col">
                      <div className="mx-3 flex flex-row justify-between">
                        <div>{getDateFromDate(match.date)}</div>
                        <div>{getTimeFromDate(match.date)}</div>
                        <div>{`C- ${match.court}`}</div>
                      </div>
                      <div className="flex flex-row justify-between mx-3">
                        <div>{match.team1}</div>
                        <div className="font-semibold"> &nbsp;vs.&nbsp; </div>
                        <div>{match.team2}</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col justify-center pl-2 mx-2">
                        <div>
                          {team === match.team1 ? match.team2 : match.team1}
                        </div>
                        <div>{calculateResult(match, team)} ➚</div>
                      </div>
                    </>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
