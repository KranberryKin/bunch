import { useState } from "react";
import Button from "../../../../components/button/button.tsx";
import ISprintz from "../../../../constants/interfaces/Sprintz.ts";
import "./currentsprint.css";
import CurrentStatus from "./currentStatus/CurrentStatus.tsx";
import Calendar from "./calendar/Calendar.tsx";

interface ICurrentSprintProps {
    currentSprint: ISprintz | undefined;
}

const CurrentSprint = (props: ICurrentSprintProps) => {

    const [isCurrentStatus, setIsCurrentStatus] = useState(true);

    const handleDisplayChange = () => {
        setIsCurrentStatus(isCurrentStatus ? false : true);
    }

    return (
        <div className="sprint-details-page-main-container">
            <div className="sprint-details-page-header">
                <div>
                    <h1>
                        {isCurrentStatus ? "Current Status" : "Calendar"}
                    </h1>
                </div>
                <div>
                    <Button title={isCurrentStatus ? "See Calendar" : "See Status"} buttonLabel={isCurrentStatus ? "Status" : "Calendar"} clicked={handleDisplayChange} />
                </div>
            </div>
            <div className="sprint-details-pages-container">
                {isCurrentStatus ? <CurrentStatus Sprintz={props.currentSprint} /> : <Calendar />}
            </div>
        </div>
    );
}
export default CurrentSprint;