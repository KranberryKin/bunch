import React, { useEffect } from 'react';
import './profile.css'
import IUser from '../../constants/interfaces/user';
import { useNavigate } from 'react-router-dom';
const Profile = ({currentUser}:{currentUser: IUser | undefined}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if(currentUser === undefined){
            navigate("/login");
        }
    },[currentUser]);
    
    return (
        <div className='profile-container'>
            <div className='profile-top-section'>
                <div>
                    <img className="profile-pic" src="http://placehold.it/50x50" alt="profile-pic" />
                    <p>
                        {currentUser?.user_name}
                    </p>
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default Profile;