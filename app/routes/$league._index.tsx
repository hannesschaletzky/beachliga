import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return json({ name: params.league });
}

export default function League() {
  const data = useLoaderData<typeof loader>();
  const { league } = useParams();

  return (
    <div className="">
      <div className="flex flex-col p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 rounded-lg ">
        <div className="flex justify-between">
          <div># 1</div>
          <div>01.01.2024</div>
          <div>C - 1</div>
        </div>
        <div className="flex flex-row justify-center border-dashed border-gray-800 border-b-2 text-sm pb-2 w-full">
          <div>Böttcher/Stiegemann</div>
        </div>

        <Form method="post" className="w-full max-w-md space-y-6">
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-center">
              <div className="font-bold">Team 1 </div>
              <span className="text-gray-700 mx-4">:</span>
              <div className="font-bold">Team 2</div>
            </div>
            <div className="flex items-center justify-center">
              <input
                type="number"
                id="set1_team1_points"
                name="set1_team1_points"
                className="border p-2 w-20 text-center rounded"
                required
              />
              <span className="text-gray-700 mx-4">Satz 1</span>
              <input
                type="number"
                id="set1_team2_points"
                name="set1_team2_points"
                className="border p-2 w-20 text-center rounded"
                required
              />
            </div>

            <div className="flex items-center justify-center">
              <input
                type="number"
                id="set2_team1_points"
                name="set2_team1_points"
                className="border p-2 w-20 text-center rounded"
                required
              />
              <span className="text-gray-700 mx-4">Satz 2</span>
              <input
                type="number"
                id="set2_team2_points"
                name="set2_team2_points"
                className="border p-2 w-20 text-center rounded"
                required
              />
            </div>

            <div className="flex items-center justify-center">
              <input
                type="number"
                id="set3_team1_points"
                name="set3_team1_points"
                className="border p-2 w-20 text-center rounded"
              />
              <span className="text-gray-700 mx-4">Satz 3</span>
              <input
                type="number"
                id="set3_team2_points"
                name="set3_team2_points"
                className="border p-2 w-20 text-center rounded"
              />
            </div>
            <div className="flex items-center justify-center">
              <button className="border p-2 w-20 text-center rounded hover:bg-green-300">
                {" "}
                Yes
              </button>
              <span className="text-gray-700 mx-4"> Win </span>
              <button className="border p-2 w-20 text-center rounded hover:bg-green-300">
                Yes
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Speichern
          </button>
        </Form>
      </div>

      {/* Match Card */}
      {/* <div className="flex flex-col p-2 m-4 bg-gradient-to-b from-gray-200 to-slate-50 scroll-mt-12 rounded-lg ">
        <div className="flex justify-between">
          <div>#1</div>
          <div>01.01.2024</div>
          <div>C - 1</div>
          <div>📝</div>
        </div>
        <div className="flex justify-center text-sm border-dashed border-gray-800 border-b-2">
          Böttcher
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="mt-2">Spieler 1</div>
            <div>Spieler 2</div>
            <div className="mt-2">Spieler 3</div>
            <div>Spieler 4</div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col justify-evenly font-bold text-xl mx-3">
              <div>2</div>
              <div>1</div>
            </div>
            <div className="flex flex-col justify-evenly ml-2">
              <div>21</div>
              <div>19</div>
            </div>
            <div className="flex flex-col justify-evenly ml-2">
              <div>19</div>
              <div>21</div>
            </div>
            <div className="flex flex-col justify-evenly ml-2">
              <div>15</div>
              <div>13</div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
