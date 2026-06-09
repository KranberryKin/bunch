import { useState } from "react";
import ITask from "../../../constants/interfaces/ITask.ts";
import IUser from "../../../constants/interfaces/user.ts";
import "./taskcommentsform.css"
import LocalStorageManager from "../../../services/LocalStorageManager.ts";
import IComment from "../../../constants/interfaces/IComments.ts";
import { DataBase_Strings } from "../../../constants/initial-states/Database.ts";
import Button from "../../button/button.tsx"
import { useNotify } from '../../../contextProvider/notifyContext.tsx'


interface ITaskCommentsForm{
  currentUser: IUser | undefined
  currentTask: ITask | undefined
  callbackFunc: () => void
}

const TaskCommentsForm = (props: ITaskCommentsForm) => {
  const taskCommentsRepo = new LocalStorageManager<IComment>(DataBase_Strings.Task_Comments_DB)
  const { sendNotify } = useNotify();
  const [commentFormData, setCommentFormData] = useState<string>("");

  const title = "Comment Form";

  const handleButtonClick = (buttonLabel : "Clear" | "Submit") => {
    if(buttonLabel === "Clear"){
      setCommentFormData("");
    }else{
      if(props.currentTask && props.currentUser && commentFormData !== ""){
        const newComment: IComment = {
          id: taskCommentsRepo.generateId(),
          taskId: props.currentTask.id,
          creatorId: props.currentUser.id,
          description: commentFormData,
        };
        taskCommentsRepo.add(newComment);
        props.callbackFunc();
      }else{
        sendNotify("Please fill in all required fields.");
      };
    };
  }

  return (
    <div className="comments-form-main-container">
      <div className="comment-form-header">
        <h3>{title}</h3>
      </div>
      <div className="comment-form-body">
        <input type="text" value={commentFormData} onChange={(e) => setCommentFormData(e.target.value)} />
      </div>
      <div className="comment-form-footer">
        <Button buttonLabel="Submit" clicked={() => handleButtonClick("Submit")} title="Submit"/>
        <Button buttonLabel="Clear" clicked={() => handleButtonClick("Clear")} title="Clear"/>
      </div>
    </div>
  )
}

export default TaskCommentsForm;