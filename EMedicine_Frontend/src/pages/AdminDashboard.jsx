import { useEffect, useState } from "react";
import api from "../services/api";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);


function AdminDashboard() {

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    medicines: 0,
    orders: 0,
    pending: 0,
    completed: 0,
    revenue: 0
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const medicinesRes = await api.get("/Medicines");

      const ordersRes = await api.get("/Orders/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const orders = ordersRes.data;
      setOrders(orders);  


     const revenue = orders.reduce(
  (sum, order) => sum + order.totalAmount,
  0
);

setStats({
  medicines: medicinesRes.data.length,
  orders: orders.length,
  pending: orders.filter(x => x.status === "Pending").length,
  completed: orders.filter(x => x.status === "Completed").length,
  revenue
});

    } catch (error) {
      console.log(error);
    }
  };

  const pieData = {
  labels: ["Pending Orders", "Completed Orders"],
  datasets: [
    {
      data: [
        stats.pending,
        stats.completed
      ],
      backgroundColor: [
        "#ffc107",
        "#198754"
      ]
    }
  ]
};


  return (


    <div className="container mt-4">
      <h1 className="text-center mb-4">
        Admin Dashboard
      </h1>


      <div className="mb-4">
  <h3>Welcome Back, Admin 👋</h3>
  <p className="text-muted">
    Here's what's happening in your store today.
  </p>
</div>

      <div
  className="p-4 mb-4 text-white rounded shadow"
  style={{
    background:
      "linear-gradient(135deg,#6a11cb,#2575fc)"
  }}
>


  <h2>E-Medicine Admin Panel</h2>
  <p className="mb-0">
    Monitor medicines, orders, users and revenue.
  </p>
</div>

      <div className="row">

        <div className="col-md-2 mb-3">
          <div className="card bg-primary text-white text-center shadow">
            <div className="card-body">
              <h5>Total Medicines</h5>
              <h2>{stats.medicines}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-info text-white text-center shadow">
            <div className="card-body">
              <h5>Total Orders</h5>
              <h2>{stats.orders}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-warning text-dark text-center shadow">
            <div className="card-body">
              <h5>Pending Orders</h5>
              <h2>{stats.pending}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-success text-white text-center shadow">
            <div className="card-body">
              <h5>Completed Orders</h5>
              <h2>{stats.completed}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
  <div className="card bg-dark text-white text-center shadow">
    <div className="card-body">
      <h5>Total Revenue</h5>
      <h2>₹ {stats.revenue}</h2>
    </div>
  </div>
</div>

      </div>

      <div className="row mt-5">
  <div className="col-md-6 mx-auto">
    <div className="card shadow">
      <div className="card-body">
        <h4 className="text-center mb-3">
          Orders Overview
        </h4>

        <Pie data={pieData} />
      </div>
    </div>
  </div>
</div>


<div className="card shadow mt-4">
  <div className="card-body">
    <h4>Recent Orders</h4>

    <table className="table table-striped">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {orders.slice(0, 5).map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>₹ {order.totalAmount}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>




    </div>

    
  );
}

export default AdminDashboard;