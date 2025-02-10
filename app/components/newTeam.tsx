import { Form } from "@remix-run/react";
import { useState } from "react";
import { Team } from "~/types";

interface NewTeamsProps {
  cancel: () => void;
}

export default function NewTeam({ cancel }: NewTeamsProps) {
  return (
    <div className="flex flex-col p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 rounded-lg mb-2">
      <div className="flex justify-center border-dashed border-gray-800 border-b-2 w-full">
        <div>Teamname:</div>
      </div>
      <Form className="my-2 " onSubmit={cancel} method="post">
        <input
          name={`Team ...`}
          type="text"
          className="w-full rounded-sm p-1"
          required
        />
        <div className="flex justify-center space-x-2 mt-4">
          <button
            type="button"
            className="bg-gray-400 text-white rounded p-1 hover:bg-gray-500"
            onClick={() => cancel()}
          >
            Abbruch
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded p-1 hover:bg-blue-600"
          >
            Speichern
          </button>
        </div>
      </Form>
    </div>
  );
}
