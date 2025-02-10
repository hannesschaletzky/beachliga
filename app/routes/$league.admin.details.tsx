import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import {
  batchWriteMatches,
  getLeagues,
  getTeams,
  insertMatch,
} from "~/api/dynamo";
import { generateMatches } from "~/services/generateMatches";
import { Match } from "~/types";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const formDataObject = Object.fromEntries(body);

  const gameDaysArr: string[] = [];
  const entries = Object.entries(formDataObject);

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];

    const dateMatch = key.match(/^gameday-(\d+)-date$/);
    if (dateMatch) {
      const date = value as string;

      gameDaysArr.push(date);
    }
  }

  if (request.method === "POST") {
    const leagueName = formDataObject.league_name as string;
    const gameDays = gameDaysArr;
    const matchesPerPair = formDataObject.matchesPerPair as string;
    const courts = formDataObject.courts as string;
    const startTime = formDataObject.time as string;
    const interval = formDataObject.interval as string;

    const teams = await getTeams();
    let arrTeams = teams?.map((teams) => teams.team_name);
    if (arrTeams == undefined) {
      arrTeams = [];
    }

    const matches = generateMatches(
      leagueName,
      arrTeams,
      gameDays,
      matchesPerPair,
      courts,
      startTime,
      interval
    );
    console.log(matches.length);

    await batchWriteMatches(matches);

    return null;
  }

  throw new Response("Method not allowed", { status: 405 });
}

export async function loader({ params }: LoaderFunctionArgs) {
  const leagues = await getLeagues();
  const teams = await getTeams();
  const league = leagues?.find((l) => l.name === params.league);
  if (!league) {
    throw new Response("League not found", { status: 404 });
  }
  return json({ league, teams });
}

export default function LeagueAdmin() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 rounded-lg mb-2">
      <div className="flex flex-row mt-4">
        <div className="w-28"> Liga:</div>
        <div className=""> {data.league.name}</div>
      </div>
      <div className="flex flex-row">
        <div className="w-28"> Courts:</div>
        <div className=""> {data.league.numberOfCourts}</div>
      </div>
      <div className="flex flex-row">
        <div className="w-28"> Teams:</div>
        <div className=""> {data.league.numberOfTeams}</div>
      </div>
      <div className="flex flex-row mb-2">
        <div className="w-28"> Spieltage:</div>
        <div className=""> {data.league.numberOfGamedays}</div>
      </div>

      <Form method="post">
        <div className=" ">
          {Array.from({ length: data.league.numberOfGamedays }).map(
            (_, index) => (
              <div key={index} className="flex">
                <label
                  htmlFor={`gameday-${index}`}
                  className="w-28 ml-4"
                >{`Spieltag ${index + 1}`}</label>
                <input
                  id={`gameday-${index}-date`}
                  name={`gameday-${index}-date`}
                  type="date"
                  className="p-1 rounded border border-gray-300"
                />
              </div>
            )
          )}
          <div className="flex flex-row mt-2">
            <label className="w-28 ml-4">Uhrzeit</label>
            <input
              id={`time`}
              name={`time`}
              type="time"
              className="p-1 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col mt-2">
            <label htmlFor="JvsJ" className="">
              Wie oft wird gegeneinander gespielt?
            </label>
            <input
              defaultValue={2}
              name="matchesPerPair"
              type="number"
              className="p-1 rounded border w-12 ml-28 border-gray-300"
            />
          </div>
          <div className="flex flex-col mt-2">
            <label htmlFor="interval" className="">
              Wie groß ist der Abstand zwischen den Spielen? (in Minuten)
            </label>
            <input
              defaultValue={45}
              type="number"
              name="interval"
              className="p-1 rounded border w-12 ml-28 border-gray-300"
            />
          </div>
          <input
            type="text"
            name="league_name"
            hidden
            value={data.league.name}
          />
          <input
            type="text"
            name="courts"
            hidden
            value={data.league.numberOfCourts}
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Speichern
        </button>
      </Form>
    </div>
  );
}
