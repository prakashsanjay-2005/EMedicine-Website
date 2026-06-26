import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/Orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const completeOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/Orders/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order Completed");

      loadOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to Complete Order");
    }
  };

  const viewItems = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(
      `/Orders/${orderId}/items`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setItems(response.data);
  } catch (error) {
    console.log(error);
  }
};

  return (

    <div className="container mt-4">
     <h1 className="fw-bold mb-4">
  Admin Orders
</h1>

      <div
  className="p-4 mb-4 text-white rounded shadow"
  style={{
    background:
      "linear-gradient(135deg,#198754,#0dcaf0)"
  }}
>
  <h2>📦 Order Management</h2>
  <p className="mb-0">
    Manage customer orders and track deliveries.
  </p>
</div>

  <div className="row mb-4">

  <div className="col-md-4">
    <div className="card bg-primary text-white">
      <div className="card-body text-center">
        <h5>Total Orders</h5>
        <h2>{orders.length}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-4">
    <div className="card bg-warning">
      <div className="card-body text-center">
        <h5>Pending</h5>
        <h2>
          {orders.filter(x => x.status === "Pending").length}
        </h2>
      </div>
    </div>
  </div>

  <div className="col-md-4">
    <div className="card bg-success text-white">
      <div className="card-body text-center">
        <h5>Completed</h5>
        <h2>
          {orders.filter(x => x.status === "Completed").length}
        </h2>
      </div>
    </div>
  </div>

</div>


      <div className="table-responsive">
<table className="table table-hover shadow">
       <thead className="table-dark">
          <tr>
            <th>Order Id</th>
            <th>User Id</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Action</th>
            <th>Order Date</th>
          </tr>
        </thead>


        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userId}</td>
              <td>{order.totalAmount}</td>

              <td>
  {order.status === "Completed" ? (
    <span className="badge bg-success">
      Completed
    </span>
  ) : (
    <span className="badge bg-warning text-dark">
      Pending
    </span>
  )}
</td>

             <td>
  <button
    className="btn btn-primary btn-sm me-2"
    onClick={() => viewItems(order.id)}
  >
    View Items
  </button>

  <button
    disabled={order.status === "Completed"}
    className="btn btn-success btn-sm"
    onClick={() => completeOrder(order.id)}
  >
    Complete
  </button>
</td>

<td>
  {new Date(order.orderDate).toLocaleString()}
</td>


            </tr>
          ))}
        </tbody>
      </table>
      </div>
    <hr />

    <div className="card shadow mt-4">
  <div className="card-body">

    <h3 className="mb-3">
      Order Items
    </h3>

    {items.length === 0 ? (
      <div className="alert alert-info">
        Click "View Items" to see order details.
      </div>
    ) : (
      <table className="table table-bordered">





      <thead className="table-secondary">
        <tr>
          <th>Medicine Name</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.medicineName}</td>
            <td>{item.quantity}</td>
            <td>₹ {item.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
    )}

  </div>
</div>

</div>    
  );
}

export default AdminOrders;