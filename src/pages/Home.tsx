import { Suspense } from "react";
import { LoaderFunctionArgs, defer } from "react-router-dom";

import { Earth } from "../components/Earth";
import { fetchFlights } from "../utils/rewardFlights";

// eslint-disable-next-line react-refresh/only-export-components
export function loader({ params }: LoaderFunctionArgs) {
  return defer({
    flights: fetchFlights(params["program"]),
  });
}

export function Component() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <Earth />
    </Suspense>
  );
}
