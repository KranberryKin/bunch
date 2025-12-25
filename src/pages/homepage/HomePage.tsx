import React from 'react'
import './homepage.css'

const HomePage = () => {
    const title = "Welcome to Bunch!"
    const content = `I hope you enjoy your stay while using Bunch. Bunch is an static webapp that can help manage Tasks and plans. Bunch in a work in progress, and will be receiving consistent updates thoughout app development.`
    const versionTitle = "Version Updates"
    const versionDescription = "Here you can find the recent updates to the App of changes to UI/UX 'User Interaction & User Experience'."
    const updates: string[] = [
        "8/14/25 Updated UserPrefrenceThemes. Now when logged in, your page remains in dark/light theme after refresh. Whichever you choose, and gets assigned after you login.",
        "12/11/24 Updated the ProfilePage to allow users to change their username, and upload an profile picture if desired. Slight changes to LocalStorageManager, Id generation is handled on object creation/save instead of needing to be assigned beforehand.",
        "12/6/24 Changes Background Color and Header/Footer Color. Also added Toggle for Light and Dark Themes(Default Light, Click ⚙️ Icon in Header)",
        "12/5/24 Updated codebase. Improved functionality of app for improved productivity. (Created LocalStorageManager Service). Also keeping User state in Browser, so App will no longer require login on refresh. (Token Expires in 10 min)",
        "12/3/24 Created two forms. creating user & logging in a User. Also, added navigation to profile page after login.",
    ]

    return (
        <div className="home-container">
            <h1>{title}</h1>
            <p className='home-text-content'>
                {content}
            </p>
            <h1>
                {versionTitle}
            </h1>
            <p>
                {versionDescription}
            </p>
            <ul className='version-updates'>
                {updates.map((str, index) => (
                    <>
                    <li key={"HomePage-" + index}>
                        {str}
                    </li>
                    <br />
                    </>
                ))}
            </ul>
        </div>
    )
}

export default HomePage;