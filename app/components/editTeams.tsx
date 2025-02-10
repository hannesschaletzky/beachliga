import { useState } from "react";
import { Form } from "@remix-run/react";
import { Team } from "~/types";

interface EditTeamsProps {
  initialTeams: Team[];
  numberOfTeams: number;
  leagueName: string;
  cancel: () => void;
}

export default function EditTeams({
  initialTeams,
  numberOfTeams,
  leagueName,
  cancel,
}: EditTeamsProps) {
  const defaultTeams = Array.from(
    { length: numberOfTeams },
    (_, i) => initialTeams[i]?.team_name || `Team ${i + 1}`
  );
  const [teams, setTeams] = useState(defaultTeams);

  const handleTeamChange = (index: number, newValue: string) => {
    const updatedTeams = [...teams];
    updatedTeams[index] = newValue;
    setTeams(updatedTeams);
  };

  return (
    <div className="flex flex-col p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 rounded-lg mb-2">
      <div className="flex justify-start border-dashed border-gray-800 border-b-2 w-full">
        <div className="w-12 text-center">#</div>
        <div>Teamname:</div>
      </div>
      <Form className="my-2" onSubmit={cancel} method="post">
        {teams.map((team, index) => {
          if (initialTeams[index]?.team_name) {
            return (
              <div key={index} className="flex flex-row justify-start m-1">
                <div className="w-12 text-center p-1">{index + 1}:</div>
                <input
                  name={`team_${index}`}
                  value={team}
                  onChange={(e) => handleTeamChange(index, e.target.value)}
                  type="text"
                  className="flex-grow rounded-sm p-1"
                />
                <input
                  hidden={true}
                  name={`oldName_${index}`}
                  value={defaultTeams[index]}
                  type="text"
                />
                <input
                  hidden={true}
                  name="leagueName"
                  value={leagueName}
                  type="text"
                />

                <button
                  className=" bg-red-500 text-white font-semibold p-1 rounded hover:bg-red-600"
                  type="submit"
                  formMethod="delete"
                >
                  Löschen
                </button>
              </div>
            );
          }
          return null;
        })}
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
