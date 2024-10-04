/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import CreateLeague from "~/components/createLeague";
import EditLeague from "~/components/editLeague";

import {
  LeagueRecord,
  deleteLeague,
  getStoredLeagues,
  storeLeagues,
} from "../data";

enum ContentState {
  initial,
  newLeague,
  editLeague,
}

let currentId = 1;
export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const formDataObject = Object.fromEntries(body);

  if (request.method == "POST") {
    const newLeague: LeagueRecord = {
      id: "league" + currentId++,
      createdAt: new Date().toString(),
      leagueName: (formDataObject.leagueName as string) || "Untitled League",
      numberOfTeams: Number(formDataObject.numberOfTeams) || 0,
      numberOfGamedays: Number(formDataObject.numberOfGamedays) || 0,
      numberOfCourts: Number(formDataObject.numberOfCourts) || 0,
      adress: (formDataObject.adress as string) || "No Address Provided",
    };

    const existingLeagues = await getStoredLeagues();
    const leaguesArray = Array.isArray(existingLeagues) ? existingLeagues : [];

    const updatedLeagues = [...leaguesArray, newLeague];

    await storeLeagues(updatedLeagues);
  }

  if (request.method == "DELETE") {
    deleteLeague(formDataObject.leagueId as string);
  }

  return redirect("/admin");
}

export async function loader() {
  const leagues = await getStoredLeagues();

  return json({ leagues });
}

export default function Admin() {
  const { leagues } = useLoaderData<{ leagues: LeagueRecord[] }>();
  const [contentState, setContentState] = useState(ContentState.initial);
  const [editingLeague, setEditingLeague] = useState<LeagueRecord | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-75 flex flex-col bg-white shadow-lg">
        <div className="flex items-center space-x-2 p-4 border-b-2">
          <Form id="search-form">
            <input
              className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search"
            />
          </Form>
          <div
            onClick={() => {
              setContentState(ContentState.newLeague);
            }}
          >
            <button className="p-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600">
              New
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-4 w-full border-b-2">
          {leagues.length ? (
            <ul>
              {leagues.map((league: LeagueRecord) => (
                <div
                  className=" flex justify-between items-center hover:bg-gray-100 p-3 m-1 rounded-lg cursor-pointer"
                  key={league.id}
                  onClick={() => {
                    setEditingLeague(league);
                    setContentState(ContentState.editLeague);
                  }}
                >
                  <div>{league.leagueName || <i>No Name</i>}</div>
                </div>
              ))}
            </ul>
          ) : (
            <p>
              <i>No Leagues</i>
            </p>
          )}
        </div>
        <div className="flex justify-center items-center space-x-2 p-4 bg-gray-50 text-center">
          <span className="font-bold text-gray-600">Leagues</span>
        </div>
      </div>

      <div className="flex-grow flex justify-center items-center relative">
        {contentState == ContentState.initial && <div>initial</div>}
        {contentState == ContentState.newLeague && (
          <CreateLeague submit={() => setContentState(ContentState.initial)} />
        )}
        {contentState === ContentState.editLeague && editingLeague && (
          <EditLeague
            league={editingLeague}
            cancel={() => setContentState(ContentState.initial)}
          />
        )}
      </div>
    </div>
  );
}
