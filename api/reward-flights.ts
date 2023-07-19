import { geolocation } from "@vercel/edge";

import { Flight } from "../src/utils/types";

export const config = {
  runtime: "edge",
};

const regionToContinent: Record<string, string> = {
  syd1: "Oceania",
  pdx1: "North America",
  sfo1: "North America",
};

export default async (request: Request) => {
  const { region } = geolocation(request);
  const continent = regionToContinent[region ?? "syd1"] ?? "Oceania";
  const body = (await request.json()) as { program?: string };
  const res = await fetch(
    `https://seats.aero/api/availability?source=${body}`,
    {
      method: "GET",
      headers: { accept: "application/json" },
    },
  );
  const flights = (await res.json()) as Flight[];
  return new Response(
    JSON.stringify(flights.filter((r) => r.Route.OriginRegion === continent)),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    },
  );
};
