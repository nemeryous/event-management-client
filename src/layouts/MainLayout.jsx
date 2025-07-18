import Footer from "@components/user/Footer";
import Header from "@components/user/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <div className="mx-auto max-w-6xl px-5">
        <div style={{ padding: 24 }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
