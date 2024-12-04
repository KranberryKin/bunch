import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import HomePage from "../../pages/homepage/HomePage.tsx";
import Profile from "../../pages/profile/Profile.tsx";
import { IUser } from "../../constants/interfaces/user";
import Login from "../../pages/login/Login.tsx";


const Body = ({currentUser, setCurrentUser} :{currentUser: IUser | undefined,setCurrentUser: (s:IUser) => void}) => {
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
                        <Login setCurrentUser={setCurrentUser}/>
                        }/>
                </Routes>
        </div>
    );
}
export default Body;