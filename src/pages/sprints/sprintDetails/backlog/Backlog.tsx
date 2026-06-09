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
import CustomDropdown from "../../../../components/customDropdown/CustomDropdown.tsx";
import TaskStatus from "../../../../constants/interfaces/TaskStatus.ts";

interface IBacklogProps {
    currentUser: IUser | undefined;
    Sprintz: ISprintz | undefined;
    selectedSprint: ICurrentSprint | undefined;
    setSelectedSprint: (sprint: ICurrentSprint | undefined) => void;
}

const Backlog = ({Sprintz, currentUser, selectedSprint, setSelectedSprint}: IBacklogProps) => {

    const tasksRepository = new LocalStorageManager<ITask>(DataBase_Strings.Tasks_DB);
    const sprintsRepository = new LocalStorageManager<ICurrentSprint>(DataBase_Strings.Current_Sprints_DB);

    const navigate = useNavigate();

    const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
    const [isSelectingFilter, setIsSelectingFilter] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string>("All");

    const [sprintzTasks, setSprintzTasks] = useState<ITask[]>([]);

    const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);

    const [modalContent, setModalContent] =  useState<{body: React.ReactNode}>({
        body: null,
    });

    const setState = () => {
        if(currentUser && Sprintz){
            setSprintzTasks(tasksRepository.values.filter(task => task.sprintzId === Sprintz.id));
        }
    }

    const updateFilterOptions = () => {
        sprintsRepository.get();
        if(Sprintz){
            let newOptions = ["All", "Completed", "In Progress"];
            const currentSprintOptions = sprintsRepository.values.filter(sprint => sprint.sprintzId === Sprintz.id).map(sprint => sprint.name);
            for(let i = 0; i < currentSprintOptions.length; i++){
                newOptions.push(currentSprintOptions[i]);
            }
            setDropdownOptions(newOptions);
        }
    }

    useEffect(() => {
        setState();
        updateFilterOptions();
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

    const handleOptionSelection = (selectedOption: string) => {
        switch (selectedOption) {
            case "All":
                setFilteredTasks(tasksRepository.values.filter(task => task.sprintzId === Sprintz?.id));
                setSelectedFilter("All");
                break;
            case "Completed":
                setFilteredTasks(tasksRepository.values.filter(task => task.sprintzId === Sprintz?.id && task.status === TaskStatus.Complete));
                setSelectedFilter("Completed");
                break;
            case "In Progress":
                setFilteredTasks(tasksRepository.values.filter(task => task.sprintzId === Sprintz?.id && task.status !== TaskStatus.Complete));
                setSelectedFilter("In Progress");
                break;
            default:
                const sprintIndex = sprintsRepository.values.findIndex(sprint => sprint.name === selectedOption);
                if(sprintIndex !== -1){
                    const selectedSprint = sprintsRepository.values[sprintIndex];
                    setFilteredTasks(tasksRepository.values.filter(task => task.sprintzId === Sprintz?.id && task.currentSprintId === selectedSprint.id));
                    setSelectedFilter(selectedSprint.name);
                    setSelectedSprint(selectedSprint);
                }else{
                    setFilteredTasks(tasksRepository.values.filter(task => task.sprintzId === Sprintz?.id))
                }
                break;
            }
            setIsSelectingFilter(!isSelectingFilter);
    }

    return (
        <div className="backlog-page-main-container">
            <CustomModal body_content={modalContent.body} />
            <div className="backlog-page-header">
                <div>
                    <h3>Backlog Items</h3>
                </div>
                <div className="filter-container">
                    <label>{"Filter :"}</label>
                    {isSelectingFilter && (
                        <CustomDropdown listOptions={dropdownOptions} callback={(selectedOption: string) => handleOptionSelection(selectedOption)} />
                    )}
                    {!isSelectingFilter && (
                        <p className="selectable" onClick={() => setIsSelectingFilter(!isSelectingFilter)}>
                            {selectedFilter}
                        </p>
                    )}
                </div>
                <div>
                    <Button buttonLabel={"Add Backlog Item"} clicked={() => addTaskToBacklog()} />
                </div>
            </div>
            <div className="backlog-table-container">
                {filteredTasks && filteredTasks.length > 0 ? filteredTasks.map((task, index) => (
                    <div key={index} className="backlog-table-content">
                        <div className="selectable" onClick={() => handleSelectedTask(task)}>
                            {task.title}
                        </div>
                        <div  className="selectable" onClick={() => deleteTask(task)}>
                            🗑️
                        </div>
                    </div>
                )) : <p>{"No tasks found."}</p>
                }
            </div>
        </div>
    );
}
export default Backlog;