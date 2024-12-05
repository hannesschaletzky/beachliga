import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getMatches } from "~/api/dynamo";
import calculateStandings from "~/services/standings";

export async function loader({ params }: LoaderFunctionArgs) {
  const matches = await getMatches();
  return json({ name: params.league, matches });
}

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
            <th>#</th>
            <th>Team</th>
            <th>W/T/L</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team.team}>
              <td>{index + 1}.</td>
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
