import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getMatches } from "~/api/dynamo";

export async function loader({ params }: LoaderFunctionArgs) {
  const matches = await getMatches();
  return json({ name: params.league, matches });
}
import { useLoaderData, useParams } from "@remix-run/react";
import { Match } from "~/types";
import calculateStandings from "~/services/standings";

export default function Standings() {
  const { matches } = useLoaderData<typeof loader>();
  const { league } = useParams();
  if (matches == undefined) {
    return <div>No teams here!</div>;
  }
  const filterdMatches = matches.filter(
    (match) => match.league_name === league
  );

  const standings = calculateStandings(filterdMatches);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Platz</th>
            <th>Team</th>
            <th>Absolvierte Spiele</th>
            <th>Siege</th>
            <th>Satzverhältnis</th>
            <th>Punkteverhältnis</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team.team}>
              <td>{index + 1}</td>
              <td>{team.team}</td>
              <td>{team.games}</td>
              <td>{team.wins}</td>
              <td>{team.setRatio}</td>
              <td>{team.pointRatio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
