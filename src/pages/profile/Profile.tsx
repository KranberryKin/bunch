import React, { useEffect } from 'react';
import './profile.css'
import IUser from '../../constants/interfaces/user';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/button.tsx';
const Profile = ({currentUser}:{currentUser: IUser | undefined}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if(currentUser === undefined){
            navigate("/login");
        }
    },[currentUser]);
    
    const dothis = () => {
        console.log("I'm Clicked, What Do i Do?!")
    }

    const doThat = () => {
        console.log("I'm Clicked, What Do i Do?!")
    }

    
    return (
        <div className='profile-container'>
            <div className='profile-top-section'>
                <div className='profile-pic-section-container'>
                    <div>
                        <img className="profile-pic" src="http://placehold.it/50x50" alt="profile-pic" />
                        <p>
                            {currentUser?.user_name}
                        </p>
                    </div>
                    <div className='button-div'>
                        <Button title='Edit Profile?' buttonLabel='✏️' clicked={dothis}  backgroundClass='bg-green'/>
                    </div>
                </div>
                <div>
                    <Button title='Delete Profile?' buttonLabel='🗑️' clicked={doThat} backgroundClass='bg-red'  />
                </div>
            </div>
        </div>
    )
}

export default Profile;