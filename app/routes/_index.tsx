import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { getLeagueNames } from "~/api/dynamo";
import { RegistrationForm } from "~/components/registrationForm";

export const meta: MetaFunction = () => {
  return [
    { title: "BeachLiga" },
    {
      name: "Beachliga",
      content: "Beachliga Beach Volleyball",
    },
  ];
};
enum ContentState {
  form,
  tableview,
}

export const loader = async () => {
  const leagueNames = await getLeagueNames();
  return { leagueNames };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const leagueNameArray = data.leagueNames?.map((league) => league.name) || [];

  const [selectedLeague, setSelectedLeague] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <RegistrationForm
        leagues={leagueNameArray}
        submit={(league: string) => {
          setSelectedLeague(league);
          navigate(`/${league}`);
        }}
      />
    </div>
  );
}
