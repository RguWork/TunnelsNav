import React from "react";
import "./NavBar.css";

export const NavBar = () => {
    return(
        <div className = "NavBarContainer">
            <h2>MIT TunnelNav</h2>
            <span className="nav-divider"></span>
            <nav>
                <a href="searchForm">Search</a>
                <a href="about">About</a>
            </nav>
        </div>
    )
};