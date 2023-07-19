import { Html, OrbitControls, Stats } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { Color, Group, WebGLRenderer } from "three";

import { Atmosphere } from "../components/Atmosphere";
import { Land } from "../components/Land";
import { calcPosFromLatLonRad } from "../utils/coordinates";
import { Flights } from "./Flights";
import { Planet } from "./Planet";

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

const extraOffset = 2;

function Autofocus() {
  const camera = useThree((state) => state.camera);

  useLayoutEffect(() => {
    const date = new Date();
    const timeZoneOffset = date.getTimezoneOffset() || 0;
    const hoursOffset = timeZoneOffset / 60;
    const longitude = (-hoursOffset + extraOffset) * 15;
    const [x, y, z] = calcPosFromLatLonRad(0, longitude, camera.position.z);
    camera.position.set(x, y, z);
  }, [camera]);

  return null;
}

export function Earth() {
  const data = useLoaderData() as { flights: Promise<[]> };
  const [autoRotate, setAutoRotate] = useState(true);
  return (
    <div className="h-screen">
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
    </div>
  );
}
