import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRole } from "../services/auth";
import {
  FaPills,
  FaShoppingCart,
  FaClipboardList,
  FaUser,
  FaChartBar,
  FaUsers,
  FaSignOutAlt,
  FaPhoneAlt
} from "react-icons/fa";


function Navbar() {
   const navigate = useNavigate();
  const role = getRole();
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (
  location.pathname === "/" ||
  location.pathname === "/login" ||
  location.pathname === "/register"
) {
  return null;
}

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  navigate("/login");
};

  return (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
    <div className="container">

      <Link
        className="navbar-brand fw-bold"
        to="/medicines"
      >
        💊 E-Medicine
      </Link>

      <div className="navbar-nav ms-auto">

        <Link
          className="nav-link text-white"
          to="/medicines"
        >
          <FaPills /> Medicines
        </Link>

        <Link
          className="nav-link text-white"
          to="/cart"
        >
          <FaShoppingCart /> Cart
        </Link>

        <Link
          className="nav-link text-white"
          to="/orders"
        >
          <FaClipboardList /> Orders
        </Link>

       <Link
  className="nav-link text-white"
  to="/contact"
>
  <FaPhoneAlt /> Contact
</Link>

        <Link
          className="nav-link text-white"
          to="/profile"
        >
          <FaUser /> Profile
        </Link>

        {role === "Admin" && (
          <>
            <Link
              className="nav-link text-white"
              to="/admin-medicines"
            >
              <FaPills /> Admin Medicines
            </Link>

            <Link
              className="nav-link text-white"
              to="/admin-orders"
            >
              <FaClipboardList /> Admin Orders
            </Link>

            <Link
              className="nav-link text-white"
              to="/admin-users"
            >
              <FaUsers /> Users
            </Link>

            <Link
              className="nav-link text-white"
              to="/admin-dashboard"
            >
              <FaChartBar /> Dashboard
            </Link>
          </>
        )}

        <button
          className="btn btn-danger ms-3"
          onClick={logout}
        >
          <FaSignOutAlt /> Logout
        </button>

      </div>
    </div>
  </nav>
);
}

export default Navbar;