import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <p className="hero-small-title">
          HANDMADE • UNIQUE • BEAUTIFUL
        </p>

        <h1>
          
          <span>Crafted With LOVE</span>
        </h1>

        <p>
          Discover unique handmade crochet products
          created with creativity, care and love.
        </p>

        <Link className="hero-btn" to={"/products"}>
          Explore Collection
        </Link>

      </div>

      <div className="hero-image">
        <img
          src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTMeccKSLTfCnrC0Ja7Hue-LT3MyJW8dpQDP9N4cxAEV0IYkFBwcdp1lC1cUQxTfLgLILPjSRkYdX9KouRUnbfJa9kQKRSeOpAVJaFz_G6orgY0rFOOIq-u"
          alt="Crochet products"
        />
      </div>

    </section>
  );
}

export default Hero;