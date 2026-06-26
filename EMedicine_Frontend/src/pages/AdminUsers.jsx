import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";


function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/Users", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
 

setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
  `/Users/${id}/toggle-status`,
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

console.log("Toast called");
toast.success("User status updated successfully");

await loadUsers();

    } catch (error) {
  console.log(error);
  toast.error(error.response?.data || "Operation Failed");
}
  };

  return (
    <div className="container mt-4">
      <h1 className="fw-bold mb-4">
  Admin Users
</h1>

      <div
  className="p-4 mb-4 text-white rounded shadow"
  style={{
    background:
      "linear-gradient(135deg,#6610f2,#0dcaf0)"
  }}
>
  <h2>👥 User Management</h2>
  <p className="mb-0">
    Manage users, roles and account status.
  </p>
</div>

  <div className="card bg-primary text-white mb-4">
  <div className="card-body text-center">
    <h5>Total Users</h5>
    <h2>{users.length}</h2>
  </div>
</div>
  

      <input
  type="text"
   className="form-control shadow-sm mb-4"
  placeholder="Search by name or email..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>


{users.filter(
  (user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    user.email
      .toLowerCase()
      .includes(search.toLowerCase())
).length === 0 && (
  <div className="alert alert-warning">
    No users found.
  </div>
)}

     <div className="table-responsive">
  <table className="table table-hover shadow">
        <thead className="table-dark">
          <tr>
            <th>Id</th>
            <th>Name</th> 
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {
          users
  .filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  )
  .map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>

              <td>
                {user.firstName} {user.lastName}
              </td>

              <td>{user.email}</td>

              <td>
  {user.role === "Admin" ? (
    <span className="badge bg-primary">
      Admin
    </span>
  ) : (
    <span className="badge bg-secondary">
      User
    </span>
  )}
</td>

              <td>
                <span
  className={`badge ${
    user.status === 1
      ? "bg-success"  
      : "bg-danger"
  }`}
>
  {user.status === 1
    ? "Active"
    : "Disabled"}
</span>
              </td>

              <td>
                <button
  className={`btn btn-sm ${
    user.status === 1
      ? "btn-danger"
      : "btn-success"
  }`}
  onClick={() => toggleStatus(user.id)}
>
  {user.status === 1
    ? "Disable"
    : "Enable"}
</button>


              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default AdminUsers;