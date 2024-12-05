import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { useState } from "react";
import { getMatches } from "~/api/dynamo";
import { Match } from "../types";

enum ContentState {
  games,
  enterMatch,
}

function calculateResult(dynamoMatch: Match): string {
  const set1_team1_points = dynamoMatch.set1_team1_points;
  const set1_team2_points = dynamoMatch.set1_team2_points;
  const set2_team1_points = dynamoMatch.set2_team1_points;
  const set2_team2_points = dynamoMatch.set2_team2_points;
  const set3_team1_points = dynamoMatch.set3_team1_points;
  const set3_team2_points = dynamoMatch.set3_team2_points;

  if (set1_team1_points == set1_team2_points) {
    return "";
  }

  const setsWonByTeam1 =
    (set1_team1_points > set1_team2_points ? 1 : 0) +
    (set2_team1_points > set2_team2_points ? 1 : 0) +
    (set3_team1_points > set3_team2_points ? 1 : 0);
  const setsWonByTeam2 =
    (set1_team1_points < set1_team2_points ? 1 : 0) +
    (set2_team1_points < set2_team2_points ? 1 : 0) +
    (set3_team1_points < set3_team2_points ? 1 : 0);

  if (set3_team1_points == set3_team2_points) {
    const twoSetW = `${setsWonByTeam1}:${setsWonByTeam2} (${set1_team1_points}:${set1_team2_points}, ${set2_team1_points}:${set2_team2_points})`;
    return twoSetW;
  }
  const threeSetW = `${setsWonByTeam1}:${setsWonByTeam2} (${set1_team1_points}:${set1_team2_points}, ${set2_team1_points}:${set2_team2_points}, ${set3_team1_points}:${set3_team2_points})`;
  return threeSetW;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const matches = await getMatches();
  return json({ name: params.league, matches });
}

export default function Matches() {
  const data = useLoaderData<typeof loader>();
  const [contentState, setContentState] = useState(ContentState.games);
  const { league } = useParams();

  if (!data.matches) {
    return <p>Keine Matches verfügbar</p>;
  }
  const sortedMatches = data.matches.sort(
    (a, b) => a.match_number - b.match_number
  );

  const matchesByDate = Object.entries(
    sortedMatches
      .filter((match) => match.league_name === league)
      .reduce((acc: Record<string, (typeof match)[]>, match) => {
        acc[match.date] = acc[match.date] || [];
        acc[match.date].push(match);
        return acc;
      }, {})
  );

  return (
    <div className="">
      {contentState == ContentState.games && (
        <div className="">
          {matchesByDate.map(([date, matches], index) => (
            <div key={index} className="my-2">
              <div className="font-bold mx-2 text-xl text-gray-700">
                Spieltag {index + 1}: {date}
              </div>

              {matches.map((match) => (
                <div
                  className="p-6 bg-gray-200 m-4 flex flex-col items-center text-center rounded-lg shadow-md flex-wrap"
                  key={match.match_number}
                >
                  <div className="flex flex-wrap justify-between w-full mb-2">
                    <div className="">Spiel {match.match_number}</div>
                    <div className="">{match.date}</div>
                    <div className="">Court {match.court}</div>
                  </div>
                  <div className="flex flex-wrap justify-center w-full   mb-2">
                    <div className=" text-center font-semibold mx-2">
                      {match.team1}
                    </div>
                    <div>:</div>
                    <div className=" text-center font-semibold mx-2">
                      {match.team2}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center w-full mb-2">
                    <div>{calculateResult(match)}</div>
                  </div>
                  <div className="text-gray-600 text-center">
                    <Link
                      onClick={() => {
                        setContentState(ContentState.enterMatch);
                      }}
                      to={`/${match.league_name}/matches/${match.match_number}`}
                    >
                      <div className="px-1 border-2  bg-blue-500 text-white rounded text-center hover:bg-blue-400">
                        Eingabe
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {contentState == ContentState.enterMatch}
      <Outlet />
    </div>
  );
}
