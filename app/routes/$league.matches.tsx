import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { useState } from "react";
import { getMatches } from "~/api/dynamo";
import { Match } from "../types";
import { calculateResult } from "~/services/result";
import { getDateFromDate, getTimeFromDate } from "~/services/date";

enum ContentState {
  games,
  enterMatch,
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

  const formattedMatchesByDate = Object.entries(
    sortedMatches
      .filter((match) => match.league_name === league)
      .reduce((acc: Record<string, (typeof match)[]>, match) => {
        const normalizedDate = new Date(match.date).toISOString().split("T")[0];
        acc[normalizedDate] = acc[normalizedDate] || [];
        acc[normalizedDate].push(match);
        return acc;
      }, {})
  ).map(([date, matches]) => ({
    formattedDate: getDateFromDate(date),
    matches: matches.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ),
  }));

  return (
    <div className="">
      {contentState == ContentState.games && (
        <div className="">
          {formattedMatchesByDate.map(({ formattedDate, matches }, index) => (
            <div key={index} className="my-2">
              <div className="font-bold mx-2 text-xl text-gray-700">
                Spieltag {index + 1}: {formattedDate}
              </div>

              {matches.map((match) => (
                <div
                  className="p-6 bg-gray-200 m-4 flex flex-col items-center text-center rounded-lg shadow-md flex-wrap"
                  key={match.match_number}
                >
                  <div className="flex flex-wrap justify-between w-full mb-2">
                    <div className="">Spiel {match.match_number}</div>
                    <div className="">{getTimeFromDate(match.date)} Uhr</div>
                    <div className="">Court {match.court}</div>
                  </div>
                  <div className="flex w-full justify-center mb-2">
                    <div className="text-center w-[150px] font-semibold mx-2">
                      {match.team1}
                    </div>

                    <div className="flex-row mx-2">:</div>

                    <div className="text-center w-[150px] font-semibold mx-2">
                      {match.team2}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center w-full mb-2">
                    <div>{calculateResult(match, match.team1)}</div>
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
