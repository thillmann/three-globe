import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div>
      <header className="">
        <div className="fixed top-8 left-8 text-white ">reward.flights</div>
      </header>
      <Outlet />
    </div>
  );
}
