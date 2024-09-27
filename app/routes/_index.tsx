import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { generateSchedule } from "~/schedule";

export const meta: MetaFunction = () => {
  return [
    { title: "BeachLiga" },
    {
      name: "Beachliga",
      content: "Beachliga Beach Volleyball",
    },
  ];
};

export const loader = async () => {
  const schedule = generateSchedule(
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    2,
    3
  );

  return json({ text: "World!" });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  console.log(data);
  return (
    <>
      <div>Hello</div>
      <div>{data.text}</div>
    </>
  );
}
