/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import CreateLeague from "~/components/createLeague";
import EditLeague from "~/components/editLeague";

import {
  deleteCredentials,
  deleteLeague,
  getCredentials,
  getLeagues,
  insertCredentials,
  insertLeague,
} from "~/api/dynamo";
import { Credentials, League } from "../types";
import { generatePassword } from "~/services/generatePassword";
import { isAuthenticated } from "~/services/auth";

enum ContentState {
  initial,
  newLeague,
  editLeague,
}

function createLeagueFromFormData(formData: {
  [k: string]: FormDataEntryValue;
}) {
  const newLeague: League = {
    createdAt: new Date().toString(),
    name: formData.name as string,
    numberOfTeams: Number(formData.numberOfTeams) || 0,
    numberOfGamedays: Number(formData.numberOfGamedays) || 0,
    numberOfCourts: Number(formData.numberOfCourts) || 0,
    adress: (formData.adress as string) || "",
  };
  return newLeague;
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const formDataObject = Object.fromEntries(body);

  if (request.method == "POST") {
    const newLeague = createLeagueFromFormData(formDataObject);
    const creds: Credentials = {
      league_name: formDataObject.name as string,
      username: "admin",
      password: generatePassword(),
    };
    await insertCredentials(creds);
    await insertLeague(newLeague);
  }

  if (request.method == "DELETE") {
    await deleteCredentials("Winter25");
    await deleteLeague(formDataObject.name as string);
  }

  if (request.method == "PUT") {
    await deleteLeague(formDataObject.oldName as string);
    const updatedLeague = createLeagueFromFormData(formDataObject);
    await insertLeague(updatedLeague);
  }

  return redirect("/admin");
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!isAuthenticated(request, "masterAdmin", "1234")) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area"',
      },
    });
  }

  const leagues = await getLeagues();
  const creds = await getCredentials();

  return json({ leagues: leagues ?? [], creds: creds ?? [] });
}

export default function Admin() {
  let { leagues = [], creds = [] } = useLoaderData<typeof loader>();
  const [contentState, setContentState] = useState(ContentState.initial);
  const [editingLeague, setEditingLeague] = useState<League | null>(null);

  if (Array.isArray(leagues) && leagues.length > 0) {
    leagues = leagues.sort((a: League, b: League) =>
      a.name.localeCompare(b.name)
    );
  }

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-row justify-between items-center pb-2">
        <div className="text-white font-extrabold">Leagues</div>
        <div
          onClick={() => {
            setContentState(ContentState.newLeague);
          }}
        >
          <button className="p-1 bg-blue-500 text-white font-extrabold rounded-md shadow hover:bg-blue-600">
            New
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center">
        {contentState == ContentState.newLeague && (
          <CreateLeague submit={() => setContentState(ContentState.initial)} />
        )}
      </div>

      <div className="flex text-white hover:cursor-pointer">
        {leagues.length ? (
          <div className="w-full">
            {leagues.map((league: League) => (
              <div
                className="flex flex-col text-white"
                key={league.name}
                onClick={() => {
                  setEditingLeague(league);
                  setContentState(ContentState.editLeague);
                }}
              >
                <div className="flex flex-row p-2 justify-between w-full">
                  <div> {league.name || <i>No Name</i>}</div>
                  <div className="px-2">📝</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>
            <i>No Auth</i>
          </p>
        )}
      </div>
      {contentState === ContentState.editLeague && editingLeague && (
        <div className="flex justify-center">
          <EditLeague
            league={editingLeague}
            credentials={
              creds?.find(
                (cred: Credentials) => cred.league_name === editingLeague.name
              ) ?? {
                league_name: "",
                username: "",
                password: "",
              }
            }
            cancel={() => setContentState(ContentState.initial)}
          />
        </div>
      )}
    </div>
  );
}
