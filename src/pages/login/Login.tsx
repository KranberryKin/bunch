import React, { useEffect, useState } from "react";
import './login.css'
import IUser from "../../constants/interfaces/user";
import Button from "../../components/button/button.tsx";
import { useNavigate } from "react-router-dom";
import LocalStorageManager from "../../services/LocalStorageManager.ts";
import SessionDataManager from "../../services/SessionDataManager.ts";
import { IPageContent } from "../../constants/interfaces/page.ts";
import { DataBase_Strings } from "../../constants/initial-states/Database.ts";
import { useNotify } from "../../contextProvider/notifyContext.tsx";

interface IUserForm {
    userName:string;
    password:string;
    verify_password:string;
}

const Login = ({currentUser, setCurrentUser, userSessionManager,page_options} : {currentUser: IUser | undefined,setCurrentUser: (s:IUser) => void, userSessionManager: SessionDataManager<IUser>, page_options: IPageContent[]}) => {
    const [userForm, setUserForm] = useState<IUserForm>({
        userName:"",
        password:"",
        verify_password:""
    })

    const [validUserForm, setValidUserForm] = useState<{userName:boolean, userErrorMsg: string, password:boolean,passwordErrorMsg:string, verify_password:boolean, verifyErrorMsg: string}>({
        userName: true, 
        userErrorMsg: "Username must be longer than 4 letters.",
        password: true, 
        passwordErrorMsg:"Password must be longer than 4 letters.",
        verify_password:true,
        verifyErrorMsg:"Passwords must match."
    });
        
    const userFormKeys = Object.keys(userForm);
    const navigate = useNavigate();
    const [creatingUser, setCreatingUser] = useState<boolean>(true);
    const userDBString = DataBase_Strings.Users_DB;
    const UserDataService = new LocalStorageManager<IUser>(userDBString);
    let BunchUsers:IUser[] = UserDataService.values;
    const {sendNotify} = useNotify();
    
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

    const doStringsMatch = (s1:string, s2:string) => {
        let isValid = true;
        if(s1.length !== s2.length){
            isValid = false;
        }else{
            for(let i = 0; i < s1.length; i++){
                let s1char = s1[i];
                let s2char = s2[i];
                if(s1char !== s2char){
                    isValid = false;
                }
            }
        }
        return isValid;
    }
    
    const validateForm = () => {
        let isValid = true;
        if(!doStringsMatch(userForm.password, userForm.verify_password) || userForm.password.length < 5){
            setValidUserForm({...validUserForm, password: false, verify_password: false});
            isValid = false;
        }else{
            setValidUserForm({...validUserForm, password: true, verify_password: true});
        }
        if (userForm.userName.length < 5){
            setValidUserForm({...validUserForm, userName: false});
            isValid = false;
        } else {
            setValidUserForm({...validUserForm, userName: true})
        }
        
        if(BunchUsers.findIndex(user => user.user_name === userForm.userName) > -1){
            setValidUserForm({...validUserForm, userName: false});
            isValid = false;
            sendNotify("User Already Exists")
        }
        return isValid;
    }
    
    const onSubmit = () => {
        if(!validateForm()){
            console.log("Failed to Create User")
        }else{
            let newUser: IUser = {
                id: -1,
                user_name: userForm.userName,
                password:userForm.password,
                profile_picture: "",
            };
            UserDataService.add(newUser);
            BunchUsers = UserDataService.values;
            newUser.password = "";
            userSessionManager.saveSessionData(newUser, 10)
            setCurrentUser(newUser);
            const profileUrl = page_options.find(page => page.page_name = "Profile")?.page_url;
            if(profileUrl !== undefined){
                navigate(profileUrl);
            }else{
                navigate('/my_profile')
            }
        }
    }
    
    const login = () => {
        
        const foundUserIndex = BunchUsers.findIndex(user => user.user_name === userForm.userName);
        let foundUser:IUser = {} as IUser;
        if(foundUserIndex > -1){
            foundUser = BunchUsers[foundUserIndex];
        }else{
            sendNotify("Couldn't find User")
            return;
        }
        
        if(doStringsMatch(foundUser.password, userForm.password)){
            foundUser.password = "";
            userSessionManager.saveSessionData(foundUser, 10);
            setCurrentUser(foundUser);
            navigate("/my_profile");
        }else{
            sendNotify("Passwords Don't Match")
        }
        
    }
    
    const LabelInput = (key:string, index:number) => {
        return (<>
            <label key={key + index} htmlFor={key}>{key.toLocaleLowerCase().replace("_", " ")}</label>
            <input key={key + index + index} name={key} value={userForm[key]} type={key.includes("password") ? "password" : "text"} onChange={(e) => updateForm(e.target.value, e.target.name)}/>
            <div hidden={validUserForm[key] || !creatingUser} style={{color: "red"}}>
                {userFormKeys[0] == key ?  validUserForm.userErrorMsg: 
                userFormKeys[1] == key ?  validUserForm.passwordErrorMsg :
                validUserForm.verifyErrorMsg}
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
            {userFormKeys.map((key, index) => {
                return(<>{creatingUser ? LabelInput(key, index)
                    : <>{key.includes("verify") ? <></> : LabelInput(key, index)} </>
                }</>)
            })}
            <div className="login-button-container">
                <Button buttonLabel="Clear" clicked={setInitialState} backgroundClass="bg-red"/>
                <Button buttonLabel={creatingUser ? "Submit" : "Login"} clicked={creatingUser ? onSubmit : login} backgroundClass="bg-green"/>
            </div>
        </div>
    </div>)
}
export default Login;