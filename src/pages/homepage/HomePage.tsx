import React from 'react'
import './homepage.css'

const HomePage = () => {
    const title = "Welcome to Bunch!"
    const content = `I hope you enjoy your stay while using Bunch. Bunch is an static webapp that can help manage Tasks and plans. Bunch in a work in progress, and will be receiving consistent updates thoughout app development.`
    const versionTitle = "Version Updates"
    const versionDescription = "Here you can find the recent updates to the App of changes to UI/UX 'User Interaction & User Experience'."
    const updates: string[] = [
        "12/3 Created two forms. creating user & logging in a User. Also, added navigation to profile page after login.",
        "12/5 Updated codebase. Improved functionality of app for improved productivity. (Created LocalStorageManager Service)"
    ]

    return (
        <div className="body-content home-container">
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
            <ul>
                {updates.map((str, index) => (
                    <li key={"HomePage-" + index}>
                        {str}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default HomePage;