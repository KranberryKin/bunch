import { useNavigate } from "react-router-dom";
import { IPageContent } from "../../constants/interfaces/page";
import "./header.css";
import React, { useEffect, useState } from "react";
import IUser from "../../constants/interfaces/user";
import IUserThemePref from "../../constants/interfaces/userThemePref";
import LocalStorageManager from "../../services/LocalStorageManager.ts";

const Header = ({currentUser, page_options}:{currentUser: IUser | undefined, page_options: IPageContent[]}) => {
    const title = "Bunch";
    const navigate = useNavigate();
    const userPrefLocal = "userPref";
    const themes: string[] = ["light", "dark"]
    const userThemeStorageManager = new LocalStorageManager<IUserThemePref>(userPrefLocal);
    const setPage = (url: string) => {
        navigate(url);
    }
    const [userTheme, setUserTheme] = useState<IUserThemePref | undefined>(undefined)
    const [theme, setTheme] = useState(userTheme ? userTheme.theme : themes[0]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    },[theme]);

    useEffect(() => {
        if(userTheme != undefined){
            setTheme(userTheme.theme);
        }
    },[userTheme])
    

    useEffect(() => {
        if (currentUser != undefined && userThemeStorageManager.values.length === 0){
            const userPref: IUserThemePref = {
                id: -1,
                userId: currentUser.id,
                theme: theme
            }
            userThemeStorageManager.add(userPref);
        }
        assignUserTheme()
    },[currentUser])

    const assignUserTheme = () => {
        if(currentUser != undefined){
            const userPrefIndex: number = userThemeStorageManager.values.findIndex(obj => obj.userId === currentUser.id);
            if(userPrefIndex >= 0){
                const userPrefTheme: IUserThemePref = userThemeStorageManager.values[userPrefIndex];
                setUserTheme(userPrefTheme);
            };
        };
    }

    const changeThemes = () => {
        if(theme === themes[0]){
            setTheme(themes[1])
            if(userTheme != undefined){
                const userPrefTheme: IUserThemePref = {
                        id: userTheme.id,
                        userId: userTheme.userId,
                        theme: themes[1]
                    }
                userThemeStorageManager.updateData(userPrefTheme)

            }
        }else{
            setTheme(themes[0]);
            if(userTheme != undefined){
                const userPrefTheme: IUserThemePref = {
                        id:userTheme.id,
                        userId: userTheme.userId,
                        theme: themes[0]
                    }
                setUserTheme(userPrefTheme);
                userThemeStorageManager.updateData(userPrefTheme)
            }
        } 
        assignUserTheme();
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
                <div title="Toggle Light/Dark Themes" className="options-icon-container" onClick={changeThemes}>
                ⚙️
                </div>
            </div>
        </div>
    )
}

export default Header;