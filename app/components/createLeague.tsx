import { Form } from "@remix-run/react";
import { useState } from "react";

interface LeagueProps {
  submit: () => void;
}

export default function CreateLeague(props: LeagueProps) {
  const [name, setName] = useState("");
  const handleChange = (e: any) => {
    const value = e.target.value.replace(/\s/g, "");
    const sanitizedValue = value.replace(/[^A-Za-z0-9_-]/g, "");
    setName(sanitizedValue);
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-150">
      <h1 className="text-xl font-bold mb-6 text-center">Ligaerstellung</h1>

      <Form
        action="/admin"
        className="flex flex-col gap-4"
        id="league-form"
        onSubmit={props.submit}
      >
        <span className="text-center">
          Liganame: Buchstaben, Zahlen, _ oder -
        </span>
        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Liganame:</span>
          <input
            name="name"
            placeholder="..."
            type="text"
            value={name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Anzahl der Teams:</span>
          <input
            name="numberOfTeams"
            placeholder="1-64"
            type="number"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-right text-lg w-48">Anzahl der Spieltage:</span>
          <input
            name="numberOfGamedays"
            placeholder="1-20"
            type="number"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Anzahl der Felder:</span>
          <input
            name="numberOfCourts"
            placeholder="1-50"
            type="number"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-right text-lg w-48">Adresse:</span>
          <input
            name="adress"
            placeholder="z.B.: Unter den Linden 6, 10099 Berlin"
            type="text"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="submit"
            formMethod="get"
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Abbruch
          </button>
          <button
            type="submit"
            formMethod="post"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Speichern
          </button>
        </div>
      </Form>
    </div>
  );
}
