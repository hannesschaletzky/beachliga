import {
  LoaderFunctionArgs,
  ActionFunction,
  redirect,
  json,
} from "@remix-run/node";
import { useLoaderData, Form, useParams } from "@remix-run/react";
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

  return null;
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
    team1: match.team1,
    team2: match.team2,
    ref: match.referee,
    court: match.court,
    date: match.date,
  });
}

export default function MatchResultPage() {
  const { team1, team2, ref, court, date } = useLoaderData<typeof loader>();

  const { match_number, league } = useParams();

  return (
    <div className="flex flex-col p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 rounded-lg ">
      <div className="flex justify-between">
        <div># {match_number}</div>
        <div>{getDateFromDate(date)}</div>
        <div>C - {court}</div>
      </div>
      <div className="flex flex-row justify-center border-dashed border-gray-800 border-b-2 text-sm pb-2 w-full">
        <div>{ref}</div>
      </div>

      <Form method="post" className="w-full max-w-md space-y-6">
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-center">
            <div className="font-bold">{team1} </div>
            <span className="text-gray-700 mx-4">:</span>
            <div className="font-bold">{team2}</div>
          </div>
          <div className="flex items-center justify-center">
            <input
              type="number"
              id="set1_team1_points"
              name="set1_team1_points"
              className="border p-2 w-20 text-center rounded"
              required
            />
            <span className="text-gray-700 mx-4">Satz 1</span>
            <input
              type="number"
              id="set1_team2_points"
              name="set1_team2_points"
              className="border p-2 w-20 text-center rounded"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <input
              type="number"
              id="set2_team1_points"
              name="set2_team1_points"
              className="border p-2 w-20 text-center rounded"
              required
            />
            <span className="text-gray-700 mx-4">Satz 2</span>
            <input
              type="number"
              id="set2_team2_points"
              name="set2_team2_points"
              className="border p-2 w-20 text-center rounded"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <input
              type="number"
              id="set3_team1_points"
              name="set3_team1_points"
              className="border p-2 w-20 text-center rounded"
            />
            <span className="text-gray-700 mx-4">Satz 3</span>
            <input
              type="number"
              id="set3_team2_points"
              name="set3_team2_points"
              className="border p-2 w-20 text-center rounded"
            />
          </div>
          <input
            type="text"
            hidden
            id="redirect"
            value={"/${league}/matches#${match_number}"}
          />
          <div className="flex items-center justify-center">
            <button className="border p-2 w-20 text-center rounded hover:bg-green-300">
              {" "}
              Yes
            </button>
            <span className="text-gray-700 mx-4"> Win </span>
            <button className="border p-2 w-20 text-center rounded hover:bg-green-300">
              Yes
            </button>
          </div>
        </div>
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-900"
          type="submit"
        >
          Speichern
          {/* <a href={`/${league}/matches#${match_number}`} className="w-full">
          </a> */}
        </button>
      </Form>
    </div>
  );
}
