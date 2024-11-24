import "./header.css";

const Header = () => {
    const title = "Bunch";
    const page_options = [
        "Home",
        "Profile"
    ]
    return (
        <div className="header-container">
            <div>
                <p>
                    {title}
                </p>
            </div>
            <div className="options-container">
                {page_options.map(string => (
                <p className="header-option">
                    {string}
                </p>
                ))}
            </div>
        </div>
    )
}

export default Header;