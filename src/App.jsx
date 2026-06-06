import "./App.css";
import heroImage from "./assets/hero.jpg";

import necklaceImage from "./assets/necklace.jpg";
import ringImage from "./assets/ring.jpg";
import bridalImage from "./assets/bridal.jpg";
import banglesImage from "./assets/bangles.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import whatsappIcon from "./assets/whatsapp.png";
import { Menu, Store, Heart, User } from "lucide-react";
import ramSlide from "./assets/Slides/ram.jpg";
import coupleSlide from "./assets/Slides/couplering.jpg";
import bridalSlide from "./assets/Slides/bridal.jpg";
import earringsSlide from "./assets/Slides/earrings.jpg";
import casualSlide from "./assets/Slides/casual.jpg";

function App() {

  const heroSlides = [
  ramSlide,
  coupleSlide,
  bridalSlide,
  earringsSlide,
  casualSlide,
];

const [currentSlide, setCurrentSlide] = useState(0);
const [isSliderPaused, setIsSliderPaused] = useState(false);

useEffect(() => {
  if (isSliderPaused) return;

  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, 3000);

  return () => clearInterval(interval);
}, [isSliderPaused]);
 const [products, setProducts] = useState([
  {
    id: 1,
    name: "Gold Necklace",
    category: "Gold",
    price: 55000,
    description: "Elegant 22K gold necklace design",
    imageUrl: "necklace.jpg",
  },
  {
    id: 2,
    name: "Diamond Ring",
    category: "Diamond",
    price: 25000,
    description: "Premium diamond ring for special moments",
    imageUrl: "ring.jpg",
  },
  {
    id: 3,
    name: "Bridal Set",
    category: "Bridal",
    price: 150000,
    description: "Traditional bridal jewellery collection",
    imageUrl: "bridal.jpg",
  },
  {
    id: 4,
    name: "Bangles",
    category: "Gold",
    price: 45000,
    description: "Beautiful gold bangles for every occasion",
    imageUrl: "bangles.jpg",
  },
]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

const [loginData, setLoginData] = useState({
  username: "",
  password: "",
});
const [newProduct, setNewProduct] = useState({
  
  name: "",
  category: "",
  price: "",
  description: "",
  imageUrl: "necklace.jpg",
});
useEffect(() => {
  axios
    .get("http://localhost:5232/api/products")
    .then((response) => {
      setProducts(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);
const addProduct = () => {
  axios
    .post("http://localhost:5232/api/products", {
      ...newProduct,
      price: Number(newProduct.price),
    })
    .then((response) => {
      setProducts([...products, response.data]);
      setNewProduct({
        name: "",
        category: "",
        price: "",
        description: "",
        imageUrl: "necklace.jpg",
      });
    });
};

const deleteProduct = (id) => {
  axios
    .delete(`http://localhost:5232/api/products/${id}`)
    .then(() => {
      setProducts(products.filter((product) => product.id !== id));
    });
};

const updateProduct = () => {
  axios
    .put(`http://localhost:5232/api/products/${editingProductId}`, {
      ...newProduct,
      id: editingProductId,
      price: Number(newProduct.price),
    })
    .then((response) => {
      setProducts(
        products.map((product) =>
          product.id === editingProductId ? response.data : product
        )
      );

      setNewProduct({
        name: "",
        category: "",
        price: "",
        description: "",
        imageUrl: "necklace.jpg",
      });

      setEditingProductId(null);
    });
};

const uploadImage = () => {
  if (!selectedFile) {
    alert("Please select an image first");
    return;
  }

  console.log("Selected file:", selectedFile);

  const formData = new FormData();
  formData.append("file", selectedFile);

  axios
    .post("http://localhost:5232/api/upload", formData)
    .then((response) => {
      console.log("Upload response:", response.data);

      setNewProduct({
        ...newProduct,
        imageUrl: response.data.imageUrl,
      });

      alert("Image uploaded successfully");
    })
    .catch((error) => {
      console.error("Upload error:", error);
      alert("Image upload failed");
    });
};

const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(searchText.toLowerCase()) ||
  product.category.toLowerCase().includes(searchText.toLowerCase()) ||
  product.description.toLowerCase().includes(searchText.toLowerCase())
);
const handleLogin = () => {
  if (loginData.username === "admin" && loginData.password === "admin123") {
    setIsAdminLoggedIn(true);
    alert("Admin login successful");
  } else {
    alert("Invalid username or password");
  }
};

const handleLogout = () => {
  setIsAdminLoggedIn(false);
};
const getProductImage = (imageUrl) => {
  if (imageUrl.includes("-")) {
    return `http://localhost:5232/Uploads/${imageUrl}`;
  }

  const localImages = {
    "necklace.jpg": necklaceImage,
    "ring.jpg": ringImage,
    "bridal.jpg": bridalImage,
    "bangles.jpg": banglesImage,
  };

  return localImages[imageUrl];
};
const isAdminPage =
  window.location.pathname.toLowerCase() === "/admin";
  return (
   
    <div className="site">
  <nav className="navbar">
  <div className="nav-left">
    <span className="menu-icon">
      <Menu size={30} />
    </span>

    <input
      type="text"
      placeholder="Search..."
      className="navbar-search"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  </div>

  <div className="brand-logo">Ashish Jewellers</div>

  <div className="nav-right">
    <a href="/" className="nav-icon">
      <Store size={30} />
    </a>

    <a href="#" className="nav-icon">
      <Heart size={30} />
    </a>

    <a href="/admin" className="nav-icon">
      <User size={30} />
    </a>
  </div>
</nav>

<section
  id="home"
  className="hero-slider"
  onMouseEnter={() => setIsSliderPaused(true)}
  onMouseLeave={() => setIsSliderPaused(false)}
>
  {heroSlides.map((slide, index) => (
    <img
      key={index}
      src={slide}
      alt="Jewellery Collection"
      loading={index === 0 ? "eager" : "lazy"}
      className={`slider-image ${index === currentSlide ? "active" : ""}`}
    />
  ))}

  <button
    className="slider-arrow left-arrow"
    onClick={() =>
      setCurrentSlide(
        (currentSlide - 1 + heroSlides.length) % heroSlides.length
      )
    }
  >
    ‹
  </button>

  <button
    className="slider-arrow right-arrow"
    onClick={() =>
      setCurrentSlide((currentSlide + 1) % heroSlides.length)
    }
  >
    ›
  </button>

  <div className="slider-dots">
    {heroSlides.map((_, index) => (
      <button
        key={index}
        className={`slider-dot ${index === currentSlide ? "active-dot" : ""}`}
        onClick={() => setCurrentSlide(index)}
      ></button>
    ))}
  </div>
</section>
      {isAdminPage && (
<section className="login-section">
  <h2>Admin Login</h2>

  <input
    type="text"
    placeholder="Username"
    value={loginData.username}
    onChange={(e) =>
      setLoginData({
        ...loginData,
        username: e.target.value,
      })
    }
  />

  <input
    type="password"
    placeholder="Password"
    value={loginData.password}
    onChange={(e) =>
      setLoginData({
        ...loginData,
        password: e.target.value,
      })
    }
  />

  {isAdminLoggedIn ? (
    <button onClick={handleLogout}>Logout</button>
  ) : (
    <button onClick={handleLogin}>Login</button>
  )}
</section>
  )}
      {isAdminLoggedIn && (
  <section id="admin-form" className="admin-form">
  <h2>{editingProductId ? "Edit Product" : "Add New Product"}</h2>
  

  <input
    type="text"
    placeholder="Product Name"
    value={newProduct.name}
    onChange={(e) =>
      setNewProduct({ ...newProduct, name: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Category"
    value={newProduct.category}
    onChange={(e) =>
      setNewProduct({ ...newProduct, category: e.target.value })
    }
  />

  <input
    type="number"
    placeholder="Price"
    value={newProduct.price}
    onChange={(e) =>
      setNewProduct({ ...newProduct, price: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Description"
    value={newProduct.description}
    onChange={(e) =>
      setNewProduct({ ...newProduct, description: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Image Name"
    value={newProduct.imageUrl}
    onChange={(e) =>
      setNewProduct({ ...newProduct, imageUrl: e.target.value })
    }
  />
<input
  type="file"
  onChange={(e) => setSelectedFile(e.target.files[0])}
/>

<button type="button" onClick={uploadImage}>
  Upload Image
</button>
<button onClick={editingProductId ? updateProduct : addProduct}>
  {editingProductId ? "Update Product" : "Add Product"}
</button>
</section>
)}
      <section id="collections" className="collections">
  <h2>Our Collections</h2>

  <h3>Total Products: {products.length}</h3>

  <div className="cards">
    {products.length > 0 ? (
      filteredProducts.map((product) => {
        return (
           
          <div className="card" key={product.id}>
            <img
  src={getProductImage(product.imageUrl)}
  alt={product.name}
  className="card-image"
/>
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>{product.description}</p>
            <p>
              <strong>₹{product.price}</strong>
            </p>
            <button>Enquire Now</button>
            {isAdminLoggedIn && (
  <>
    <button onClick={() => deleteProduct(product.id)}>
      Delete
    </button>

    <button
      onClick={() => {
        setEditingProductId(product.id);
        setNewProduct({
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          imageUrl: product.imageUrl,
        });

        document.getElementById("admin-form").scrollIntoView({
          behavior: "smooth",
        });
      }}
    >
      Edit
    </button>
  </>
)}
          </div>
        );
      })
    ) : (
      <p>Loading products...</p>
    )}
  </div>
</section>

      <section className="gallery">
  <h2>Jewellery Gallery</h2>

  <div className="gallery-grid">
    <img src={necklaceImage} alt="Necklace" />
    <img src={ringImage} alt="Ring" />
    <img src={bridalImage} alt="Bridal" />
    <img src={banglesImage} alt="Bangles" />
  </div>
</section>

<section className="testimonials">
  <h2>What Our Customers Say</h2>

  <div className="testimonial-cards">
    <div className="testimonial">
      <p>"Beautiful designs and excellent quality. Highly recommended."</p>
      <h4>- Priya S.</h4>
    </div>

    <div className="testimonial">
      <p>"Best bridal jewellery collection with great customer service."</p>
      <h4>- Anjali R.</h4>
    </div>

    <div className="testimonial">
      <p>"Trusted jewellers with elegant gold and diamond designs."</p>
      <h4>- Rohit K.</h4>
    </div>
  </div>
</section>

     <section id="about" className="about">
  <h2>About Ashish Jewellers</h2>
  <p>
    Ashish Jewellers brings you elegant gold, diamond, bridal and traditional
    jewellery crafted with trust, quality and timeless design.
  </p>
</section>

<section id="contact" className="contact">
  <h2>Contact Us</h2>
  <p>📞 +91 9542298222</p>
  <p>📧 ashishjewellers@gmail.com</p>
  <p>📍  Mayur Kushal Complex, Abids Road, Gun Foundry, Abids, Hyderabad, Telangana 500001, India</p>
</section>
<footer className="footer">
  <h3>Ashish Jewellers</h3>

  <p>✨ Trusted Jewellery Since 2005</p>

  <p>© 2026 Ashish Jewellers. All Rights Reserved.</p>
</footer>

<a
  href="https://wa.me/919542298222"
  target="_blank"
  rel="noreferrer"
  className="floating-whatsapp"
>
  💬
</a>

<a
  href="https://wa.me/919542298222"
  className="floating-whatsapp"
  target="_blank"
  rel="noreferrer"
>
  <img src={whatsappIcon} alt="WhatsApp" />
</a>

    </div>
  );
}

export default App;


