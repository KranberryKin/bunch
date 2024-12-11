import React, { useEffect } from 'react';
import './profile.css'
import IUser from '../../constants/interfaces/user';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/button.tsx';
import LocalStorageManager from '../../services/LocalStorageManager.ts';
import SessionDataManager from '../../services/SessionDataManager.ts';
import { DataBase_Strings } from '../../constants/initial-states/Database.ts';
const Profile = ({currentUser, setCurrentUser, userSessionManager}:{currentUser: IUser | undefined, setCurrentUser: (IUser) => void, userSessionManager: SessionDataManager<IUser>}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if(currentUser === undefined){
            navigate("/login");
        }
    },[currentUser]);
    
    const dothis = () => {
        console.log("I'm Clicked, What Do i Do?!")
    }

    const deleteUser = () => {
        if(window.confirm(`Are you sure you want to Delete User ${currentUser?.user_name ?? ""}?`) && currentUser !== undefined){
            const userDBString = DataBase_Strings.Users_DB;
            const userDataService = new LocalStorageManager<IUser>(userDBString);
            userDataService.deleteData(currentUser);
            userSessionManager.clearSession();
            setCurrentUser(undefined);
        }
    }

    
    return (
        <div className='profile-container'>
            <div className='profile-top-section'>
                <div className='profile-pic-section-container'>
                    <div>
                        <img className="profile-pic" src="https://placehold.it/100x100" alt="profile-pic" />
                        <p>
                            {currentUser?.user_name}
                        </p>
                    </div>
                    <div className='button-div'>
                        <Button title='Edit Profile?' buttonLabel='✏️' clicked={dothis}  backgroundClass='bg-green'/>
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