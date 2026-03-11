import { useEffect, useState } from "react";
import Button from "../../../../../components/button/button.tsx";
import CustomModal from "../../../../../components/custommodal/CustomModal.tsx";
import TaskStatus from "../../../../../constants/interfaces/TaskStatus.ts";
import "./currentstatus.css"
import CurrentSprintForm from "../../../../../components/forms/currentSprintForm/CurrentSprintForm.tsx";
import LocalStorageManager from "../../../../../services/LocalStorageManager.ts";
import ITask from "../../../../../constants/interfaces/ITask.ts";
import { DataBase_Strings } from "../../../../../constants/initial-states/Database.ts";
import ICurrentSprint from "../../../../../constants/interfaces/icurrentSprint.ts";
import CustomDropdown from "../../../../../components/customDropdown/CustomDropdown.tsx";
import ISprintz from "../../../../../constants/interfaces/Sprintz.ts";
import CurrentSprint from "../CurrentSprint.tsx";
import { useNavigate } from "react-router-dom";

interface CurrentStatusProps {
  Sprintz: ISprintz | undefined
}

const CurrentStatus = (props: CurrentStatusProps) => {
  const navigate = useNavigate();
    const statusList = Object.keys(TaskStatus);
    const tasksRepo = new LocalStorageManager<ITask>(DataBase_Strings.Tasks_DB);
    const currentSprintRepo = new LocalStorageManager<ICurrentSprint>(DataBase_Strings.Current_Sprints_DB);
    const [isSelectingSprint, setIsSelectingSprint] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState<ICurrentSprint | undefined>(undefined);
    const [modalContent, setModalContent] = useState<React.ReactNode | undefined>(undefined);
    const [displayedTasks, setDisplayedTaks] = useState<ITask[]>([]);
    const closeModal = () => {
      setModalContent(undefined)
    }

    const handleAddSprint = () => {
      setModalContent(<CurrentSprintForm Sprintz={props.Sprintz}  callbackFunc={closeModal} />);
    };
    
    const handleSelectSprint = (selectedOption: string) => {
      const foundSprint = currentSprintRepo.values.find(s => s.name === selectedOption);
      setSelectedSprint(foundSprint);
      setIsSelectingSprint(!isSelectingSprint);
    };

    const deleteSprint = () => {
      if(window.confirm(`Are you sure you want to Delete Sprint ${selectedSprint?.name}? This cannot be undone.`)){
        if(selectedSprint){
          currentSprintRepo.deleteData(selectedSprint);
          setSelectedSprint(undefined);
        }
      }
    }

    const handleNavigate = (task: ITask) => {
      navigate(`task/${task.id}`);
    }

    useEffect(() => {
      if(selectedSprint){
        setDisplayedTaks(tasksRepo.values.filter(task => task.currentSprintId === selectedSprint.id));
      }
    },[selectedSprint])

  return <div className="current-status-main-container">
    <CustomModal body_content={modalContent} />
    <div className="current-status-header-container">
      <div className="current-status-header-title">
        {"Current Sprint : "} {(isSelectingSprint ? <CustomDropdown listOptions={currentSprintRepo.values.filter(s => s.sprintzId === props.Sprintz?.id).map(s => s.name)} callback={(selectedOption: string) => handleSelectSprint(selectedOption)} /> : selectedSprint ? <p className="current-status-title" onClick={() => setIsSelectingSprint(!isSelectingSprint)}>{selectedSprint.name}</p> : <p className="current-status-title" onClick={() => setIsSelectingSprint(!isSelectingSprint)}>"No Current Sprint Selected" </p>)}
      </div>
      <div className="current-status-dates-container">
        <div className="spacing">
          {selectedSprint && "Start Date: "} {selectedSprint && selectedSprint.startDate?.toString().split('T')[0]}
        </div>
        <div>
          {selectedSprint && "End Date: "} {selectedSprint && selectedSprint.endDate?.toString().split('T')[0]}
        </div>
      </div>
      <div className="current-status-button-container">
        {selectedSprint && <div className="clickable spacing" onClick={deleteSprint}>🗑️</div>}
        <Button buttonLabel={"Add Current Sprint"} clicked={handleAddSprint} />
      </div>
    </div>
    <div className="current-status-tasks-container">
      {statusList.map((status) => (
        <div key={status} className="status-container">
          <div className="status-title">
            <h3>{status}</h3>
          </div>
          <div className="status-tasks-container">
            {displayedTasks.filter(task => task.status === TaskStatus[status as keyof typeof TaskStatus]).length > 0 ? displayedTasks.filter(task => task.status === TaskStatus[status as keyof typeof TaskStatus]).map((task, index) => (
              <div key={task.id + index} className="task-item border clickable" onClick={() => handleNavigate(task)}>
                <p className="overflow">{task.title}</p>
              </div>
            )) : <p className="border">No tasks Here</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
}

export default CurrentStatus;