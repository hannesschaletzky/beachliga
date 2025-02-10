import { json, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import { getLeagues } from "~/api/dynamo";

const AUTH_USERNAME = "admin";
const AUTH_PASSWORD = "123456";

function isAuthenticated(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  // Decode the Base64 string
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(":");

  return username === AUTH_USERNAME && password === AUTH_PASSWORD;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const leagues = await getLeagues();
  let league = leagues?.find((l) => l.name === params.league);

  if (!league) {
    throw new Response("League not found", { status: 404 });
  }

  if (!isAuthenticated(request)) {
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
        <Outlet />
      </div>
    </div>
  );
}
