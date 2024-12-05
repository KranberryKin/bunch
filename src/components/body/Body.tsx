import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import HomePage from "../../pages/homepage/HomePage.tsx";
import Profile from "../../pages/profile/Profile.tsx";
import { IUser } from "../../constants/interfaces/user";
import Login from "../../pages/login/Login.tsx";
import { IPageContent } from "../../constants/interfaces/page.ts";


const Body = ({currentUser, setCurrentUser, page_options} :{currentUser: IUser | undefined,setCurrentUser: (s:IUser) => void, page_options: IPageContent[]}) => {
    return (
        <div className="body-content">
                <Routes>
                    <Route path="/bunch" element={
                        <HomePage />
                        }>
                        </Route>
                    <Route path='/my_profile' element={
                        <Profile currentUser={currentUser}/>
                        }/>
                    <Route path='/login' element={
                        <Login setCurrentUser={setCurrentUser} page_options={page_options}/>
                        }/>
                </Routes>
        </div>
    );
}
export default Body;