import { Outlet } from "react-router-dom";
import Menu from "./Menu";

function Layout() {
  return (
    <div className="d-flex w-100 vh-100" style={{ backgroundColor: "#fcfaf6" }}>
      <Menu />
      <main className="flex-grow-1 p-5 overflow-auto" style={{ backgroundColor: "#fcfaf6" }}>
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;
