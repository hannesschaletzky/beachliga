import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { getMatches } from "~/api/dynamo";
import { calculateResult } from "~/services/result";

interface TeamDetailsProps {
  team: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const matches = await getMatches();
  return json({ name: params.league, matches });
}

export default function TeamDetails({ team }: TeamDetailsProps) {
  const { matches } = useLoaderData<typeof loader>();
  const { league } = useParams();

  if (matches == undefined) {
    return <div>Keine Spiele vorhanden!</div>;
  }
  const teamMatches = matches.filter(
    (match) =>
      (match.team1 === team && match.league_name == league) ||
      (match.team2 === team && match.league_name == league)
  );

  return (
    <div className="">
      <div className="mx-2 rounded">
        {teamMatches.map((match, index) => (
          <a
            href={`/${league}/matches#${match.match_number}`}
            key={index}
            className="mb-4 flex ml-4 rounded bg-gray-500 hover:border-2"
          >
            <div className="flex flex-col items-start justify-center w-[40px]">
              {calculateResult(match, team).charAt(0) === "2" && (
                <div className="bg-teal-600 ml-2 p-1 py-2 font-semibold text-white rounded align-center">
                  W
                </div>
              )}
              {(calculateResult(match, team).charAt(0) === "1" ||
                calculateResult(match, team).charAt(0) === "0") && (
                <div className="bg-red-600 ml-2 p-1 px-2 py-2 font-semibold text-white rounded text-center">
                  L
                </div>
              )}
            </div>

            <div className="ml-3 flex flex-col items-end">vs.</div>
            <div className="flex flex-col justify-center">
              <div> {team === match.team1 ? match.team2 : match.team1}</div>
              <div>{calculateResult(match, team)} ➚</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
