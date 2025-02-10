import { json, LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  NavLink,
  Outlet,
  useParams,
  useLocation,
} from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return json({ name: params.league });
}

export default function League() {
  const data = useLoaderData<typeof loader>();
  const { league } = useParams();
  const location = useLocation();

  const isAdminRoute =
    location.pathname.endsWith("/admin") ||
    location.pathname.endsWith("/teams") ||
    location.pathname.endsWith("/details");

  return (
    <div>
      {!isAdminRoute && (
        <nav className="bg-gradient-to-b from-gray-200 to-slate-50 p-4">
          <div className="flex justify-start">
            <ul className="flex space-x-4 text-lg">
              <li>
                <NavLink to={`/${data.name}`} className="font-extrabold">
                  {league}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/${data.name}/standings`}
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-400 font-bold"
                      : "hover:text-yellow-400 transition duration-300"
                  }
                >
                  Tabelle
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/${data.name}/matches`}
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-400 font-bold"
                      : "hover:text-yellow-400 transition duration-300"
                  }
                >
                  Spiele
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/${data.name}/timeTable`}
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-400 font-bold"
                      : "hover:text-yellow-400 transition duration-300"
                  }
                >
                  Zeitplan
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <div className="">
        <Outlet />
      </div>
    </div>
  );
}
