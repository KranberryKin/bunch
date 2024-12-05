import React, { useEffect, useState } from "react";
import './login.css'
import IUser from "../../constants/interfaces/user";
import Button from "../../components/button/button.tsx";
import { useNavigate } from "react-router-dom";
import LocalStorageManager from "../../services/LocalStorageManager.ts";
import SessionDataManager from "../../services/SessionDataManager.ts";

interface IUserForm {
    userName:string;
    password:string;
    verify:string;
}

const Login = ({currentUser, setCurrentUser, userSessionManager} : {currentUser: IUser | undefined,setCurrentUser: (s:IUser) => void, userSessionManager: SessionDataManager<IUser>}) => {
    const navigate = useNavigate();
    const [userForm, setUserForm] = useState<IUserForm>({
        userName:"",
        password:"",
        verify:""
    })
    const [creatingUser, setCreatingUser] = useState<boolean>(true);
    const userDBString = "bunch-users";
    const UserDataService = new LocalStorageManager<IUser>(userDBString);

    useEffect(() => {
        if(currentUser !== undefined){
            navigate("/my_profile");
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
            verify:""
        })
    }

    const updateUserName = (s:string) => {
        setUserForm({
            userName: s,
            password: userForm.password,
            verify: userForm.verify
        });
    }

    
    const updatePassword = (s:string) => {
        setUserForm({
            userName: userForm.userName,
            password: s,
            verify: userForm.verify
        });
    }

    
    const updateVerify = (s:string) => {
        setUserForm({
            userName: userForm.userName,
            password: userForm.password,
            verify: s
        });
    }

    const validateForm = (formData:IUserForm) => {
        let isValid = true;
        for(let i = 0; i < formData.password.length; i++){
            let passChar = formData.password[i];
            let variChar = formData.verify[i];
            if(passChar !== variChar){
                isValid = false;
            }
        }
        return isValid;
    }


    const onSubmit = () => {
        debugger
        if(!validateForm(userForm)){
            console.log("Failed to Create User")
        }else{
            let newUser: IUser = {
                id: UserDataService.generateId(),
                user_name: userForm.userName,
                password:userForm.password,
            };
            UserDataService.add(newUser);
            newUser.password = "";
            userSessionManager.saveSessionData(newUser, 10)
            setCurrentUser(newUser);
            navigate("/my_profile");
        }
    }

    const login = () => {
        debugger
        let BunchUsers:IUser[] = UserDataService.values;

        const foundUserIndex = BunchUsers.findIndex(user => user.user_name === userForm.userName);
        let foundUser:IUser = {} as IUser;
        if(foundUserIndex > -1){
            foundUser = BunchUsers[foundUserIndex];
        }else{
            console.error("Couldn't find User")
            return;
        }

        let isValid = true;
        for(let i =0; i < foundUser.password.length; i++){
            const passChar = foundUser.password[i];
            const formChar = userForm.password[i];
            if(passChar !== formChar){
                isValid = false;
            }
        }

        if(isValid){
            foundUser.password = "";
            userSessionManager.saveSessionData(foundUser, 10)
            setCurrentUser(foundUser)
            navigate("/my_profile");
        }else{
            console.error("Passwords Don't Match")
        }

    }


    const title = 'Please create an Account or Login'
    return (<div className="login-container">
        <div className="login-title">
            {title}
        </div>
        <div className="form-filter-container">
            {creatingUser ? <Button title="Login?" backgroundClass="bg-green" clicked={switchForms}/> : <Button title="New User?" backgroundClass="bg-green" clicked={switchForms} />}
        </div>
        <div className={creatingUser ? "form-container" : "hidden form-container"}>
            <label htmlFor="userName">UserName</label>
            <input name="userName" value={userForm.userName} type="text" onChange={(e) => updateUserName(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input name="password" value={userForm.password} type="password" onChange={(e) => updatePassword(e.target.value)} />

            <label htmlFor="verify">Verify</label>
            <input name="verify" value={userForm.verify} type="password" onChange={(e) => updateVerify(e.target.value)} />

            <div className="login-button-container">
                <Button title="Clear" clicked={setInitialState} backgroundClass="bg-red"/>
                <Button title="Submit" clicked={onSubmit} backgroundClass="bg-green"/>
            </div>
        </div>

        <div className={creatingUser ? "hidden form-container" : "form-container"}>
            <label htmlFor="userName">UserName</label>
            <input name="userName" value={userForm.userName} type="text" onChange={(e) => updateUserName(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input name="password" value={userForm.password} type="password" onChange={(e) => updatePassword(e.target.value)} />


            <div className="login-button-container">
                <Button title="Clear" clicked={setInitialState} backgroundClass="bg-red"/>
                <Button title="Login" clicked={login} backgroundClass="bg-green"/>
            </div>
        </div>
    </div>)
}
export default Login;