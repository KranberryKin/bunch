import React, { ChangeEvent, useEffect, useState } from 'react';
import './profile.css'
import IUser from '../../constants/interfaces/user';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/button.tsx';
import LocalStorageManager from '../../services/LocalStorageManager.ts';
import SessionDataManager from '../../services/SessionDataManager.ts';
import { DataBase_Strings } from '../../constants/initial-states/Database.ts';

interface IEditUserForm {
    profile_picture: string;
    user_name: string;
}

const Profile = ({currentUser, setCurrentUser, userSessionManager}:{currentUser: IUser | undefined, setCurrentUser: (IUser) => void, userSessionManager: SessionDataManager<IUser>}) => {
    const navigate = useNavigate();
    const userDBString = DataBase_Strings.Users_DB;
    const userDataService = new LocalStorageManager<IUser>(userDBString);
    const [editUserState, setEditUserState] = useState<IEditUserForm>({
        user_name:currentUser?.user_name ?? "",
        profile_picture: "",
    });
    const isFormValid = editUserState.profile_picture !== "" || (editUserState.user_name !== "" && editUserState.user_name !== currentUser?.user_name)
        
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        if(currentUser === undefined){
            navigate("/login");
        }
    },[currentUser]);

    const onUsernameChange = (e:string) => {
        setEditUserState({
            user_name: e,
            profile_picture: editUserState.profile_picture,
        })
    }

    const onProfilePicChange = (e: ChangeEvent) => {
        const input = e.target as HTMLInputElement;
        if(!input.files || input.files.length === 0){
            console.log("No Profile Picture Selected")
            return;
        }
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;

            setEditUserState({
                user_name: editUserState.user_name,
                profile_picture: base64String,
            })
        }
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
          };
        
          reader.readAsDataURL(file);
    }

    const handleUpdateUser = () => {
        if(!isFormValid){
            console.log("Username or Profile Picture wouldn't change if Submitted")
            return;
        }
        if(currentUser){
            const currentUserData = userDataService.getDataById(currentUser.id);
            if(currentUserData){
                let userToUpdate:IUser ={
                    id: currentUserData.id,
                    user_name: (editUserState.user_name !== "" && editUserState.user_name !== currentUser?.user_name) ? editUserState.user_name : currentUser.user_name,
                    profile_picture: editUserState.profile_picture,
                    password: currentUserData.password
                };
                userDataService.updateData(userToUpdate);
                userSessionManager.clearSession();
                userToUpdate.password = "";
                userSessionManager.saveSessionData(userToUpdate, 30);
                setCurrentUser(userToUpdate);
            }
        }
    }
    
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }

    const deleteUser = () => {
        if(window.confirm(`Are you sure you want to Delete User ${currentUser?.user_name ?? ""}?`) && currentUser !== undefined){
            userDataService.deleteData(currentUser);
            userSessionManager.clearSession();
            setCurrentUser(undefined);
        }
    }

    
    return (
        <div className='profile-container'>
            <div className='profile-top-section'>
                <div className='profile-pic-section-container'>
                    {isEditing ?
                     <div className='profile-edit-container'>
                        <label className='profile-edit-container-label' htmlFor="profile_pic">Profile Picture</label>
                        <input name='profile_pic'  type="file" accept="image/*" onChange={(e) => onProfilePicChange(e)} />
                        <label className='profile-edit-container-label' htmlFor="user_name_input">User Name</label>
                        <input name='user_name_input' type="text" value={editUserState.user_name} onChange={(e) => onUsernameChange(e.target.value)} />
                        <div className='edit-user-button-container'>
                        <Button title='Update Profile' buttonLabel='Submit' clicked={handleUpdateUser} backgroundClass='bg-green'/>
                        </div>
                    </div> 
                    : 
                    <div>
                        <img className="profile-pic" src={currentUser?.profile_picture !== "" ? currentUser?.profile_picture : "https://placehold.it/100x100"} alt="profile-pic" />
                        <p>
                            {currentUser?.user_name}
                        </p>
                    </div>}
                    <div className='button-div'>
                        <Button title='Edit Profile?' buttonLabel='✏️' clicked={toggleEdit}  backgroundClass='bg-green'/>
                    </div>
                </div>
                <div className='profile-del-button-container'>
                    <div>
                      <Button title='Delete Profile?' buttonLabel='🗑️' clicked={deleteUser} backgroundClass='bg-red'  />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;