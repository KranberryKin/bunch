import ISprintz from "../../../../constants/interfaces/Sprintz";
import "./currentsprint.css";

interface ICurrentSprintProps {
    currentSprint: ISprintz | undefined;
}

const CurrentSprint = (props: ICurrentSprintProps) => {
    return (
        <div className="sprint-details-page-main-container">
            <h3>Current Sprint Details</h3>
        </div>
    );
}
export default CurrentSprint;