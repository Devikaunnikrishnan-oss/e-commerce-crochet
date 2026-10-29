import { useEffect, useState } from "react";
import "./FeaturedProducts.css";
import { getProducts } from "../../services/productApi";
import ProductCard from "../ProductCard/ProductCard";

function FeaturedProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await getProducts();

        setProducts(response.data);

      } catch (error) {

        console.error(error);
        setError("Failed to load products.");

      } finally {

        setLoading(false);

      }
    };

    fetchProducts();

  }, []);

  return (
    <section className="featured" id="featured">

      <div className="section-heading">

        <p>OUR COLLECTION</p>

        <h2>Featured Products</h2>

      </div>

      {loading && (
        <p className="status-message">
          Loading products...
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading && !error && (

        <div className="product-grid">

          {products.slice(0, 6).map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      )}

    </section>
  );
}

export default FeaturedProducts;