
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { getProducts } from "../services/productApi";
import {
  addToWishlist,
  removeFromWishlist,
  loadWishlist,
} from "../features/wishlistSlice";

import {
  getWishlist,
  saveWishlist,
} from "../services/WishlistStorage";

import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // Load the current user's wishlist.
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedWishlist = getWishlist(user.id);
      dispatch(loadWishlist(savedWishlist));
    } else {
      dispatch(loadWishlist([]));
    }
  }, [user, isAuthenticated, dispatch]);

  // Fetch products from JSON Server.
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();

      const activeProducts = response.data.filter(
        (product) => product.isActive !== false
      );

      setProducts(activeProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Unable to load products.");
    }
  };

  // Check whether a product is in the wishlist.
  const isWishlisted = (productId) => {
    return wishlistItems.some(
      (item) => String(item.id) === String(productId)
    );
  };

  // Add or remove a product from the wishlist.
  const handleWishlist = (event, product) => {
    event.stopPropagation();

    if (!isAuthenticated || !user) {
      toast.error("Please login to use your wishlist.");
      navigate("/login");
      return;
    }

    const savedWishlist = getWishlist(user.id);

    const alreadyExists = savedWishlist.some(
      (item) => String(item.id) === String(product.id)
    );

    if (alreadyExists) {
      const updatedWishlist = savedWishlist.filter(
        (item) => String(item.id) !== String(product.id)
      );

      saveWishlist(user.id, updatedWishlist);
      dispatch(removeFromWishlist(product.id));

      toast.success("Removed from wishlist");
    } else {
      const updatedWishlist = [...savedWishlist, product];

      saveWishlist(user.id, updatedWishlist);
      dispatch(addToWishlist(product));

      toast.success("Added to wishlist");
    }
  };

  const featuredProducts = products.slice(0, 5);

  return (
    <div className="home-page">
      <div className="promo-bar">
        <p>
          HANDMADE WITH LOVE — FREE SHIPPING
          ON ORDERS ABOVE ₹999
        </p>
      </div>

      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-small-title">
            HANDMADE • UNIQUE • TIMELESS
          </p>

          <h1>
            Handmade with love,
            <br />
            stitched with care.
          </h1>

          <p className="hero-description">
            Discover beautiful crochet creations
            made by hand with patience, creativity,
            and lots of love.
          </p>

          <button
            className="hero-button"
            onClick={() => navigate("/products")}
          >
            Shop Collection <span>→</span>
          </button>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80"
            alt="Handmade crochet creation"
          />

          <div className="hero-badge">
            <span>♡</span>
            <p>
              Made
              <br />
              with love
            </p>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="benefit">
          <div className="benefit-icon">♡</div>
          <div>
            <h3>Handmade</h3>
            <p>Every piece is carefully crafted by hand.</p>
          </div>
        </div>

        <div className="benefit">
          <div className="benefit-icon">♧</div>
          <div>
            <h3>Thoughtfully Made</h3>
            <p>
              Created with quality yarn and attention to detail.
            </p>
          </div>
        </div>

        <div className="benefit">
          <div className="benefit-icon">✧</div>
          <div>
            <h3>Made to Last</h3>
            <p>
              Beautiful creations designed to be treasured.
            </p>
          </div>
        </div>
      </section>

      <section className="category-section">
        <div className="section-heading">
          <p className="section-label">EXPLORE</p>
          <h2>Shop by Category</h2>
          <p>Find something special for every occasion.</p>
        </div>

        <div className="category-grid">
          <button
            className="category-card category-one"
            onClick={() => navigate("/products")}
          >
            <div>
              <span>01</span>
              <h3>Toys</h3>
              <p>Cute handmade companions</p>
            </div>
            <span className="category-arrow">→</span>
          </button>

          <button
            className="category-card category-two"
            onClick={() => navigate("/products")}
          >
            <div>
              <span>02</span>
              <h3>Flowers</h3>
              <p>Flowers that never fade</p>
            </div>
            <span className="category-arrow">→</span>
          </button>

          <button
            className="category-card category-three"
            onClick={() => navigate("/products")}
          >
            <div>
              <span>03</span>
              <h3>Bags</h3>
              <p>Everyday handmade style</p>
            </div>
            <span className="category-arrow">→</span>
          </button>

          <button
            className="category-card category-four"
            onClick={() => navigate("/products")}
          >
            <div>
              <span>04</span>
              <h3>Accessories</h3>
              <p>Small details, big charm</p>
            </div>
            <span className="category-arrow">→</span>
          </button>
        </div>
      </section>

      <section className="featured-section">
        <div className="featured-header">
          <div>
            <p className="section-label">OUR FAVOURITES</p>
            <h2>Featured Creations</h2>
            <p>A few of our most loved handmade pieces.</p>
          </div>

          <button
            className="view-all-button"
            onClick={() => navigate("/products")}
          >
            View All Products →
          </button>
        </div>

        <div className="featured-grid">
          {featuredProducts.map((product) => {
            const wishlisted = isWishlisted(product.id);

            return (
              <div
                className="home-product-card"
                key={product.id}
                onClick={() =>
                  navigate(`/products/${product.id}`)
                }
              >
                <div className="product-image-box">
                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <button
                    type="button"
                    className={`product-heart ${
                      wishlisted ? "active" : ""
                    }`}
                    onClick={(event) =>
                      handleWishlist(event, product)
                    }
                    aria-label={
                      wishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    aria-pressed={wishlisted}
                  >
                    {wishlisted ? "♥" : "♡"}
                  </button>
                </div>

                <div className="product-info">
                  <p className="product-category">
                    {product.category}
                  </p>

                  <h3>{product.name}</h3>

                  <p className="product-description">
                    {product.description}
                  </p>

                  <div className="product-bottom">
                    <span className="product-price">
                      ₹{product.price}
                    </span>

                    <span className="product-view">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {featuredProducts.length === 0 && (
          <p className="empty-products">
            Products are coming soon...
          </p>
        )}
      </section>

      <section className="story-section">
        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1595816173454-9d6a1d6f4c76?auto=format&fit=crop&w=1000&q=80"
            alt="Crochet handmade work"
          />
        </div>

        <div className="story-content">
          <p className="section-label">OUR STORY</p>

          <h2>
            Made slowly.
            <br />
            Made beautifully.
          </h2>

          <p>
            Crochet is more than just yarn and stitches.
            Every piece takes time, patience, and creativity.
          </p>

          <p>
            At CROCHETSTORE, we believe that handmade
            products carry something special — a little
            piece of the person who created them.
          </p>

          <button
            className="story-button"
            onClick={() => navigate("/products")}
          >
            Explore Our Collection →
          </button>
        </div>
      </section>

      <section className="newsletter-section">
        <p className="section-label">STAY IN THE LOOP</p>
        <h2>Join the CROCHETSTORE family</h2>
        <p>
          Get updates about new creations, special offers
          and handmade stories.
        </p>

        <div className="newsletter-form">
          <input
            type="email"
            placeholder="Your email address"
          />
          <button type="button">Subscribe</button>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-brand">
          <h3>CROCHETSTORE</h3>
          <p>
            Handmade creations crafted with love,
            one stitch at a time.
          </p>
        </div>

        <div className="footer-column">
          <h4>SHOP</h4>
          <button onClick={() => navigate("/products")}>
            All Products
          </button>
          <button onClick={() => navigate("/products")}>
            New Arrivals
          </button>
          <button onClick={() => navigate("/wishlist")}>
            Wishlist
          </button>
        </div>

        <div className="footer-column">
          <h4>HELP</h4>
          <button type="button">Contact</button>
          <button type="button">Shipping</button>
          <button type="button">Returns</button>
        </div>

        <div className="footer-column">
          <h4>FOLLOW US</h4>
          <div className="social-links">
            <span>Instagram</span>
            <span>Facebook</span>
          </div>
        </div>
      </footer>

      <div className="footer-bottom">
        <p>© 2026 CROCHETSTORE. All rights reserved.</p>
        <p>Handmade with ♡</p>
      </div>
    </div>
  );
}

export default Home;