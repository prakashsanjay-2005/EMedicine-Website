import { useEffect, useState } from "react";
import api from "../services/api";
import { getUserId } from "../services/auth";
import { toast } from "react-toastify";

function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
  loadProfile();
  loadStats();
}, []);

const updateProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    await api.put(
  `/Users/${user.id}`,
  {
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  address: user.address,
  city: user.city,
  pincode: user.pincode,
  password: "123456",
  role: user.role,
  status: user.status,
  createdOn: user.createdOn
},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Profile Updated");
    setEditing(false);

    loadProfile();
  } catch (error) {
  console.log(error.response?.data);
  alert(JSON.stringify(error.response?.data));
}
};

const changePassword = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = getUserId();

    await api.put(
      `/Users/${userId}/change-password`,
      {
        currentPassword,
        newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Password Changed Successfully");

    setCurrentPassword("");
    setNewPassword("");

  } catch (error) {
    console.log(error);

    toast.error(error.response?.data || "Operation Failed");
  }
};


  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserId();

      const response = await api.get(`/Users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };


  const loadStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = getUserId();

    const response = await api.get(
      `/Users/${userId}/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStats(response.data);
  } catch (error) {
    console.log(error.response);
console.log(error.response?.data);
  }
};


  if (!user) return <h3>Loading...</h3>;

  return (
     
    <div className="container mt-4">
      <div className="card shadow border-0 mb-4">
  <div className="card-body text-center">
    <h2>👤 My Profile</h2>
    <p className="text-muted mb-0">
      Manage your account information
    </p>
  </div>
  </div>

      <div className="card shadow border-0 p-4">

        {editing ? (
  <>
    <input
      className="form-control mb-2"
      value={user.firstName}
      onChange={(e) =>
        setUser({
          ...user,
          firstName: e.target.value,
        })
      }
    />

    <input
      className="form-control mb-2"
      value={user.lastName}
      onChange={(e) =>
        setUser({
          ...user,
          lastName: e.target.value,
        })
      }
    />

    <input
      className="form-control mb-2"
      value={user.email}
      onChange={(e) =>
        setUser({
          ...user,
          email: e.target.value,
        })
      }
    />

   <input
  className="form-control mb-2"
  placeholder="Phone Number"
  value={user.phoneNumber || ""}
  onChange={(e) =>
    setUser({
      ...user,
      phoneNumber: e.target.value,
    })
  }
/>

<textarea
  className="form-control mb-2"
  placeholder="Address"
  value={user.address || ""}
  onChange={(e) =>
    setUser({
      ...user,
      address: e.target.value,
    })
  }
/>

<input
  className="form-control mb-2"
  placeholder="City"
  value={user.city || ""}
  onChange={(e) =>
    setUser({
      ...user,
      city: e.target.value,
    })
  }
/>

<input
  className="form-control mb-2"
  placeholder="Pincode"
  value={user.pincode || ""}
  onChange={(e) =>
    setUser({
      ...user,
      pincode: e.target.value,
    })
  }
/>


  </>
) : (
   <>
    <h4>
      Name: {user.firstName} {user.lastName}
    </h4>

    <h4>
      Email: {user.email}
    </h4>

    <h4>
  Phone: {user.phoneNumber}
</h4>

<h4>
  Address: {user.address}
</h4>

<h4>
  City: {user.city}
</h4>

<h4>
  Pincode: {user.pincode}
</h4>
  </>
)}

        <h4>
          Role: {user.role}
        </h4>
         
        <div className="my-3"></div>

{editing ? (
  <button
    className="btn btn-success"
    onClick={updateProfile}
  >
    Save Changes
  </button>
) : (
  <button
    className="btn btn-primary"
    onClick={() => setEditing(true)}
  >
    Edit Profile
  </button>
)}

{stats && (
  <>
    <div className="row mt-4">
  <div className="col-md-6">
    <div className="card bg-primary text-white text-center">
      <div className="card-body">
        <h5>Total Orders</h5>
        <h2>{stats.totalOrders}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-6">
    <div className="card bg-success text-white text-center">
      <div className="card-body">
        <h5>Total Spent</h5>
        <h2>₹ {stats.totalSpent}</h2>
      </div>
    </div>
  </div>
</div>
  </>
)}

<div className="card shadow border-0 mt-4">
  <div className="card-body">

    <h3>🔒 Change Password</h3>

    <input
      type="password"
      className="form-control mb-2"
      placeholder="Current Password"
      value={currentPassword}
      onChange={(e) =>
        setCurrentPassword(e.target.value)
      }
    />

    <input
      type="password"
      className="form-control mb-3"
      placeholder="New Password"
      value={newPassword}
      onChange={(e) =>
        setNewPassword(e.target.value)
      }
    />

    <button
      className="btn btn-danger"
      onClick={changePassword}
    >
      Change Password
    </button>

    

  </div>
</div>



      </div>
    </div>
  );
}

export default Profile;