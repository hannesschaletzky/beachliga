import React, { useState } from "react";

interface RegistrationFormProps {
  leagues: string[];
  submit: (league: string) => void;
}

export function RegistrationForm({ leagues, submit }: RegistrationFormProps) {
  const [league, setLeague] = useState("");

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-6">Anmeldung</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(league);
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Dein Name:
          </label>
          <input
            type="text"
            placeholder="z.B. Max Mustermann"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Wähle deine Liga aus:
          </label>
          <select
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a league</option>
            {leagues.map((league) => (
              <option key={league} value={league}>
                {league}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
