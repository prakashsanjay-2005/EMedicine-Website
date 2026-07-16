import { useState } from "react";
import api from "../services/api";
import doctorImage from "../assets/login-doctor.jpg";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  city: "",
  pincode: "",
  password: "",
  confirmPassword: ""
});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!emailRegex.test(form.email)) {
    toast.error("Enter a valid email.");
    return;
  }

  if (!passwordRegex.test(form.password)) {
    toast.error(
  "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
);
    return;
  }

  if (form.password !== form.confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  if (!/^\d{10}$/.test(form.phoneNumber)) {
    toast.error("Phone number must be 10 digits.");
    return;
  }

  if (!/^\d{6}$/.test(form.pincode)) {
    toast.error("Pincode must be 6 digits.");
    return;
  }

  try {
    const data = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      password: form.password
    };

    const response = await api.post("/Auth/register", data);

   toast.success(response.data);

   
setTimeout(() => {
  navigate("/login");
}, 1500);

  } catch (error) {
    toast.error(error.response?.data || "Registration Failed");
  }
};

  return (
    <div className="container-fluid vh-100">
  <div className="row h-100">

    {/* Left Side */}
    <div className="col-md-6 d-flex align-items-center justify-content-center">
      <div
        className="card shadow-lg p-5 border-0"
        style={{
          width: "500px",
          borderRadius: "20px"
        }}
      >
        <h1 className="mb-3 fw-bold">
          Create Account 🚀
        </h1>

        <p className="text-muted mb-4">
          Register to continue
        </p>

        <input
  type="text"
  name="firstName"
  className="form-control mb-3"
  placeholder="First Name"
  value={form.firstName}
  onChange={handleChange}
/>

<input
  type="text"
  name="lastName"
  className="form-control mb-3"
  placeholder="Last Name"
  value={form.lastName}
  onChange={handleChange}
/>

<input
  type="email"
  name="email"
  className="form-control mb-3"
  placeholder="Email"
  value={form.email}
  onChange={handleChange}
/>

<input
  type="text"
  name="phoneNumber"
  className="form-control mb-3"
  placeholder="Phone Number"
  value={form.phoneNumber}
  onChange={handleChange}
/>

<input
  type="text"
  name="address"
  className="form-control mb-3"
  placeholder="Address"
  value={form.address}
  onChange={handleChange}
/>

<input
  type="text"
  name="city"
  className="form-control mb-3"
  placeholder="City"
  value={form.city}
  onChange={handleChange}
/>

<input
  type="text"
  name="pincode"
  className="form-control mb-3"
  placeholder="Pincode"
  value={form.pincode}
  onChange={handleChange}
/>

<input
  type="password"
  name="password"
  className="form-control mb-3"
  placeholder="Password"
  value={form.password}
  onChange={handleChange}
/>

<input
  type="password"
  name="confirmPassword"
  className="form-control mb-4"
  placeholder="Confirm Password"
  value={form.confirmPassword}
  onChange={handleChange}
/>

<button
  className="btn text-white w-100"
  style={{
    background:
      "linear-gradient(90deg,#6a11cb,#2575fc)",
    height: "50px",
    borderRadius: "10px"
  }}
  onClick={handleSubmit}
>
  Register
</button>

<div className="text-center mt-4">
  Already have an account?
 <Link
  to="/login"
  className="ms-2 text-decoration-none"
>
  Login
</Link>
</div>

      </div>
    </div>

    {/* Right Side */}
    <div
      className="col-md-6 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg,#6a11cb,#2575fc)"
      }}
    >
      <img
        src={doctorImage}
        alt="Doctor"
        className="img-fluid"
        style={{
          maxHeight: "700px"
        }}
      />
    </div>

  </div>
</div>
  );
}

export default Register;