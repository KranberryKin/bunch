import React from "react";

import './button.css'

interface IButton {
    title:string,
    clicked: () => any;
    backgroundClass?:string;
}

const Button = ({title, clicked, backgroundClass}:IButton) => {
    return (
        <div className={backgroundClass ? backgroundClass + " button-container" : "" + " button-container"} onClick={() => clicked()}>
            {title}
        </div>
    )
}

export default Button;