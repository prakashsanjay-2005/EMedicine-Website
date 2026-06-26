import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function AdminMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
  id: 0,
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: ""
});

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const response = await api.get("/Medicines");
      setMedicines(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const uploadImage = async () => {
  if (!imageFile) {
    alert("Select an image");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await api.post(
      "/Medicines/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setForm({
      ...form,
      imageUrl: response.data.imageUrl,
    });

    toast.success("Image Uploaded");
  } catch (error) {
    console.log(error);
    toast.error("Image Upload Failed");
  }
};


  const addMedicine = async () => {
      
      if (
  !form.name ||
  !form.description ||
  !form.price ||
  !form.stock
) {
  alert("Please fill all fields");
  return;
}

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/Medicines",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Medicine Added");

     setForm({
  id: 0,
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: ""
});

      loadMedicines();
    } 
    
  catch (error) {
  console.log(JSON.stringify(error.response?.data, null, 2));
  alert("Failed to add medicine");
}

  };

  const deleteMedicine = async (id) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    await api.delete(`/Medicines/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Medicine Deleted");
    loadMedicines();
  } catch (error) {
  console.log(error.response);
 toast.success("Medicine Deleted");
}
};

const editMedicine = (medicine) => {
  setForm({
    id: medicine.id,
    name: medicine.name,
    description: medicine.description,
    price: medicine.price,
    stock: medicine.stock,
    imageUrl: medicine.imageUrl || ""
  });
};

const updateMedicine = async () => {
  try {
    const token = localStorage.getItem("token");

    await api.put(
      `/Medicines/${form.id}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Medicine Updated");

   setForm({
  id: 0,
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: ""
});

    loadMedicines();
  } catch (error) {
    console.log(error);
    alert("Update Failed");
  }
};

  return (
    <div>
      <h1>Admin Medicines</h1>

      <div className="card shadow border-0 mb-4">
  <div className="card-body">
    <h3 className="mb-4">💊 Add New Medicine</h3>

    <input
  type="text"
  name="name"
  className="form-control mb-3"
  placeholder="Medicine Name"
  value={form.name}
  onChange={handleChange}
/>

      <br /><br />

      <input
        type="text"
        name="description"
        className="form-control mb-3"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="number"
        name="price"
        className="form-control mb-3"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="number"
        name="stock"
        className="form-control mb-3"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
      />

      <br /><br />

     <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setImageFile(e.target.files[0])
  }
/>

<br /><br />

<label className="form-label fw-bold">
  Medicine Image
</label>

<button
  className="btn btn-info"
  onClick={uploadImage}
>
  Upload Image
</button>

<br /><br />

{form.imageUrl && (
  <div className="mb-3">
    <img
      src={`https://localhost:7178${form.imageUrl}`}
      alt="Preview"
      width="150"
      className="rounded shadow"
    />
  </div>
)}


     {form.id === 0 ? (
  <button
  className="btn btn-primary"
  onClick={addMedicine}
>
  Add Medicine
</button>
) : (


  <button
  className="btn btn-warning"
  onClick={updateMedicine}
>
  Update Medicine
</button>

)}


      </div>
      </div>

      <hr />

      <table className="table table-bordered table-hover shadow">
        <thead className="table-dark">
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
           <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {medicines.map((med) => (
            <tr key={med.id}>
              <td>{med.id}</td>
              <td>{med.name}</td>
              <td>{med.description}</td>
              <td>{med.price}</td>
              <td>{med.stock}</td>
              <td>
  <img
  src={`https://localhost:7178${med.imageUrl}`}
  alt={med.name}
  width="80"
  height="80"
  className="rounded"
  style={{ objectFit: "cover" }}
/>
</td>

<td>
  <button
  className="btn btn-warning btn-sm me-2"
  onClick={() => editMedicine(med)}
>
  Edit
</button>

  <button
  className="btn btn-danger btn-sm"
  onClick={() => deleteMedicine(med.id)}
>
  Delete
</button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminMedicines;