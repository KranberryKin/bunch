import { useNavigate } from "react-router-dom";
import "./header.css";
import {IPageContent} from "../../constants/interfaces/page"
import React from "react";

const Header = () => {
    const title = "Bunch";
    const navigate = useNavigate();
    const page_options: IPageContent[] = [
        {page_name:"Home", page_url: "/bunch"},
        {page_name:"Profile", page_url: "/my_profile"}
    ]
    const pageNavigation = (s:string) => { 
        navigate(s)
    }
    return (
        <div className="header-container">
            <div>
                <p>
                    {title}
                </p>
            </div>
            <div className="options-container">
                {page_options.map(obj => (
                <p className="header-option" onClick={() => pageNavigation(obj.page_url)}>
                    {obj.page_name}
                </p>
                ))}
            </div>
        </div>
    )
}

export default Header;