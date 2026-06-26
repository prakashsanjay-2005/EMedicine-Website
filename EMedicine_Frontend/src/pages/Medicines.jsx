import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getMedicines();
  }, []);

  const getMedicines = async () => {
    try {
      const response = await api.get("/Medicines");
      setMedicines(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const addToCart = async (medicineId) => {
  try {
    const token = localStorage.getItem("token");

    const userId = localStorage.getItem("userId");
    
   await api.post(
  `/Cart/add?userId=${userId}&medicineId=${medicineId}&quantity=1`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Added to Cart");
  } catch (error) {
    console.log(error);
   toast.error("Failed to add to Cart");
  }
};

  return (
    <div className="container mt-4">
      <h1 className="text-center fw-bold mb-4">
       Medicines
      </h1>

  <div
  className="p-4 mb-4 text-white rounded shadow"
  style={{
    background:
      "linear-gradient(135deg,#0d6efd,#20c997)"
  }}
>
  <h2>💊 Online Pharmacy</h2>

  <p className="mb-0">
    Order medicines quickly, safely and securely.
  </p>
</div>



    <div className="mb-4">
  <input
    type="text"
    className="form-control shadow-sm"
    placeholder="Search medicines..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>


{medicines.filter((med) =>
  med.name.toLowerCase().includes(search.toLowerCase())
).length === 0 && (
  <div className="alert alert-warning">
    No medicines found.
  </div>
)}

  <div className="row">
    {medicines
  .filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase())
  )
  .map((med) => (
      <div key={med.id} className="col-md-4 mb-4">

        <div className="card shadow border-0 h-100">

          <img
  src={`https://localhost:7178${med.imageUrl}`}
  className="card-img-top"
  alt={med.name}
  style={{
    height: "220px",
    objectFit: "cover"
  }}
/>

          <div className="card-body">

            <h5 className="card-title">
              {med.name}
            </h5>

            <p className="card-text">
              {med.description}
            </p>

            <p>
              <strong className="text-success">
             ₹ {med.price}
             </strong>
            </p>

           <p>
  {med.stock > 0 ? (
    <span className="badge bg-success">
  Stock: {med.stock}
</span>
  ) : (
    <span className="badge bg-danger">
  Out of Stock
</span>
  )}
</p>

           <button
  className="btn btn-success w-100"
  disabled={med.stock <= 0}
              onClick={() => addToCart(med.id)}
            >
              Add To Cart
            </button>

          </div>

        </div>

      </div>
    ))}
  </div>
</div>
  );
}

export default Medicines;