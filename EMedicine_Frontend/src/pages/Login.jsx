import { useState } from "react";
import { getUserId } from "../services/auth";
import api from "../services/api";
import doctorImage from "../assets/login-doctor.jpg";
import { toast } from "react-toastify";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    try {
      const response = await api.post("/Auth/login", form);


      const token = response.data.token;

      localStorage.setItem("token", token);

      const userId = getUserId();

      console.log("User Id:", userId);

      localStorage.setItem("userId", userId);

     toast.success("Login Successful");

setTimeout(() => {
  window.location.href = "/medicines";
}, 1500);

    } 

    catch (error) {
  console.log(error.response?.data);
  console.log(error.response?.status);
  toast.error("Invalid Email or Password");
}

  };

  return (
  <div className="container-fluid vh-100">
    <div className="row h-100">

      {/* Left Side */}
      <div className="col-md-6 d-flex align-items-center justify-content-center">
        <div
          className="card shadow-lg p-5 border-0"
          style={{ width: "500px", borderRadius: "20px" }}
        >
          <h1 className="mb-3 fw-bold">
            Welcome Back 👋
          </h1>

          <p className="text-muted mb-4">
            Please sign in to your account
          </p>

          <input
            type="email"
            name="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            className="form-control mb-4"
            placeholder="Enter your password"
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
            onClick={handleLogin}
          >
            Sign In
          </button>

          <div className="text-center mt-4">
            Don't have an account?
            <a
              href="/register"
              className="ms-2 text-decoration-none"
            >
              Register
            </a>
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
  src="/src/assets/login-doctor.jpg"
  alt="Doctor"
  width="500"
/>
      </div>

    </div>
  </div>
);
}

export default Login;