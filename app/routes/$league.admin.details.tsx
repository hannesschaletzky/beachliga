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
import { useState } from "react";
import {
  batchWriteMatches,
  getCredentials,
  getLeagues,
  getTeams,
  insertMatch,
  updateLeague,
} from "~/api/dynamo";
import { isAuthenticated } from "~/services/auth";
import { generateMatches } from "~/services/generateMatches";
import { League, Match } from "~/types";

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
  if (request.method === "PUT") {
    const newLeague: League = {
      name: formDataObject.league as string,
      numberOfTeams: Number(formDataObject.teamCount),
      numberOfGamedays: Number(formDataObject.gamedays),
      numberOfCourts: -1,
      adress: "1234",
      createdAt: new Date().toString(),
    };
    await updateLeague(newLeague);
    return redirect("/Winter25/admin/details");
  }

  throw new Response("Method not allowed", { status: 405 });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const leagues = await getLeagues();
  const teams = await getTeams();
  const credentials = await getCredentials();

  let league_creds = credentials?.find((l) => l.league_name === params.league);
  console.log(league_creds);
  const league = leagues?.find((l) => l.name === params.league);

  if (!league_creds) {
    throw new Response("League not found", { status: 404 });
  }

  if (
    !isAuthenticated(request, league_creds?.username, league_creds?.password)
  ) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area"',
      },
    });
  }
  return json({ league, teams });
}

export default function LeagueAdmin() {
  const data = useLoaderData<typeof loader>();

  if (data.league?.numberOfTeams == undefined) {
    return <div>ACCESS DENIED.</div>;
  }

  const [numberOfTeams, setNumberOfTeams] = useState(data.league.numberOfTeams);
  const [gamedays, setGamedays] = useState(data.league.numberOfGamedays);

  const handleTChange = (newValue: number) => {
    setNumberOfTeams(newValue);
  };
  const handleGChange = (newValue: number) => {
    setGamedays(newValue);
  };

  return (
    <div className="flex flex-col p-2 m-4 mb-2">
      <Form
        method="post"
        className="flex flex-col md:flex-row bg-gradient-to-b from-gray-200 to-slate-50 rounded-lg justify-around py-4 space-y-3 md:space-y-0 p-2 m-2 w-full"
      >
        <div className="flex items-center justify-between">
          <div className="mr-2">Liga:</div>
          <div className=""> {data.league.name}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="mr-2">Teams:</div>
          <input type="text" hidden name="league" value={data.league.name} />
          <input
            name={`teamCount`}
            type="number"
            className="rounded-md w-10 text-center"
            required
            value={numberOfTeams}
            onChange={(e) => handleTChange(Number(e.target.value))}
          ></input>
        </div>
        <div className="flex items-center justify-between">
          <div className="mr-2">Spieltage:</div>
          <input
            name={`gamedays`}
            type="number"
            className="rounded-md w-10 text-center"
            required
            value={gamedays}
            onChange={(e) => handleGChange(Number(e.target.value))}
          ></input>
        </div>
        <div className="flex items-center justify-between">
          <div className="mr-2">Punkte:</div>
          <select name="points" className="rounded-md w-10 text-center">
            <option value="1">11</option>
            <option value="2">15</option>
            <option value="3">21</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="mr-2">Sätze:</div>
          <select name="sets" className="rounded-md w-10 text-center">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <button
          type="submit"
          formMethod="put"
          className="bg-blue-500 text-white rounded px-1 hover:bg-blue-600"
        >
          ↻
        </button>
      </Form>

      <Form method="post">
        <div className="pt-4">
          <div className="flex justify-center items-center">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className=" flex flex-col justify-center bg-gradient-to-b from-gray-200 to-slate-50 p-2 m-4 rounded-lg "
                >
                  <div className="text-center bg-blue-400 rounded-lg font-semibold">
                    Spieltag {index + 1}
                  </div>
                  <div className="flex flex-row">
                    <div className="flex flex-col m-1">
                      <div className="mr-2 p-1">Datum</div>
                      <input
                        id={`gameday-${index}-date`}
                        name={`gameday-${index}-date`}
                        type="date"
                        className="p-1 rounded border border-gray-300"
                      />
                    </div>
                    <div className="flex flex-col m-1 w-full">
                      <div className="mr-2 p-1">Uhrzeit</div>
                      <input
                        id={`gameday-${index}-time`}
                        name={`gameday-${index}-time`}
                        type="time"
                        className="p-1 rounded border border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex flex-col m-1">
                      <div className="mr-2 p-1">Courts</div>
                      <input
                        id={`gameday-${index}-courts`}
                        name={`gameday-${index}-courts`}
                        type="number"
                        min="1"
                        className="p-1 w-16 text-center rounded border border-gray-300"
                        defaultValue={2}
                      />
                    </div>
                    <div className="flex flex-col m-1 w-full">
                      <div className="mr-2 p-1">Adresse</div>
                      <input
                        id={`gameday-${index}-address`}
                        name={`gameday-${index}-address`}
                        type="text"
                        className="p-1 w-auto rounded border border-gray-300"
                        placeholder="Adresse eingeben"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex flex-row bg-gradient-to-b justify-between from-gray-200 to-slate-50 rounded-lg items-center p-2 mx-4 max-w-2xl">
              <label className="">Wie oft wird gegeneinander gespielt?</label>
              <input
                defaultValue={2}
                name="matchesPerPair"
                type="number"
                className="p-1 rounded border w-12 ml-28 border-gray-300"
              />
            </div>
            <div className="flex flex-row m-4 p-2 bg-gradient-to-b justify-between from-gray-200 to-slate-50 rounded-lg items-center max-w-2xl">
              <label className="">
                Wie groß ist der Abstand zwischen den Spielen? (in min)
              </label>
              <input
                defaultValue={45}
                type="number"
                name="interval"
                className="p-1 rounded border w-12 ml-28 border-gray-300"
              />
            </div>
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
