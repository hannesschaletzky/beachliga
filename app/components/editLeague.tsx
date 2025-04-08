import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Credentials, League } from "../types";

export default function EditLeague({
  league,
  credentials,
  cancel,
}: {
  league: League;
  credentials: Credentials;
  cancel: () => void;
}) {
  const [name, setName] = useState(league.name);
  const [numberOfTeams, setNumberOfTeams] = useState(league.numberOfTeams);
  const [numberOfGamedays, setNumberOfGamedays] = useState(
    league.numberOfGamedays
  );
  const [numberOfCourts, setNumberOfCourts] = useState(league.numberOfCourts);
  const [address, setAddress] = useState(league.adress);
  const oldName = league.name;

  useEffect(() => {
    setName(league.name);
    setNumberOfTeams(league.numberOfTeams);
    setNumberOfGamedays(league.numberOfGamedays);
    setNumberOfCourts(league.numberOfCourts);
    setAddress(league.adress);
  }, [league]);

  return (
    <div className="bg-gradient-to-b from-gray-200 to-slate-50 p-4 m-4 rounded-lg text-center max-w-md">
      <h1 className="text-xl font-bold text-center pb-4">Liga bearbeiten</h1>

      <Form
        method="post"
        className="flex flex-col gap-4"
        id="edit-league-form"
        onSubmit={cancel}
      >
        <input hidden={true} name="oldName" value={oldName} type="text" />
        <div className="flex justify-center">
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <span className="w-24 text-left p-2">Name:</span>
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-row items-center">
              <div className="w-24 text-left p-2">Username:</div>
              <div>{credentials.username}</div>
            </div>
            <div className="flex  flex-row items-center">
              <div className="w-24 text-left p-2">Password:</div>
              <div>{credentials.password}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <button
            type="button"
            className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={() => cancel()}
          >
            Abbruch
          </button>
          <button
            type="submit"
            formMethod="put"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            name="_action"
            value="put"
          >
            Speichern
          </button>
          <button
            type="submit"
            formMethod="delete"
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
            name="_action"
            value="delete"
          >
            Löschen
          </button>
        </div>
      </Form>
    </div>
  );
}
