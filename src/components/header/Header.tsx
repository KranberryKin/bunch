import { useNavigate } from "react-router-dom";
import { IPageContent } from "../../constants/interfaces/page";
import "./header.css";
import React from "react";
import { IUser } from "../../constants/interfaces/user";

const Header = ({currentUser}:{currentUser: IUser | undefined}) => {
    const title = "Bunch";
    const navigate = useNavigate();
    const page_options: IPageContent[] = [
        {page_name:"Home", page_url: "/bunch"},
        {page_name:"Profile", page_url: "/my_profile"},
        {page_name:"Login", page_url:"/login"}
    ]
    const setPage = (url: string) => {
        navigate(url);
    }

    return (
        <div className="header-container">
            <div>
                <p>
                    {title}
                </p>
            </div>
            <div className="options-container">
                {page_options.map(obj => {
                    if(currentUser === undefined && obj.page_name == page_options[1].page_name){
                        return;
                    }else if(currentUser !== undefined && obj.page_name == page_options[2].page_name){
                        return;
                    }
                    return (<p className="header-option" onClick={() => setPage(obj.page_url)}>
                        {obj.page_name}
                    </p>
                    )
                })}
            </div>
        </div>
    )
}

export default Header;