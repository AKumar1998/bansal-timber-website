import {Routes, Route} from "react-router-dom";
import AdminLayout from "./AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Blogs from "./pages/Blogs.jsx";
import Categories from "./pages/Categories.jsx";
import Testimonials from "./pages/Testimonials.jsx";
import Login from "./pages/Login.jsx";

export default function AdminApp(){

  return (
    <Routes>
      <Route path ="/login" element={<Login/>} />
      <Route element={<AdminLayout/>}>
        <Route index element={<Dashboard/>} />
        <Route path="products" element={<Products/>} />
        <Route path="blogs" element={<Blogs/>} />
        <Route path="categories" element={<Categories/>} />
        <Route path="testimonials" element={<Testimonials/>} />
      </Route>
    </Routes>
  );

};

