import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getLeagues } from "~/api/dynamo";

export async function loader({}: LoaderFunctionArgs) {
  const leagues = await getLeagues();

  return json(leagues);
}
export default function Login() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-white">Unauthorized</h1>
      <p className="text-gray-600">
        You must enter a valid username and password.
      </p>
      <Link
        to={`/Winter25/admin`}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go to Admin
      </Link>
    </div>
  );
}
