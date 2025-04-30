import { Link, Outlet } from "react-router-dom";

export default function AdminNavBar() {
  const paths = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <div>
      <div className=" flex gap-2 flex-col p-5">
        {paths.map((path) => {
          return (
            <Link
              className={`px-5 py-4 hover:bg-gray-200 rounded-md ${
                window.location.pathname == path.path ? "bg-blue-200" : ""
              }`}
              to={path.path}
            >
              {path.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
