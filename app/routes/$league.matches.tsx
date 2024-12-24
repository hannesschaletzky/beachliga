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
            <div
              key={index}
              className="rounded-md p-1 m-3 border-slate-300 border-2"
            >
              <div className="font-bold text-xl text-center items-center text-white sticky top-0 p-2 bg-gray-800 rounded-md">
                Spieltag {index + 1}: {formattedDate}
              </div>
              {/* Match Card */}
              {matches.map((match) => (
                <div className="flex flex-col p-2 m-2 bg-slate-300">
                  <div
                    className="flex justify-between border-dashed border-gray-800 border-b-2"
                    key={match.match_number}
                  >
                    <div>#{match.match_number}</div>
                    <div>{getTimeFromDate(match.date)}</div>
                    <div>C - {match.court}</div>
                    <Link
                      onClick={() => {
                        setContentState(ContentState.enterMatch);
                      }}
                      to={`/${match.league_name}/matches/${match.match_number}`}
                    >
                      <div>📝</div>
                    </Link>
                  </div>
                  <div className="flex justify-start ">Ref:{match.referee}</div>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      <div className="mt-2">{match.team1.split("/")[0]}</div>
                      <div>{match.team1.split("/")[1]}</div>
                      <div className="mt-2">{match.team2.split("/")[0]}</div>
                      <div>{match.team2.split("/")[1]}</div>
                    </div>
                    <div className="flex flex-row">
                      <div className="flex flex-col justify-evenly font-bold text-xl mx-3">
                        <div>
                          {calculateResult(match, match.team1).charAt(0)}
                        </div>
                        <div>
                          {calculateResult(match, match.team2).charAt(0)}
                        </div>
                      </div>
                      <div className="flex flex-col justify-evenly ml-2">
                        <div>{match.set1_team1_points}</div>
                        <div>{match.set1_team2_points}</div>
                      </div>
                      <div className="flex flex-col justify-evenly ml-2">
                        <div>{match.set2_team1_points}</div>
                        <div>{match.set2_team2_points}</div>
                      </div>
                      <div className="flex flex-col justify-evenly ml-2">
                        <div>{match.set3_team1_points}</div>
                        <div>{match.set3_team2_points}</div>
                      </div>
                    </div>
                  </div>
                </div>
                // <div
                //   className="p-3 bg-gray-200 m-2 flex flex-col items-center text-center rounded-lg shadow-md flex-wrap"
                //   key={match.match_number}
                // >
                //   <div className="flex flex-wrap justify-between w-full">
                //     <div className="">Spiel {match.match_number}</div>
                //     <div className="">{getTimeFromDate(match.date)} Uhr</div>
                //     <div className="">Court {match.court}</div>
                //     <Link
                //       onClick={() => {
                //         setContentState(ContentState.enterMatch);
                //       }}
                //       to={`/${match.league_name}/matches/${match.match_number}`}
                //     >
                //       <div className="px-1 border-2 bg-gray-800 text-white rounded text-center hover:bg-blue-400">
                //         📝
                //       </div>
                //     </Link>
                //   </div>
                //   <div className="items-center w-full text-xs">
                //     Ref: {match.referee}
                //   </div>
                //   <div className="flex items-center justify-between w-full">
                //     <div
                //       className={`text-center mx-2 ${
                //         calculateResult(match, match.team1).startsWith("2")
                //           ? "font-extrabold"
                //           : "font-medium"
                //       }`}
                //     >
                //       {match.team1}
                //     </div>

                //     <div className="text-left font-bold mx-2">:</div>

                //     <div
                //       className={`text-center mx-2 ${
                //         calculateResult(match, match.team2).startsWith("2")
                //           ? "font-extrabold"
                //           : "font-medium"
                //       }`}
                //     >
                //       {match.team2}
                //     </div>
                //   </div>

                //   <div className="flex flex-wrap justify-center w-full">
                //     <span className="font-extrabold">
                //       {calculateResult(match, match.team1)
                //         .slice(0, 3)
                //         .replace(/:/g, " : ")}
                //     </span>
                //   </div>
                //   <div className=" flex text-center">
                //     <span>
                //       {calculateResult(match, match.team1).slice(
                //         5,
                //         calculateResult(match, match.team1).length - 1
                //       )}
                //     </span>
                //   </div>
                // </div>
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
