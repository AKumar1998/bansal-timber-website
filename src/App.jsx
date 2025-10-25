import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";

// --- Frontend Imports ---
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Blogs from "./pages/Blogs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import BlogPage from "./pages/BlogPage.jsx";

// --- Lazy Load Admin Panel ---
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          //Frontend Routes
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPage />} />
          <Route path="/contactus" element={<ContactUs />} />
          //Admin Panel Route
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

