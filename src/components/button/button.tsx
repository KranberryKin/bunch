import React from "react";

import './button.css'

interface IButton {
    buttonLabel:string,
    clicked: () => any;
    backgroundClass?:string;
    title?:string
}

const Button = ({buttonLabel, clicked, backgroundClass, title}:IButton) => {
    return (
        <div title={title} className={backgroundClass ? backgroundClass + " button-container" : "" + " button-container"} onClick={() => clicked()}>
            {buttonLabel}
        </div>
    )
}

export default Button;