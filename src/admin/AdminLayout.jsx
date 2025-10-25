import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";

export default function AdminLayout(){
  return(
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar/>
      <div className="flex flex-col flex-1">
        <Topbar/>
        <main className="p-6 flex-1 overflow-auto">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};
