import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return json({ name: params.league });
}

export default function League() {
  const data = useLoaderData<typeof loader>();
  const { league } = useParams();
  const original = league || "Beachliga";
  const modifed = original.slice(0, 9) + " 20" + original.slice(9);

  return <div>Willkommen zur {modifed}</div>;
}
