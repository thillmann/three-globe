import { useRef, useState } from "react";
import { useAsyncValue } from "react-router-dom";
import { Color, Material, Mesh } from "three";

import { useAnimation } from "../utils/animations";
import { useCoordinates } from "../utils/coordinates";
import { RewardFlights } from "../utils/rewardFlights";
import { Arch } from "./Arch";
import { Marker } from "./Marker";

function useFlightWindow(length: number) {
  const nextIdx = useRef(10);
  const [window, setWindow] = useState(
    () => new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
  );
  return {
    window,
    removeFlight: (idx: number) => {
      setWindow((set) => {
        set.delete(idx);
        const values = Array.from(set.values());
        const newIdx = nextIdx.current;
        nextIdx.current += 1;
        if (newIdx > length - 1) {
          if (values.length > 0) {
            return new Set([...values]);
          }
          nextIdx.current = 10;
          return new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }
        return new Set([...values, newIdx]);
      });
    },
  };
}

const colors = {
  Y: new Color("#c084fc"),
  W: new Color("#38bdf8"),
  J: new Color("#86efac"),
  F: new Color("#fbbf24"),
} as const;

function getColor(maxClassOfTravel: keyof typeof colors) {
  return colors[maxClassOfTravel];
}

interface FlightProps {
  flight: RewardFlights[number];
  radius: number;
  onAnimationEnd: () => void;
}

function Flight(props: FlightProps) {
  const fromRef = useRef<Mesh>(null);
  const toRef = useRef<Mesh>(null);
  const archRef = useRef<Mesh>(null);
  const {
    route: { from, to },
  } = props.flight;
  const fromCoords = useCoordinates(from, props.radius + 0.02);
  const toCoords = useCoordinates(to, props.radius + 0.02);

  useAnimation(() => {
    const target = {
      fromMarkerOpacity: 0,
      toMarkerOpacity: 0,
      archOpacity: 1,
      archDrawRange: 0,
    };
    const maxDrawRange =
      (archRef.current?.geometry.attributes.position.count ?? 0) * 8;
    return {
      targets: target,
      keyframes: [
        { fromMarkerOpacity: 1, duration: 500 },
        {
          archDrawRange: maxDrawRange * 0.5,
          duration: 1000,
        },
        {
          archDrawRange: maxDrawRange * 0.6,
          toMarkerOpacity: 1,
          duration: 200,
        },
        { archDrawRange: maxDrawRange, duration: 800 },
        {
          delay: 500,
          fromMarkerOpacity: 0,
          toMarkerOpacity: 0,
          archOpacity: 0,
          duration: 1000,
        },
      ],
      easing: "linear",
      autoplay: false,
      loop: false,
      update: () => {
        if (fromRef.current && archRef.current && toRef.current) {
          (fromRef.current.material as Material).opacity =
            target.fromMarkerOpacity;
          (toRef.current.material as Material).opacity = target.toMarkerOpacity;
          archRef.current.geometry.setDrawRange(
            0,
            Math.round(target.archDrawRange),
          );
          (archRef.current.material as Material).opacity = target.archOpacity;
        }
      },
      complete: props.onAnimationEnd,
    };
  });

  return (
    <group>
      <Marker
        ref={fromRef}
        coords={fromCoords}
        color={getColor(props.flight.maxClassOfTravel)}
      />
      <Arch
        ref={archRef}
        from={fromCoords}
        to={toCoords}
        radius={props.radius}
        color={getColor(props.flight.maxClassOfTravel)}
      />
      <Marker
        ref={toRef}
        coords={toCoords}
        color={getColor(props.flight.maxClassOfTravel)}
      />
      {/* <Html occlude={"blending"} position={fromCoords} transform>
        {props.flight.route.fromIata}
      </Html> */}
    </group>
  );
}

interface FlightsProps {
  radius: number;
}

export function Flights(props: FlightsProps) {
  const flights = useAsyncValue() as RewardFlights;
  const { window, removeFlight } = useFlightWindow(flights.length);
  return flights.map((flight, i) =>
    window.has(i) ? (
      <Flight
        key={flight.id}
        flight={flight}
        radius={props.radius}
        onAnimationEnd={() => removeFlight(i)}
      />
    ) : null,
  );
}
