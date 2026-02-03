import ISprintz from "../../../../constants/interfaces/Sprintz";
import "./statistics.css";

interface IStatisticsProps {
    currentSprint: ISprintz | undefined;
}

const Statistics = (props: IStatisticsProps) => {
    return (
        <div className="sprint-details-page-main-container">
            <h3>Sprint Statistics</h3>
        </div>
    );
}
export default Statistics;