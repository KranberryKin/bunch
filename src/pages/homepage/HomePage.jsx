import './homepage.css'

const HomePage = () => {
    const title = "Welcome to Bunch!"

    const content = `I hope you enjoy your stay while using Bunch. Bunch is an static webapp that can help manage Tasks and plans. Bunch in a work in progress, and will be receiving consistent updates thoughout app development.`

    return (
        <div className="body-content home-container">
            <h1>{title}</h1>
            <p className='home-text-content'>
                {content}
            </p>
        </div>
    )
}

export default HomePage;