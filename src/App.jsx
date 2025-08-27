import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Blogs from "./pages/Blogs.jsx";
import ContactUs from "./pages/ContactUs.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

