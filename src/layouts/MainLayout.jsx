import Footer from "@components/Footer";
import Header from "@components/Header";
import QRPage from "@pages/qr/QRPage";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
