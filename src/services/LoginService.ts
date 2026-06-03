import { NavigateFunction } from "react-router-dom";
import IUser from "../constants/interfaces/user.ts";
import { IUserForm, IValidUserForm } from "../pages/login/Login.tsx";
import SessionDataManager from "./SessionDataManager.ts";
import LocalStorageManager from "./LocalStorageManager.ts";
import { ROUTES } from "../constants/initial-states/routes.ts";
import { IPageContent } from "../constants/interfaces/page.ts";
import { Dispatch, SetStateAction } from "react";

class LoginService {
    private _sendNotify: any;
    private _bunchUsers: IUser[];
    private _navigate: NavigateFunction;
    private _setValidUserForm: React.Dispatch<React.SetStateAction<IValidUserForm>>;
    private _UserDataService: LocalStorageManager<IUser>;
    private _setCurrentUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
    private _userSessionManager: SessionDataManager<IUser>

    constructor(
            sendNotify: any,
            bunchUsers: IUser[],
            navigate: NavigateFunction,
            setValidUserForm: React.Dispatch<React.SetStateAction<IValidUserForm>>,
            UserDataService:LocalStorageManager<IUser>,
            setCurrentUser: React.Dispatch<React.SetStateAction<IUser | undefined>>,
            userSessionManager: SessionDataManager<IUser>
        ) {
        this._sendNotify = sendNotify;
        this._bunchUsers = bunchUsers;
        this._navigate = navigate;
        this._setValidUserForm = setValidUserForm;
        this._UserDataService = UserDataService;
        this._setCurrentUser = setCurrentUser;
        this._userSessionManager = userSessionManager;
    }

    public doStringsMatch = (s1:string, s2:string) => {
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

    public validateForm = (userForm:IUserForm, validUserForm: IValidUserForm, setValidUserForm: React.Dispatch<React.SetStateAction<IValidUserForm>>) => {
        let isValid = true;
        if(!this.doStringsMatch(userForm.password, userForm.verify_password) || userForm.password.length < 5){
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
        
        if(this._bunchUsers.findIndex(user => user.user_name === userForm.userName) > -1){
            setValidUserForm({...validUserForm, userName: false});
            isValid = false;
            this._sendNotify("User Already Exists")
        }
        return isValid;
    }

    public login = (userForm:IUserForm) => {
            
            const foundUserIndex = this._bunchUsers.findIndex(user => user.user_name === userForm.userName);
            let foundUser:IUser = {} as IUser;
            if(foundUserIndex > -1){
                foundUser = this._bunchUsers[foundUserIndex];
            }else{
                this._sendNotify("Couldn't find User")
                return;
            }
            
            if(this.doStringsMatch(foundUser.password, userForm.password)){
                foundUser.password = "";
                this._userSessionManager.saveSessionData(foundUser, 30);
                this._setCurrentUser(foundUser);
                this._navigate("/my_profile");
            }else{
                this._sendNotify("Passwords Don't Match")
            }
            
    }

    public onSubmit = (
            userForm:IUserForm,
            validUserForm: IValidUserForm,
            page_options:IPageContent[],
        ) => {
        if(!this.validateForm(userForm, validUserForm, this._setValidUserForm)){
            console.log("Failed to Create User")
        }else{
            let newUser: IUser = {
                id: -1,
                user_name: userForm.userName,
                password:userForm.password,
                profile_picture: "",
                prefered_theme: "light"
            };
            this._UserDataService.add(newUser);
            this._bunchUsers = this._UserDataService.values;
            newUser.password = "";
            this._userSessionManager.saveSessionData(newUser, 30)
            this._setCurrentUser(newUser);
            const profileUrl = page_options.find(page => page.page_name = "Profile")?.page_url;
            if(profileUrl !== undefined){
                this._navigate(profileUrl);
            }else{
                this._navigate(ROUTES.URL.PROFILE);
            }
        }
    }

}

export default LoginService;