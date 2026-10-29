import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getProductById,
  updateProduct
} from "../services/productApi";

import "./EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: ""
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Get existing product
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await getProductById(id);

      const product = response.data;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        image: product.image || ""
      });
    } catch (error) {
      console.error(error);
      setError("Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setUpdating(true);

    try {
      const updatedProduct = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        image: formData.image.trim()
      };

      await updateProduct(id, updatedProduct);

      alert("Product updated successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      setError("Failed to update product.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-product-loading">
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="edit-product-error">
        <h2>{error}</h2>

        <button
          onClick={() =>
            navigate("/admin/products")
          }
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="edit-product">
      <div className="edit-product-container">

        <h1>Edit Product</h1>

        <form onSubmit={handleSubmit}>

          {/* Product Name */}

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

          {/* Description */}

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

          {/* Price */}

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

          {/* Category */}

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

          {/* Image */}

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
            <p className="edit-product-error-text">
              {error}
            </p>
          )}

          {/* Buttons */}

          <div className="edit-product-buttons">

            <button
              type="submit"
              disabled={updating}
            >
              {updating
                ? "Updating..."
                : "Update Product"}
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

export default EditProduct;