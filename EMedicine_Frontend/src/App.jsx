import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Medicines from "./pages/Medicines";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminMedicines from "./pages/AdminMedicines";
import AdminOrders from "./pages/AdminOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/AdminUsers";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>  
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route
  path="/medicines"
  element={
    <ProtectedRoute>
      <Medicines />
    </ProtectedRoute>
  }
/>

<Route path="/contact" element={<Contact />} />

        <Route
  path="/cart"
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  }
/>

        <Route
  path="/orders"
  element={
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin-medicines"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <AdminMedicines />
      </AdminRoute>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin-orders"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <AdminOrders />
      </AdminRoute>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin-users"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <AdminUsers />
      </AdminRoute>
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;