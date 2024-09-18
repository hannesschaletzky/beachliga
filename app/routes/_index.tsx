import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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
  return json({ ok: true });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  return <div>Hello World!</div>;
}
