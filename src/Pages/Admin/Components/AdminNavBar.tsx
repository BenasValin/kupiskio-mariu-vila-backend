import { Link } from "react-router-dom";

export default function AdminNavBar() {
  return (
    <>
      <div className="absolute left-1/2 -translate-x-1/2 top-5 flex gap-10">
        <Link className="text-black" to="/admin/dashboard">
          Dashboard
        </Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/orders">Orders</Link>
        <Link to="/admin/users">Users</Link>
      </div>
    </>
  );
}
