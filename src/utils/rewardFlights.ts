import { LngLat } from "./coordinates";
import { rewardPrograms } from "./rewardPrograms";
import { Airport, Flight } from "./types";

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
        fromIata: origin,
        toIata: destination,
        from: [parseFloat(originLng), parseFloat(originLat)] as LngLat,
        to: [parseFloat(destinationLng), parseFloat(destinationLat)] as LngLat,
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
