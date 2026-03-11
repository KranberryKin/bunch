import { useParams } from "react-router-dom";
import "./taskdetails.css"
import LocalStorageManager from "../../../../services/LocalStorageManager.ts";
import ITask from "../../../../constants/interfaces/ITask.ts";
import { DataBase_Strings } from "../../../../constants/initial-states/Database.ts";
import { useEffect, useState } from "react";
import IUser from "../../../../constants/interfaces/user";
import Button from "../../../../components/button/button.tsx";
import TaskComments from "./taskcomments/TaskComments.tsx";
import ICurrentSprint from "../../../../constants/interfaces/icurrentSprint.ts";
import CustomDropdown from "../../../../components/customDropdown/CustomDropdown.tsx";
import TaskStatus from "../../../../constants/interfaces/TaskStatus.ts";

interface ITaskDetailsProps {
  currentUser: IUser | undefined;
}

const TaskDetails = (props: ITaskDetailsProps) => {
  const taskRepo = new LocalStorageManager<ITask>(DataBase_Strings.Tasks_DB);
  const currentSprintRepo = new LocalStorageManager<ICurrentSprint>(DataBase_Strings.Current_Sprints_DB);
  const usersRepo = new LocalStorageManager<IUser>(DataBase_Strings.Users_DB);
  const taskStatuses = Object.keys(TaskStatus);

  const params = useParams();
  const taskID = params.taskId;
  const SprintzId = params.sprintId;
  const [currentTask, setCurrentTask] = useState<ITask | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedDescription, setEditedDescription] = useState<string | undefined>(currentTask?.description)
  const [taskEditableDetails, setTaskEditableDetails] = useState<Partial<ITask> | undefined>(undefined);
  const [isEditingExtraDetails, setIsEditingExtraDetails] = useState({
    currentSprint: false,
    assignedUser: false,
    estimatedStoryPoints: false,
    status: false,
  });
  
  const editDescription = () => {
    if (!isEditing && currentTask) {
      setEditedDescription(currentTask.description);
    }
    setIsEditing(!isEditing)
  }

  const handleDescriptionButtonClick = (state: "Save" | "Cancel") => {
    if (state === "Save" && currentTask && editedDescription) {
      const updatedTask = { ...currentTask, description: editedDescription };
      setCurrentTask(updatedTask);
      taskRepo.updateData(updatedTask);
    } else if (state === "Cancel" && currentTask) {
      setEditedDescription(currentTask.description);
    }
    setIsEditing(false);
  }

  const setState = () => {
    if(taskID && taskRepo){
      const thisTask = taskRepo.values.filter(t => t.id === parseInt(taskID));
      setCurrentTask(thisTask[0]);
      setEditedDescription(thisTask[0].description);
    }
  }

  const handleUpdateEstimatedStoryPointsInput = (value: string) => {
    setTaskEditableDetails({...taskEditableDetails, estimatedStoryPoints: parseInt(value) || 0});
  }

  const handleEditExtraDetails = (detail: keyof typeof isEditingExtraDetails, value?: any) => {
    if("currentSprint" === detail){
      const selectedSprint = currentSprintRepo.values.find(s => s.name === value);
      if (selectedSprint && currentTask) {
        const updatedTask = { ...currentTask, currentSprintId: selectedSprint.id };
        taskRepo.updateData(updatedTask);
      }
      setState();
    }else if("assignedUser" === detail){
      const selectedUser = usersRepo.values.find(u => u.user_name === value);
      if (selectedUser && currentTask) {
        const updatedTask = { ...currentTask, assignedToUserId: selectedUser.id };
        taskRepo.updateData(updatedTask);
      }
      setState();
    }else if("status" === detail){
      if (currentTask) {
        const updatedTask = { ...currentTask, status: TaskStatus[value as keyof typeof TaskStatus] };
        taskRepo.updateData(updatedTask);
      }
      setState();
    }else if("estimatedStoryPoints" === detail){
      if (currentTask) {
        const updatedTask = { ...currentTask, estimatedStoryPoints: value };
        taskRepo.updateData(updatedTask);
      }
      setState();
    }
    setIsEditingExtraDetails({...isEditingExtraDetails, [detail]: false });
  }

  const enableExtraEdits = (detail: keyof typeof isEditingExtraDetails) => {
    setIsEditingExtraDetails({...isEditingExtraDetails, [detail]: true });
  };

  useEffect(() => {
    setState();
  }, [props.currentUser])

  useEffect(() => {
    const newTaskEditableDeatail: Partial<ITask> = {
      currentSprintId: currentTask?.currentSprintId,
      assignedToUserId: currentTask?.assignedToUserId,
      estimatedStoryPoints: currentTask?.estimatedStoryPoints,
      status: currentTask?.status
    };
    setTaskEditableDetails(newTaskEditableDeatail);
  },[currentTask])
  


  return (
    <div className="task-details-main-container">
      <div className="task-details-left-column">
        <h3 className="task-details-title">
          <div>
            {"Tasks Details Page"}
          </div>
          <div>
            {currentTask?.title}
          </div>
        </h3>
        <div className="task-details-description-main-container">
          <h4 className="task-details-description-title">
            {"Description"}
            {!isEditing ?
             <Button buttonLabel={"Edit"} clicked={() => editDescription()} /> 
             : <div className="task-editing-button-container">
                <Button buttonLabel={"Save"} clicked={() => handleDescriptionButtonClick("Save")} />
                <Button buttonLabel={"Cancel"} clicked={() => handleDescriptionButtonClick("Cancel")} />
              </div>}
          </h4>
            <div className="task-details-description-body">
              {isEditing ? <textarea className="task-details-description-input" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)}  /> : <div className="display-linebreak">{currentTask?.description}</div>}
            </div>
        </div>
          <TaskComments currentTask={currentTask} currentUser={props.currentUser} />
      </div>
      <div className="task-details-right-column">
        <div className="task-details-editable-content-container">
          <div className="additinal-editable-details">
            <div>
              {"Current Sprint"}
            </div>
            <div>
              {isEditingExtraDetails.currentSprint ? <CustomDropdown listOptions={currentSprintRepo.values.filter(cs => cs.sprintzId === parseInt(SprintzId || "0")).length ? currentSprintRepo.values.filter(cs => cs.sprintzId === parseInt(SprintzId || "0")).map(s => (s.name)) : ["No Sprints Available"]}  callback={(selectedOption) => handleEditExtraDetails('currentSprint', selectedOption)}/> : <div className="clickable" onClick={() => enableExtraEdits("currentSprint")}>{currentSprintRepo.values.find(s => s.id === taskEditableDetails?.currentSprintId)?.name ?? "Null"}</div>}
            </div>
          </div>
          <div className="additinal-editable-details">
            <div>
              {"Assigned To"}
            </div>
            <div>
              {isEditingExtraDetails.assignedUser ? <CustomDropdown listOptions={usersRepo.values.length ? usersRepo.values.map(u => (u.user_name)) : ["No Users Available"]}  callback={(selectedOption) => handleEditExtraDetails('assignedUser', selectedOption)}/> : <div className="clickable" onClick={() => enableExtraEdits("assignedUser")}>{usersRepo.values.find(u => u.id === taskEditableDetails?.assignedToUserId)?.user_name ?? "Null"}</div>}
            </div>
          </div>
          <div className="additinal-editable-details">
            <div>
              {"Estimated Story Points"}
            </div>
            <div>
              {isEditingExtraDetails.estimatedStoryPoints ? <><input type="number" value={taskEditableDetails?.estimatedStoryPoints ?? ""} onChange={(e) => handleUpdateEstimatedStoryPointsInput(e.target.value || "0")} /> <Button buttonLabel={"Save"} clicked={() => handleEditExtraDetails("estimatedStoryPoints", taskEditableDetails?.estimatedStoryPoints)} /> </> : <div className="clickable" onClick={() => enableExtraEdits("estimatedStoryPoints")}>{taskEditableDetails?.estimatedStoryPoints ?? "Null"}</div>}
            </div>
          </div>
          <div className="additinal-editable-details">
            <div>
              {"Status"}
            </div>
            <div>
              {isEditingExtraDetails.status ? <CustomDropdown listOptions={taskStatuses}  callback={(selectedOption) => handleEditExtraDetails('status', selectedOption)}/> : <div className="clickable" onClick={() => enableExtraEdits("status")}>{taskEditableDetails?.status ?? "Null"}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails;