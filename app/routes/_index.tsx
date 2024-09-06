import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Beachliga" },
    {
      name: "Beachliga",
      content: "Beachliga Beach Volleyball",
    },
  ];
};

export default function Index() {
  return <div>Hello World!</div>;
}
