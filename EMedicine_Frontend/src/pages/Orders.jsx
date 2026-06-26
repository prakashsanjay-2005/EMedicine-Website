import { useEffect, useState } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await api.get(`/Orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [items, setItems] = useState([]);
const [selectedOrderId, setSelectedOrderId] = useState(null);


  const loadOrderItems = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(
      `/Orders/${orderId}/items`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSelectedOrderId(orderId);
    setItems(response.data);
  } catch (error) {
    console.log(error);
  }
};

const downloadPdf = async (order) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(
      `/Orders/${order.id}/items`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const orderItems = response.data;

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("E-Medicine Invoice", 70, 20);

    doc.setFontSize(12);

    doc.text(`Order ID: ${order.id}`, 20, 40);

    doc.text(
      `Date: ${new Date(
        order.orderDate
      ).toLocaleString()}`,
      20,
      50
    );

    doc.text(
      `Status: ${order.status}`,
      20,
      60
    );

   autoTable(doc, {
  startY: 75,
  head: [["Medicine", "Qty", "Price", "Total"]],
  body: orderItems.map((item) => [
    item.medicineName,
    item.quantity,
    `Rs. ${item.price}`,
    `Rs. ${item.price * item.quantity}`,
  ]),
});

    doc.text(
  `Grand Total: Rs. ${order.totalAmount}`,
  20,
  doc.lastAutoTable.finalY + 20
);

    doc.save(`Order_${order.id}.pdf`);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div>
      <h1>My Orders</h1>

      <table className="table table-bordered table-striped">
        <thead>
         <tr>
  <th>Order Id</th>
  <th>Order Date</th>
  <th>Total Amount</th>
  <th>Status</th>
  <th>Action</th>
</tr>
        </thead>

        <tbody>
          {orders.map((order) => (
           <tr key={order.id}>
  <td>{order.id}</td>

  <td>
  {new Date(order.orderDate).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  )}
</td>

  <td>₹ {order.totalAmount}</td>

  <td>
  <span
    className={`badge ${
      order.status === "Completed"
        ? "bg-success"
        : "bg-warning text-dark"
    }`}
  >
    {order.status}
  </span>
</td>
              <td>
   <>
  <button
    className="btn btn-primary btn-sm me-2"
    onClick={() => loadOrderItems(order.id)}
  >
    View Items
  </button>

  <button
    className="btn btn-danger btn-sm"
    onClick={() => downloadPdf(order)}
  >
    PDF
  </button>
</>
  </td>
            </tr>
          ))}
        </tbody>

      </table>

      <hr />

<h3>
  Order Items
  {selectedOrderId && ` (Order #${selectedOrderId})`}
</h3>

<table className="table table-bordered">
  <thead>
    <tr>
      <th>Image</th>
      <th>Medicine</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>Total</th>
    </tr>
  </thead>

  <tbody>
    {items.map((item) => (
      <tr key={item.id}>
        <td>
          <img
  src={`https://localhost:7178${item.imageUrl}`}
  alt={item.medicineName}
  width="80"
  height="80"
/>
        </td>

        <td>{item.medicineName}</td>

        <td>{item.quantity}</td>

        <td>₹ {item.price}</td>

        <td>₹ {item.price * item.quantity}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default Orders;