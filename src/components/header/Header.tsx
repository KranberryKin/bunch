import { useNavigate } from "react-router-dom";
import { IPageContent } from "../../constants/interfaces/page";
import "./header.css";
import React, { useEffect, useState } from "react";
import IUser from "../../constants/interfaces/user";
import LocalStorageManager from "../../services/LocalStorageManager.ts";
import { DataBase_Strings } from "../../constants/initial-states/Database.ts";
import SessionDataManager from "../../services/SessionDataManager.ts";

const Header = ({currentUser, userSessionManager, page_options, setCurrentUser}:{currentUser: IUser | undefined,userSessionManager: SessionDataManager<IUser>, page_options: IPageContent[], setCurrentUser: (user:IUser| undefined) => void}) => {
    const title = "Bunch";
    const navigate = useNavigate();
    const userRepo = new LocalStorageManager<IUser>(DataBase_Strings.Users_DB);
    const setPage = (url: string) => {
        navigate(url);
    }
    const [theme, setTheme] = useState("light");

    useEffect(() => {
            document.documentElement.setAttribute('data-theme', theme)
    },[theme, theme.length])

    useEffect(() => {
        if(currentUser?.prefered_theme){
            setTheme(currentUser.prefered_theme);
        }
        console.log("currentUser?.prefered_theme", currentUser?.prefered_theme)
        console.log("currentUser", currentUser)
    },[currentUser?.prefered_theme]);

    const updateUserPrefTheme = (currentUser:IUser, prefTheme: string) => {
                const objToReplicate = userRepo.getDataById(currentUser.id);
                if(objToReplicate){
                    let userToUpdate: IUser = {...objToReplicate, prefered_theme: prefTheme};
                    userRepo.updateData(userToUpdate);
                    userToUpdate.password = "";
                    setCurrentUser(userToUpdate);
                    return userToUpdate;
                }
                return currentUser;
    }
    const updateSessionPrefTheme = (updatedUser:IUser) => {
                    userSessionManager.clearSession();
                    userSessionManager.saveSessionData(updatedUser, 10);
    }

    const changeThemes = () => {
        if(theme === "light"){
            if(currentUser){
               const updatedUser = updateUserPrefTheme(currentUser, "dark")
               updateSessionPrefTheme(updatedUser)
            }else{
                setTheme('dark')
            }
        }else{
            if(currentUser){
                const updatedUser = updateUserPrefTheme(currentUser, "light")
                updateSessionPrefTheme(updatedUser)
            }else{
                setTheme('light')
            }
        } 
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
                    if(
                            currentUser === undefined && 
                            (obj.page_name == page_options[1].page_name ||
                             obj.page_name == page_options[3].page_name)
                        ){
                        return;
                    }else if(currentUser !== undefined && obj.page_name == page_options[2].page_name){
                        return;
                    }
                    return (<p key={"Header-" + index} className="header-option" onClick={() => setPage(obj.page_url)}>
                        {obj.page_name}
                    </p>
                    )
                })}
                <div title="Toggle Light/Dark Themes" className="options-icon-container" onClick={changeThemes}>
                ⚙️
                </div>
            </div>
        </div>
    )
}

export default Header;