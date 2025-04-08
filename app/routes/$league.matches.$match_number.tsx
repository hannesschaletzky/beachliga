import {
  LoaderFunctionArgs,
  ActionFunction,
  redirect,
  json,
} from "@remix-run/node";
import { useLoaderData, Form, useParams } from "@remix-run/react";
import { useState } from "react";
import { getMatches, updateMatch } from "~/api/dynamo";
import { getDateFromDate } from "~/services/date";
import { Match, Points } from "~/types";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = new URLSearchParams(await request.text());
  const league = params.league || "league0";
  const matchNumber = params.match_number
    ? parseInt(params.match_number, 10)
    : 0;
  const newPoints: Points = {
    set1_team1_points: parseInt(formData.get("set1_team1_points") || "0"),
    set1_team2_points: parseInt(formData.get("set1_team2_points") || "0"),
    set2_team1_points: parseInt(formData.get("set2_team1_points") || "0"),
    set2_team2_points: parseInt(formData.get("set2_team2_points") || "0"),
    set3_team1_points: parseInt(formData.get("set3_team1_points") || "0"),
    set3_team2_points: parseInt(formData.get("set3_team2_points") || "0"),
  };
  updateMatch(league, matchNumber, newPoints);

  return redirect(`/${league}/matches#${matchNumber}`);
};
export async function loader({ params }: LoaderFunctionArgs) {
  const matches = await getMatches();
  if (!matches) {
    throw new Error("Matches nicht gefunden");
  }
  const match = matches.find(
    (m) =>
      m.league_name === params.league &&
      m.match_number === parseInt(params.match_number || "0", 10)
  );

  if (!match) {
    throw new Error("Match nicht gefunden");
  }

  return json({
    match,
  });
}

export default function MatchResultPage() {
  const { match } = useLoaderData<typeof loader>();
  const [winner, setWinner] = useState(String);
  const [error, setError] = useState(String);
  const [validatedWinner, setValidatedWinner] = useState(String);

  const { match_number, league } = useParams();
  const handleWinSelection = (team: string) => {
    setWinner(team);
    setError("");
    const actualWinner = calculateWinner();
    if (actualWinner === team) {
      setValidatedWinner(`${team} `);
    } else {
      setValidatedWinner("");
      setError("Eintragung ist fehlerhaft/unvollständig!");
    }
  };

  const calculateWinner = () => {
    let team1Wins = 0;
    let team2Wins = 0;

    for (let set = 1; set <= 3; set++) {
      const team1Input = document.getElementById(
        `set${set}_team1_points`
      ) as HTMLInputElement;
      const team2Input = document.getElementById(
        `set${set}_team2_points`
      ) as HTMLInputElement;
      const team1Points = parseInt(team1Input?.value || "0");
      const team2Points = parseInt(team2Input?.value || "0");

      if (team1Points > team2Points) {
        team1Wins++;
      } else if (team2Points > team1Points) {
        team2Wins++;
      }
    }

    return team1Wins >= 2 ? match.team1 : team2Wins >= 2 ? match.team2 : null;
  };

  return (
    <div className="flex flex-col p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 rounded-lg ">
      <div className="flex justify-between">
        <div># {match_number}</div>
        <div>{getDateFromDate(match.date)}</div>
        <div>C - {match.court}</div>
      </div>
      <div className="flex flex-row justify-center border-dashed border-gray-800 border-b-2 pb-2 w-full">
        <div>{match.referee}</div>
      </div>

      <Form method="post" className="w-full space-y-6">
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-center">
            <div className="font-bold">{match.team1} </div>
            <span className="text-gray-700 mx-4">:</span>
            <div className="font-bold">{match.team2}</div>
          </div>

          {[1, 2, 3].map((set) => (
            <div key={set} className="flex items-center justify-center">
              <input
                type="number"
                id={`set${set}_team1_points`}
                name={`set${set}_team1_points`}
                className="border p-2 w-20 text-center rounded"
                required={set < 3}
                defaultValue={
                  set == 1
                    ? match.set1_team1_points
                    : set == 2
                    ? match.set2_team1_points
                    : match.set3_team1_points
                }
              />
              <span className="text-gray-700 mx-4">Satz {set}</span>
              <input
                type="number"
                id={`set${set}_team2_points`}
                name={`set${set}_team2_points`}
                className="border p-2 w-20 text-center rounded"
                required={set < 3}
                defaultValue={
                  set == 1
                    ? match.set1_team2_points
                    : set == 2
                    ? match.set2_team2_points
                    : match.set3_team2_points
                }
              />
            </div>
          ))}

          <input
            type="text"
            hidden
            id="redirect"
            value={"/${league}/matches#${match_number}"}
          />
          {validatedWinner && (
            <div className="text-center font-bold text-green-700">
              {validatedWinner}
            </div>
          )}
          {error && (
            <div className="text-center font-bold text-red-700">{error}</div>
          )}
          <div className="flex items-center justify-center">
            <button
              type="button"
              className={`border p-2 w-20 text-center rounded hover:bg-green-300 ${
                winner === match.team1 ? "bg-green-500 text-white" : ""
              }`}
              onClick={() => handleWinSelection(match.team1)}
            >
              Yes
            </button>
            <span className="text-gray-700 mx-4"> Win </span>
            <button
              type="button"
              className={`border p-2 w-20 text-center rounded hover:bg-green-300 ${
                winner === match.team2 ? "bg-green-500 text-white" : ""
              }`}
              onClick={() => handleWinSelection(match.team2)}
            >
              Yes
            </button>
          </div>
        </div>

        <button
          className="w-full px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-900"
          type="submit"
          disabled={!validatedWinner}
        >
          Speichern
          {/* <a href={`/${league}/matches#${match_number}`} className="w-full">
          </a> */}
        </button>
      </Form>
    </div>
  );
}
