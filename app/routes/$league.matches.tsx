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
  console.log(league);

  if (!data.matches) {
    return <p className="text-white">Keine Spiele verfügbar.</p>;
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
    <div className="mt-4">
      {contentState == ContentState.games && (
        <div className="">
          {formattedMatchesByDate.map(({ formattedDate, matches }, index) => (
            <div key={index} className="">
              <div className="font-bold text-xl text-center items-center text-white sticky pt-2 top-0 bg-gray-800">
                Spieltag {index + 1}: {formattedDate}
              </div>
              {/* Match Card */}
              {matches.map((match) => (
                <div
                  className="flex flex-col p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 scroll-mt-12 rounded-lg"
                  id={`${match.match_number}`}
                >
                  <div
                    className="flex justify-between"
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
                  <div className="flex justify-center border-dashed border-gray-800 border-b-2">
                    {match.referee}
                  </div>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      <div
                        className={`mt-2 ${
                          calculateResult(match, match.team1).charAt(0) === "2"
                            ? "font-bold"
                            : ""
                        }`}
                      >
                        {match.team1.split("/")[0]}
                        <div>{match.team1.split("/")[1]}</div>
                      </div>
                      <div
                        className={`mt-2 ${
                          calculateResult(match, match.team2).charAt(0) === "2"
                            ? "font-bold"
                            : ""
                        }`}
                      >
                        {match.team2.split("/")[0]}
                        <div>{match.team2.split("/")[1]}</div>
                      </div>
                    </div>
                    {!(
                      match.set1_team1_points === 0 &&
                      match.set1_team2_points === 0
                    ) && (
                      <div className="flex flex-row">
                        <div className="flex flex-col justify-evenly text-xl mx-3">
                          <div
                            className={
                              calculateResult(match, match.team1).charAt(0) >
                              calculateResult(match, match.team2).charAt(0)
                                ? "font-bold"
                                : ""
                            }
                          >
                            {calculateResult(match, match.team1).charAt(0)}
                          </div>
                          <div
                            className={
                              calculateResult(match, match.team1).charAt(0) <
                              calculateResult(match, match.team2).charAt(0)
                                ? "font-bold"
                                : ""
                            }
                          >
                            {calculateResult(match, match.team2).charAt(0)}
                          </div>
                        </div>
                        <div className="flex flex-col justify-evenly ml-2">
                          <div
                            className={
                              match.set1_team1_points > match.set1_team2_points
                                ? "font-bold"
                                : ""
                            }
                          >
                            {match.set1_team1_points}
                          </div>
                          <div
                            className={
                              match.set1_team2_points > match.set1_team1_points
                                ? "font-bold"
                                : ""
                            }
                          >
                            {match.set1_team2_points}
                          </div>
                        </div>
                        <div className="flex flex-col justify-evenly ml-2">
                          <div
                            className={
                              match.set2_team1_points > match.set2_team2_points
                                ? "font-bold"
                                : ""
                            }
                          >
                            {match.set2_team1_points}
                          </div>
                          <div
                            className={
                              match.set2_team2_points > match.set2_team1_points
                                ? "font-bold"
                                : ""
                            }
                          >
                            {match.set2_team2_points}
                          </div>
                        </div>
                        {!(
                          match.set1_team1_points > match.set1_team2_points &&
                          match.set2_team1_points > match.set2_team2_points
                        ) &&
                          !(
                            match.set1_team2_points > match.set1_team1_points &&
                            match.set2_team2_points > match.set2_team1_points
                          ) && (
                            <div className="flex flex-col justify-evenly ml-2">
                              <div
                                className={
                                  match.set3_team1_points >
                                  match.set3_team2_points
                                    ? "font-bold"
                                    : ""
                                }
                              >
                                {match.set3_team1_points}
                              </div>
                              <div
                                className={
                                  match.set3_team2_points >
                                  match.set3_team1_points
                                    ? "font-bold"
                                    : ""
                                }
                              >
                                {match.set3_team2_points}
                              </div>
                            </div>
                          )}
                      </div>
                    )}
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
