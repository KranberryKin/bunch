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
import Budgets from "../../pages/budgets/Budgets.tsx";
import BudgetDetails from "../../pages/budgets/budgetdetails/BudgetDetails.tsx";
import Sprints from "../../pages/sprints/Sprints.tsx";
import SprintDetails from "../../pages/sprints/sprintDetails/SprintDetails.tsx";
import { ROUTES } from "../../constants/initial-states/routes.ts";


const Body = ({currentUser, userSessionManager, setCurrentUser, page_options} :{currentUser: IUser | undefined, userSessionManager: SessionDataManager<IUser>, setCurrentUser: (s:IUser | undefined) => void, page_options: IPageContent[]}) => {

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
                    <Route path={ROUTES.HOMEPAGE} element={
                      <HomePage />
                    }/>
                    <Route path={ROUTES.PROFILE} element={
                      <Profile currentUser={currentUser} setCurrentUser={setCurrentUser} userSessionManager={userSessionManager}/>
                    }/>
                    <Route path={ROUTES.LOGIN} element={
                      <Login userSessionManager={userSessionManager} currentUser={currentUser} setCurrentUser={setCurrentUser}  page_options={page_options}/>
                    }/>
                    <Route path={ROUTES.BUNCH_APP + ROUTES.ETC} element={
                      <BunchApp  childern={
                      <Routes>
                        <Route path={ROUTES.BUDGETS} element={<Budgets currentUser={currentUser}/>} />
                        <Route path={ROUTES.BUDGET_DETAILS} element={<BudgetDetails />} />
                        <Route path={ROUTES.SPRINTS} element={<Sprints currentUser={currentUser} />} />
                        <Route path={ROUTES.SPRINT_DETAILS} element={<SprintDetails />} />
                        <Route path={ROUTES.ETC} element={null} />
                      </Routes>
                      }/>
                    } />
                </Routes>} />
        </div>
    );
}
export default Body;