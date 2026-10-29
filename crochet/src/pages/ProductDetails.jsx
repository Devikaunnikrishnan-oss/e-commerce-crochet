import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getProductById } from "../services/productApi";
import { addToCart } from "../features/cartSlice";

import {
  getCart,
  saveCart
} from "../services/cartStorage";

import "./ProductDetails.css";

import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user, isAuthenticated } =
    useSelector((state) => state.auth);


  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response =
          await getProductById(id);

        setProduct(response.data);

      } catch (error) {
        console.error(error);

        setError("Product not found.");

      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

  }, [id]);



  const increaseQuantity = () => {
    setQuantity(
      (previousQuantity) =>
        previousQuantity + 1
    );
  };


  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(
        (previousQuantity) =>
          previousQuantity - 1
      );
    }
  };


  const handleAddToCart = () => {

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }


    if (!product || !user) {
      return;
    }


    const existingCart =
      getCart(user.id);


    const existingProduct =
      existingCart.find(
        (item) =>
          item.id === product.id
      );


    let updatedCart;


    if (existingProduct) {

      updatedCart =
        existingCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity +
                  quantity
              }
            : item
        );

    } else {

      updatedCart = [
        ...existingCart,

        {
          ...product,
          quantity: quantity
        }
      ];

    }


    saveCart(
      user.id,
      updatedCart
    );


    dispatch(
      addToCart({
        ...product,
        quantity: quantity
      })
    );


    toast.success(
      "Product added to cart!"
    );


    navigate("/cart");
  };



  if (loading) {
    return (
      <div className="product-details-status">

        <div className="loading-circle"></div>

        <p>
          Loading product...
        </p>

      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-status">

        <div className="error-symbol">
          ♡
        </div>

        <h2>
          {error ||
            "Product not found."}
        </h2>

        <button
          onClick={() =>
            navigate("/products")
          }
        >
          Back to Collection
        </button>

      </div>
    );
  }


  return (
    <div className="product-details-page">


      <div className="product-breadcrumb">

        <button
          onClick={() =>
            navigate("/")
          }
        >
          Home
        </button>

        <span>/</span>

        <button
          onClick={() =>
            navigate("/products")
          }
        >
          Shop
        </button>

        <span>/</span>

        <span>
          {product.name}
        </span>

      </div>

      <main className="product-details">

        <div className="product-details-image-wrapper">

          <div className="product-details-image">

            <img
              src={product.image}
              alt={product.name}
            />

          </div>


          <div className="handmade-tag">

            <span>♡</span>

            <div>
              <strong>
                Handmade
              </strong>

              <small>
                Made with care
              </small>
            </div>

          </div>

        </div>



        <div className="product-details-info">


          <p className="details-category">
            {product.category}
          </p>


          <h1>
            {product.name}
          </h1>


          <p className="details-price">
            ₹{product.price}
          </p>


          <div className="details-divider"></div>


          <p className="details-description">
            {product.description}
          </p>


          

          <div className="quantity-section">

            <p>
              Quantity
            </p>


            <div className="quantity-controls">

              <button
                onClick={
                  decreaseQuantity
                }
                aria-label="Decrease quantity"
              >
                −
              </button>


              <span>
                {quantity}
              </span>


              <button
                onClick={
                  increaseQuantity
                }
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>

          </div>


          
          <button
            className="add-cart-btn"
            onClick={
              handleAddToCart
            }
          >
            <span>
              Add to Cart
            </span>

            <span>
              →
            </span>
          </button>


          

          <div className="product-features">


            <div className="product-feature">

              <span className="feature-icon">
                ♡
              </span>

              <div>

                <strong>
                  Handmade
                </strong>

                <p>
                  Carefully crafted
                  with attention to detail.
                </p>

              </div>

            </div>


            <div className="product-feature">

              <span className="feature-icon">
                ✧
              </span>

              <div>

                <strong>
                  Quality Materials
                </strong>

                <p>
                  Made using carefully
                  selected yarn.
                </p>

              </div>

            </div>


            <div className="product-feature">

              <span className="feature-icon">
                ♧
              </span>

              <div>

                <strong>
                  Thoughtfully Made
                </strong>

                <p>
                  Created to be enjoyed
                  for a long time.
                </p>

              </div>

            </div>


          </div>

        </div>

      </main>


      

      <section className="product-note">

        <div>

          <p className="note-label">
            A LITTLE MORE ABOUT
          </p>

          <h2>
            Made especially for you.
          </h2>

        </div>

        <p>
          Every crochet creation is
          made with patience and care.
          Because handmade pieces aren't
          just products — they're little
          pieces of creativity made to
          bring joy.
        </p>

      </section>


    </div>
  );
}

export default ProductDetails;