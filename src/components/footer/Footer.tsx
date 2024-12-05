import React from "react";
import "./footer.css"

const Footer = () => {
    const footer_text = "Made with <3 by Quinn"
    return (
        <div className="footer-container">
            <p>
                {footer_text}
            </p>
        </div>
    )
}

export default Footer;