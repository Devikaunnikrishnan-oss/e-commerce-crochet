import "./CategorySection.css";

function CategorySection() {

  const categories = [
    {
      name: "Bags",
      icon: "👜"
    },
    {
      name: "Amigurumi",
      icon: "🧸"
    },
    {
      name: "Home Decor",
      icon: "🏠"
    },
    {
      name: "Accessories",
      icon: "🌸"
    }
  ];

  return (
    <section className="categories">

      <div className="section-heading">
        <p>EXPLORE</p>
        <h2>Shop By Category</h2>
      </div>

      <div className="category-grid">

        {categories.map((category) => (
          <div
            className="category-card"
            key={category.name}
          >
            <div className="category-icon">
              {category.icon}
            </div>

            <h3>{category.name}</h3>

            <span>EXPLORE</span>
          </div>
        ))}

      </div>

    </section>
  );
}

export default CategorySection;