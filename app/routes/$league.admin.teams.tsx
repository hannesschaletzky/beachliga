import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { useState } from "react";
import {
  deleteTeam,
  getCredentials,
  getLeagues,
  getTeams,
  insertTeam,
} from "~/api/dynamo";
import EditTeams from "~/components/editTeams";
import NewTeam from "~/components/newTeam";
import { isAuthenticated } from "~/services/auth";
import { League, Team } from "~/types";

enum ContentState {
  initial,
  editTeams,
  newTeam,
}
function createTeamFromFormData(formDataObject: {
  [k: string]: FormDataEntryValue;
}) {
  const teamName = ((((((formDataObject.player1_firstName as string) +
    "_" +
    formDataObject.player1_surname) as string) +
    "/" +
    formDataObject.player2_firstName) as string) +
    "_" +
    formDataObject.player2_surname) as string;

  const short_teamName = ((formDataObject.player1_surname as string) +
    "/" +
    formDataObject.player2_surname) as string;

  const newTeam: Team = {
    league_name: "Winter25",
    team_name: teamName,
    createdAt: new Date().toString(),
    short_team_name: short_teamName,
    first_name_player1: formDataObject.player1_firstName as string,
    first_name_player2: formDataObject.player2_firstName as string,
    surname_player1: formDataObject.player1_surname as string,
    surname_player2: formDataObject.player2_surname as string,
  };
  return newTeam;
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const formDataObject = Object.fromEntries(body);

  if (request.method == "POST") {
    const teamName = ((((((formDataObject.player1_firstName as string) +
      "_" +
      formDataObject.player1_surname) as string) +
      "/" +
      formDataObject.player2_firstName) as string) +
      "_" +
      formDataObject.player2_surname) as string;

    const short_teamName = ((formDataObject.player1_surname as string) +
      "/" +
      formDataObject.player2_surname) as string;

    const newTeam: Team = {
      league_name: "Winter25",
      team_name: teamName,
      createdAt: new Date().toString(),
      short_team_name: short_teamName,
      first_name_player1: formDataObject.player1_firstName as string,
      first_name_player2: formDataObject.player2_firstName as string,
      surname_player1: formDataObject.player1_surname as string,
      surname_player2: formDataObject.player2_surname as string,
    };
    await insertTeam(newTeam);
  }
  if (request.method == "DELETE") {
    await deleteTeam(
      formDataObject.leagueName as string,
      formDataObject.oldName as string
    );
  }
  if (request.method == "PUT") {
    await deleteTeam(
      formDataObject.leagueName as string,
      formDataObject.oldName as string
    );
    const updatedTeam = createTeamFromFormData(formDataObject);
    await insertTeam(updatedTeam);
  }
  return redirect("/Winter25/admin/teams");
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const leagues = await getLeagues();
  const teams = await getTeams();

  if (!leagues) {
    console.error("Error: leagues are undefined");
    return json({ leagues: [], name: params.league, teams });
  }

  const credentials = await getCredentials();

  let league_creds = credentials?.find((l) => l.league_name === params.league);

  if (!league_creds) {
    throw new Response("League not found", { status: 404 });
  }

  if (
    !isAuthenticated(request, league_creds?.username, league_creds?.password)
  ) {
    throw new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area"',
      },
    });
  }
  return json({ leagues, name: params.league, teams });
}

export default function TeamList() {
  const [contentState, setContentState] = useState(ContentState.initial);
  const data = useLoaderData<typeof loader>();
  const { league: currentLeagueName } = useParams();
  const [teamToEdit, setTeamToEdit] = useState<number>(-1);

  const currentLeague = data.leagues.find((l) => l.name === currentLeagueName);

  const numberOfTeams = currentLeague?.numberOfTeams || 0;
  const filteredTeams =
    data.teams?.filter((team) => team.league_name === data.name) || Array(0);

  return (
    <div className="">
      {contentState == ContentState.initial && (
        <div className="flex justify-center items-center">
          <div className="flex justify-center p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 rounded-lg">
            <div className="">
              <div className="flex justify-center w-full border-dashed border-gray-800 pb-2 border-b-2">
                <div className="w-12 text-center font-normal">
                  {filteredTeams.length}/{numberOfTeams}
                </div>
                <button
                  className="bg-blue-500 text-white rounded hover:bg-blue-600 align-middle w-24"
                  onClick={() => {
                    setContentState(ContentState.newTeam);
                  }}
                >
                  neues Team
                </button>
              </div>
              <div className="flex">
                <table className="text-center">
                  <thead className="">
                    <tr>
                      <th className="px-4 py-2 w-6"></th>
                      <th className="px-4 py-2 w-6"></th>
                      <th className="px-4 py-2 text-left">Spieler 1</th>
                      <th className="px-4 py-2 text-left">Spieler 2</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTeams.map((team, index) => (
                      <tr key={index} className="">
                        <td className="text-center p-2">{index + 1}:</td>
                        <td className="text-center">
                          <button
                            onClick={() => {
                              setTeamToEdit(index);
                              setContentState(ContentState.editTeams);
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            📝
                          </button>
                        </td>
                        <td className="px-4 py-2 text-left">
                          {team.first_name_player1} {team.surname_player1}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {team.first_name_player2} {team.surname_player2}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {contentState === ContentState.editTeams && (
        <EditTeams
          initialTeams={filteredTeams}
          numberOfTeams={numberOfTeams}
          leagueName={currentLeagueName || ""}
          cancel={() => setContentState(ContentState.initial)}
          teamIndex={teamToEdit}
        />
      )}
      {contentState === ContentState.newTeam && (
        <NewTeam cancel={() => setContentState(ContentState.initial)} />
      )}
    </div>
  );
}
