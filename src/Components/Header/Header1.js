import React, { useContext, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./Header.css";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function Header1({ signupBtn }) {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      alert("Logout failed");
    }
  };
  return (
    <div className="header1">
      <Row>
        <Col md={6}>
          <div className="logo">
            <h1>
              Fi<span style={{ color: "#61dafb" }}>nTe</span>ch
            </h1>
          </div>
        </Col>
        <Col md={6}>
          <div>
            <ul className="menu">
              <li>
                <Link to="/overview">Overview</Link>
              </li>
              <li>
                <Link to="/portfoliosummary">Portfolio</Link>
              </li>
              <li>
                <Link to="/accounts">Accounts</Link>
              </li>
              <li>
                <Link to="/resources">Resources</Link>
              </li>

              <li>
                <div className="login-btn">
                {isAuthenticated ? (
                  <p onClick={handleLogout}>Sign Out</p>
                ) : (
                  <Link to="/login">Sign In</Link>
                )}
                </div>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Header1;
