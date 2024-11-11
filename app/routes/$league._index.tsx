import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return json({ name: params.league });
}

export default function League() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="mt-4 text-center text-4xl font-semibold text-gray-800">
      {data.name}
    </div>
  );
}
