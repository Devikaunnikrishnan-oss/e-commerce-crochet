import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProduct, getProducts } from "../services/productApi";

import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      
      const response = await getProducts();

      const products = response.data;

      const duplicateProduct = products.find(
        (product) =>
          product.name.toLowerCase().trim() ===
          formData.name.toLowerCase().trim()
      );

      if (duplicateProduct) {
        setError("Product already exists.");
        setLoading(false);
        return;
      }

      
      const newProduct = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        image: formData.image.trim(),
        isActive: true
      };

      
      await createProduct(newProduct);

      alert("Product added successfully!");

      
      navigate("/admin/products");

    } catch (error) {
      console.error(error);
      setError("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">

      <div className="add-product-container">

        <h1>Add Product</h1>

        <form onSubmit={handleSubmit}>

         
          <div className="form-group">

            <label>Product Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          
          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              required
            />

          </div>

          
          <div className="form-group">

            <label>Price</label>

            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              min="1"
              required
            />

          </div>

          
          <div className="form-group">

            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Category
              </option>

              <option value="Toys">
                Toys
              </option>

              <option value="Flowers">
                Flowers
              </option>

              <option value="Bags">
                Bags
              </option>

              <option value="Accessories">
                Accessories
              </option>

              <option value="Home Decor">
                Home Decor
              </option>
            </select>

          </div>

         
          <div className="form-group">

            <label>Image URL</label>

            <input
              type="text"
              name="image"
              placeholder="Enter image URL"
              value={formData.image}
              onChange={handleChange}
              required
            />

          </div>

          
          {error && (
            <p className="add-product-error">
              {error}
            </p>
          )}

          
          <div className="add-product-buttons">

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/products")
              }
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;