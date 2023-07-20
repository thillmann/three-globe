import { Html, OrbitControls, Stats } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { PropsWithChildren } from "react";
import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { Await, useLoaderData } from "react-router-dom";
import type { Group } from "three";
import { Color, WebGLRenderer } from "three";

import { Atmosphere } from "../components/Atmosphere";
import { Land } from "../components/Land";
import { calcPosFromLatLonRad } from "../utils/coordinates";
import { getColorForClassOfTravel } from "../utils/rewardFlights";
import { Flights } from "./Flights";
import { Planet } from "./Planet";

function Legend(props: PropsWithChildren) {
  return (
    <div className="fixed bottom-8 left-8 bg-white p-2 rounded-lg pointer-events-none select-none shadow-lg">
      {props.children}
    </div>
  );
}

interface LegendClassProps {
  color: string;
}

function LegendClass(props: PropsWithChildren<LegendClassProps>) {
  return (
    <div className="flex items-center text-xs sm:text-sm">
      <div
        className="w-3 h-3 sm:w-4 sm:h-4 rounded mr-2"
        style={{ background: props.color }}
      />
      {props.children}
    </div>
  );
}

const globeRadius = 5;

interface LightingProps {
  radius: number;
}

function Lighting(props: LightingProps) {
  const camera = useThree((state) => state.camera);
  const ref = useRef<Group>(null);
  useFrame(() => {
    ref.current?.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={ref}>
      <ambientLight intensity={0.2} />
      <pointLight position={[-props.radius, props.radius, props.radius]} />
      <pointLight
        position={[props.radius, props.radius, props.radius]}
        color={new Color("red")}
        intensity={0.4}
      />
    </group>
  );
}

const extraOffset = 0;

function Autofocus() {
  const camera = useThree((state) => state.camera);

  useLayoutEffect(() => {
    const date = new Date();
    const timeZoneOffset = date.getTimezoneOffset() || 0;
    const hoursOffset = timeZoneOffset / 60;
    const longitude = (-hoursOffset + extraOffset) * 15;
    const [x, y, z] = calcPosFromLatLonRad(10, longitude, camera.position.z);
    camera.position.set(x, y, z);
  }, [camera]);

  return null;
}

export function Earth() {
  const data = useLoaderData() as { flights: Promise<[]> };
  const [autoRotate, setAutoRotate] = useState(true);
  return (
    <div className="h-screen relative">
      <Canvas
        dpr={window.devicePixelRatio}
        camera={{ position: [0, 0, globeRadius * 2] }}
        onPointerDown={() => setAutoRotate(false)}
        frameloop="demand"
        gl={(canvas) =>
          new WebGLRenderer({ canvas, antialias: false, alpha: true })
        }
      >
        <Lighting radius={globeRadius * 2} />
        <group>
          <Atmosphere radius={globeRadius} />
          <Planet radius={globeRadius} />
          <Land radius={globeRadius} />
          <Suspense
            fallback={
              <Html center>
                <div className="bg-white w-40 rounded-lg px-2 py-2 shadow-lg text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 animate-pulse mx-auto"
                  >
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                  Loading flights
                </div>
              </Html>
            }
          >
            <Await
              resolve={data.flights}
              errorElement={<p>An error occured</p>}
            >
              <Flights radius={globeRadius} />
            </Await>
          </Suspense>
        </group>
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.4}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={0.3 * Math.PI}
          maxPolarAngle={0.65 * Math.PI}
        />
        <Autofocus />
        {!import.meta.env.PROD && <Stats />}
      </Canvas>
      <Legend>
        <LegendClass color={getColorForClassOfTravel("F")}>
          First class (F)
        </LegendClass>
        <LegendClass color={getColorForClassOfTravel("J")}>
          Business class (J)
        </LegendClass>
        <LegendClass color={getColorForClassOfTravel("W")}>
          Premium economy class (W)
        </LegendClass>
        <LegendClass color={getColorForClassOfTravel("Y")}>
          Economy class (Y)
        </LegendClass>
      </Legend>
      <div className="fixed bottom-8 right-8 text-white text-xs">
        <a
          href="https://seats.aero"
          target="_blank"
          rel="nofollow noreferrer noopener"
          className="opacity-50 hover:opacity-100 transition-opacity"
        >
          Powered by seats.aero
        </a>
      </div>
    </div>
  );
}
