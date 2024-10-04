import { Form } from "@remix-run/react";
import { LeagueRecord } from "../data";

export default function EditLeague({
  league,
  cancel,
}: {
  league: LeagueRecord;
  cancel: () => void;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-150">
      <h1 className="text-xl font-bold mb-6 text-center">Liga bearbeiten</h1>

      <Form
        method="post"
        className="flex flex-col gap-4"
        id="edit-league-form"
        onSubmit={cancel}
      >
        <input type="hidden" name="leagueId" value={league.id} />

        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Liganame:</span>
          <input
            name="leagueName"
            defaultValue={league.leagueName}
            type="text"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Anzahl der Teams:</span>
          <input
            name="numberOfTeams"
            defaultValue={league.numberOfTeams}
            type="text"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Anzahl der Spieltage:</span>
          <input
            name="numberOfGamedays"
            defaultValue={league.numberOfGamedays}
            type="number"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Anzahl der Felder:</span>
          <input
            name="numberOfCourts"
            defaultValue={league.numberOfCourts}
            type="number"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Adresse:</span>
          <input
            name="adress"
            defaultValue={league.adress}
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
