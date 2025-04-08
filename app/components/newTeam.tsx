import { Form } from "@remix-run/react";
import { useState } from "react";
import { Team } from "~/types";

interface NewTeamsProps {
  cancel: () => void;
}

export default function NewTeam({ cancel }: NewTeamsProps) {
  return (
    <div className="flex flex-col p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 rounded-lg mb-2">
      <Form className="my-2 " onSubmit={cancel} method="post">
        <div className="flex row justify-center border-dashed border-gray-800 border-b-2 text-center">
          <div className="mx-4">Spieler 1</div>
          <div className="w-20"></div>
          <div className="mx-4">Spieler 2</div>
        </div>

        <div className="flex row justify-center w-full">
          <input
            tabIndex={1}
            name={`player1_firstName`}
            type="text"
            className="rounded-md p-1 m-2 w-full max-w-max"
            required
          />
          <div className="w-20 text-center place-content-center">Vorname</div>
          <input
            tabIndex={3}
            name={`player2_firstName`}
            type="text"
            className="rounded-md w-full p-1 m-2 max-w-max"
            required
          />
        </div>
        <div className="flex row justify-center">
          <input
            tabIndex={2}
            name={`player1_surname`}
            type="text"
            className="rounded-md w-full p-1 m-2 max-w-max"
            required
          />
          <div className="w-20 text-center place-content-center">Nachname</div>
          <input
            tabIndex={4}
            name={`player2_surname`}
            type="text"
            className="rounded-md w-full p-1 m-2 max-w-max"
            required
          />
        </div>

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
