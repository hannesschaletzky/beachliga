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
    <div className="flex  flex-col bg-gradient-to-b from-gray-200 to-slate-50 p-4 m-4 rounded-lg max-w-2xl">
      <h1 className="text-xl font-bold text-center">Liganame:</h1>

      <Form
        action="/admin"
        className="flex flex-col gap-2"
        id="league-form"
        onSubmit={props.submit}
      >
        <span className="text-center">Buchstaben, Zahlen, _ oder -</span>
        <div className="flex items-center gap-2">
          <input
            name="name"
            placeholder="..."
            type="text"
            value={name}
            onChange={handleChange}
            className="p-2 border w-full border-gray-300 rounded"
            required
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
