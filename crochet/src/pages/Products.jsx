
import { useEffect, useState } from "react";
import { getProducts } from "../services/productApi";
import ProductCard from "../components/ProductCard/ProductCard";

import "./Products.css";

const PRODUCTS_PER_PAGE = 8;

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from JSON Server
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      const activeProducts = response.data.filter(
        (product) => product.isActive !== false
      );

      setProducts(activeProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sortBy]);

  // Search and category filtering
  let filteredProducts = products.filter((product) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      (product.name || "").toLowerCase().includes(searchText) ||
      (product.category || "").toLowerCase().includes(searchText) ||
      (product.description || "").toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  // Sorting
  if (sortBy === "price-low") {
    filteredProducts.sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  } else if (sortBy === "price-high") {
    filteredProducts.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  } else if (sortBy === "name-az") {
    filteredProducts.sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );
  }

  // Pagination
  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="products-loading">
        Loading crochet creations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button type="button" onClick={fetchProducts}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Page heading */}
      <header className="shop-header">
        <p className="shop-label">HANDMADE WITH LOVE</p>

        <h1>Our Collections</h1>

        <p className="shop-description">
          Explore our collection of handmade crochet creations,
          thoughtfully crafted to bring warmth and joy to your life.
        </p>
      </header>

      {/* Search, category and sorting */}
      <section className="products-controls">
        <div className="search-wrapper">
          <input
            type="search"
            placeholder="Search crochet products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
        </div>

        <div className="filter-group">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            <option value="Bags">Bags</option>
            <option value="Amigurumi">Amigurumi</option>
            <option value="Home Decor">Home Decor</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Default Sorting</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
          </select>
        </div>
      </section>

      {/* Results count */}
      <div className="products-results">
        <p>
          Showing {filteredProducts.length === 0 ? 0 : startIndex + 1}
          {"–"}
          {Math.min(
            startIndex + PRODUCTS_PER_PAGE,
            filteredProducts.length
          )}{" "}
          of {filteredProducts.length} products
        </p>
      </div>

      {/* Product grid */}
      {displayedProducts.length > 0 ? (
        <div className="products-grid">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <div className="empty-icon">♡</div>

          <h2>No products found</h2>

          <p>
            Try another search or choose a different category.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setSortBy("default");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="products-pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((page) => page - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => page + 1)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;