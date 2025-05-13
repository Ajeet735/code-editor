// components/Navbar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.scss"; // Import SCSS
import logo from "../../../assets/logo.png"; // correct path as needed

interface NavbarProps {
  isFullScreen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isFullScreen }) => {
  const navigate = useNavigate();

  return (
    <div className={`navbar-container ${isFullScreen ? "fullscreen" : ""}`}>
      <div className="navbar-content" onClick={() => navigate("/")}>

      <div className="navbar-title">
  <img className="navbar-logo" src={logo} alt="Logo" />
  <h1 className="main-heading">
    <span className="highlight">Code</span>
    <span>Camp</span>
  </h1>
</div>
        
      </div>
    </div>
  );
};
