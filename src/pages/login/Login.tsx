import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import './login.css'
import IUser from "../../constants/interfaces/user.ts";
import Button from "../../components/button/button.tsx";
import { useNavigate } from "react-router-dom";
import LocalStorageManager from "../../services/LocalStorageManager.ts";
import SessionDataManager from "../../services/SessionDataManager.ts";
import { IPageContent } from "../../constants/interfaces/page.ts";
import { DataBase_Strings } from "../../constants/initial-states/Database.ts";
import { useNotify } from "../../contextProvider/notifyContext.tsx";
import { ROUTES } from "../../constants/initial-states/routes.ts";
import LoginService from "../../services/LoginService.ts";

export interface IUserForm {
    userName:string;
    password:string;
    verify_password:string;
}
export interface IValidUserForm {
    userName:boolean, 
    password:boolean,
    verify_password:boolean, 
}

const Login = ({currentUser, setCurrentUser, userSessionManager,page_options} : {currentUser: IUser | undefined,setCurrentUser: React.Dispatch<React.SetStateAction<IUser | undefined>>, userSessionManager: SessionDataManager<IUser>, page_options: IPageContent[]}) => {
    const [userForm, setUserForm] = useState<IUserForm>({
        userName:"",
        password:"",
        verify_password:""
    })
    const userErrorMsg: string = "Username must be longer than 4 letters.";
    const passwordErrorMsg: string ="Password must be longer than 4 letters.";
    const verifyErrorMsg: string ="Passwords must match.";

    const [validUserForm, setValidUserForm] = useState<IValidUserForm>({
        userName: true, 
        password: true, 
        verify_password:true,
    });
        
    const userFormKeys = Object.keys(userForm);
    const navigate = useNavigate();
    const [creatingUser, setCreatingUser] = useState<boolean>(true);
    const userDBString = DataBase_Strings.Users_DB;
    const UserDataService = new LocalStorageManager<IUser>(userDBString);
    let BunchUsers:IUser[] = UserDataService.values;
    const {sendNotify} = useNotify();
    const loginService = new LoginService(
        sendNotify,
        BunchUsers,
        navigate,
        setValidUserForm,
        UserDataService,
        setCurrentUser ,
        userSessionManager);
    
    useEffect(() => {
        if(currentUser !== undefined){
            navigate(ROUTES.URL.PROFILE);
        }
    },[currentUser])
    
    const switchForms = () => {
        setInitialState();
        setCreatingUser(!creatingUser);
    }
    
    const setInitialState = () => {
        setUserForm({
            userName:"",
            password:"",
            verify_password:""
        })
        setValidUserForm({...validUserForm,
            userName: true,
            password: true,
            verify_password: true,
        })
    }
    
    const updateForm = (s:string, key:string) => {
        if(userFormKeys.includes(key)){
            setUserForm({...userForm, [key]: s});
        }else{
            console.log("Failed to update Form");
        }
    }

    
    const LabelInput = (key:string, index:number) => {
        return (<>
            <label key={key + index} htmlFor={key}>{key.toLocaleLowerCase().replace("_", " ")}</label>
            <input key={key + index + index} name={key} value={userForm[key as keyof IUserForm]} type={key.includes("password") ? "password" : "text"} onChange={(e) => updateForm(e.target.value, e.target.name)}/>
            <div key={key + index + index + index} hidden={validUserForm[key as keyof IValidUserForm] || !creatingUser} style={{color: "red"}}>
                {userFormKeys[0] == key ?  userErrorMsg: 
                userFormKeys[1] == key ?  passwordErrorMsg :
                verifyErrorMsg}
                </div>
            </>)
    }
    
    const title = 'Please create an Account or Login'
    return (<div className="login-container">
        <div className="login-title">
            {title}
        </div>
        <div className="form-filter-container">
            {creatingUser ? <Button buttonLabel="Login?" backgroundClass="bg-green" clicked={switchForms}/> : <Button buttonLabel="New User?" backgroundClass="bg-green" clicked={switchForms} />}
        </div>
        <div className="form-container">
            {userFormKeys.map((key:string, index:number) => (creatingUser ? LabelInput(key, index) : key.includes("verify") ? null : LabelInput(key, index)))}
                
            <div className="login-button-container">
                <Button buttonLabel="Clear" clicked={setInitialState} backgroundClass="bg-red"/>
                <Button buttonLabel={creatingUser ? "Submit" : "Login"} clicked={creatingUser ? () => loginService.onSubmit(userForm, validUserForm, page_options) : () => loginService.login(userForm)} backgroundClass="bg-green"/>
            </div>
        </div>
    </div>)
}
export default Login;