import { useState } from "react";
import ITask from "../../../constants/interfaces/ITask.ts";
import "./taskform.css";
import TaskStatus from "../../../constants/interfaces/TaskStatus.ts";
import TaskCategory from "../../../constants/interfaces/TaskCategory.ts";
import IUser from "../../../constants/interfaces/user.ts";
import ISprintz from "../../../constants/interfaces/Sprintz";
import CustomDropdown from "../../customDropdown/CustomDropdown.tsx";
import Button from "../../button/button.tsx";
import LocalStorageManager from "../../../services/LocalStorageManager.ts";
import { DataBase_Strings } from "../../../constants/initial-states/Database.ts";
import { useNotify } from '../../../contextProvider/notifyContext.tsx'


interface ITaskFormProps {
    currentUser?: IUser;
    currentSprint?: ISprintz;
    callbackFunction?: () => void;
}

const TaskForm = (props: ITaskFormProps) => {

    const taskLocalStorageManager = new LocalStorageManager<ITask>(DataBase_Strings.Tasks_DB);
    const { sendNotify } = useNotify();

    const [taskFormData, setTaskFormData] = useState<ITask>({
        id: taskLocalStorageManager.generateId() || 0,
        sprintzId: props.currentSprint ?  props.currentSprint.id : 0,
        creatorUserId: props.currentUser ? props.currentUser.id : 0,
        title: "",
        description: "",
        status: TaskStatus.StandAlone,
        category: TaskCategory.Task,
        assignedToUserId: undefined,
        startDate: undefined,
        projectedEndDate: undefined,
        completionDate: undefined,
        estimatedStoryPoints: undefined,
        actualStoryPoints: undefined,
    });

    const validateForm = ():boolean => {
        let isValid = true;
        if(props.currentUser){
            if(taskFormData.creatorUserId !== props.currentUser.id){
                setTaskFormData({
                ...taskFormData,
                creatorUserId: props.currentUser.id
                })   
            }
        }else{
            isValid = false;
        }

        if(isValid && props.currentSprint){
            if(taskFormData.sprintzId !== props.currentSprint.id){
                setTaskFormData({
                ...taskFormData,
                sprintzId: props.currentSprint.id
               })
            }
        }else {
            isValid = false;
        }

        if(isValid && taskFormData.title.trim().length < 3){
            isValid = false;
            sendNotify("Title must be at least 3 characters long.");
        }

        return isValid
    }

    const handleConfirm = () => {
        if(validateForm()){
            taskLocalStorageManager.add(taskFormData);
            if(props.callbackFunction){
                props.callbackFunction()
            }
        }
    }
    const handleCancel = () => {
        setTaskFormData({
            id: 0,
            sprintzId: props.currentSprint ?  props.currentSprint.id : 0,
            creatorUserId: props.currentUser ? props.currentUser.id : 0,
            title: "",
            description: "",
            status: TaskStatus.Idle,
            category: TaskCategory.Task,
            assignedToUserId: undefined,
            startDate: undefined,
            projectedEndDate: undefined,
            completionDate: undefined,
            estimatedStoryPoints: undefined,
            actualStoryPoints: undefined,
        })
    }

    const isKeyNeeded = (key: string): boolean => {
        const notNeededKeys = ["id", "creatorUserId", "sprintzId", "startDate", "projectedEndDate", "completionDate", "actualStoryPoints", "assignedToUserId"];
        return !notNeededKeys.includes(key);
    }

    return (
        <div className="task-form-main-container">
            <div className="task-form-container">
                <div className="task-form-header-container">
                    <div className="task-form-header-title">{"Task Form"}</div>
                </div>
                {Object.keys(taskFormData).map((key, index) => (
                     key.includes("status") || key.includes("category") ? 
                     <div key={index} className="custom-dropdown-container">
                        <label className="task-form-label">{key.charAt(0).toLocaleUpperCase() + key.slice(1)}:*</label>
                        <CustomDropdown 
                            listOptions={key.includes("status") ? Object.values(TaskStatus) : Object.values(TaskCategory)}
                            callback={(selectedOption) => setTaskFormData({
                                ...taskFormData,
                                [key]: key.includes("status") ? TaskStatus[selectedOption as keyof typeof TaskStatus] : TaskCategory[selectedOption as keyof typeof TaskCategory]
                            })}
                        />
                     </div>
                     : key.includes("estimatedStoryPoints") ? <div key={index} className="task-form-number-container">
                        <label className="task-form-label">{key.charAt(0).toLocaleUpperCase() + key.slice(1)}</label>
                        <input type="number" value={taskFormData.estimatedStoryPoints} onChange={(e) => setTaskFormData({...taskFormData, [key]: e.target.value})} />
                    </div> : isKeyNeeded(key) &&
                     <div key={index} className="task-form-input-container">
                        <label className="task-form-label">{key.charAt(0).toLocaleUpperCase() + key.slice(1)}:*</label>
                        <input
                            type="text"
                            value={(taskFormData as any)[key] || ""}
                            onChange={(e) => setTaskFormData({
                                ...taskFormData,
                                [key]: e.target.value
                            })}
                        />
                    </div>
                ))}
            </div>
            <div className="task-form-button-container">
                <div>
                    <Button buttonLabel={"Confirm"} clicked={() => handleConfirm()} /> 
                </div>
                <div>
                    <Button buttonLabel={"Reset"} clicked={() => handleCancel()} /> 
                </div>
            </div>
        </div>
    );
}
export default TaskForm;