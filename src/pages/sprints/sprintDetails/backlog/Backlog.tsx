import { useEffect, useState } from "react";
import Button from "../../../../components/button/button.tsx";
import CustomModal from "../../../../components/custommodal/CustomModal.tsx";
import { DataBase_Strings } from "../../../../constants/initial-states/Database.ts";
import ISprintz from "../../../../constants/interfaces/Sprintz.ts";
import LocalStorageManager from "../../../../services/LocalStorageManager.ts";
import "./backlog.css";
import ITask from "../../../../constants/interfaces/ITask.ts";
import TaskForm from "../../../../components/forms/taskform/TaskForm.tsx";
import IUser from "../../../../constants/interfaces/user.ts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants/initial-states/routes.ts";
import ICurrentSprint from "../../../../constants/interfaces/ICurrentSprint.ts";

interface IBacklogProps {
    currentUser: IUser | undefined;
    Sprintz: ISprintz | undefined;
    selectedSprint: ICurrentSprint | undefined;
    setSelectedSprint: (sprint: ICurrentSprint | undefined) => void;
}

const Backlog = ({Sprintz, currentUser, selectedSprint, setSelectedSprint}: IBacklogProps) => {

    const tasksRepository = new LocalStorageManager<ITask>(DataBase_Strings.Tasks_DB);

    const navigate = useNavigate();

    const [sprintzTasks, setSprintzTasks] = useState<ITask[]>([]);

    const [modalContent, setModalContent] =  useState<{body: React.ReactNode}>({
        body: null,
    });

    const setState = () => {
        if(currentUser && Sprintz){
            setSprintzTasks(tasksRepository.values.filter(task => task.sprintzId === Sprintz.id))
        }
    }

    useEffect(() => {
        setState();
    }, [currentUser, Sprintz])

    const handleTaskAdded = () => {
        if(currentUser && Sprintz){
            tasksRepository.get();
            setSprintzTasks(tasksRepository.values.filter(task => task.sprintzId === Sprintz.id))
        }
        setModalContent({body: null})
    }

    const addTaskToBacklog = () => {
        setModalContent({
            body: <TaskForm currentSprint={Sprintz} currentUser={currentUser} callbackFunction={() => handleTaskAdded() } />
        });
    };

    const handleSelectedTask = (task: ITask) => {
        navigate(ROUTES.navigate.taskDetails.replace(":taskId", task.id.toString()))
    }

    const deleteTask = (task:ITask) => {
        if(window.confirm(`Are you sure you want to delete Task ${task.title}? This cannot be undone.`)){
            tasksRepository.deleteData(task);
            setState();
        }
    }

    return (
        <div className="backlog-page-main-container">
            <CustomModal body_content={modalContent.body} />
            <div className="backlog-page-header">
                <div>
                    <h3>Backlog Items</h3>
                </div>
                <div>
                    <Button buttonLabel={"Add Backlog Item"} clicked={() =>addTaskToBacklog()} />
                </div>
            </div>
            <div className="backlog-table-container">
                {sprintzTasks.map((task, index) => (
                    <div key={index} className="backlog-table-content">
                        <div className="selectable" onClick={() => handleSelectedTask(task)}>
                            {task.title}
                        </div>
                        <div  className="selectable" onClick={() => deleteTask(task)}>
                            🗑️
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Backlog;