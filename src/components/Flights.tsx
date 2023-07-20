import { Html, Hud, OrthographicCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useAsyncValue } from "react-router-dom";
import type { Material, Mesh } from "three";
import { Color } from "three";

import { useAnimation } from "../utils/animations";
import { useCoordinates } from "../utils/coordinates";
import type { RewardFlights } from "../utils/rewardFlights";
import { getColorForClassOfTravel } from "../utils/rewardFlights";
import { Arch } from "./Arch";
import { Marker, MarkerRing } from "./Marker";

const labelPositions: Record<number, [number, number, number]> = {
  0: [-480, -62, 0],
  1: [-480, 62, 0],
  2: [450, -125, 0],
  3: [480, 0, 0],
  4: [450, 125, 0],
};

interface FlightLabelProps {
  flight: RewardFlights[number];
}

function FlightLabel(props: FlightLabelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-2 space-y-1 w-64">
      <div className="text-xs text-gray-600">
        {props.flight.date.toLocaleDateString()}
      </div>
      <div className="text-sm">
        {props.flight.route.fromAirport} to {props.flight.route.toAirport}
      </div>
      <div className="text-xs space-x-1">
        <span
          className={`${
            props.flight.availableClasses.F ? "" : "text-gray-300"
          }`}
        >
          F
        </span>
        <span
          className={`${
            props.flight.availableClasses.J ? "" : "text-gray-300"
          }`}
        >
          J
        </span>
        <span
          className={`${
            props.flight.availableClasses.W ? "" : "text-gray-300"
          }`}
        >
          W
        </span>
        <span
          className={`${
            props.flight.availableClasses.Y ? "" : "text-gray-300"
          }`}
        >
          Y
        </span>
      </div>
    </div>
  );
}

function useFlightWindow(length: number) {
  const nextIdx = useRef(5);
  const [window, setWindow] = useState(() => new Set([0, 1, 2, 3, 4]));
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
          nextIdx.current = 5;
          return new Set([0, 1, 2, 3, 4]);
        }
        return new Set([...values, newIdx]);
      });
    },
  };
}

let masterPosition = -1;

interface FlightProps {
  flight: RewardFlights[number];
  radius: number;
  onAnimationEnd: () => void;
}

function Flight(props: FlightProps) {
  const [position] = useState(() => {
    masterPosition = (masterPosition + 1) % 5;
    return masterPosition;
  });
  const fromRef = useRef<Mesh>(null);
  const toRef = useRef<Mesh>(null);
  const toRingRef = useRef<Mesh>(null);
  const archRef = useRef<Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const {
    route: { from, to },
  } = props.flight;
  const fromCoords = useCoordinates(from, props.radius + 0.02);
  const toCoords = useCoordinates(to, props.radius + 0.02);
  const [color] = useState(
    () => new Color(getColorForClassOfTravel(props.flight.maxClassOfTravel)),
  );

  useAnimation(() => {
    const target = {
      fromMarkerOpacity: 0,
      toMarkerOpacity: 0,
      toMarkerRingScale: 1,
      toMarkerRingOpacity: 0,
      archOpacity: 1,
      archDrawRange: 0,
      labelOpacity: 0,
    };
    const maxDrawRange =
      (archRef.current?.geometry.attributes.position.count ?? 0) * 6;
    return {
      targets: target,
      keyframes: [
        { fromMarkerOpacity: 1, labelOpacity: 1, duration: 500 },
        {
          archDrawRange: maxDrawRange * 0.8,
          duration: 1600,
        },
        {
          archDrawRange: maxDrawRange,
          toMarkerOpacity: 1,
          toMarkerRingOpacity: 1,
          duration: 400,
        },
        {
          toMarkerRingScale: 4,
          toMarkerRingOpacity: 0,
          duration: 400,
          easing: "easeOutQuad",
        },
        {
          delay: Math.random() * 1500 + 1500,
          fromMarkerOpacity: 0,
          toMarkerOpacity: 0,
          archOpacity: 0,
          labelOpacity: 0,
          duration: 1000,
        },
      ],
      easing: "linear",
      delay: Math.random() * 6000,
      autoplay: false,
      loop: false,
      update: () => {
        if (
          fromRef.current &&
          archRef.current &&
          toRef.current &&
          toRingRef.current &&
          labelRef.current
        ) {
          (fromRef.current.material as Material).opacity =
            target.fromMarkerOpacity;
          (toRef.current.material as Material).opacity = target.toMarkerOpacity;
          archRef.current.geometry.setDrawRange(
            0,
            Math.round(target.archDrawRange),
          );
          (archRef.current.material as Material).opacity = target.archOpacity;
          toRingRef.current.scale.set(
            target.toMarkerRingScale,
            target.toMarkerRingScale,
            1,
          );
          (toRingRef.current.material as Material).opacity =
            target.toMarkerRingOpacity;
          labelRef.current.style.opacity = target.labelOpacity + "";
        }
      },
      complete: props.onAnimationEnd,
    };
  });

  const { size } = useThree();

  return (
    <>
      <group>
        <Marker ref={fromRef} coords={fromCoords} color={color} />
        <Arch
          ref={archRef}
          from={fromCoords}
          to={toCoords}
          radius={props.radius}
          color={color}
        />
        <Marker ref={toRef} coords={toCoords} color={color} />
        <MarkerRing ref={toRingRef} coords={toCoords} color={color} />
      </group>
      <Hud>
        <OrthographicCamera
          makeDefault
          args={[
            -size.width / 2,
            size.width / 2,
            -size.height / 2,
            size.height / 2,
          ]}
        />
        <Html
          ref={labelRef}
          center
          position={labelPositions[position]}
          style={{ opacity: 0, willChange: "auto" }}
        >
          <FlightLabel flight={props.flight} />
        </Html>
      </Hud>
    </>
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
