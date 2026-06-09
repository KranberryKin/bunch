import { useEffect, useState } from "react";
import Button from "../../../components/button/button.tsx";
import "./sprintdetails.css"
import SPRINT_DETAILS_INITIAL_STATE from "../../../constants/initial-states/SPRINT_DETAILS_INITIAL_STATE.ts";
import Statistics from "./statistics/Statistics.tsx";
import CurrentSprint from "./currentSprint/CurrentSprint.tsx";
import Backlog from "./backlog/Backlog.tsx";
import { useParams } from "react-router-dom";
import ISprintz from "../../../constants/interfaces/Sprintz.ts";
import IUser from "../../../constants/interfaces/user.ts";
import LocalStorageManager from "../../../services/LocalStorageManager.ts";
import { DataBase_Strings } from "../../../constants/initial-states/Database.ts";
import ICurrentSprint from "../../../constants/interfaces/ICurrentSprint.ts";

interface ISprintDetailsProps {
    currentUser: IUser | undefined;  
}

const SprintDetails = (props: ISprintDetailsProps) => {
    const sprintId = useParams().sprintId;
    const sprintsRepository = new LocalStorageManager<ISprintz>(DataBase_Strings.Sprintz_DB);
    const [displayMode, setDisplayMode] = useState<string>("Backlog");
    const [sprintz, setSprintz] = useState<ISprintz | undefined>(undefined);
    const [selectedSprint, setSelectedSprint] = useState<ICurrentSprint | undefined>(undefined);
    
    const handlePageChange = (page: string) => () => {
        setDisplayMode(page);
    }
    useEffect(() => {
        if(sprintId && props.currentUser){
            const sprint = sprintsRepository.values.find(sprint => sprint.id === parseInt(sprintId) && sprint.userId === props.currentUser?.id);
            setSprintz(sprint);
        }
    }, [sprintId, props.currentUser]);

    return (
        <div className="sprint-details-page-main-container">
            <div className="sprint-details-page-header-container">
                <div>
                    <h3 className="title-styles">{SPRINT_DETAILS_INITIAL_STATE.Page_Title}</h3>
                </div>
                <div>
                    <h3>Title: {sprintz?.title}</h3>
                </div>
                <div className="sprint-details-page-header-buttons-container">
                    <div>
                        <Button backgroundClass={displayMode === SPRINT_DETAILS_INITIAL_STATE.Child_Pages[0] ? "selected" : ""} buttonLabel={SPRINT_DETAILS_INITIAL_STATE.Child_Pages[0]} clicked={handlePageChange(SPRINT_DETAILS_INITIAL_STATE.Child_Pages[0])} />
                    </div>
                    <div>
                        <Button backgroundClass={displayMode === SPRINT_DETAILS_INITIAL_STATE.Child_Pages[1] ? "selected" : ""} buttonLabel={SPRINT_DETAILS_INITIAL_STATE.Child_Pages[1]} clicked={handlePageChange(SPRINT_DETAILS_INITIAL_STATE.Child_Pages[1])} />
                    </div>
                    <div>
                        <Button backgroundClass={displayMode === SPRINT_DETAILS_INITIAL_STATE.Child_Pages[2] ? "selected" : ""} buttonLabel={SPRINT_DETAILS_INITIAL_STATE.Child_Pages[2]} clicked={handlePageChange(SPRINT_DETAILS_INITIAL_STATE.Child_Pages[2])} />
                    </div>
                </div>
                <div>
                    <Button buttonLabel={"Edit Sprint"} clicked={() => {}} />
                </div>
            </div>
            <div className="sprint-details-page-child-page-container">
                <div className={displayMode !== SPRINT_DETAILS_INITIAL_STATE.Child_Pages[0] ? "hidden" : ""}>
                    <Backlog currentUser={props.currentUser} Sprintz={sprintz} selectedSprint={selectedSprint}  setSelectedSprint={setSelectedSprint} />
                </div>
                <div className={displayMode !== SPRINT_DETAILS_INITIAL_STATE.Child_Pages[1] ? "hidden" : ""}>
                    <CurrentSprint sprintz={sprintz} selectedSprint={selectedSprint} setSelectedSprint={setSelectedSprint} />
                </div>
                <div className={displayMode !== SPRINT_DETAILS_INITIAL_STATE.Child_Pages[2] ? "hidden" : ""}>
                    <Statistics sprintz={sprintz} selectedSprint={selectedSprint} setSelectedSprint={setSelectedSprint} />
                </div>
            </div>
        </div>
    );
}
export default SprintDetails;