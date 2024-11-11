import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return json({
    name: params.league,
    match_number: params.match_number,
  });
}

export default function FillInMatch() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h2>Match: {data.match_number}</h2>
      <div>
        Details for {data.name} - Match {data.match_number}
      </div>
      {/* Weitere Inhalte für das Match können hier angezeigt werden */}
    </div>
  );
}
