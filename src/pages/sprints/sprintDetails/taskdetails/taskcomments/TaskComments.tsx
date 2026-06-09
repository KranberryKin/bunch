import { useEffect, useState } from "react";
import IUser from "../../../../../constants/interfaces/user.ts";
import "./taskcomments.css"
import LocalStorageManager from "../../../../../services/LocalStorageManager.ts";
import { DataBase_Strings } from "../../../../../constants/initial-states/Database.ts";
import ITask from "../../../../../constants/interfaces/ITask.ts";
import Button from "../../../../../components/button/button.tsx";
import CustomModal from "../../../../../components/custommodal/CustomModal.tsx";
import IComment from "../../../../../constants/interfaces/IComments.ts";
import TaskCommentsForm from "../../../../../components/forms/taskcommentsform/TaskCommentsForm.tsx";

interface ITaskCommentsProps {
  currentUser: IUser | undefined,
  currentTask: ITask | undefined,
}


const TaskComments = (props:ITaskCommentsProps) => {

  const taskCommentsRepo = new LocalStorageManager<IComment>(DataBase_Strings.Task_Comments_DB)
  const userRepo = new LocalStorageManager<IUser>(DataBase_Strings.Users_DB)

  const [comments, setComments] = useState<IComment[]>([]);

  const [modalcontent,setModalContent] = useState<{bodycontent: React.JSX.Element | null}>({bodycontent: null})

  const setState = (formSubmit?: boolean) => {
    if(props.currentUser && props.currentTask){
      taskCommentsRepo.get()
      const currentComments:IComment[] = taskCommentsRepo.values.filter(com => com.taskId === props.currentTask!.id)
      setComments(currentComments);
      if(formSubmit){
        setModalContent({bodycontent: null})
      }
    }
  }

  useEffect(() => {
    setState()
  },[props.currentUser, props.currentTask])

  const setModalBodyContent = () => {
    setModalContent({bodycontent: <TaskCommentsForm currentUser={props.currentUser} currentTask={props.currentTask} callbackFunc={() => setState(true)} />})
  }

  const getUsersName = (com: IComment) => {
    const commentsCreatorIndex = userRepo.values.findIndex(user => user.id === com.creatorId);
    let usersName = ""
    if(commentsCreatorIndex !== -1){
      usersName = userRepo.values[commentsCreatorIndex].user_name
    }
    return usersName;
  }

  const deleteComment = (comment: IComment) => {
    if(window.confirm("Are you sure you want to delete this Comment? This can not be undone.")){
      taskCommentsRepo.deleteData(comment);
      setState();
    }
  }

  return (
    <div className="task-comments-main-container">
      <CustomModal body_content={modalcontent.bodycontent} />
      <div className="task-comments-header-container">
        <h4>{"Comment Section"}</h4>
        <Button buttonLabel={"+Add Comment"} clicked={() => setModalBodyContent()} />
      </div>
      <div className="task-comments-comments-container">
        {comments.length === 0 && <div>{"No Comments yet."}</div>}
        {comments.map((com, index) => (
          <div key={index} className="task-comments-comment">
            <div>
              {getUsersName(com) + " : "}
            </div>
            <div>
              {com.description}
            </div>
            <div>
              <div className="clickable" onClick={() => deleteComment(com)}>🗑️</div>
            </div>
          
        </div>))}
      </div>
    </div>
  )
}

export default TaskComments;