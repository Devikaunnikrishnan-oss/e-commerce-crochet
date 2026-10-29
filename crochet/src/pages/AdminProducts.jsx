import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  updateProduct
} from "../services/productApi";

import "./AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const navigate = useNavigate();



  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      setProducts(response.data);

    } catch (error) {
      console.error(error);

      setError("Failed to load products.");

    } finally {
      setLoading(false);
    }
  };


 

  let filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  if (category !== "All") {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.category === category
    );
  }


  /* =========================
     TOGGLE PRODUCT STATUS
  ========================= */

  const handleToggleStatus = async (product) => {
    try {
      const newStatus =
        product.isActive !== false;

      await updateProduct(product.id, {
        isActive: !newStatus
      });

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id
            ? {
                ...item,
                isActive: !newStatus
              }
            : item
        )
      );

    } catch (error) {
      console.error(error);

      alert(
        "Failed to update product status."
      );
    }
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="admin-products-loading">

        <div className="admin-products-loader"></div>

        <p>
          Loading products...
        </p>

      </div>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="admin-products-error">

        <h2>
          Something went wrong
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={fetchProducts}
        >
          Try Again
        </button>

      </div>
    );
  }


  return (
    <div className="admin-products-page">


      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="admin-products-top">

        <div>

          <p className="admin-products-eyebrow">
            CATALOG MANAGEMENT
          </p>

          <h1>
            Products
          </h1>

          <p className="admin-products-subtitle">
            Manage your store products,
            pricing and availability.
          </p>

        </div>


        <button
          className="add-product-button"
          onClick={() =>
            navigate(
              "/admin/products/add"
            )
          }
        >
          + Add Product
        </button>

      </div>


     

      <div className="admin-products-toolbar">

        <div className="admin-products-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          className="admin-products-category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="All">
            All Categories
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


      {/* =========================
          RESULTS INFORMATION
      ========================= */}

      <div className="admin-products-results">

        <span>
          Showing{" "}
          <strong>
            {filteredProducts.length}
          </strong>{" "}
          of{" "}
          <strong>
            {products.length}
          </strong>{" "}
          products
        </span>

        <span>
          {products.filter(
            (product) =>
              product.isActive !== false
          ).length}{" "}
          active
        </span>

      </div>


      {/* =========================
          PRODUCT TABLE
      ========================= */}

      {filteredProducts.length === 0 ? (

        <div className="admin-no-products">

          <div className="no-products-icon">
            ◇
          </div>

          <h2>
            No products found
          </h2>

          <p>
            Try changing your search or
            category filter.
          </p>

        </div>

      ) : (

        <div className="admin-products-table">

          {/* =========================
              TABLE HEADER
          ========================= */}

          <div className="admin-products-table-header">

            <span>
              PRODUCT
            </span>

            <span>
              CATEGORY
            </span>

            <span>
              PRICE
            </span>

            <span>
              STATUS
            </span>

            <span>
              ACTIONS
            </span>

          </div>


          {/* =========================
              PRODUCTS
          ========================= */}

          {filteredProducts.map(
            (product) => {

              const isActive =
                product.isActive !== false;

              return (
                <div
                  className="admin-product-row"
                  key={product.id}
                >


                  {/* PRODUCT */}

                  <div className="admin-product-info">

                    <div className="admin-product-image">

                      {product.image ? (

                        <img
                          src={product.image}
                          alt={product.name}
                        />

                      ) : (

                        <span>
                          C
                        </span>

                      )}

                    </div>


                    <div className="admin-product-name">

                      <h2>
                        {product.name}
                      </h2>

                      <p>
                        ID: {product.id}
                      </p>

                    </div>

                  </div>


                  {/* CATEGORY */}

                  <div className="admin-product-category">

                    <span>
                      {product.category}
                    </span>

                  </div>


                  {/* PRICE */}

                  <div className="admin-product-price">

                    ₹
                    {Number(
                      product.price
                    ).toLocaleString("en-IN")}

                  </div>


                  {/* STATUS */}

                  <div>

                    <span
                      className={
                        isActive
                          ? "product-status active"
                          : "product-status inactive"
                      }
                    >

                      <span className="status-dot"></span>

                      {isActive
                        ? "Active"
                        : "Inactive"}

                    </span>

                  </div>


                  {/* ACTIONS */}

                  <div className="admin-product-actions">

                    <button
                      className="product-edit-button"
                      onClick={() =>
                        navigate(
                          `/admin/products/edit/${product.id}`
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      className={
                        isActive
                          ? "product-delete-button"
                          : "product-activate-button"
                      }
                      onClick={() =>
                        handleToggleStatus(
                          product
                        )
                      }
                    >

                      {isActive
                        ? "Delete"
                        : "Activate"}

                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>

      )}

    </div>
  );
}

export default AdminProducts;