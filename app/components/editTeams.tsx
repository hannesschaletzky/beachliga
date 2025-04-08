import { useEffect, useState } from "react";
import { Form } from "@remix-run/react";
import { Team } from "~/types";

interface EditTeamsProps {
  initialTeams: Team[];
  numberOfTeams: number;
  leagueName: string;
  cancel: () => void;
  teamIndex: number;
}

export default function EditTeams({
  initialTeams,
  numberOfTeams,
  leagueName,
  cancel,
  teamIndex,
}: EditTeamsProps) {
  const [firstName1, setFirstName1] = useState(
    initialTeams[teamIndex]?.first_name_player1
  );
  const [firstName2, setFirstName2] = useState(
    initialTeams[teamIndex]?.first_name_player2
  );
  const [surName1, setSurName1] = useState(
    initialTeams[teamIndex]?.surname_player1
  );
  const [surName2, setSurName2] = useState(
    initialTeams[teamIndex]?.surname_player2
  );

  const handleF1Change = (newValue: string) => {
    setFirstName1(newValue);
  };
  const handleF2Change = (newValue: string) => {
    setFirstName2(newValue);
  };
  const handleS1Change = (newValue: string) => {
    setSurName1(newValue);
  };
  const handleS2Change = (newValue: string) => {
    setSurName2(newValue);
  };

  return (
    <div className="p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 rounded-lg mb-2">
      <Form className="my-2" onSubmit={cancel} method="post">
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
            value={firstName1}
            onChange={(e) => handleF1Change(e.target.value)}
          />
          <div className="w-20 text-center place-content-center">Vorname</div>
          <input
            tabIndex={3}
            name={`player2_firstName`}
            type="text"
            className="rounded-md w-full p-1 m-2 max-w-max"
            required
            value={firstName2}
            onChange={(e) => handleF2Change(e.target.value)}
          />
        </div>
        <div className="flex row justify-center">
          <input
            tabIndex={2}
            name={`player1_surname`}
            type="text"
            className="rounded-md w-full p-1 m-2 max-w-max"
            required
            value={surName1}
            onChange={(e) => handleS1Change(e.target.value)}
          />
          <div className="w-20 text-center place-content-center">Nachname</div>
          <input
            tabIndex={4}
            name={`player2_surname`}
            type="text"
            value={surName2}
            onChange={(e) => handleS2Change(e.target.value)}
            className="rounded-md w-full p-1 m-2 max-w-max"
            required
          />
        </div>

        <input
          hidden
          name="oldName"
          value={initialTeams[teamIndex]?.team_name}
          type="text"
        />
        <input hidden name="leagueName" value={leagueName} type="text" />

        <div className="flex justify-center space-x-2 mt-4">
          <button
            type="submit"
            formMethod="delete"
            className="bg-red-500 text-white rounded p-1 hover:bg-red-600"
          >
            Löschen
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white rounded p-1 hover:bg-gray-500"
            onClick={cancel}
          >
            Abbruch
          </button>
          <button
            type="submit"
            formMethod="put"
            className="bg-blue-500 text-white rounded p-1 hover:bg-blue-600"
          >
            Speichern
          </button>
        </div>
      </Form>
    </div>
  );
}
