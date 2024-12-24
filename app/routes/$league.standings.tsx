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
  const [openTeams, setOpenTeams] = useState<string[]>([]);

  const toggleTeamDetails = (teamName: string) => {
    setOpenTeams((prev) =>
      prev.includes(teamName)
        ? prev.filter((name) => name !== teamName)
        : [...prev, teamName]
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
    <div className="flex justify-center items-center rounded-md m-2 px-2 shadow-md bg-gray-800">
      <table className="w-full rounded text-white border-separate border-spacing-y-2">
        <thead className="font-extrabold">
          <tr className="bg-yellow-600 rounded-t-md">
            <th className="font-extrabold py-2 text-center rounded-l-md">#</th>
            <th className="font-extrabold py-2 text-left">Team</th>
            <th className="font-extrabold py-2 text-center">Spiele</th>
            <th className="font-extrabold py-2 text-center">W/T/L</th>
            <th className="font-extrabold py-2 text-center">S</th>
            <th className="font-extrabold py-2 text-center">P</th>
            <th className="font-extrabold py-2 text-center rounded-r-md"></th>
          </tr>
        </thead>
        {standings.map((team, index) => (
          <tbody key={team.team}>
            <tr
              key={team.team}
              className="group hover:bg-gray-500  cursor-pointer"
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
