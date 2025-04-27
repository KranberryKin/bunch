import React, { useEffect, useState } from "react"
import "./navbar.css"
import { NAVBAR_CONSTANTS } from "../../constants/initial-states/navBar.ts"
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const pages = NAVBAR_CONSTANTS.page_names;
    const navigate= useNavigate();

    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };
    const changePage = (page:string) => {
        navigate(page);
    }

    return (
        <div className={`bunchApp-navbar-container ${isOpen ? "open" : "closed"}`}>
            <div title={isOpen ? "Close" : "Open"} className="nav-button" onClick={toggleSidebar}>{isOpen ? "<" : ">"}</div>
            <div>
                {pages.map((page_name, index) => (
                    <div onClick={() => changePage(page_name.page)} className="navbar-option" id={page_name.name + `${index}`}>{page_name.name}</div>
                ))}
            </div>
        </div>
    )
}

export default NavBar;