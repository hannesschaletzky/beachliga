import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, NavLink, Outlet, useParams } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return json({ name: params.league });
}

export default function League() {
  const data = useLoaderData<typeof loader>();
  const { league } = useParams();

  return (
    <div>
      <nav className="bg-gray-800 p-4 shadow-lg">
        <div className="container  flex justify-start">
          <ul className="flex space-x-4 text-white text-lg">
            <li>
              <div className="font-extrabold">{league}</div>
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
          </ul>
        </div>
      </nav>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
