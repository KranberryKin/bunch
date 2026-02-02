import { useEffect, useState } from "react";
import Button from "../../components/button/button.tsx";
import LocalStorageManager from "../../services/LocalStorageManager.ts";
import "./sprints.css"
import IToggleListDisplayState from "../../constants/interfaces/ToggleListDisplayState.ts";
import ISprintz from "../../constants/interfaces/Sprintz.ts";
import SPRINTZ_INITIAL_STATE from "../../constants/initial-states/SPRINTZ_INITIAL_STATE.ts";
import CustomModal from "../../components/custommodal/CustomModal.tsx";
import IUser from "../../constants/interfaces/user.ts";
import { DataBase_Strings } from "../../constants/initial-states/Database.ts";
import SprintzForm from "../../components/forms/sprintzForm/SprintzForm.tsx";
import CustomDatePicker from "../../components/customdatepicker/CustomDatePicker.tsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/initial-states/routes.ts";

interface ISprintsProps {
    currentUser: IUser | undefined;
}

const Sprints = ({currentUser}: ISprintsProps) => {
    const initialState =  SPRINTZ_INITIAL_STATE;
    const navigate = useNavigate();
    const sprintzRepo = new LocalStorageManager<ISprintz>(DataBase_Strings.Sprintz_DB);
    const [currentToggleState, setCurrentToggleState] =  useState<IToggleListDisplayState>(initialState.toggleListDisplayState[0]);
    const [sprintz, setSprintz] = useState<ISprintz[]>([]);
    const [modalState, setModalState] = useState<{body_content: JSX.Element | null}>({
        body_content: null
    });

    const toggleFormModal = () => {
        setModalState({body_content: <SprintzForm currentUser={currentUser} callbackFunction={() => setModalState({body_content: null})} />});
    };
    
    const toggleListDisplay = () => {
        const currentIndex = initialState.toggleListDisplayState.findIndex(state => state.label === currentToggleState.label);
        if(currentIndex + 1 === initialState.toggleListDisplayState.length){
            setCurrentToggleState(initialState.toggleListDisplayState[0]);
        }else{
            setCurrentToggleState(initialState.toggleListDisplayState[currentIndex + 1]);
        }
    };

    const selectSprintz = (sprint: ISprintz) => {
        navigate(`${ROUTES.navigate.sprintDetails.replace(":sprintId", sprint.id.toString())}`);
    };


    const deleteSprintz = (sprint: ISprintz) => {
        if(window.confirm(`Are you sure you want to delete the sprint: "${sprint.title}"? This action cannot be undone.`)){
            sprintzRepo.deleteData(sprint);
        }
        setCurrentToggleState({...currentToggleState});
    };


    useEffect(() => {
        const allSprints = sprintzRepo.get();
        const allUserSprints = allSprints?.filter(sprint => sprint.userId === currentUser?.id) || [];
        if(currentToggleState.label === initialState.toggleListDisplayState[2].label){
            setSprintz(allUserSprints);
        }else{
            const filteredSprints = allUserSprints?.filter(sprint => sprint.isCompleted === currentToggleState.isCompleted) || [];
            setSprintz(filteredSprints);
        }
    }, [currentToggleState.label, currentToggleState.buttonTitle, currentToggleState.isCompleted, currentUser]);

    return <div className="sprints-page-main-container">
        <CustomModal  body_content={modalState.body_content} />
        <div className="sprints-page-header-container">
            <div>
                <h1>{initialState.sprintzPageTitle}</h1>
            </div>
            <div>
                <Button buttonLabel={initialState.createSprintButtonLabel} clicked={() => toggleFormModal()} />
            </div>
        </div>
        <div className="sprints-page-table-container">
            <div className="sprints-page-table-header-container">
                <h2>{currentToggleState.label}</h2>
                <Button title={currentToggleState.buttonTitle} buttonLabel={currentToggleState.label} clicked={() => toggleListDisplay()} />
            </div>
            <div className="sprints-page-sprint-list-container">
                {sprintz.length === 0 && <p>No sprintz to display.</p>}
                {sprintz.map((sprint) => (
                    <div key={sprint.id} className="sprints-page-sprint-item">
                        <h3 className="selectable" onClick={() => selectSprintz(sprint)}>{sprint.title}</h3>
                        <div>Start Date: {sprint.startDate}</div>
                        <div>End Date: {sprint.endDate}</div>
                        <div className="selectable" onClick={() => deleteSprintz(sprint)}>
                            🗑️
                        </div>
                    </div>
                ))}
            </div>
        </div>
            
        </div>;
}
export default Sprints;