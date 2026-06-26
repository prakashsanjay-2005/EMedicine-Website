import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function Cart() {
  const [items, setItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
  loadCart();
  loadUser();
}, []);

  const loadCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const userId = localStorage.getItem("userId");

      const response = await api.get(`/Cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const placeOrder = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    await api.post(
      `/Orders/place?userId=${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   toast.success("Order Placed Successfully");
    loadCart();
  } catch (error) {
    console.log(error);
   toast.error("Failed to Place Order");
  }
};

const increaseQuantity = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await api.put(
      `/Cart/increase/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    loadCart();
  } catch (error) {
    console.log(error);
  }
};

const decreaseQuantity = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await api.put(
      `/Cart/decrease/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    loadCart();
  } catch (error) {
    console.log(error);
  }
};

const removeItem = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await api.delete(
      `/Cart/remove/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    loadCart();
  } catch (error) {
    console.log(error);
  }
};

const loadUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const response = await api.get(`/Users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setUser(response.data);
  } catch (error) {
    console.log(error);
  }
};



  return (
    <div className="container mt-4">
      <h1>My Cart</h1>

      <div
  className="p-4 mb-4 text-white rounded shadow"
  style={{
    background:
      "linear-gradient(135deg,#198754,#20c997)"
  }}
>
  <h2>🛒 Shopping Cart</h2>
  <p className="mb-0">
    Review your medicines before placing an order.
  </p>
</div>

{items.length === 0 && (
  <div className="alert alert-info">
    Your cart is empty.
  </div>
)}

      <table className="table table-hover shadow">
        <thead className="table-dark">
          <tr>
  <th>Image</th>
  <th>Medicine</th>
  <th>Price</th>
  <th>Quantity</th>
  <th>Total</th>
  <th>Remove</th>
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
  className="rounded"
  style={{ objectFit: "cover" }}
/>
  </td>

  <td>{item.medicineName}</td>

  <td>₹ {item.price}</td>

  <td>
    <button
      className="btn btn-warning btn-sm"
      onClick={() => decreaseQuantity(item.id)}
    >
      -
    </button>

    <span className="mx-3">
      {item.quantity}
    </span>

    <button
      className="btn btn-success btn-sm"
      onClick={() => increaseQuantity(item.id)}
    >
      +
    </button>
  </td>

  <td>
    ₹ {item.price * item.quantity}
  </td>

  <td>
    <button
      className="btn btn-outline-danger btn-sm"
      onClick={() => removeItem(item.id)}
    >
      Remove
    </button>
  </td>

</tr>
          ))}
        </tbody>
      </table>
      <br />


     <div className="card bg-success text-white mt-4">
  <div className="card-body text-center">
    <h4>Grand Total</h4>

    <h2>
      ₹ {items.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      )}
    </h2>
  </div>
</div>

<br />

<button
  className="btn btn-primary btn-lg w-100"
  onClick={() => setShowCheckout(true)}
>
  Place Order
</button> 

{showCheckout && user && (
  <div
    className="modal fade show d-block"
    style={{ background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog">
      <div className="modal-content">

        <div className="modal-header">
          <h4>Confirm Delivery Address</h4>
        </div>

        <div className="modal-body">

          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>

          <p><strong>Phone:</strong> {user.phoneNumber}</p>

          <p><strong>Address:</strong> {user.address}</p>

          <p><strong>City:</strong> {user.city}</p>

          <p><strong>Pincode:</strong> {user.pincode}</p>

          <hr />

          <h4>
            Grand Total :
            ₹ {items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            )}
          </h4>

        </div>

        <div className="modal-footer">

          <button
            className="btn btn-secondary"
            onClick={() => setShowCheckout(false)}
          >
            Cancel
          </button>

          <button
            className="btn btn-success"
            onClick={() => {
              setShowCheckout(false);
              placeOrder();
            }}
          >
            Confirm Order
          </button>

        </div>

      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default Cart;