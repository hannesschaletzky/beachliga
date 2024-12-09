import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getMatches } from "~/api/dynamo";
import calculateStandings from "~/services/standings";
import TeamDetails from "~/components/teamDetails";
import { useState } from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  const matches = await getMatches();
  return json({ name: params.league, matches });
}

export default function Standings() {
  const { matches } = useLoaderData<typeof loader>();
  const { league } = useParams();
  const [openTeams, setOpenTeams] = useState<string[]>([]); // stores multiple open team names

  const toggleTeamDetails = (teamName: string) => {
    setOpenTeams(
      (prev) =>
        prev.includes(teamName)
          ? prev.filter((name) => name !== teamName) // remove if already open
          : [...prev, teamName] // add if not open
    );
  };

  if (matches == undefined) {
    return <div>No teams here!</div>;
  }

  const filteredMatches = matches.filter(
    (match) => match.league_name === league
  );

  const standings = calculateStandings(filteredMatches);

  return (
    <div className="flex justify-start items-center p-2 m-2 rounded shadow-md bg-orange-100">
      <table className="w-full max-w-3xl rounded border-separate border-spacing-y-2">
        <thead className="">
          <tr className="bg-gray-200 rounded-t-md">
            <th className="py-2 text-center rounded-l-md">#</th>
            <th className="py-2 text-left">Team</th>
            <th className="py-2 text-center">Spiele</th>
            <th className="py-2 text-center">W/T/L</th>
            <th className="py-2 text-center">S</th>
            <th className="py-2 text-center">P</th>
            <th className="py-2 text-center rounded-r-md"></th>
          </tr>
        </thead>
        {standings.map((team, index) => (
          <tbody key={team.team}>
            <tr
              key={team.team}
              className="group hover:bg-zinc-200 cursor-pointer"
              onClick={() => toggleTeamDetails(team.team)}
            >
              <td className="text-center rounded-l-md py-2">{index + 1}.</td>
              <td className="py-2 truncate max-w-[150px]" title={team.team}>
                {team.team}
              </td>
              <td className="text-center py-2">{team.games}</td>
              <td className="text-center py-2">
                {team.wins}/{team.ties}/{team.losses}
              </td>
              <td className="text-center py-2">{team.setRatio}</td>
              <td className="text-center py-2">{team.pointRatio}</td>
              <td className="text-center rounded-r-md py-2">▼</td>
            </tr>

            {openTeams.includes(team.team) && (
              <tr>
                <td colSpan={7}>
                  <div className="rounded-md">
                    <TeamDetails team={team.team} />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        ))}
      </table>
    </div>
  );
}
