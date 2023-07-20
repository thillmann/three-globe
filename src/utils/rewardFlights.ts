import type { LngLat } from "./coordinates";
import { rewardPrograms } from "./rewardPrograms";
import type { Airport, Flight } from "./types";

function processFlights(flights: Flight[]) {
  const routes = new Set<string>();
  const newFlights: Flight[] = [];
  for (const flight of flights) {
    const origin = flight.Route.OriginAirport;
    const destination = flight.Route.DestinationAirport;
    const route = `${origin}->${destination}`;
    const returnRoute = `${destination}->${origin}`;
    if (routes.has(route) || routes.has(returnRoute)) {
      continue;
    }
    newFlights.push(flight);
    routes.add(route);
    routes.add(returnRoute);
  }
  return newFlights;
}

export async function fetchFlights(program?: string) {
  if (!program || !rewardPrograms.includes(program)) {
    throw new Error("Unknown reward program");
  }

  const [iataAirports, flights] = await Promise.all([
    fetch("/api/airports")
      .then((res) => res.json() as Promise<Airport[]>)
      .catch(() => []),
    fetch("/api/reward-flights", {
      method: "POST",
      body: JSON.stringify({ program }),
    })
      .then((res) => res.json() as Promise<Flight[]>)
      .catch(() => []),
  ]);

  return processFlights(flights).map((flight) => {
    const origin = flight.Route.OriginAirport;
    const originAirport = iataAirports.find((a) => a.iata_code === origin);
    const destination = flight.Route.DestinationAirport;
    const destinationAirport = iataAirports.find(
      (a) => a.iata_code === destination,
    );
    const [originLng, originLat] = originAirport?.coordinates.split(", ") ?? [
      "0",
      "0",
    ];
    const [destinationLng, destinationLat] =
      destinationAirport?.coordinates.split(", ") ?? ["0", "0"];
    return {
      id: flight.ID,
      route: {
        fromAirport: originAirport?.municipality,
        toAirport: destinationAirport?.municipality,
        fromIata: origin,
        toIata: destination,
        from: [parseFloat(originLng), parseFloat(originLat)] as LngLat,
        to: [parseFloat(destinationLng), parseFloat(destinationLat)] as LngLat,
      },
      date: new Date(flight.Date),
      availableClasses: {
        F: flight.FAvailable,
        J: flight.JAvailable,
        W: flight.WAvailable,
        Y: flight.YAvailable,
      },
      maxClassOfTravel: flight.FAvailable
        ? "F"
        : flight.JAvailable
        ? "J"
        : flight.WAvailable
        ? "W"
        : "Y",
    } as const;
  });
}

export type RewardFlights = Awaited<ReturnType<typeof fetchFlights>>;

const travelClassColors = {
  Y: "#c084fc",
  W: "#38bdf8",
  J: "#86efac",
  F: "#fbbf24",
} as const;

export function getColorForClassOfTravel(
  classOfTravel: keyof typeof travelClassColors,
) {
  return travelClassColors[classOfTravel];
}
