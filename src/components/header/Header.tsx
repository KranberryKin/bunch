import { useNavigate } from "react-router-dom";
import { IPageContent } from "../../constants/interfaces/page";
import "./header.css";
import React from "react";
import IUser from "../../constants/interfaces/user";

const Header = ({currentUser, page_options}:{currentUser: IUser | undefined, page_options: IPageContent[]}) => {
    const title = "Bunch";
    const navigate = useNavigate();
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
                {page_options.map((obj, index) => {
                    if(currentUser === undefined && obj.page_name == page_options[1].page_name){
                        return;
                    }else if(currentUser !== undefined && obj.page_name == page_options[2].page_name){
                        return;
                    }
                    return (<p key={"Header-" + index} className="header-option" onClick={() => setPage(obj.page_url)}>
                        {obj.page_name}
                    </p>
                    )
                })}
            </div>
        </div>
    )
}

export default Header;