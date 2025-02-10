import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { useState } from "react";
import { deleteTeam, getLeagues, getTeams, insertTeam } from "~/api/dynamo";
import EditTeams from "~/components/editTeams";
import NewTeam from "~/components/newTeam";
import { League, Team } from "~/types";

enum ContentState {
  initial,
  editTeams,
  newTeam,
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const formDataObject = Object.fromEntries(body);
  const teams = Array.from(body.entries()).map(([_, value]) =>
    value.toString()
  );
  if (request.method == "POST") {
    for (const team_name of teams) {
      const newTeam: Team = {
        league_name: "Winter25",
        team_name,
        createdAt: new Date().toString(),
      };
      await insertTeam(newTeam);
    }
  }
  if (request.method == "DELETE") {
    await deleteTeam(
      formDataObject.leagueName as string,
      formDataObject.oldName_2 as string
    );
  }
  return redirect("/Winter25/admin/teams");
}

export async function loader({ params }: LoaderFunctionArgs) {
  const leagues = await getLeagues();
  const teams = await getTeams();
  if (!leagues) {
    console.error("Error: leagues are undefined");
    return json({ leagues: [], name: params.league, teams });
  }
  return json({ leagues, name: params.league, teams });
}

export default function TeamList() {
  const [contentState, setContentState] = useState(ContentState.initial);
  const data = useLoaderData<typeof loader>();
  const { league: currentLeagueName } = useParams();

  const currentLeague = data.leagues.find((l) => l.name === currentLeagueName);

  const numberOfTeams = currentLeague?.numberOfTeams || 0;
  const filteredTeams =
    data.teams?.filter((team) => team.league_name === data.name) || Array(0);
  const displayedTeams = Array.from(
    { length: filteredTeams.length },
    (_, i) => filteredTeams[i]?.team_name || ""
  );

  return (
    <div>
      {contentState == ContentState.initial && (
        <div className="flex flex-col p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 rounded-lg mb-2 pb-2">
          <div className="flex justify-between items-center w-full">
            <div className="w-12 text-center">
              {filteredTeams.length}/{numberOfTeams}
            </div>
            <div className="font-semibold ">Teamname:</div>
            <button
              className="bg-blue-500 text-white rounded hover:bg-blue-600 align-middle w-24 p-1"
              onClick={() => {
                setContentState(ContentState.newTeam);
              }}
            >
              neues Team
            </button>
          </div>
          <div className="my-2">
            {displayedTeams.map((team, index) => (
              <div key={index} className="flex flex-row justify-start m-1">
                <div className="w-12 text-center p-1">{index + 1}:</div>
                <div className="flex-grow p-1">{team}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-end">
            <button
              onClick={() => {
                setContentState(ContentState.editTeams);
              }}
              type="button"
              className="flex justify-center bg-blue-500 text-white rounded hover:bg-blue-600  w-24 p-1"
            >
              bearbeiten
            </button>
          </div>
        </div>
      )}
      {contentState === ContentState.editTeams && (
        <EditTeams
          initialTeams={filteredTeams}
          numberOfTeams={numberOfTeams}
          leagueName={currentLeagueName || ""}
          cancel={() => setContentState(ContentState.initial)}
        />
      )}
      {contentState === ContentState.newTeam && (
        <NewTeam cancel={() => setContentState(ContentState.initial)} />
      )}
    </div>
  );
}
