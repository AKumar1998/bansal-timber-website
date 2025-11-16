import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Blogs from "./pages/Blogs.jsx";
import Bundles from "./pages/Bundles.jsx";
import BundleEditor from "./pages/BundleEditor.jsx";
import Testimonials from "./pages/Testimonials.jsx";
import Login from "./pages/Login.jsx";
import FooterInfo from "./pages/FooterInfo.jsx";
import ProductsIntroAdmin from "./pages/ProductsIntroAdmin.jsx";
import HomeIntroProductsAdmin from "./pages/HomeIntroProductsAdmin.jsx";
import FounderSection from "./pages/FounderSection.jsx";

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="bundles" element={<Bundles />} />
        <Route path="bundles/:bundleId" element={<BundleEditor />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="footerInfo" element={<FooterInfo />} />
        <Route path="productsIntroAdmin" element={<ProductsIntroAdmin />} />
        <Route path="homeIntroProductsAdmin" element={<HomeIntroProductsAdmin />} />
        <Route path="founderSection" element={<FounderSection />} />
      </Route>
    </Routes>
  );
}

