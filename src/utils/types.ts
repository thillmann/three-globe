export interface Airport {
  continent: string;
  coordinates: string;
  elevation_ft: string;
  gps_code: string;
  iata_code: string;
  ident: string;
  iso_country: string;
  iso_region: string;
  local_code: string;
  municipality: string;
  name: string;
  type:
    | "small_airport"
    | "medium_airport"
    | "large_airport"
    | "seaplane_base"
    | "heliport"
    | "closed";
}

export interface Flight {
  ID: string;
  RouteID: string;
  Route: {
    ID: string;
    OriginAirport: string;
    OriginRegion: string;
    DestinationAirport: string;
    DestinationRegion: string;
    NumDaysOut: number;
    Distance: number;
    Source: string;
  };
  Date: string;
  ParsedDate: string;
  YAvailable: boolean;
  WAvailable: boolean;
  JAvailable: boolean;
  FAvailable: boolean;
  YMileageCost: string;
  WMileageCost: string;
  JMileageCost: string;
  FMileageCost: string;
  YRemainingSeats: number;
  WRemainingSeats: number;
  JRemainingSeats: number;
  FRemainingSeats: number;
  YAirlines: string;
  WAirlines: string;
  JAirlines: string;
  FAirlines: string;
  YDirect: boolean;
  WDirect: boolean;
  JDirect: boolean;
  FDirect: boolean;
  Source: string;
  ComputedLastSeen: string;
  AvailabilityTrips: null;
}
