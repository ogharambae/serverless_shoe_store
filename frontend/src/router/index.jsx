import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages";
import Product from "../pages/Product";
import ProductsPage from "../pages/Products";
import Orders from "../pages/Orders";
import Checkout from "../pages/Checkout";
import Success from "../pages/Success";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Admin from "../pages/Admin";
import History from "../pages/History";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:category" element={<ProductsPage />}></Route>
      <Route path="/:category/:product" element={<Product />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/success" element={<Success />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/history/:userid" exact element={<History />} />
    </Routes>
  );
};

export default Router;
