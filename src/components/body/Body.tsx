import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import HomePage from "../../pages/homepage/HomePage.tsx";
import Profile from "../../pages/profile/Profile.tsx";
import IUser from "../../constants/interfaces/user";
import Login from "../../pages/login/Login.tsx";
import SessionDataManager from "../../services/SessionDataManager.ts";
import { IPageContent } from "../../constants/interfaces/page.ts";
import BunchApp from "../../pages/bunch/bunchApp.tsx";
import { NotifyProvider } from "../../contextProvider/notifyContext.tsx";


const Body = ({currentUser, setCurrentUser, page_options} :{currentUser: IUser | undefined, setCurrentUser: (s:IUser) => void, page_options: IPageContent[]}) => {
    const userSessionLocal = "userSession";
    const userSessionManager = new SessionDataManager<IUser>(userSessionLocal);
    const navigate = useNavigate();
  
    useEffect(() => {
      if(currentUser === undefined){
        const sessionData = userSessionManager.checkSessionData<IUser>();
        if(sessionData != null){
          setCurrentUser(sessionData)
        }else{
          navigate("/login")
        }

      }
    },[currentUser]);
    return (
        <div className="body-content">
          <NotifyProvider Children={<Routes>
                    <Route path="/bunch" element={
                      <HomePage />
                    }/>
                    <Route path='/my_profile' element={
                      <Profile currentUser={currentUser} setCurrentUser={setCurrentUser} userSessionManager={userSessionManager}/>
                    }/>
                    <Route path='/login' element={
                      <Login userSessionManager={userSessionManager} currentUser={currentUser} setCurrentUser={setCurrentUser}  page_options={page_options}/>
                    }/>
                    <Route path="/bunchApp" element={
                      <BunchApp />
                    } />
                </Routes>} />
        </div>
    );
}
export default Body;