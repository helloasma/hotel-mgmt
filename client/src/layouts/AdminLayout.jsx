import React, { useEffect } from "react";
import AdminNavbar from "../components/Admin/AdminNavbar";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  useEffect(() => {
    document.title = "Lovender Operation Portal";
  }, []);

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-main-content">{children}</main>
    </div>
  );
};

export default AdminLayout;