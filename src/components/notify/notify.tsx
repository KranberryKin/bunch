import React from "react";
import "./notify.css"

const Notify = ({message}:{message: string}) => {
    const isHidden = message ===  "";

    return (
        <div className={(isHidden ? "hidden" : "") + " notify-instance"}>
            <div>{message}</div>
      </div>
    )
}
export default Notify;