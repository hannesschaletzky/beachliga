import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Beispiel Loader für mehrere Spiele mit Ergebnis
export async function loader({ params }: LoaderFunctionArgs) {
  // Diese Daten solltest du aus deiner API oder Datenquelle holen
  return json([
    {
      match_number: 1,
      team1: "Team A",
      team2: "Team B",
      court: "Court 1",
      referee: "John Doe",
      result: "21-19, 20-22", // Ergebnis für das Spiel
    },
    {
      match_number: 2,
      team1: "Team C",
      team2: "Team D",
      court: "Court 2",
      referee: "Jane Smith",
      result: "18-21, 21-19, 15-12", // Ergebnis für das Spiel
    },
    {
      match_number: 3,
      team1: "Team E",
      team2: "Team F",
      court: "Court 3",
      referee: "Michael Johnson",
      result: "21-17, 21-15", // Ergebnis für das Spiel
    },
  ]);
}

export default function Matches() {
  const matches = useLoaderData<typeof loader>();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Volleyball Matches
      </h2>

      {/* Tabelle der bestehenden Spiele */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th
              className="px-4 py-2 text-left text-lg text-gray-700"
              style={{ width: "10%" }}
            >
              #
            </th>
            <th className="px-4 py-2 text-left text-lg text-gray-700">
              Team 1
            </th>
            <th className="px-4 py-2 text-left text-lg text-gray-700">
              Team 2
            </th>
            <th className="px-4 py-2 text-left text-lg text-gray-700">Court</th>
            <th className="px-4 py-2 text-left text-lg text-gray-700">
              Referee
            </th>
            <th className="px-4 py-2 text-left text-lg text-gray-700">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Hier die Spiele aus der API anzeigen */}
          {matches.map((match, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-600">{match.match_number}</td>
              <td className="px-4 py-2 text-gray-600">{match.team1}</td>
              <td className="px-4 py-2 text-gray-600">{match.team2}</td>
              <td className="px-4 py-2 text-gray-600">{match.court}</td>
              <td className="px-4 py-2 text-gray-600">{match.referee}</td>
              <td className="px-4 py-2 text-gray-600">{match.result}</td>{" "}
              {/* Ergebnis anzeigen */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
