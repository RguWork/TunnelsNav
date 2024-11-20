import React from "react";
import "./NavBar.css";

export const NavBar = () => {
    return(
        <div className = "NavBarContainer">
            <h2>TunnelNav</h2>
            <span className="nav-divider"></span>
            <nav>
                <a href="#">Search</a>
                <a href="#about">About</a>
            </nav>
        </div>
    )
};