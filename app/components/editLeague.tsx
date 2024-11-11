import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import { League } from "../types";

export default function EditLeague({
  league,
  cancel,
}: {
  league: League;
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
    <div className="bg-white p-6 rounded-lg shadow-md w-150">
      <h1 className="text-xl font-bold mb-6 text-center">Liga bearbeiten</h1>

      <Form
        method="post"
        className="flex flex-col gap-4"
        id="edit-league-form"
        onSubmit={cancel}
      >
        <input hidden={true} name="oldName" value={oldName} type="text" />
        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Name:</span>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Anzahl der Teams:</span>
          <input
            name="numberOfTeams"
            value={numberOfTeams}
            onChange={(e) => setNumberOfTeams(Number(e.target.value))}
            type="number"
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Anzahl der Spieltage:</span>
          <input
            name="numberOfGamedays"
            value={numberOfGamedays}
            onChange={(e) => setNumberOfGamedays(Number(e.target.value))}
            type="number"
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Anzahl der Felder:</span>
          <input
            name="numberOfCourts"
            value={numberOfCourts}
            onChange={(e) => setNumberOfCourts(Number(e.target.value))}
            type="number"
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Adresse:</span>
          <input
            name="adress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={() => cancel()}
          >
            Abbruch
          </button>
          <button
            type="submit"
            formMethod="put"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            name="_action"
            value="put"
          >
            Speichern
          </button>
          <button
            type="submit"
            formMethod="delete"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
