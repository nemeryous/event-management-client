import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <Header />
      <div style={{ padding: 24, minHeight: "calc(100vh - 120px)" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
