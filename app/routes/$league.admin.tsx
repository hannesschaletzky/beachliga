import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useParams,
} from "@remix-run/react";
import { getCredentials, getLeagues } from "~/api/dynamo";
import { isAuthenticated } from "~/services/auth";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const leagues = await getLeagues();
  const credentials = await getCredentials();

  let league_creds = credentials?.find((l) => l.league_name === params.league);
  let league = leagues?.find((l) => l.name === params.league);

  if (!league_creds) {
    return <div> Fehler</div>;
  }

  if (
    !isAuthenticated(request, league_creds?.username, league_creds?.password)
  ) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area"',
      },
    });
  }

  return json(league);
}

export default function LeagueAdmin() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <div>
      <nav className="bg-gradient-to-b from-gray-200 to-slate-50 p-4">
        <div className="flex justify-start">
          <ul className="flex space-x-4 text-lg">
            <li>
              <NavLink to={`/${data.name}/admin`} className="font-extrabold">
                ADMIN
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${data.name}/admin/teams`}
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-400 font-bold"
                    : "hover:text-yellow-400 transition duration-300"
                }
              >
                Teams
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${data.name}/admin/details`}
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-400 font-bold"
                    : "hover:text-yellow-400 transition duration-300"
                }
              >
                Details
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <div className="">
        {location.pathname === "/Winter25/admin" && (
          <div className="flex text-white justify-center h-screen items-center">
            Willkommen im Adminbereich!
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
}
